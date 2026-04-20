import { useState } from "react";
import toast from "react-hot-toast";
import {
  addCategory,
  updateCategory,
  deleteCategoryAndItems,
  countItemsInCategory,
  seedDefaultCategories,
  DEFAULT_CATEGORIES,
  type Category,
} from "@/services/categories";
import { useConfirm } from "@/components/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  categories: Category[];
  onChange: () => Promise<void> | void;
}

export default function CategoriesPanel({ categories, onChange }: Props) {
  const confirm = useConfirm();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSeedDefaults() {
    setBusy(true);
    try {
      const added = await seedDefaultCategories();
      toast.success(
        added === 0 ? "All default categories already exist" : `Added ${added} default categor${added === 1 ? "y" : "ies"}`,
      );
      await onChange();
    } catch (err) {
      console.error("[seedDefaultCategories] failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg.toLowerCase().includes("permission")
          ? `Permission denied (signed in as ${user?.email ?? "unknown"}). Check firestore.rules.`
          : `Failed: ${msg}`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error("That category already exists");
      return;
    }
    setBusy(true);
    try {
      await addCategory(name);
      toast.success("Category added");
      setNewName("");
      await onChange();
    } catch (err) {
      console.error("[addCategory] failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg.toLowerCase().includes("permission")
          ? `Permission denied (signed in as ${user?.email ?? "unknown"}). Check firestore.rules.`
          : `Failed: ${msg}`,
      );
    } finally {
      setBusy(false);
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  async function saveEdit(cat: Category) {
    const name = editName.trim();
    if (!name) return;
    if (name === cat.name) {
      setEditingId(null);
      return;
    }
    if (categories.some((c) => c.id !== cat.id && c.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Another category already has that name");
      return;
    }
    setBusy(true);
    try {
      await updateCategory(cat.id, name, cat.name);
      toast.success("Category renamed");
      setEditingId(null);
      await onChange();
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename category");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(cat: Category) {
    const count = await countItemsInCategory(cat.name);
    const videoLine =
      count === 0
        ? "No portfolio items use this category."
        : count === 1
          ? "1 portfolio video in this category will also be permanently deleted."
          : `${count} portfolio videos in this category will also be permanently deleted.`;

    const ok = await confirm({
      title: `Delete category "${cat.name}"?`,
      message: `${videoLine} This cannot be undone.`,
      confirmText: count > 0 ? `Delete category + ${count} video${count === 1 ? "" : "s"}` : "Delete category",
      tone: "danger",
    });
    if (!ok) return;

    setBusy(true);
    try {
      const deleted = await deleteCategoryAndItems(cat.id, cat.name);
      toast.success(
        deleted > 0
          ? `Deleted "${cat.name}" and ${deleted} portfolio item${deleted === 1 ? "" : "s"}`
          : `Deleted "${cat.name}"`,
      );
      await onChange();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-white/10 bg-white/[0.02] mb-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div>
          <h2 className="font-inter text-sm font-semibold text-white">Categories</h2>
          <p className="text-white/40 text-xs font-light mt-0.5">
            {categories.length} {categories.length === 1 ? "category" : "categories"} — used as filters on the public site
          </p>
        </div>
        <span className={`text-white/40 text-lg transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="border-t border-white/10 p-5 space-y-5">
          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name"
              className="flex-1 bg-white/[0.03] border border-white/10 text-white px-4 py-2.5 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
            />
            <button
              type="submit"
              disabled={busy || !newName.trim()}
              className="px-5 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors disabled:opacity-50"
            >
              + Add
            </button>
          </form>

          {categories.length === 0 ? (
            <div className="border border-white/10 bg-white/[0.02] p-4 space-y-3">
              <p className="text-white/50 text-sm font-light">
                No categories yet. You can add one above, or load the default set:
              </p>
              <p className="text-white/40 text-xs font-light">
                {DEFAULT_CATEGORIES.join(" · ")}
              </p>
              <button
                type="button"
                onClick={handleSeedDefaults}
                disabled={busy}
                className="px-5 py-2.5 border border-[#ffffff]/40 text-white text-xs tracking-widest uppercase font-light hover:bg-[#ffffff] hover:text-black transition-colors disabled:opacity-50"
              >
                Load Default Categories
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-white/5 border border-white/5">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center gap-3 px-4 py-3">
                  {editingId === cat.id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        className="flex-1 bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                      />
                      <button
                        onClick={() => saveEdit(cat)}
                        disabled={busy}
                        className="px-3 py-2 bg-[#ffffff] text-black text-[10px] tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 border border-white/10 text-white/50 text-[10px] tracking-widest uppercase font-light hover:border-white/40 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-white text-sm font-light">{cat.name}</span>
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-3 py-1.5 border border-white/10 text-white/50 text-[10px] tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={busy}
                        className="px-3 py-1.5 border border-white/10 text-white/50 text-[10px] tracking-widest uppercase font-light hover:border-red-500/60 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
