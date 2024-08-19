import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { create } from "zustand";
import { createCountriesSlice, CountriesSlice } from "./createCountriesSlice";
import { Country } from "../../../../models";

const mockCountry: Country = {
  code: "NL",
  name: "Netherlands",
};

describe("CountriesSlice", () => {
  const useTestStore = create<CountriesSlice>()((...a) => ({
    ...createCountriesSlice(...a),
  }));

  it("should initialize with the correct default state", () => {
    const { result } = renderHook(() => useTestStore());

    expect(result.current.countries).toEqual([]); // Should start with an empty array
  });

  it("should update countries with setCountries", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setCountries([mockCountry]);
    });

    expect(result.current.countries).toEqual([mockCountry]); // The countries array should now contain mockCountry
  });

  it("should replace the countries array when setCountries is called again", () => {
    const { result } = renderHook(() => useTestStore());

    act(() => {
      result.current.setCountries([mockCountry]);
    });

    expect(result.current.countries).toEqual([mockCountry]);

    // Call setCountries again with a different country
    const anotherCountry: Country = { code: "BE", name: "Belgium" };
    act(() => {
      result.current.setCountries([anotherCountry]);
    });

    expect(result.current.countries).toEqual([anotherCountry]);
  });
});
