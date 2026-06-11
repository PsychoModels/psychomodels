import React from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

// Stand-in for @marsidev/react-turnstile in component tests: jsdom can't run
// Cloudflare's real challenge script, so this immediately "passes" the
// challenge, letting token-gated submit buttons enable.
interface MockProps {
  onSuccess?: (token: string) => void;
}

export const Turnstile = React.forwardRef<
  TurnstileInstance | undefined,
  MockProps
>(
  // eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
  function TurnstileMock({ onSuccess }, _ref) {
    const onSuccessRef = React.useRef(onSuccess);
    React.useLayoutEffect(() => {
      onSuccessRef.current = onSuccess;
    });
    React.useEffect(() => {
      onSuccessRef.current?.("test-turnstile-token");
    }, []);
    return <div data-testid="turnstile-widget" />;
  },
);
