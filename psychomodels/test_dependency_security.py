"""Local regressions for dependency security upgrades; no external services."""

from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from http.server import BaseHTTPRequestHandler, HTTPServer
from io import BytesIO
import hmac
import json
from threading import Thread
from types import SimpleNamespace

import jwt
from allauth.socialaccount.internal import jwtkit
from allauth.socialaccount.providers.google.views import _verify_and_decode
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase
from markdownx.forms import ImageForm
from PIL import Image, UnidentifiedImageError


class MarkdownxImageCompatibilityTests(SimpleTestCase):
    @staticmethod
    def upload(image_format="PNG", mode="RGB"):
        buffer = BytesIO()
        with Image.new(mode, (640, 480)) as image:
            image.save(buffer, image_format)
        return SimpleUploadedFile(
            f"image.{image_format.lower()}",
            buffer.getvalue(),
            content_type=f"image/{image_format.lower()}",
        )

    def test_supported_raster_uploads_resize_and_preserve_mode(self):
        for image_format, mode in (
            ("JPEG", "RGB"),
            ("PNG", "RGB"),
            ("PNG", "RGBA"),
            ("PNG", "I;16"),
        ):
            with self.subTest(image_format=image_format, mode=mode):
                form = ImageForm(files={"image": self.upload(image_format, mode)})
                self.assertTrue(form.is_valid(), form.errors)
                result = form.save(commit=False)
                with Image.open(result.image) as image:
                    image.load()
                    self.assertEqual(image.size, (500, 375))
                    self.assertEqual(image.format, image_format)
                    self.assertEqual(image.mode, mode)

    def test_gif_upload_preserves_original_file(self):
        upload = self.upload("GIF")
        original = upload.read()
        upload.seek(0)
        form = ImageForm(files={"image": upload})
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.save(commit=False).image.read(), original)

    def test_invalid_raster_is_rejected_by_decoder(self):
        upload = SimpleUploadedFile("image.png", b"not an image", "image/png")
        form = ImageForm(files={"image": upload})
        self.assertTrue(form.is_valid(), form.errors)
        with self.assertRaises(UnidentifiedImageError):
            form.save(commit=False)

    def test_pixel_limit_rejects_before_processing(self):
        form = ImageForm(files={"image": self.upload()})
        self.assertTrue(form.is_valid(), form.errors)
        # A lowered limit exercises the guard using a small, harmless image.
        with patch.object(Image, "MAX_IMAGE_PIXELS", 100):
            with self.assertRaises(Image.DecompressionBombError):
                form.save(commit=False)

    def test_declared_type_and_upload_byte_limit_remain_enforced(self):
        upload = self.upload()
        upload.content_type = "application/octet-stream"
        self.assertFalse(ImageForm(files={"image": upload}).is_valid())
        with patch("markdownx.forms.MARKDOWNX_UPLOAD_MAX_SIZE", 16):
            self.assertFalse(ImageForm(files={"image": self.upload()}).is_valid())


class JWTProviderCompatibilityTests(SimpleTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        cls.public_key = cls.private_key.public_key()
        cls.key_id = "local-test-key"
        cls.issuer = "https://accounts.google.com"
        cls.audience = "tbp-test-client"
        now = datetime.now(timezone.utc)
        cls.claims = {
            "iss": cls.issuer,
            "aud": cls.audience,
            "sub": "local-test-user",
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(minutes=5)).timestamp()),
        }
        name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "local-test")])
        cls.certificate = (
            x509.CertificateBuilder()
            .subject_name(name)
            .issuer_name(name)
            .public_key(cls.public_key)
            .serial_number(x509.random_serial_number())
            .not_valid_before(now - timedelta(minutes=1))
            .not_valid_after(now + timedelta(hours=1))
            .sign(cls.private_key, hashes.SHA256())
            .public_bytes(serialization.Encoding.PEM)
            .decode("ascii")
        )

    def credential(self, claims=None, key=None, headers=None):
        return jwt.encode(
            self.claims | (claims or {}),
            key or self.private_key,
            algorithm="RS256",
            headers={"kid": self.key_id} | (headers or {}),
        )

    @contextmanager
    def provider_keys(self, jwks=False):
        keys = {self.key_id: self.certificate}
        if jwks:
            key = jwt.algorithms.RSAAlgorithm.to_jwk(self.public_key, as_dict=True)
            keys = {"keys": [key | {"kid": self.key_id}]}
        with patch("allauth.socialaccount.internal.jwtkit.get_adapter") as adapter:
            response = (
                adapter.return_value.get_requests_session.return_value.__enter__.return_value.get.return_value
            )
            response.json.return_value = keys
            yield

    def google_decode(self, credential):
        with self.provider_keys():
            return _verify_and_decode(
                SimpleNamespace(client_id=self.audience),
                credential,
                verify_signature=True,
            )

    def test_google_certificate_id_token_round_trip(self):
        self.assertEqual(self.google_decode(self.credential()), self.claims)

    def test_jwks_id_token_round_trip(self):
        with self.provider_keys(jwks=True):
            result = jwtkit.verify_and_decode(
                credential=self.credential(),
                keys_url="https://provider.invalid/keys",
                issuer=self.issuer,
                audience=self.audience,
                lookup_kid=jwtkit.lookup_kid_jwk,
            )
        self.assertEqual(result, self.claims)

    def test_provider_rejects_bad_claims_signature_and_unknown_critical_header(self):
        other_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        header, payload, signature = self.credential().split(".")
        raw_signature = bytearray(jwt.utils.base64url_decode(signature))
        raw_signature[0] ^= 1
        tampered = ".".join(
            [header, payload, jwt.utils.base64url_encode(raw_signature).decode()]
        )
        invalid = {
            "audience": self.credential({"aud": "wrong-client"}),
            "issuer": self.credential({"iss": "https://untrusted.invalid"}),
            "expiry": self.credential({"exp": 0}),
            "wrong-key": self.credential(key=other_key),
            "tampering": tampered,
            "critical-header": self.credential(
                headers={"crit": ["tbp-test-extension"], "tbp-test-extension": True}
            ),
        }
        for reason, credential in invalid.items():
            with self.subTest(reason=reason), self.assertRaises(OAuth2Error):
                self.google_decode(credential)

    def test_public_key_material_is_rejected_as_hmac_secret(self):
        pem = self.public_key.public_bytes(
            serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo
        )
        der = self.public_key.public_bytes(
            serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo
        )
        for public_key in (pem.replace(b"\n", b"\r\n"), der):
            with self.subTest(encoding=public_key[:10]):
                header = jwt.utils.base64url_encode(b'{"alg":"HS256","typ":"JWT"}')
                payload = jwt.utils.base64url_encode(json.dumps(self.claims).encode())
                signing_input = header + b"." + payload
                signature = jwt.utils.base64url_encode(
                    hmac.new(public_key, signing_input, sha256).digest()
                )
                credential = (signing_input + b"." + signature).decode()
                with self.assertRaises(jwt.InvalidKeyError):
                    jwt.decode(
                        credential,
                        public_key,
                        algorithms=["RS256", "HS256"],
                        audience=self.audience,
                        issuer=self.issuer,
                    )

    def test_empty_hmac_jwk_is_rejected(self):
        with self.assertRaises(jwt.InvalidKeyError):
            jwt.PyJWK.from_dict({"kty": "oct", "k": "", "alg": "HS256"})

    def test_jwks_fetch_does_not_follow_redirects(self):
        paths = []

        class RedirectHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                paths.append(self.path)
                self.send_response(302)
                self.send_header("Location", "/keys")
                self.end_headers()

            def log_message(self, *_args):
                pass

        server = HTTPServer(("127.0.0.1", 0), RedirectHandler)
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            client = jwt.PyJWKClient(
                f"http://127.0.0.1:{server.server_port}/redirect", timeout=2
            )
            with self.assertRaises(jwt.PyJWKClientConnectionError):
                client.fetch_data()
            self.assertEqual(paths, ["/redirect"])
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)
