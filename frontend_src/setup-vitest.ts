import "@testing-library/jest-dom";

import { setupServer } from "msw/node";
import { beforeAll, afterAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Setup MSW server
const server = setupServer();

server.events.on("request:start", ({ request }) => {
  console.log("MSW intercepted:", request.method, request.url);
});

beforeAll(() => {
  // Start the MSW server before all tests
  server.listen();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  // Close the MSW server after all tests
  server.close();
});

export { server };
