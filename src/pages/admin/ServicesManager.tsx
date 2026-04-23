import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getServices,
  addService,
  updateService,
  deleteService,
  type Service,
  type SubItem,
} from "@/services/services";
import { useConfirm } from "@/components/ConfirmDialog";
import { SERVICE_ICONS } from "@/lib/serviceIcons";

interface DraftForm {
  title: string;
  iconPath: string;
  subItems: SubItem[];
}

const blankSubItem: SubItem = { number: "", title: "", description: "" };

const emptyDraft: DraftForm = {
  title: "",
  iconPath: "",
  subItems: [
    { number: "01", title: "", description: "" },
    { number: "02", title: "", description: "" },
    { number: "03", title: "", description: "" },
  ],
};

export default function ServicesManager() {
  const confirm = useConfirm();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftForm>(emptyDraft);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<DraftForm>(emptyDraft);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(svc: Service) {
    setEditingId(svc.id);
    setEditDraft({
      title: svc.title,
      iconPath: svc.iconPath,
      subItems: svc.subItems.map((s) => ({ ...s })),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(emptyDraft);
  }

  function updateSubItem(
    target: "add" | "edit",
    index: number,
    field: keyof SubItem,
    value: string
  ) {
    const setter = target === "add" ? setAddDraft : setEditDraft;
    setter((d) => {
      const subItems = [...d.subItems];
      subItems[index] = { ...subItems[index], [field]: value };
      return { ...d, subItems };
    });
  }

  function addSubItemRow(target: "add" | "edit") {
    const setter = target === "add" ? setAddDraft : setEditDraft;
    setter((d) => ({
      ...d,
      subItems: [...d.subItems, { ...blankSubItem, number: String(d.subItems.length + 1).padStart(2, "0") }],
    }));
  }

  function removeSubItemRow(target: "add" | "edit", index: number) {
    const setter = target === "add" ? setAddDraft : setEditDraft;
    setter((d) => ({
      ...d,
      subItems: d.subItems.filter((_, i) => i !== index),
    }));
  }

  function validateDraft(draft: DraftForm): string | null {
    if (!draft.title.trim()) return "Title is required";
    if (!draft.iconPath.trim()) return "Icon path is required";
    if (draft.subItems.length === 0) return "Add at least one sub-item";
    for (const s of draft.subItems) {
      if (!s.title.trim()) return "Each sub-item needs a title";
    }
    return null;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const error = validateDraft(addDraft);
    if (error) { toast.error(error); return; }
    setBusyId("__add__");
    try {
      const nextOrder = services.length > 0 ? Math.max(...services.map((s) => s.order)) + 1 : 0;
      await addService(
        {
          title: addDraft.title.trim(),
          iconPath: addDraft.iconPath.trim(),
          subItems: addDraft.subItems.map((s) => ({
            number: s.number.trim(),
            title: s.title.trim(),
            description: s.description.trim(),
          })),
        },
        nextOrder
      );
      toast.success("Service added");
      setAddDraft(emptyDraft);
      setAdding(false);
      await loadServices();
    } catch (err) {
      console.error(err);
      toast.error("Add failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveEdit(svc: Service) {
    const error = validateDraft(editDraft);
    if (error) { toast.error(error); return; }
    setBusyId(svc.id);
    try {
      await updateService(svc.id, {
        title: editDraft.title.trim(),
        iconPath: editDraft.iconPath.trim(),
        subItems: editDraft.subItems.map((s) => ({
          number: s.number.trim(),
          title: s.title.trim(),
          description: s.description.trim(),
        })),
      });
      toast.success("Saved");
      setEditingId(null);
      setEditDraft(emptyDraft);
      await loadServices();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(svc: Service) {
    const ok = await confirm({
      title: `Delete "${svc.title}"?`,
      message: "This service and all its sub-items will be permanently removed.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(svc.id);
    try {
      await deleteService(svc.id);
      toast.success("Deleted");
      await loadServices();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(svc: Service, direction: -1 | 1) {
    const idx = services.findIndex((s) => s.id === svc.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= services.length) return;
    const neighbor = services[swapIdx];
    setBusyId(svc.id);
    try {
      await Promise.all([
        updateService(svc.id, { order: neighbor.order }),
        updateService(neighbor.id, { order: svc.order }),
      ]);
      await loadServices();
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
          <h1 className="font-inter text-2xl font-bold text-white mb-2">Services</h1>
          <p className="text-white/40 text-sm font-light">
            {services.length} {services.length === 1 ? "service" : "services"} — shown in the "Our Services" section
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="px-5 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-white/80 transition-colors"
          >
            + Add Service
          </button>
        )}
      </div>

      {adding && (
        <form
          onSubmit={handleAdd}
          className="border border-[#ffffff]/30 bg-[#ffffff]/5 p-6 mb-8 space-y-5"
        >
          <h2 className="font-inter text-lg font-semibold text-white">Add Service</h2>
          <ServiceFormFields
            draft={addDraft}
            onTitleChange={(v) => setAddDraft((d) => ({ ...d, title: v }))}
            onIconChange={(v) => setAddDraft((d) => ({ ...d, iconPath: v }))}
            onSubItemChange={(i, f, v) => updateSubItem("add", i, f, v)}
            onAddSubItem={() => addSubItemRow("add")}
            onRemoveSubItem={(i) => removeSubItemRow("add", i)}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busyId === "__add__"}
              className="px-6 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-white/80 transition-colors disabled:opacity-50"
            >
              {busyId === "__add__" ? "Adding..." : "Add Service"}
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

      {services.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-white/40 text-sm font-light">
            No services yet — click "Add Service" to create the first one
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((svc, i) => {
            const isEditing = editingId === svc.id;
            const isBusy = busyId === svc.id;
            return (
              <div key={svc.id} className="border border-white/10 bg-white/[0.02]">
                {isEditing ? (
                  <div className="p-6 space-y-5">
                    <ServiceFormFields
                      draft={editDraft}
                      onTitleChange={(v) => setEditDraft((d) => ({ ...d, title: v }))}
                      onIconChange={(v) => setEditDraft((d) => ({ ...d, iconPath: v }))}
                      onSubItemChange={(i2, f, v) => updateSubItem("edit", i2, f, v)}
                      onAddSubItem={() => addSubItemRow("edit")}
                      onRemoveSubItem={(i2) => removeSubItemRow("edit", i2)}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(svc)}
                        disabled={isBusy}
                        className="px-6 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-semibold hover:bg-white/80 transition-colors disabled:opacity-50"
                      >
                        {isBusy ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-6 py-2.5 border border-white/20 text-white/60 text-xs tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-white">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={svc.iconPath} />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-white/30 text-xs tracking-widest uppercase font-light">#{i + 1}</span>
                            <h3 className="font-inter text-lg font-semibold text-white">{svc.title}</h3>
                          </div>
                          <p className="text-white/40 text-xs font-light">
                            {svc.subItems.length} {svc.subItems.length === 1 ? "sub-item" : "sub-items"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMove(svc, -1)}
                          disabled={i === 0 || isBusy}
                          title="Move up"
                          className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#ffffff]/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(svc, 1)}
                          disabled={i === services.length - 1 || isBusy}
                          title="Move down"
                          className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#ffffff]/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => startEdit(svc)}
                          disabled={isBusy}
                          className="py-2 px-4 border border-white/10 text-white/60 text-xs tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(svc)}
                          disabled={isBusy}
                          className="py-2 px-4 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-red-500/60 hover:text-red-400 transition-colors"
                        >
                          {isBusy ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-16">
                      {svc.subItems.map((s) => (
                        <div key={s.number + s.title} className="border border-white/5 bg-white/[0.02] p-4">
                          <div className="text-white/30 text-[10px] tracking-widest font-light mb-1">{s.number}</div>
                          <div className="text-white text-sm font-semibold mb-1">{s.title}</div>
                          <div className="text-white/50 text-xs font-light leading-relaxed">{s.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ServiceFormFieldsProps {
  draft: DraftForm;
  onTitleChange: (v: string) => void;
  onIconChange: (v: string) => void;
  onSubItemChange: (index: number, field: keyof SubItem, value: string) => void;
  onAddSubItem: () => void;
  onRemoveSubItem: (index: number) => void;
}

function ServiceFormFields({
  draft, onTitleChange, onIconChange, onSubItemChange, onAddSubItem, onRemoveSubItem,
}: ServiceFormFieldsProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">Title</label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
            placeholder="e.g. Marketing Consultancy"
          />
        </div>
        <div>
          <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">Icon</label>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {SERVICE_ICONS.map((icon) => {
              const selected = draft.iconPath === icon.path;
              return (
                <button
                  key={icon.key}
                  type="button"
                  onClick={() => onIconChange(icon.path)}
                  title={icon.label}
                  className={`aspect-square flex items-center justify-center border transition-colors ${
                    selected
                      ? "border-white bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
                  </svg>
                </button>
              );
            })}
          </div>
          {!draft.iconPath && (
            <p className="text-white/30 text-xs font-light mt-2">Select an icon above</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-white/40 text-xs tracking-widest uppercase font-light">Sub-items</label>
          <button
            type="button"
            onClick={onAddSubItem}
            className="px-3 py-1 border border-white/15 text-white/60 text-[10px] tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
          >
            + Add Sub-item
          </button>
        </div>
        <div className="space-y-3">
          {draft.subItems.map((s, i) => (
            <div key={i} className="border border-white/10 bg-white/[0.02] p-4 grid sm:grid-cols-[80px_1fr_auto] gap-3 items-start">
              <input
                type="text"
                value={s.number}
                onChange={(e) => onSubItemChange(i, "number", e.target.value)}
                placeholder="01"
                className="bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60"
              />
              <div className="space-y-2">
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => onSubItemChange(i, "title", e.target.value)}
                  placeholder="Sub-item title"
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60"
                />
                <textarea
                  value={s.description}
                  onChange={(e) => onSubItemChange(i, "description", e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-3 py-2 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 resize-none"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveSubItem(i)}
                className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-red-500/60 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
