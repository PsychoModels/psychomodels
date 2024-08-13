import { getCSRFToken } from "./django";
import axios, { Method } from "axios";

// Copied from https://github.com/pennersr/django-allauth/blob/main/examples/react-spa/frontend/src/lib/allauth.js

const BASE_URL = `/_allauth/browser/v1`;
const ACCEPT_JSON = {
  accept: "application/json",
};

export const URLs = Object.freeze({
  // Meta
  CONFIG: BASE_URL + "/config",

  // Account management
  CHANGE_PASSWORD: BASE_URL + "/account/password/change",
  EMAIL: BASE_URL + "/account/email",
  PROVIDERS: BASE_URL + "/account/providers",

  // Auth: Basics
  LOGIN: BASE_URL + "/auth/login",
  SESSION: BASE_URL + "/auth/session",
  REAUTHENTICATE: BASE_URL + "/auth/reauthenticate",
  REQUEST_PASSWORD_RESET: BASE_URL + "/auth/password/request",
  RESET_PASSWORD: BASE_URL + "/auth/password/reset",
  SIGNUP: BASE_URL + "/auth/signup",
  VERIFY_EMAIL: BASE_URL + "/auth/email/verify",

  // Auth: Social
  PROVIDER_SIGNUP: BASE_URL + "/auth/provider/signup",
  REDIRECT_TO_PROVIDER: BASE_URL + "/auth/provider/redirect",
  PROVIDER_TOKEN: BASE_URL + "/auth/provider/token",
});

const tokenStorage = window.localStorage;

async function request(
  method: Method,
  path: string,
  data?: any,
  addHeaders?: any,
) {
  const headers: Record<string, string | null> = {
    ...ACCEPT_JSON,
    ...addHeaders,
  };

  // Don't pass along authentication related headers to the config endpoint.
  if (path !== URLs.CONFIG) {
    headers["X-CSRFToken"] = getCSRFToken();
  }

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios({
      method: method,
      url: path,
      data: data,
      headers: headers,
    });

    const msg = response.data;

    if (msg.status === 410) {
      tokenStorage.removeItem("sessionToken");
    }
    if (msg.meta?.session_token) {
      tokenStorage.setItem("sessionToken", msg.meta.session_token);
    }
    if (
      [401, 410].includes(msg.status) ||
      (msg.status === 200 && msg.meta?.is_authenticated)
    ) {
      const event = new CustomEvent("allauth.auth.change", { detail: msg });
      document.dispatchEvent(event);
    }
    return msg;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error here
      // const responseError = error.response?.data;
      // You can handle specific status codes or errors if needed
      // console.error("Request failed:", responseError);
      throw error;
    } else {
      // Handle unexpected errors
      // console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}

export async function login(data: any) {
  return await request("POST", URLs.LOGIN, data);
}

export async function logout() {
  return await request("DELETE", URLs.SESSION);
}

export async function getSession() {
  return await request("GET", URLs.SESSION);
}

export async function signUp(data: any) {
  return await request("POST", URLs.SIGNUP, data);
}

export async function changePassword(data: any) {
  return await request("POST", URLs.CHANGE_PASSWORD, data);
}

export async function requestPasswordReset(data: any) {
  return await request("POST", URLs.REQUEST_PASSWORD_RESET, data);
}

export async function getPasswordReset(key: any) {
  return await request("GET", URLs.RESET_PASSWORD, undefined, {
    "X-Password-Reset-Key": key,
  });
}

export async function resetPassword(data: any) {
  return await request("POST", URLs.RESET_PASSWORD, data);
}
