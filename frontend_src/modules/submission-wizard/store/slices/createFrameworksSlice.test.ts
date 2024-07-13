import { expect, describe, beforeEach, it } from "vitest";

import create from "zustand";
import {
  createFrameworksSlice,
  Framework,
  FrameworksSlice,
} from "./createFrameworksSlice";

const useStore = create<FrameworksSlice>(createFrameworksSlice);

describe("createFrameworksSlice", () => {
  beforeEach(() => {
    // Reset the state before each test
    useStore.setState({ frameworks: [] });
  });

  it("should initialize with an empty frameworks array", () => {
    const { frameworks } = useStore.getState();
    expect(frameworks).toEqual([]);
  });

  it("should add a framework to the frameworks array", () => {
    const newFramework: Framework = {
      id: 1,
      name: "React",
      description: "A JavaScript library for building user interfaces",
      explanation: "Maintained by Facebook",
    };
    useStore.getState().addFramework(newFramework);

    const { frameworks } = useStore.getState();
    expect(frameworks).toHaveLength(1);
    expect(frameworks).toContainEqual(newFramework);
  });

  it("should set the frameworks array with provided data", () => {
    const frameworksData: Framework[] = [
      {
        id: 1,
        name: "React",
        description: "A JavaScript library for building user interfaces",
        explanation: "Maintained by Facebook",
      },
      {
        id: 2,
        name: "Angular",
        description:
          "A platform for building mobile and desktop web applications",
        explanation: "Maintained by Google",
      },
    ];

    useStore.getState().setFrameworks(frameworksData);

    const { frameworks } = useStore.getState();
    expect(frameworks).toEqual(frameworksData);
  });

  it("should correctly update frameworks array when adding multiple frameworks", () => {
    const framework1: Framework = {
      id: 1,
      name: "Vue",
      description: "A progressive framework for building user interfaces",
      explanation: "Created by Evan You",
    };
    const framework2: Framework = {
      id: 2,
      name: "Svelte",
      description: "A radical new approach to building user interfaces",
      explanation: "Created by Rich Harris",
    };

    useStore.getState().addFramework(framework1);
    useStore.getState().addFramework(framework2);

    const { frameworks } = useStore.getState();
    expect(frameworks).toHaveLength(2);
    expect(frameworks).toContainEqual(framework1);
    expect(frameworks).toContainEqual(framework2);
  });
});
