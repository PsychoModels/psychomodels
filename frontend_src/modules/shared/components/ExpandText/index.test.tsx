import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExpandText } from "./index.tsx";

describe("ExpandText", () => {
  // Mocking the scrollHeight to simulate the overflow behavior
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 200, // Setting a value greater than 100 to simulate overflow
    });
  });

  it("renders the children and truncates the text if it's overflowing", () => {
    render(
      <ExpandText>
        <p>
          This is some long text that should be truncated because it overflows
          the container.
        </p>
      </ExpandText>,
    );

    // Check that the content is in the document
    const content = screen.getByText(/this is some long text/i);
    expect(content).toBeInTheDocument();

    // Check that the text is initially truncated and "Show More" button appears
    const button = screen.getByRole("button", { name: /show more/i });
    expect(button).toBeInTheDocument();
  });

  it("expands the text when 'Show More' is clicked", () => {
    render(
      <ExpandText>
        <p>
          This is some long text that should be truncated because it overflows
          the container.
        </p>
      </ExpandText>,
    );

    const button = screen.getByRole("button", { name: /show more/i });

    // Simulate clicking the "Show More" button
    fireEvent.click(button);

    // After clicking, the button should change to "Show Less"
    expect(
      screen.getByRole("button", { name: /show less/i }),
    ).toBeInTheDocument();
  });

  it("truncates the text again when 'Show Less' is clicked", () => {
    render(
      <ExpandText>
        <p>
          This is some long text that should be truncated because it overflows
          the container.
        </p>
      </ExpandText>,
    );

    const button = screen.getByRole("button", { name: /show more/i });

    // Simulate clicking the "Show More" button
    fireEvent.click(button);

    // Simulate clicking the "Show Less" button
    fireEvent.click(screen.getByRole("button", { name: /show less/i }));

    // After clicking, the button should change back to "Show More"
    expect(
      screen.getByRole("button", { name: /show more/i }),
    ).toBeInTheDocument();
  });

  it("doesn't show 'Show More' button when the content doesn't overflow", () => {
    // Simulate a shorter scrollHeight to indicate no overflow
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 80, // Less than 100 to simulate no overflow
    });

    render(
      <ExpandText>
        <p>This is short text that fits within the container.</p>
      </ExpandText>,
    );

    // Check that the "Show More" button is not rendered
    expect(
      screen.queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });
});
