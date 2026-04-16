import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getTeamMembers,
  saveTeamMember,
  uploadTeamPhoto,
  organOrder,
  type OrganKey,
  type TeamMember,
} from "@/services/team";

export default function TeamManager() {
  const [members, setMembers] = useState<Record<OrganKey, TeamMember> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<OrganKey>("brain");
  const [draft, setDraft] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await getTeamMembers();
      setMembers(data);
      setDraft(data[activeKey]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }

  function selectMember(key: OrganKey) {
    if (!members) return;
    setActiveKey(key);
    setDraft(members[key]);
  }

  function updateDraft<K extends keyof TeamMember>(field: K, value: TeamMember[K]) {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  }

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    try {
      const { id: _id, ...rest } = draft;
      void _id;
      await saveTeamMember(activeKey, rest);
      setMembers((prev) => (prev ? { ...prev, [activeKey]: draft } : prev));
      toast.success("Saved");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !draft) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo too large (max 5MB)");
      return;
    }
    setUploading(true);
    try {
      const { photoUrl, storagePath } = await uploadTeamPhoto(activeKey, file, draft.storagePath);
      const updated: TeamMember = { ...draft, photoUrl, storagePath };
      setDraft(updated);
      setMembers((prev) => (prev ? { ...prev, [activeKey]: updated } : prev));
      toast.success("Photo uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  if (loading || !members || !draft) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter text-2xl font-bold text-white mb-2">Team</h1>
        <p className="text-white/40 text-sm font-light">
          Edit the 4 organ members shown in the "Meet the Team" section
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {organOrder.map((key) => {
          const m = members[key];
          const isActive = key === activeKey;
          return (
            <button
              key={key}
              onClick={() => selectMember(key)}
              className={`px-4 py-2.5 border text-xs tracking-widest uppercase font-light transition-all ${
                isActive
                  ? "bg-white/10 border-white/40 text-white"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
              style={isActive ? { boxShadow: `0 0 18px ${m.color}30` } : {}}
            >
              <span style={{ color: m.color }}>●</span> {m.label}
            </button>
          );
        })}
      </div>

      <div className="border border-[#ffffff]/30 bg-[#ffffff]/5 p-6 md:p-8 space-y-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-6">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-36 h-36 rounded-full overflow-hidden border-2 bg-white/5"
              style={{ borderColor: draft.color }}
            >
              {draft.photoUrl ? (
                <img
                  src={draft.photoUrl}
                  alt={draft.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-inter text-3xl font-bold"
                  style={{ color: draft.color }}
                >
                  {draft.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
            </div>
            <label className="cursor-pointer text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className="block px-4 py-2 border border-white/20 text-white/70 text-[10px] tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors">
                {uploading ? "Uploading..." : "Change Photo"}
              </span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                Name
              </label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => updateDraft("name", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                Role
              </label>
              <input
                type="text"
                value={draft.role}
                onChange={(e) => updateDraft("role", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                Label (e.g. "The Heart")
              </label>
              <input
                type="text"
                value={draft.label}
                onChange={(e) => updateDraft("label", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                Accent Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => updateDraft("color", e.target.value)}
                  className="h-12 w-16 bg-transparent border border-white/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={draft.color}
                  onChange={(e) => updateDraft("color", e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
            Vision Quote
          </label>
          <textarea
            value={draft.vision}
            onChange={(e) => updateDraft("vision", e.target.value)}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={draft.skills.join(", ")}
            onChange={(e) =>
              updateDraft(
                "skills",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
            placeholder="Skill one, Skill two, Skill three"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {draft.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-light tracking-wider border"
                style={{
                  borderColor: `${draft.color}35`,
                  color: draft.color,
                  backgroundColor: `${draft.color}08`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-[#ffffff] text-black text-sm tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
