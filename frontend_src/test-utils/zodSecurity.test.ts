import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const options = { fields: {}, shouldUseNativeValidation: false };

describe("Zod 4 security and form-resolver compatibility", () => {
  it("rejects an oversized constrained collection before parsing its elements", async () => {
    const visit = vi.fn((value: string) => value);
    const schema = z.object({
      entries: z
        .array(z.string().transform(visit))
        .max(2, "At most two entries"),
    });
    const result = await zodResolver(schema)(
      { entries: Array.from({ length: 1000 }, () => "entry") },
      undefined,
      options,
    );
    expect(visit).not.toHaveBeenCalled();
    expect(result.values).toEqual({});
    expect(result.errors).toMatchObject({
      entries: { message: "At most two entries" },
    });
  });

  it("keeps nested field paths and custom messages for valid-sized form input", async () => {
    const schema = z.object({
      entries: z
        .array(z.object({ label: z.string().min(1, "Label is required") }))
        .max(2),
    });
    const result = await zodResolver(schema)(
      { entries: [{ label: "" }] },
      undefined,
      options,
    );
    expect(result.values).toEqual({});
    expect(result.errors).toMatchObject({
      entries: [{ label: { message: "Label is required" } }],
    });
  });
});
