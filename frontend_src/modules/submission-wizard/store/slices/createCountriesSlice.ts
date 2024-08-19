import { StateCreator } from "zustand";
import { Country } from "../../../../models";

type CountriesSlice = {
  countries: Country[];
  setCountries: (data: Country[]) => void;
};

const initialState = {
  countries: [],
};

export const createCountriesSlice: StateCreator<CountriesSlice> = (set) => {
  // do not reset this slice

  return {
    ...initialState,
    setCountries: (data) =>
      set(() => ({
        countries: data,
      })),
  };
};

export type { CountriesSlice };
