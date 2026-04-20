import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

function Boom({ trigger }: { trigger: boolean }) {
  if (trigger) throw new Error("kaboom");
  return <div>all good</div>;
}

beforeEach(() => {
  // ErrorBoundary logs the error in componentDidCatch; silence the noisy console output for tests.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <Boom trigger={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("all good")).toBeInTheDocument();
  });

  it("renders the default fallback with the error message when a child throws", () => {
    render(
      <ErrorBoundary>
        <Boom trigger={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("kaboom")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
  });

  it("uses a custom fallback when one is provided", () => {
    render(
      <ErrorBoundary fallback={<div>custom fallback</div>}>
        <Boom trigger={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("custom fallback")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("exposes a Try Again button that can be clicked in the error state", () => {
    render(
      <ErrorBoundary>
        <Boom trigger={true} />
      </ErrorBoundary>,
    );
    const btn = screen.getByRole("button", { name: /Try Again/i });
    expect(btn).toBeEnabled();
  });
});
