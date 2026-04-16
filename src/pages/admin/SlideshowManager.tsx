import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSlides,
  uploadSlide,
  deleteSlide,
  updateSlideOrder,
  type SlideImage,
} from "@/services/slideshow";

export default function SlideshowManager() {
  const [slides, setSlides] = useState<SlideImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    try {
      const data = await getSlides();
      setSlides(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load slides");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Select an image first");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large (max 10MB)");
      return;
    }
    setUploading(true);
    try {
      const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.order)) + 1 : 0;
      await uploadSlide(file, nextOrder);
      toast.success("Slide uploaded");
      setFile(null);
      setPreview(null);
      const input = document.getElementById("slide-file-input") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadSlides();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(slide: SlideImage) {
    if (!confirm("Delete this slide?")) return;
    try {
      await deleteSlide(slide);
      toast.success("Slide deleted");
      await loadSlides();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete slide");
    }
  }

  async function handleMove(slide: SlideImage, direction: -1 | 1) {
    const index = slides.findIndex((s) => s.id === slide.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= slides.length) return;
    const neighbor = slides[swapIndex];
    try {
      await Promise.all([
        updateSlideOrder(slide.id, neighbor.order),
        updateSlideOrder(neighbor.id, slide.order),
      ]);
      await loadSlides();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reorder");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cinzel text-2xl font-bold text-white mb-2">Slideshow</h1>
        <p className="text-white/40 text-sm font-light">
          {slides.length} {slides.length === 1 ? "slide" : "slides"} — shown in the hero background
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="border border-[#c9a84c]/30 bg-[#c9a84c]/5 p-6 mb-8"
      >
        <h2 className="font-cinzel text-lg font-semibold text-white mb-5">Upload New Slide</h2>

        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
          <div>
            <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
              Image
            </label>
            <input
              id="slide-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-white/70 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:tracking-widest file:uppercase file:font-semibold file:bg-[#c9a84c] file:text-black hover:file:bg-[#d4b86a] file:cursor-pointer cursor-pointer"
            />
            <p className="text-white/30 text-xs mt-2 font-light">
              Recommended: 1920×1080 or larger, under 10MB
            </p>
          </div>

          {preview && (
            <div className="w-48 aspect-video border border-white/10 overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="mt-6 px-8 py-3 bg-[#c9a84c] text-black text-sm tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Slide"}
        </button>
      </form>

      {slides.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-white/40 text-sm font-light">No slides uploaded yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide, i) => (
            <div key={slide.id} className="border border-white/10 bg-white/[0.02] overflow-hidden group">
              <div className="relative aspect-video">
                <img src={slide.url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 border border-[#c9a84c]/30 backdrop-blur-sm">
                  <span className="text-[#c9a84c] text-[10px] tracking-widest uppercase font-light">
                    #{i + 1}
                  </span>
                </div>
              </div>
              <div className="p-3 flex gap-2">
                <button
                  onClick={() => handleMove(slide, -1)}
                  disabled={i === 0}
                  title="Move up"
                  className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMove(slide, 1)}
                  disabled={i === slides.length - 1}
                  title="Move down"
                  className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleDelete(slide)}
                  className="flex-1 py-2 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-red-500/60 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
