import React, { useState, useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

export const ExpandText = ({ children }: Props) => {
  const [showFullText, setShowFullText] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      // @ts-ignore
      setIsOverflowing(textRef.current.scrollHeight > 100);
    }
  }, [children]);

  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div>
      <div
        ref={textRef}
        style={{
          height: showFullText ? "auto" : "100px",
          overflow: "hidden",
          transition: "height 0.3s ease",
        }}
      >
        {children}
      </div>
      {isOverflowing && (
        <button
          onClick={toggleTextDisplay}
          className="text-cyan-900 text-sm font-bold"
        >
          {showFullText ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
