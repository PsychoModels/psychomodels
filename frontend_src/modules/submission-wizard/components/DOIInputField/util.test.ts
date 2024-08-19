import { describe, it, expect } from "vitest";
import { removeDoiUrlPrefix } from "./util";

describe("removeDoiUrlPrefix", () => {
  it('removes the prefix "https://doi.org/" from a DOI', () => {
    const doi = "https://doi.org/10.1000/xyz123";
    const result = removeDoiUrlPrefix(doi);
    expect(result).toBe("10.1000/xyz123");
  });

  it("returns the DOI unchanged if it does not have the prefix", () => {
    const doi = "10.1000/xyz123";
    const result = removeDoiUrlPrefix(doi);
    expect(result).toBe("10.1000/xyz123");
  });

  it("returns an empty string unchanged", () => {
    const doi = "";
    const result = removeDoiUrlPrefix(doi);
    expect(result).toBe("");
  });

  it("handles a DOI with a similar but incorrect prefix", () => {
    const doi = "https://otherurl.org/10.1000/xyz123";
    const result = removeDoiUrlPrefix(doi);
    expect(result).toBe("https://otherurl.org/10.1000/xyz123");
  });
});
