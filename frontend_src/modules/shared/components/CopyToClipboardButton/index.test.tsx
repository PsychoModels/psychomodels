import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CopyToClipboardButton } from "./index.tsx";

// Mock navigator.clipboard for Vitest
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe("CopyToClipboardButton", () => {
  it("copies the text to clipboard when button is clicked", () => {
    const testText = "Test text";
    render(<CopyToClipboardButton text={testText} />);

    const button = screen.getByRole("button", { name: /copy to clipboard/i });

    // Simulate clicking the button
    fireEvent.click(button);

    // Assert clipboard.writeText was called with the correct text
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
  });
});
