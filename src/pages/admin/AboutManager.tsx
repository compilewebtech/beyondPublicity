import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ABOUT_ICONS,
  DEFAULT_ABOUT,
  getAbout,
  iconPathFor,
  updateAbout,
  type AboutContent,
  type AboutHighlight,
} from "@/services/about";
import { useConfirm } from "@/components/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";

const emptyContent: AboutContent = {
  paragraphs: [],
  highlights: [],
  imageUrl: "",
  imageAlt: "",
  statValue: "",
  statLabel: "",
};

export default function AboutManager() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const [content, setContent] = useState<AboutContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getAbout();
      if (data) {
        setContent(data);
        setExists(true);
      } else {
        setContent(emptyContent);
        setExists(false);
      }
      setDirty(false);
    } catch (err) {
      console.error("[getAbout] failed:", err);
      toast.error("Failed to load About content");
    } finally {
      setLoading(false);
    }
  }

  function handleLoadDefaults() {
    setContent(DEFAULT_ABOUT);
    setDirty(true);
    toast.success("Loaded defaults. Review and click Save to publish.");
  }

  function updateField<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
    setDirty(true);
  }

  function updateParagraph(index: number, value: string) {
    setContent((c) => {
      const next = [...c.paragraphs];
      next[index] = value;
      return { ...c, paragraphs: next };
    });
    setDirty(true);
  }

  function addParagraph() {
    setContent((c) => ({ ...c, paragraphs: [...c.paragraphs, ""] }));
    setDirty(true);
  }

  async function removeParagraph(index: number) {
    const ok = await confirm({
      title: "Remove this paragraph?",
      message: "The paragraph text will be deleted. You can add a new one anytime.",
      confirmText: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    setContent((c) => ({ ...c, paragraphs: c.paragraphs.filter((_, i) => i !== index) }));
    setDirty(true);
  }

  function moveParagraph(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0) return;
    setContent((c) => {
      if (target >= c.paragraphs.length) return c;
      const next = [...c.paragraphs];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...c, paragraphs: next };
    });
    setDirty(true);
  }

  function updateHighlight(index: number, field: keyof AboutHighlight, value: string) {
    setContent((c) => {
      const next = [...c.highlights];
      next[index] = { ...next[index], [field]: value };
      return { ...c, highlights: next };
    });
    setDirty(true);
  }

  function addHighlight() {
    setContent((c) => ({
      ...c,
      highlights: [...c.highlights, { iconKey: ABOUT_ICONS[0].key, title: "", description: "" }],
    }));
    setDirty(true);
  }

  async function removeHighlight(index: number) {
    const ok = await confirm({
      title: "Remove this highlight?",
      message: "The highlight card will be deleted.",
      confirmText: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    setContent((c) => ({ ...c, highlights: c.highlights.filter((_, i) => i !== index) }));
    setDirty(true);
  }

  function moveHighlight(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0) return;
    setContent((c) => {
      if (target >= c.highlights.length) return c;
      const next = [...c.highlights];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...c, highlights: next };
    });
    setDirty(true);
  }

  async function handleSave() {
    if (content.paragraphs.length === 0 && content.highlights.length === 0) {
      toast.error("Add at least one paragraph or highlight before saving");
      return;
    }
    setSaving(true);
    try {
      await updateAbout(content);
      toast.success("Saved — live site updated");
      setDirty(false);
      setExists(true);
    } catch (err) {
      console.error("[updateAbout] failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg.toLowerCase().includes("permission")
          ? `Permission denied (signed in as ${user?.email ?? "unknown"}). Check firestore.rules.`
          : `Failed: ${msg}`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter text-2xl font-bold text-white mb-2">About Section</h1>
        <p className="text-white/40 text-sm font-light">
          Edit the copy, highlights, hero image and stat shown in the About Us section on the home page.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {!exists && (
            <div className="border border-white/10 bg-white/[0.02] p-5 mb-6 flex items-start justify-between gap-5">
              <div>
                <p className="text-white text-sm font-light mb-1">
                  About content hasn't been published yet.
                </p>
                <p className="text-white/40 text-xs font-light">
                  The live site is currently showing built-in defaults. Load them here to edit, or start from scratch.
                </p>
              </div>
              <button
                onClick={handleLoadDefaults}
                className="px-5 py-2.5 border border-[#ffffff]/40 text-white text-xs tracking-widest uppercase font-light hover:bg-[#ffffff] hover:text-black transition-colors whitespace-nowrap"
              >
                Load Defaults
              </button>
            </div>
          )}

          <div className="space-y-8">
            {/* Paragraphs */}
            <section className="border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-sm tracking-widest uppercase font-medium">
                  Paragraphs ({content.paragraphs.length})
                </h2>
                <button
                  onClick={addParagraph}
                  className="px-4 py-2 border border-white/10 text-white/60 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
                >
                  + Add Paragraph
                </button>
              </div>

              {content.paragraphs.length === 0 ? (
                <div className="border border-dashed border-white/10 p-6 text-center">
                  <p className="text-white/40 text-sm font-light">
                    No paragraphs yet. Add one above or load the defaults.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {content.paragraphs.map((p, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-white/30 text-xs font-light pt-3 w-8">#{i + 1}</span>
                      <textarea
                        value={p}
                        onChange={(e) => updateParagraph(i, e.target.value)}
                        rows={3}
                        className="flex-1 bg-white/[0.03] border border-white/10 text-white/80 px-4 py-3 text-sm font-light leading-relaxed focus:outline-none focus:border-[#ffffff]/60 transition-colors resize-y"
                        placeholder="Paragraph text"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveParagraph(i, -1)}
                          disabled={i === 0}
                          title="Move up"
                          className="px-2 py-1 border border-white/10 text-white/50 hover:border-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveParagraph(i, 1)}
                          disabled={i === content.paragraphs.length - 1}
                          title="Move down"
                          className="px-2 py-1 border border-white/10 text-white/50 hover:border-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeParagraph(i)}
                          title="Remove paragraph"
                          className="px-2 py-1 border border-white/10 text-white/50 hover:border-red-500/60 hover:text-red-400 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Highlights */}
            <section className="border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-sm tracking-widest uppercase font-medium">
                  Highlights ({content.highlights.length})
                </h2>
                <button
                  onClick={addHighlight}
                  className="px-4 py-2 border border-white/10 text-white/60 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
                >
                  + Add Highlight
                </button>
              </div>

              {content.highlights.length === 0 ? (
                <div className="border border-dashed border-white/10 p-6 text-center">
                  <p className="text-white/40 text-sm font-light">
                    No highlights yet. Add one above or load the defaults.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {content.highlights.map((h, i) => (
                    <div key={i} className="border border-white/10 bg-black/30 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white/30 text-xs font-light w-8">#{i + 1}</span>
                        <div className="w-10 h-10 border border-[#ffffff]/30 flex items-center justify-center text-white flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={iconPathFor(h.iconKey)} />
                          </svg>
                        </div>
                        <select
                          value={h.iconKey}
                          onChange={(e) => updateHighlight(i, "iconKey", e.target.value)}
                          className="bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                        >
                          {ABOUT_ICONS.map((opt) => (
                            <option key={opt.key} value={opt.key} className="bg-[#0a0a0a]">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="flex-1" />
                        <button
                          onClick={() => moveHighlight(i, -1)}
                          disabled={i === 0}
                          title="Move up"
                          className="px-3 py-2 border border-white/10 text-white/50 hover:border-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveHighlight(i, 1)}
                          disabled={i === content.highlights.length - 1}
                          title="Move down"
                          className="px-3 py-2 border border-white/10 text-white/50 hover:border-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeHighlight(i)}
                          title="Remove highlight"
                          className="px-3 py-2 border border-white/10 text-white/50 hover:border-red-500/60 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        value={h.title}
                        onChange={(e) => updateHighlight(i, "title", e.target.value)}
                        placeholder="Title"
                        className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                      />
                      <input
                        type="text"
                        value={h.description}
                        onChange={(e) => updateHighlight(i, "description", e.target.value)}
                        placeholder="Short description"
                        className="w-full bg-white/[0.03] border border-white/10 text-white/80 px-4 py-2.5 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Image + stat */}
            <section className="border border-white/10 bg-white/[0.02] p-5 space-y-4">
              <h2 className="text-white text-sm tracking-widest uppercase font-medium">
                Image & Stat Badge
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={content.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                    placeholder="/images/about-bg.jpg or https://..."
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={content.imageAlt}
                    onChange={(e) => updateField("imageAlt", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                    placeholder="Short description of the image"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                    Stat Value
                  </label>
                  <input
                    type="text"
                    value={content.statValue}
                    onChange={(e) => updateField("statValue", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                    placeholder="10+"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                    Stat Label
                  </label>
                  <input
                    type="text"
                    value={content.statLabel}
                    onChange={(e) => updateField("statLabel", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                    placeholder="Years of Excellence"
                  />
                </div>
              </div>

              {content.imageUrl && (
                <div className="mt-4">
                  <div className="text-white/40 text-xs tracking-widest uppercase font-light mb-2">Preview</div>
                  <div className="relative w-full max-w-md aspect-[4/3] border border-white/10 overflow-hidden">
                    <img
                      src={content.imageUrl}
                      alt={content.imageAlt || "preview"}
                      className="w-full h-full object-cover"
                    />
                    {content.statValue && (
                      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-[#ffffff]/30 px-4 py-2.5">
                        <div className="font-inter text-white text-lg font-bold">{content.statValue}</div>
                        <div className="text-white/60 text-[10px] tracking-widest uppercase font-light mt-0.5">
                          {content.statLabel}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs font-light">
                {dirty ? "Unsaved changes" : "All changes saved"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={load}
                  disabled={!dirty || saving}
                  className="px-5 py-2.5 border border-white/10 text-white/60 text-xs tracking-widest uppercase font-light hover:border-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Revert
                </button>
                <button
                  onClick={handleSave}
                  disabled={!dirty || saving}
                  className="px-6 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save & Publish"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
