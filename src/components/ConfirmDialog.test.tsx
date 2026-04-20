import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmProvider, useConfirm } from "./ConfirmDialog";

function Harness({ onResult }: { onResult: (v: boolean) => void }) {
  const confirm = useConfirm();
  return (
    <button
      onClick={async () => {
        const ok = await confirm({
          title: "Delete this thing?",
          message: "It will be gone forever.",
          confirmText: "Delete",
          cancelText: "Keep",
          tone: "danger",
        });
        onResult(ok);
      }}
    >
      Trigger
    </button>
  );
}

function renderWithProvider(onResult: (v: boolean) => void) {
  return render(
    <ConfirmProvider>
      <Harness onResult={onResult} />
    </ConfirmProvider>,
  );
}

describe("ConfirmDialog", () => {
  it("does not render the dialog until confirm() is called", () => {
    renderWithProvider(() => {});
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows title, message and custom button labels", async () => {
    const user = userEvent.setup();
    renderWithProvider(() => {});
    await user.click(screen.getByText("Trigger"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete this thing?")).toBeInTheDocument();
    expect(screen.getByText("It will be gone forever.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
  });

  it("resolves true when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    let resolved: boolean | null = null;
    renderWithProvider((v) => { resolved = v; });

    await user.click(screen.getByText("Trigger"));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(resolved).toBe(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("resolves false when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    let resolved: boolean | null = null;
    renderWithProvider((v) => { resolved = v; });

    await user.click(screen.getByText("Trigger"));
    await user.click(screen.getByRole("button", { name: "Keep" }));

    expect(resolved).toBe(false);
  });

  it("resolves false when Escape is pressed", async () => {
    const user = userEvent.setup();
    let resolved: boolean | null = null;
    renderWithProvider((v) => { resolved = v; });

    await user.click(screen.getByText("Trigger"));
    await act(async () => { await user.keyboard("{Escape}"); });

    expect(resolved).toBe(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("resolves true when Enter is pressed", async () => {
    const user = userEvent.setup();
    let resolved: boolean | null = null;
    renderWithProvider((v) => { resolved = v; });

    await user.click(screen.getByText("Trigger"));
    await act(async () => { await user.keyboard("{Enter}"); });

    expect(resolved).toBe(true);
  });

  it("dismisses with false when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    let resolved: boolean | null = null;
    renderWithProvider((v) => { resolved = v; });

    await user.click(screen.getByText("Trigger"));
    await user.click(screen.getByRole("dialog"));

    expect(resolved).toBe(false);
  });
});
