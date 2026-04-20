import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getLegalPage,
  updateLegalPage,
  defaultFor,
  type LegalPage,
  type LegalPageId,
  type LegalSection,
} from "@/services/legal";
import { useConfirm } from "@/components/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";

const emptyPage: LegalPage = { title: "", lastUpdated: "", sections: [] };

export default function LegalManager() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LegalPageId>("privacy");
  const [page, setPage] = useState<LegalPage>(emptyPage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    loadPage(activeTab);
  }, [activeTab]);

  async function loadPage(id: LegalPageId) {
    setLoading(true);
    try {
      const data = await getLegalPage(id);
      if (data) {
        setPage(data);
        setExists(true);
      } else {
        setPage(emptyPage);
        setExists(false);
      }
      setDirty(false);
    } catch (err) {
      console.error("[getLegalPage] failed:", err);
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  }

  function handleLoadDefaults() {
    setPage(defaultFor(activeTab));
    setDirty(true);
    toast.success("Loaded defaults. Review and click Save to publish.");
  }

  function updateField<K extends keyof LegalPage>(key: K, value: LegalPage[K]) {
    setPage((p) => ({ ...p, [key]: value }));
    setDirty(true);
  }

  function updateSection(index: number, field: keyof LegalSection, value: string) {
    setPage((p) => {
      const next = [...p.sections];
      next[index] = { ...next[index], [field]: value };
      return { ...p, sections: next };
    });
    setDirty(true);
  }

  function addSection() {
    setPage((p) => ({ ...p, sections: [...p.sections, { heading: "", body: "" }] }));
    setDirty(true);
  }

  async function removeSection(index: number) {
    const ok = await confirm({
      title: "Remove this section?",
      message: "The section's heading and body will be deleted. You can always add a new one.",
      confirmText: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    setPage((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }));
    setDirty(true);
  }

  function moveSection(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0) return;
    setPage((p) => {
      if (target >= p.sections.length) return p;
      const next = [...p.sections];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...p, sections: next };
    });
    setDirty(true);
  }

  async function handleSave() {
    if (!page.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (page.sections.length === 0) {
      toast.error("Add at least one section");
      return;
    }
    setSaving(true);
    try {
      await updateLegalPage(activeTab, page);
      toast.success("Saved — live site updated");
      setDirty(false);
      setExists(true);
    } catch (err) {
      console.error("[updateLegalPage] failed:", err);
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

  async function handleSwitchTab(next: LegalPageId) {
    if (next === activeTab) return;
    if (dirty) {
      const ok = await confirm({
        title: "Discard unsaved changes?",
        message: "Switching tabs without saving will lose your edits on this page.",
        confirmText: "Discard",
        tone: "danger",
      });
      if (!ok) return;
    }
    setActiveTab(next);
  }

  const tabs: { id: LegalPageId; label: string }[] = [
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms of Service" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter text-2xl font-bold text-white mb-2">Legal Pages</h1>
        <p className="text-white/40 text-sm font-light">
          Edit the content shown on /privacy and /terms. Paragraphs in a section body are separated by blank lines.
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSwitchTab(t.id)}
            className={`px-5 py-3 text-xs tracking-widest uppercase font-light transition-colors border-b-2 -mb-px ${
              activeTab === t.id
                ? "text-white border-white"
                : "text-white/40 border-transparent hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
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
                  This page hasn't been published yet.
                </p>
                <p className="text-white/40 text-xs font-light">
                  Start from a blank slate or load a reasonable default to edit.
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

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                  placeholder="Privacy Policy"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                  Last updated
                </label>
                <input
                  type="text"
                  value={page.lastUpdated}
                  onChange={(e) => updateField("lastUpdated", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                  placeholder="April 2026"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light">
                  Sections ({page.sections.length})
                </label>
                <button
                  onClick={addSection}
                  className="px-4 py-2 border border-white/10 text-white/60 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
                >
                  + Add Section
                </button>
              </div>

              {page.sections.length === 0 ? (
                <div className="border border-dashed border-white/10 p-8 text-center">
                  <p className="text-white/40 text-sm font-light">
                    No sections yet. Add one above or load the defaults.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {page.sections.map((section, i) => (
                    <div key={i} className="border border-white/10 bg-white/[0.02] p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white/30 text-xs font-light w-8">#{i + 1}</span>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => updateSection(i, "heading", e.target.value)}
                          className="flex-1 bg-white/[0.03] border border-white/10 text-white px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                          placeholder="Section heading"
                        />
                        <button
                          onClick={() => moveSection(i, -1)}
                          disabled={i === 0}
                          title="Move up"
                          className="px-3 py-2 border border-white/10 text-white/50 hover:border-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveSection(i, 1)}
                          disabled={i === page.sections.length - 1}
                          title="Move down"
                          className="px-3 py-2 border border-white/10 text-white/50 hover:border-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeSection(i)}
                          title="Remove section"
                          className="px-3 py-2 border border-white/10 text-white/50 hover:border-red-500/60 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        value={section.body}
                        onChange={(e) => updateSection(i, "body", e.target.value)}
                        rows={5}
                        className="w-full bg-white/[0.03] border border-white/10 text-white/80 px-4 py-3 text-sm font-light leading-relaxed focus:outline-none focus:border-[#ffffff]/60 transition-colors resize-y"
                        placeholder="Section body. Separate paragraphs with a blank line."
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs font-light">
                {dirty ? "Unsaved changes" : "All changes saved"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => loadPage(activeTab)}
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
