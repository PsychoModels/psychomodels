import React from "react";

interface Props {
  action: "SIGNUP" | "LOGIN";
  socialAccountsNewWindow: boolean;
}

export const SocialLoginButtons = ({
  action,
  socialAccountsNewWindow,
}: Props) => {
  const actionLabel = action === "SIGNUP" ? "Sign up" : "Login";

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <a
        href="/account/github/login/"
        className="flex items-center justify-center w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm"
        target={socialAccountsNewWindow ? "_blank" : "_self"}
      >
        <svg
          className="w-6 h-6 mr-2"
          viewBox="0 0 98 98"
          width="98"
          height="98"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill="#24292f"
          ></path>
        </svg>
        {actionLabel} with GitHub
      </a>

      <a
        href="/account/google/login/"
        className="flex items-center justify-center w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm"
        target={socialAccountsNewWindow ? "_blank" : "_self"}
      >
        <svg
          className="w-6 h-6 mr-2"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_13183_10121)">
            <path
              d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
              fill="#3F83F8"
            ></path>
            <path
              d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
              fill="#34A853"
            ></path>
            <path
              d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
              fill="#FBBC04"
            ></path>
            <path
              d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
              fill="#EA4335"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_13183_10121">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(0.5)"
              ></rect>
            </clipPath>
          </defs>
        </svg>
        {actionLabel} with Google
      </a>

      <a
        href="/account/orcid/login/"
        className="flex items-center justify-center w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm"
        target={socialAccountsNewWindow ? "_blank" : "_self"}
      >
        <svg
          className="w-6 h-6 mr-2"
          width="72px"
          height="72px"
          viewBox="0 0 72 72"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Orcid logo</title>
          <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="hero"
              transform="translate(-924.000000, -72.000000)"
              fillRule="nonzero"
            >
              <g id="Group-4">
                <g
                  id="vector_iD_icon"
                  transform="translate(924.000000, 72.000000)"
                >
                  <path
                    d="M72,36 C72,55.884375 55.884375,72 36,72 C16.115625,72 0,55.884375 0,36 C0,16.115625 16.115625,0 36,0 C55.884375,0 72,16.115625 72,36 Z"
                    id="Path"
                    fill="#A6CE39"
                  ></path>
                  <g
                    id="Group"
                    transform="translate(18.868966, 12.910345)"
                    fill="#FFFFFF"
                  >
                    <polygon
                      id="Path"
                      points="5.03734929 39.1250878 0.695429861 39.1250878 0.695429861 9.14431787 5.03734929 9.14431787 5.03734929 22.6930505 5.03734929 39.1250878"
                    ></polygon>
                    <path
                      d="M11.409257,9.14431787 L23.1380784,9.14431787 C34.303014,9.14431787 39.2088191,17.0664074 39.2088191,24.1486995 C39.2088191,31.846843 33.1470485,39.1530811 23.1944669,39.1530811 L11.409257,39.1530811 L11.409257,9.14431787 Z M15.7511765,35.2620194 L22.6587756,35.2620194 C32.49858,35.2620194 34.7541226,27.8438084 34.7541226,24.1486995 C34.7541226,18.1301509 30.8915059,13.0353795 22.4332213,13.0353795 L15.7511765,13.0353795 L15.7511765,35.2620194 Z"
                      id="Shape"
                    ></path>
                    <path
                      d="M5.71401206,2.90182329 C5.71401206,4.441452 4.44526937,5.72914146 2.86638958,5.72914146 C1.28750978,5.72914146 0.0187670918,4.441452 0.0187670918,2.90182329 C0.0187670918,1.33420133 1.28750978,0.0745051096 2.86638958,0.0745051096 C4.44526937,0.0745051096 5.71401206,1.36219458 5.71401206,2.90182329 Z"
                      id="Path"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        {actionLabel} with ORCID
      </a>
    </div>
  );
};
