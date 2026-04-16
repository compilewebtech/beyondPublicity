import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  type PortfolioItem,
  type PortfolioInput,
} from "@/services/portfolio";
import { extractVideoId, getThumbnailUrl } from "@/lib/youtube";
import toast from "react-hot-toast";
import { useConfirm } from "@/components/ConfirmDialog";

const categories = ["Film", "Commercial", "Documentary", "Music Video", "Photography", "Post-Production"];

const emptyForm: PortfolioInput = {
  title: "",
  category: "",
  year: new Date().getFullYear().toString(),
  videoId: "",
  youtubeUrl: "",
  description: "",
};

export default function PortfolioManager() {
  const confirm = useConfirm();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowForm(true);
      setEditingId(null);
      setForm(emptyForm);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  async function loadItems() {
    try {
      const data = await getPortfolioItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load portfolio items");
    } finally {
      setLoading(false);
    }
  }

  function handleYoutubeUrl(url: string) {
    const videoId = extractVideoId(url);
    setForm((prev) => ({
      ...prev,
      youtubeUrl: url,
      videoId: videoId || "",
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.videoId) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updatePortfolioItem(editingId, form);
        toast.success("Portfolio item updated");
      } else {
        await addPortfolioItem(form);
        toast.success("Portfolio item added");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save portfolio item");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      year: item.year,
      videoId: item.videoId,
      youtubeUrl: item.youtubeUrl,
      description: item.description,
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: "Delete this portfolio item?",
      message: "It will be removed from the public portfolio page.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await deletePortfolioItem(id);
      toast.success("Item deleted");
      await loadItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-inter text-2xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-white/40 text-sm font-light">{items.length} items</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="px-5 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors"
        >
          + Add Item
        </button>
      </div>

      {showForm && (
        <div className="border border-[#ffffff]/30 bg-[#ffffff]/5 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-inter text-lg font-semibold text-white">
              {editingId ? "Edit Item" : "Add New Portfolio Item"}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                YouTube URL
              </label>
              <input
                type="text"
                value={form.youtubeUrl}
                onChange={(e) => handleYoutubeUrl(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {form.videoId && (
                <div className="mt-3 flex items-start gap-4">
                  <img
                    src={getThumbnailUrl(form.videoId)}
                    alt="Thumbnail preview"
                    className="w-40 h-auto border border-white/10"
                  />
                  <p className="text-white/30 text-xs mt-1">
                    Video ID: <span className="text-white">{form.videoId}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                  placeholder="Project title"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white/80 px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
                rows={3}
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors resize-none"
                placeholder="Brief description of the project..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#ffffff] text-black text-sm tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Item" : "Add to Portfolio"}
            </button>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-white/40 text-sm font-light mb-4">No portfolio items yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-white/10 bg-white/[0.02] overflow-hidden group">
              <div className="relative h-40">
                <img
                  src={getThumbnailUrl(item.videoId)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 border border-[#ffffff]/30 backdrop-blur-sm">
                  <span className="text-white text-[10px] tracking-widest uppercase font-light">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2 text-white/40 text-[10px] bg-black/50 px-2 py-1">
                  {item.year}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-inter text-sm font-semibold text-white mb-1 truncate">{item.title}</h3>
                <p className="text-white/40 text-xs font-light line-clamp-2 mb-3">{item.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-2 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="py-2 px-4 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-red-500/60 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
