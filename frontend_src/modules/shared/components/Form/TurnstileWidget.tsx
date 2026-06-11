import React from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

interface Props {
  onTokenChange: (token: string) => void;
}

// When no site key is configured (e.g. local dev without Turnstile), the
// backend middleware is inert too; emit a placeholder token so token-gated
// forms remain usable.
export const TurnstileWidget = React.forwardRef<TurnstileInstance, Props>(
  // eslint-disable-next-line react/prop-types
  function TurnstileWidget({ onTokenChange }, ref) {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    // Callers pass inline arrows; track the latest one in a ref so the
    // disabled-mode effect runs once instead of on every parent re-render.
    const onTokenChangeRef = React.useRef(onTokenChange);
    React.useLayoutEffect(() => {
      onTokenChangeRef.current = onTokenChange;
    });

    React.useEffect(() => {
      if (!siteKey) {
        onTokenChangeRef.current("turnstile-disabled");
      }
    }, [siteKey]);

    if (!siteKey) {
      return null;
    }

    return (
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        onSuccess={onTokenChange}
        onExpire={() => onTokenChange("")}
        onError={() => onTokenChange("")}
      />
    );
  },
);
