import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders the login form when there is no token", () => {
    render(<App />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("shows confirm password when switching to register", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Register"));

    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  test("logs out and returns to login screen", async () => {
    localStorage.setItem("token", "abc123");
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    expect(await screen.findByText("Notes App")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBeNull();
  });
});
