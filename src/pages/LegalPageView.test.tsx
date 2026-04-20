import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LegalPageView from "./LegalPageView";
import * as legalService from "@/services/legal";

vi.mock("@/services/legal", async () => {
  const actual = await vi.importActual<typeof import("@/services/legal")>("@/services/legal");
  return {
    ...actual,
    getLegalPage: vi.fn(),
  };
});

const mockedGet = vi.mocked(legalService.getLegalPage);

function renderPage(id: "privacy" | "terms" = "privacy") {
  return render(
    <MemoryRouter>
      <LegalPageView id={id} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockedGet.mockReset();
});

describe("LegalPageView", () => {
  it("renders Firestore content when the page exists", async () => {
    mockedGet.mockResolvedValue({
      title: "Custom Privacy",
      lastUpdated: "March 2030",
      sections: [
        { heading: "Scope", body: "Applies to the website only." },
        { heading: "Contact", body: "Email us." },
      ],
    });

    renderPage("privacy");

    expect(await screen.findByText("Custom Privacy")).toBeInTheDocument();
    expect(screen.getByText(/Last updated: March 2030/)).toBeInTheDocument();
    expect(screen.getByText("Scope")).toBeInTheDocument();
    expect(screen.getByText("Applies to the website only.")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("falls back to the built-in defaults when Firestore returns null", async () => {
    mockedGet.mockResolvedValue(null);

    renderPage("terms");

    // DEFAULT_TERMS.title
    expect(await screen.findByText("Terms of Service")).toBeInTheDocument();
    // First default Terms section heading
    expect(screen.getByText("1. Acceptance")).toBeInTheDocument();
  });

  it("falls back to defaults if the Firestore call throws", async () => {
    mockedGet.mockRejectedValue(new Error("offline"));

    renderPage("privacy");

    expect(await screen.findByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("1. Who we are")).toBeInTheDocument();
  });

  it("splits a section body into separate paragraphs on blank lines", async () => {
    mockedGet.mockResolvedValue({
      title: "Test",
      lastUpdated: "",
      sections: [
        { heading: "S", body: "First para.\n\nSecond para.\n\nThird para." },
      ],
    });

    renderPage("privacy");

    await waitFor(() => expect(screen.getByText("First para.")).toBeInTheDocument());
    expect(screen.getByText("Second para.")).toBeInTheDocument();
    expect(screen.getByText("Third para.")).toBeInTheDocument();
  });

  it("links to the sibling legal page (terms → privacy)", async () => {
    mockedGet.mockResolvedValue({ title: "Terms", lastUpdated: "", sections: [{ heading: "X", body: "Y" }] });

    renderPage("terms");

    const link = await screen.findByRole("link", { name: /Privacy Policy/ });
    expect(link).toHaveAttribute("href", "/privacy");
  });
});
