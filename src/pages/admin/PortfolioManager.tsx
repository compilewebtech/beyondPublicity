import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  uploadPortfolioPhoto,
  deletePortfolioPhoto,
  type PortfolioItem,
  type PortfolioInput,
} from "@/services/portfolio";
import { extractVideoId, getThumbnailUrl } from "@/lib/youtube";
import toast from "react-hot-toast";
import { useConfirm } from "@/components/ConfirmDialog";
import { getCategories, type Category } from "@/services/categories";
import CategoriesPanel from "@/components/admin/CategoriesPanel";

const emptyForm: PortfolioInput = {
  title: "",
  category: "",
  year: new Date().getFullYear().toString(),
  videoId: "",
  youtubeUrl: "",
  description: "",
  mediaType: "video",
  vertical: false,
  photoUrl: "",
  photoStoragePath: "",
  linkUrl: "",
};

export default function PortfolioManager() {
  const confirm = useConfirm();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowForm(true);
      setEditingId(null);
      setForm(emptyForm);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  async function loadAll() {
    try {
      const [itemsData, catsData] = await Promise.all([getPortfolioItems(), getCategories()]);
      setItems(itemsData);
      setCategories(catsData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load portfolio items");
    } finally {
      setLoading(false);
    }
  }

  async function reloadCategories() {
    const [itemsData, catsData] = await Promise.all([getPortfolioItems(), getCategories()]);
    setItems(itemsData);
    setCategories(catsData);
  }

  function handleYoutubeUrl(url: string) {
    const videoId = extractVideoId(url);
    setForm((prev) => ({
      ...prev,
      youtubeUrl: url,
      videoId: videoId || "",
    }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large (max 10 MB)");
      return;
    }
    setUploadingPhoto(true);
    try {
      const { url, path } = await uploadPortfolioPhoto(file);
      const previousPath = form.photoStoragePath;
      setForm((p) => ({ ...p, photoUrl: url, photoStoragePath: path }));
      if (previousPath) {
        await deletePortfolioPhoto(previousPath);
      }
      toast.success("Photo uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isPhoto = form.mediaType === "photo";
    if (isPhoto && !form.photoUrl) {
      toast.error("Upload a photo first");
      return;
    }
    if (!isPhoto && !form.videoId) {
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
      await reloadCategories();
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
      mediaType: item.mediaType ?? "video",
      vertical: item.vertical ?? false,
      photoUrl: item.photoUrl ?? "",
      photoStoragePath: item.photoStoragePath ?? "",
      linkUrl: item.linkUrl ?? "",
    });
    setShowForm(true);
  }

  async function handleDelete(item: PortfolioItem) {
    const ok = await confirm({
      title: "Delete this portfolio item?",
      message: "It will be removed from the public portfolio page.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await deletePortfolioItem(item.id);
      if (item.photoStoragePath) {
        await deletePortfolioPhoto(item.photoStoragePath);
      }
      toast.success("Item deleted");
      await reloadCategories();
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
          className="px-5 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#fcea00] transition-colors"
        >
          + Add Item
        </button>
      </div>

      <CategoriesPanel categories={categories} onChange={reloadCategories} />

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
                Media Type
              </label>
              <div className="flex gap-2">
                {(["video", "photo"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, mediaType: t }))}
                    className={`px-5 py-2.5 text-xs tracking-widest uppercase font-light transition-colors border ${
                      (form.mediaType ?? "video") === t
                        ? "bg-white text-black border-white"
                        : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {t === "video" ? "YouTube Video" : "Photo"}
                  </button>
                ))}
              </div>
            </div>

            {(form.mediaType ?? "video") === "video" ? (
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={form.youtubeUrl}
                  onChange={(e) => handleYoutubeUrl(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                  placeholder="https://www.youtube.com/watch?v=... or /shorts/..."
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
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="block w-full text-white/70 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:tracking-widest file:uppercase file:font-semibold file:bg-[#ffffff] file:text-black hover:file:bg-[#fcea00] file:cursor-pointer cursor-pointer disabled:opacity-50"
                  />
                  <p className="text-white/30 text-xs mt-2 font-light">
                    {uploadingPhoto ? "Uploading..." : "Max 10 MB. Square (1080 × 1080) works best for Instagram-style posts."}
                  </p>
                  {form.photoUrl && (
                    <div className="mt-3">
                      <img
                        src={form.photoUrl}
                        alt="Preview"
                        className="w-40 h-40 object-cover border border-white/10"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                    Link URL <span className="text-white/30 normal-case tracking-normal">(optional — where the photo links to when clicked)</span>
                  </label>
                  <input
                    type="url"
                    value={form.linkUrl ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                    placeholder="https://instagram.com/p/..."
                  />
                </div>
              </div>
            )}

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
                  disabled={categories.length === 0}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white/80 px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors disabled:opacity-50"
                >
                  <option value="" disabled>
                    {categories.length === 0 ? "Add a category first" : "Select category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
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
              className="px-8 py-3 bg-[#ffffff] text-black text-sm tracking-widest uppercase font-semibold hover:bg-[#fcea00] transition-colors disabled:opacity-50"
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
            className="px-5 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#fcea00] transition-colors"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isPhoto = item.mediaType === "photo";
            const thumb = isPhoto ? item.photoUrl : getThumbnailUrl(item.videoId);
            return (
            <div key={item.id} className="border border-white/10 bg-white/[0.02] overflow-hidden group">
              <div className="relative h-40">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <div className="px-2 py-1 bg-black/70 border border-[#ffffff]/30 backdrop-blur-sm">
                    <span className="text-white text-[10px] tracking-widest uppercase font-light">
                      {item.category}
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-black/70 border border-white/20 backdrop-blur-sm">
                    <span className="text-white/80 text-[10px] tracking-widest uppercase font-light">
                      {isPhoto ? "Photo" : "Video"}
                    </span>
                  </div>
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
                    onClick={() => handleDelete(item)}
                    className="py-2 px-4 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-red-500/60 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
