import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getClients,
  addClient,
  updateClient,
  replaceClientLogo,
  deleteClient,
  type Client,
} from "@/services/clients";

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setFile(null);
    setPreview(null);
    const input = document.getElementById("client-file-input") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  function handleEdit(client: Client) {
    setEditingId(client.id);
    setName(client.name);
    setFile(null);
    setPreview(client.logoUrl);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Client name required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const existing = clients.find((c) => c.id === editingId);
        if (!existing) throw new Error("Client not found");
        const updates: Promise<unknown>[] = [];
        if (name.trim() !== existing.name) {
          updates.push(updateClient(editingId, { name: name.trim() }));
        }
        if (file) {
          updates.push(replaceClientLogo(existing, file));
        }
        await Promise.all(updates);
        toast.success("Client updated");
      } else {
        if (!file) {
          toast.error("Upload a logo");
          setSaving(false);
          return;
        }
        const nextOrder = clients.length > 0 ? Math.max(...clients.map((c) => c.order)) + 1 : 0;
        await addClient(name.trim(), file, nextOrder);
        toast.success("Client added");
      }
      resetForm();
      await loadClients();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(client: Client) {
    if (!confirm(`Delete ${client.name}?`)) return;
    try {
      await deleteClient(client);
      toast.success("Client deleted");
      await loadClients();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete client");
    }
  }

  async function handleMove(client: Client, direction: -1 | 1) {
    const index = clients.findIndex((c) => c.id === client.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= clients.length) return;
    const neighbor = clients[swapIndex];
    try {
      await Promise.all([
        updateClient(client.id, { order: neighbor.order }),
        updateClient(neighbor.id, { order: client.order }),
      ]);
      await loadClients();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reorder");
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
          <h1 className="font-inter text-2xl font-bold text-white mb-2">Clients</h1>
          <p className="text-white/40 text-sm font-light">
            {clients.length} {clients.length === 1 ? "client" : "clients"} — shown in the "Trusted By" strip
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) { resetForm(); return; }
            setShowForm(true);
            setEditingId(null);
            setName("");
            setFile(null);
            setPreview(null);
          }}
          className="px-5 py-2.5 bg-[#ffffff] text-black text-xs tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors"
        >
          {showForm ? "Close" : "+ Add Client"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-[#ffffff]/30 bg-[#ffffff]/5 p-6 mb-8 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-inter text-lg font-semibold text-white">
              {editingId ? "Edit Client" : "Add New Client"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              ✕ Cancel
            </button>
          </div>

          <div>
            <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
              placeholder="Brand or company name"
            />
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
                Logo {editingId && <span className="text-white/30 normal-case tracking-normal">(optional — leave blank to keep current)</span>}
              </label>
              <input
                id="client-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-white/70 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:tracking-widest file:uppercase file:font-semibold file:bg-[#ffffff] file:text-black hover:file:bg-[#d4b86a] file:cursor-pointer cursor-pointer"
              />
              <p className="text-white/30 text-xs mt-2 font-light">
                PNG with transparent background works best
              </p>
            </div>

            {preview && (
              <div className="w-40 h-24 border border-white/10 bg-white/5 flex items-center justify-center p-3">
                <img src={preview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#ffffff] text-black text-sm tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Client" : "Add Client"}
          </button>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-white/40 text-sm font-light">No clients yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, i) => (
            <div key={client.id} className="border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="h-32 bg-white/[0.03] flex items-center justify-center p-4">
                <img src={client.logoUrl} alt={client.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-4">
                <h3 className="font-inter text-sm font-semibold text-white mb-3 truncate">{client.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMove(client, -1)}
                    disabled={i === 0}
                    title="Move up"
                    className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#ffffff]/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMove(client, 1)}
                    disabled={i === clients.length - 1}
                    title="Move down"
                    className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-[#ffffff]/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleEdit(client)}
                    className="flex-1 py-2 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-[#ffffff]/60 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
                    className="py-2 px-3 border border-white/10 text-white/50 text-xs hover:border-red-500/60 hover:text-red-400 transition-colors"
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
