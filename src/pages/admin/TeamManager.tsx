import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  replaceTeamPhoto,
  deleteTeamMember,
  type TeamMember,
} from "@/services/team";
import { useConfirm } from "@/components/ConfirmDialog";

interface DraftForm {
  name: string;
  role: string;
  bio: string;
  photoFile: File | null;
  photoPreview: string | null;
}

const emptyDraft: DraftForm = {
  name: "",
  role: "",
  bio: "",
  photoFile: null,
  photoPreview: null,
};

export default function TeamManager() {
  const confirm = useConfirm();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftForm>(emptyDraft);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<DraftForm>(emptyDraft);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(member: TeamMember) {
    setEditingId(member.id);
    setEditDraft({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photoFile: null,
      photoPreview: null,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(emptyDraft);
  }

  function handleAddPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAddDraft((d) => ({
      ...d,
      photoFile: file,
      photoPreview: file ? URL.createObjectURL(file) : null,
    }));
  }

  function handleEditPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setEditDraft((d) => ({
      ...d,
      photoFile: file,
      photoPreview: file ? URL.createObjectURL(file) : null,
    }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addDraft.name.trim() || !addDraft.role.trim()) {
      toast.error("Name and role are required");
      return;
    }
    if (addDraft.photoFile && addDraft.photoFile.size > 5 * 1024 * 1024) {
      toast.error("Photo too large (max 5MB)");
      return;
    }
    setBusyId("__add__");
    try {
      const nextOrder = members.length > 0 ? Math.max(...members.map((m) => m.order)) + 1 : 0;
      await addTeamMember(
        { name: addDraft.name.trim(), role: addDraft.role.trim(), bio: addDraft.bio.trim() },
        addDraft.photoFile,
        nextOrder
      );
      toast.success("Member added");
      setAddDraft(emptyDraft);
      setAdding(false);
      await loadMembers();
    } catch (err) {
      console.error(err);
      toast.error("Add failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveEdit(member: TeamMember) {
    if (!editDraft.name.trim() || !editDraft.role.trim()) {
      toast.error("Name and role are required");
      return;
    }
    if (editDraft.photoFile && editDraft.photoFile.size > 5 * 1024 * 1024) {
      toast.error("Photo too large (max 5MB)");
      return;
    }
    setBusyId(member.id);
    try {
      await updateTeamMember(member.id, {
        name: editDraft.name.trim(),
        role: editDraft.role.trim(),
        bio: editDraft.bio.trim(),
      });
      if (editDraft.photoFile) {
        await replaceTeamPhoto(member, editDraft.photoFile);
      }
      toast.success("Saved");
      setEditingId(null);
      setEditDraft(emptyDraft);
      await loadMembers();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(member: TeamMember) {
    const ok = await confirm({
      title: `Delete ${member.name}?`,
      message: "Their card and photo will be removed from the Team section.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(member.id);
    try {
      await deleteTeamMember(member);
      toast.success("Deleted");
      await loadMembers();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(member: TeamMember, direction: -1 | 1) {
    const idx = members.findIndex((m) => m.id === member.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= members.length) return;
    const neighbor = members[swapIdx];
    setBusyId(member.id);
    try {
      await Promise.all([
        updateTeamMember(member.id, { order: neighbor.order }),
        updateTeamMember(neighbor.id, { order: member.order }),
      ]);
      await loadMembers();
    } catch (err) {
      console.error(err);
      toast.error("Reorder failed");
    } finally {
      setBusyId(null);
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
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-inter text-2xl font-bold text-white mb-2">Team</h1>
          <p className="text-white/40 text-sm font-light">
            {members.length} {members.length === 1 ? "member" : "members"} — shown in the "Meet the Team" section
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="px-5 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-white/80 transition-colors"
          >
            + Add Member
          </button>
        )}
      </div>

      {adding && (
        <form
          onSubmit={handleAdd}
          className="border border-[#ffffff]/30 bg-[#ffffff]/5 p-6 mb-8 space-y-5"
        >
          <h2 className="font-inter text-lg font-semibold text-white">Add Member</h2>

          <div className="grid md:grid-cols-[auto_1fr] gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 bg-white/5">
                {addDraft.photoPreview ? (
                  <img src={addDraft.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">No photo</div>
                )}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleAddPhoto} className="hidden" />
                <span className="block px-4 py-2 border border-white/20 text-white/70 text-[10px] tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors">
                  Choose Photo
                </span>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">Name</label>
                <input
                  type="text"
                  value={addDraft.name}
                  onChange={(e) => setAddDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">Role</label>
                <input
                  type="text"
                  value={addDraft.role}
                  onChange={(e) => setAddDraft((d) => ({ ...d, role: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">Bio</label>
                <textarea
                  value={addDraft.bio}
                  onChange={(e) => setAddDraft((d) => ({ ...d, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busyId === "__add__"}
              className="px-6 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-white/80 transition-colors disabled:opacity-50"
            >
              {busyId === "__add__" ? "Adding..." : "Add Member"}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setAddDraft(emptyDraft); }}
              className="px-6 py-2.5 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {members.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-white/40 text-sm font-light">No team members yet — click "Add Member" to start</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, i) => {
            const isEditing = editingId === member.id;
            const isBusy = busyId === member.id;
            return (
              <div key={member.id} className="border border-white/10 bg-white/[0.02] overflow-hidden">
                {isEditing ? (
                  <div className="p-5 space-y-4">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-white/5">
                        {editDraft.photoPreview ? (
                          <img src={editDraft.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/40 text-lg font-bold">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleEditPhoto} className="hidden" />
                        <span className="block px-3 py-1.5 border border-white/20 text-white/70 text-[10px] tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors">
                          Replace Photo
                        </span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={editDraft.name}
                      onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                      placeholder="Name"
                      className="w-full bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60"
                    />
                    <input
                      type="text"
                      value={editDraft.role}
                      onChange={(e) => setEditDraft((d) => ({ ...d, role: e.target.value }))}
                      placeholder="Role"
                      className="w-full bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60"
                    />
                    <textarea
                      value={editDraft.bio}
                      onChange={(e) => setEditDraft((d) => ({ ...d, bio: e.target.value }))}
                      placeholder="Bio"
                      rows={3}
                      className="w-full bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(member)}
                        disabled={isBusy}
                        className="flex-1 py-2 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-white/80 transition-colors disabled:opacity-50"
                      >
                        {isBusy ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 py-2 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-square bg-white/[0.02]">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30 text-4xl font-inter font-bold">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 border border-white/20 backdrop-blur-sm">
                        <span className="text-white text-[10px] tracking-widest uppercase font-light">#{i + 1}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-inter text-base font-semibold text-white truncate">{member.name}</h3>
                      <p className="text-white/50 text-xs font-light mb-2 truncate">{member.role}</p>
                      {member.bio && (
                        <p className="text-white/40 text-xs font-light leading-relaxed line-clamp-3 mb-3">{member.bio}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMove(member, -1)}
                          disabled={i === 0 || isBusy}
                          title="Move up"
                          className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#ffffff]/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(member, 1)}
                          disabled={i === members.length - 1 || isBusy}
                          title="Move down"
                          className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#ffffff]/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => startEdit(member)}
                          disabled={isBusy}
                          className="flex-1 py-2 border border-white/10 text-white/60 text-xs tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          disabled={isBusy}
                          className="py-2 px-3 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-red-500/60 hover:text-red-400 transition-colors"
                        >
                          {isBusy ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
