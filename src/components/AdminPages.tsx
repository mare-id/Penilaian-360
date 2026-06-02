import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { AppState, Employee, OrgUnit, Job, DemoAccount } from "../types";
import { orgUnitCatalog, jobCatalog } from "../data";
import { Badge, Card, Button, Field } from "./UIComponents";
import { calculateResult } from "../utils";

interface PageProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  toast: (msg: string) => void;
  user?: DemoAccount;
}

export function DataASNPage({ state, setState, toast, user }: PageProps) {
  const orgs = state.orgUnits && state.orgUnits.length > 0 ? state.orgUnits : orgUnitCatalog;
  const jobs = state.jobs && state.jobs.length > 0 ? state.jobs : jobCatalog;

  const blank = (): Employee => ({
    id: 0,
    nama: "",
    nip: "",
    gol: "III/a",
    jabatan: jobs[0]?.name || "Pelaksana",
    jenis: "Pelaksana",
    unit: orgs[0]?.name || "Kepala Badan",
    atasanId: null,
    hasSub: false,
    role: "ASN",
    username: "",
    password: "admin123",
  });

  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Employee>(blank());
  const [editing, setEditing] = useState(false);
  const [atasanInput, setAtasanInput] = useState<string>("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [asnToDelete, setAsnToDelete] = useState<Employee | null>(null);

  const [adminQuery, setAdminQuery] = useState("");
  const [adminForm, setAdminForm] = useState({ id: "", username: "", name: "", password: "admin123" });
  const [editingAdmin, setEditingAdmin] = useState(false);

  const formattedAdmins = (state.admins || []).filter((adm) =>
    `${adm.name} ${adm.username}`.toLowerCase().includes(adminQuery.toLowerCase())
  );

  const rows = state.employees.filter((e) =>
    `${e.nama} ${e.nip} ${e.jabatan} ${e.unit}`.toLowerCase().includes(query.toLowerCase())
  );

  const validNip = (value: string) => value.length === 18 && value.split("").every((c) => c >= "0" && c <= "9");

  const chooseJob = (jobName: string) => {
    const job = jobs.find((j) => j.name === jobName);
    setForm({
      ...form,
      jabatan: jobName,
      jenis: job?.type || form.jenis,
      unit: job?.defaultUnit || form.unit,
      hasSub: job?.leadership || false,
    });
  };

  const save = () => {
    if (!form.nama.trim()) return toast("Nama ASN wajib diisi.");
    if (!validNip(form.nip)) return toast("NIP wajib 18 digit angka.");
    const duplicate = state.employees.some((e) => e.nip === form.nip && e.id !== form.id);
    if (duplicate) return toast("NIP sudah digunakan ASN lain.");

    const cleanUsername = (form.username || form.nip).trim();
    if (!cleanUsername) return toast("Username wajib diisi.");
    if (!form.password || form.password.length < 6) return toast("Password minimal 6 karakter.");
    const duplicateUsername = state.employees.some((e) => (e.username || e.nip) === cleanUsername && e.id !== form.id);
    if (duplicateUsername) return toast("Username sudah digunakan ASN lain.");

    const parsedAtasanId = atasanInput === "" ? null : Number(atasanInput);
    const payload: Employee = {
      ...form,
      role: "ASN",
      username: cleanUsername,
      password: form.password,
      atasanId: parsedAtasanId,
    };

    setState((s) => {
      const exists = s.employees.some((e) => e.id === payload.id);
      const newId = Math.max(0, ...s.employees.map((e) => e.id)) + 1;
      return {
        ...s,
        employees: exists
          ? s.employees.map((e) => (e.id === payload.id ? payload : e))
          : [...s.employees, { ...payload, id: newId }],
      };
    });

    setForm(blank());
    setAtasanInput("");
    setEditing(false);
    setShowFormModal(false);
    toast(editing ? "Data ASN berhasil diperbarui." : "Data ASN berhasil ditambahkan.");
  };

  const edit = (employee: Employee) => {
    setForm({
      ...employee,
      username: employee.username || employee.nip,
      password: employee.password || "admin123",
    });
    setAtasanInput(employee.atasanId === null ? "" : String(employee.atasanId));
    setEditing(true);
    setShowFormModal(true);
  };

  const remove = (employee: Employee) => {
    if (user && user.userId === employee.id) {
      return toast("Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.");
    }
    const hasChildren = state.employees.some((e) => e.atasanId === employee.id);
    if (hasChildren) {
      return toast("ASN masih menjadi atasan langsung pegawai lain.");
    }
    setAsnToDelete(employee);
  };

  const confirmDelete = () => {
    if (!asnToDelete) return;
    const targetId = asnToDelete.id;

    setState((s) => ({
      ...s,
      employees: s.employees.filter((e) => e.id !== targetId),
      assignments: s.assignments.filter((a) => a.evalueeId !== targetId && a.evaluatorId !== targetId),
      responses: s.responses.filter((r) => {
        const a = s.assignments.find((x) => x.id === r.assignmentId);
        return a && a.evalueeId !== targetId && a.evaluatorId !== targetId;
      }),
      objections: s.objections.filter((o) => o.evalueeId !== targetId),
      pendingRaters: s.pendingRaters.filter((p) => p.evalueeId !== targetId),
    }));

    toast(`Data ASN ${asnToDelete.nama} berhasil dihapus.`);
    setAsnToDelete(null);
  };

  const editAdmin = (adm: any) => {
    setAdminForm({
      id: adm.id,
      username: adm.username,
      name: adm.name,
      password: adm.password || "admin123",
    });
    setEditingAdmin(true);
  };

  const saveAdmin = () => {
    if (!adminForm.username.trim()) return toast("Username admin wajib diisi.");
    if (!adminForm.name.trim()) return toast("Nama admin wajib diisi.");
    if (!adminForm.password.trim() || adminForm.password.length < 6) return toast("Password admin minimal 6 karakter.");

    const currentAdmins = state.admins || [];
    const exists = currentAdmins.some((a) => a.id === adminForm.id);
    
    const duplicateUsernameAdmins = currentAdmins.some((a) => a.username.toLowerCase() === adminForm.username.toLowerCase() && a.id !== adminForm.id);
    const duplicateUsernameEmployees = state.employees.some((e) => (e.username || e.nip).toLowerCase() === adminForm.username.toLowerCase());
    
    if (duplicateUsernameAdmins || duplicateUsernameEmployees) {
      return toast("Username sudah digunakan oleh akun lain.");
    }

    const payload = {
      id: adminForm.id || adminForm.username,
      username: adminForm.username,
      name: adminForm.name,
      password: adminForm.password,
      role: "Admin BKPSDM",
    };

    setState((s) => {
      const liveAdmins = s.admins || [];
      const isExist = liveAdmins.some((a) => a.id === payload.id);
      return {
        ...s,
        admins: isExist
          ? liveAdmins.map((a) => (a.id === payload.id ? payload : a))
          : [...liveAdmins, payload],
      };
    });

    setAdminForm({ id: "", username: "", name: "", password: "admin123" });
    setEditingAdmin(false);
    toast(editingAdmin ? "Kewenangan admin berhasil diperbarui." : "Kewenangan admin baru berhasil ditambahkan.");
  };

  const removeAdmin = (adm: any) => {
    if (user && user.role === "Admin BKPSDM" && user.username === adm.username) {
      return toast("Anda tidak dapat menghapus akun admin yang sedang aktif Anda gunakan.");
    }
    setState((s) => ({
      ...s,
      admins: (s.admins || []).filter((a) => a.id !== adm.id),
    }));
    toast(`Kewenangan admin '${adm.name}' berhasil dihapus.`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <h2 className="font-black text-blue-950 font-display">Setting Data ASN</h2>
        <p className="mt-1 text-sm leading-6 text-blue-900">
          Admin dapat menambah, mengedit, dan menghapus user ASN. Data ini menjadi dasar atasan langsung, unit kerja, jabatan, role, serta logika evaluator 360 derajat.
        </p>
      </Card>
      
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-4xl rounded-2xl border border-slate-100 bg-white shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h3 className="text-lg font-black text-slate-950 font-display">
                {editing ? "Edit User ASN" : "Tambah User ASN"}
              </h3>
              <button
                id="btn-close-asn-modal"
                onClick={() => { setShowFormModal(false); setForm(blank()); setAtasanInput(""); setEditing(false); }}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition animate-scale-up"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Nama">
                  <input id="input-asn-nama" className="w-full rounded-xl border p-3 font-semibold text-sm" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                </Field>
                <Field label="NIP">
                  <input id="input-asn-nip" className="w-full rounded-xl border p-3 font-semibold text-sm" maxLength={18} value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value.replace(/[^0-9]/g, "") })} />
                </Field>
                <Field label="Pangkat/Gol">
                  <input id="input-asn-gol" className="w-full rounded-xl border p-3 font-semibold text-sm" value={form.gol} onChange={(e) => setForm({ ...form, gol: e.target.value })} />
                </Field>
                <Field label="Jabatan">
                  <select id="select-asn-jabatan" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.jabatan} onChange={(e) => chooseJob(e.target.value)}>
                    {jobs.map((j) => <option key={j.id} value={j.name}>{j.name}</option>)}
                  </select>
                </Field>
                <Field label="Jenis Jabatan">
                  <select id="select-asn-jenis" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })}>
                    <option value="JPT Pratama">JPT Pratama</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Pengawas">Pengawas</option>
                    <option value="Fungsional">Fungsional</option>
                    <option value="Pelaksana">Pelaksana</option>
                  </select>
                </Field>
                <Field label="Unit Kerja">
                  <select id="select-asn-unit" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                    {orgs.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </Field>
                <Field label="Atasan Langsung">
                  <select id="select-asn-atasan" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={atasanInput} onChange={(e) => setAtasanInput(e.target.value)}>
                    <option value="">Tidak ada</option>
                    {state.employees.filter((e) => e.id !== form.id).map((e) => (
                      <option key={e.id} value={e.id}>{e.nama} • {e.jabatan}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Username Login">
                  <input id="input-asn-username" className="w-full rounded-xl border p-3 font-semibold text-sm" value={form.username || ""} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Contoh: dewi.berutu" />
                </Field>
                <Field label="Password Login">
                  <input id="input-asn-password" className="w-full rounded-xl border p-3 font-semibold text-sm" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimal 6 karakter" />
                </Field>
                <Field label="Memiliki Bawahan">
                  <select id="select-asn-has-sub" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.hasSub ? "Ya" : "Tidak"} onChange={(e) => setForm({ ...form, hasSub: e.target.value === "Ya" })}>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 p-5 bg-slate-50 rounded-b-2xl">
              <Button id="btn-cancel-asn-modal" variant="secondary" onClick={() => { setShowFormModal(false); setForm(blank()); setAtasanInput(""); setEditing(false); }}>Batal</Button>
              <Button id="btn-save-asn-modal" onClick={save}>{editing ? "Simpan Perubahan" : "Tambah ASN"}</Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900">Daftar User ASN</h2>
            <p className="text-xs text-slate-500 font-medium font-sans">Katalog seluruh pegawai di BKPSDM Dairi.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button id="btn-open-add-asn-modal" onClick={() => { setForm(blank()); setAtasanInput(""); setEditing(false); setShowFormModal(true); }} className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold">
              <Plus className="h-4 w-4" /> Tambah User ASN
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input id="search-asn" className="rounded-xl border py-2 pl-9 pr-3 text-xs w-60" placeholder="Cari ASN" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3">Nama</th>
                <th>NIP</th>
                <th>Username</th>
                <th>Jabatan</th>
                <th>Unit</th>
                <th>Role</th>
                <th>Atasan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const boss = state.employees.find((b) => b.id === e.atasanId);
                return (
                  <tr key={e.id} className="border-b border-slate-100">
                    <td className="py-3 font-bold">{e.nama}</td>
                    <td>{e.nip}</td>
                    <td>{e.username || e.nip}</td>
                    <td>
                      {e.jabatan}
                      <div className="text-xs text-slate-500">{e.jenis} • {e.gol}</div>
                    </td>
                    <td>{e.unit}</td>
                    <td>
                      <Badge className="border-slate-200 bg-slate-50 text-slate-705 font-bold">
                        {e.jabatan.toLowerCase() === "kepala badan" || e.id === 1
                          ? "ASN (Kepala Badan)"
                          : e.hasSub
                          ? "ASN (Atasan)"
                          : "ASN (Pegawai)"}
                      </Badge>
                    </td>
                    <td>{boss?.nama || "-"}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => edit(e)}>Edit</Button>
                        <Button variant="danger" onClick={() => remove(e)}>Hapus</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SEPARATE APPLICATION ADMINISTRATORS PANEL */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-black font-display text-slate-900">{editingAdmin ? "Edit Kewenangan Admin" : "Tambah Kewenangan Admin"}</h2>
          <p className="text-xs text-slate-500 mb-4 mt-0.5 font-medium leading-relaxed">
            Admin Sistem memegang hak administratif penuh dalam aplikasi namun tidak memiliki profil NIP, nama golongan, atau unit struktural ASN. Hal ini memisahkan peran fungsional aplikasi dari posisi PNS.
          </p>
          
          <div className="space-y-4">
            <Field label="Nama Lengkap Administrator">
              <input 
                className="w-full rounded-xl border p-3 font-semibold text-sm" 
                value={adminForm.name} 
                onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} 
                placeholder="Contoh: Admin Bidang Mutasi" 
              />
            </Field>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Username Login Admin">
                <input 
                  disabled={editingAdmin} 
                  className="w-full rounded-xl border p-3 font-semibold text-sm disabled:bg-slate-100 disabled:text-slate-500" 
                  value={adminForm.username} 
                  onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })} 
                  placeholder="Contoh: admin.mutasi" 
                />
              </Field>
              <Field label="Password Login Admin">
                <input 
                  className="w-full rounded-xl border p-3 font-semibold text-sm" 
                  value={adminForm.password} 
                  type="text"
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                  placeholder="Sandi minimal 6 karakter" 
                />
              </Field>
            </div>
            
            <div className="pt-2 flex gap-2">
              <Button onClick={saveAdmin}>{editingAdmin ? "Simpan Perbaikan Admin" : "Daftarkan Admin"}</Button>
              {editingAdmin && (
                <Button variant="secondary" onClick={() => { setAdminForm({ id: "", username: "", name: "", password: "admin123" }); setEditingAdmin(false); }}>Batal Edit</Button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black font-display text-slate-900">Daftar Administrator Sistem</h2>
              <p className="text-xs text-slate-500 font-medium font-sans">Pengguna dengan hak akses dan kewenangan penuh.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input 
                className="rounded-xl border py-1.5 pl-8 pr-3 text-xs w-48 font-semibold" 
                placeholder="Cari admin..." 
                value={adminQuery} 
                onChange={(e) => setAdminQuery(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="overflow-auto max-h-[300px] space-y-2.5">
            {formattedAdmins.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">Tidak ditemukan data admin.</div>
            ) : (
              formattedAdmins.map((adm) => (
                <div key={adm.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 flex items-center justify-between shadow-sm transition hover:shadow-md">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-950 font-display">{adm.name}</h4>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">Username: <span className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">{adm.username}</span></p>
                    <div className="flex gap-1.5 mt-2">
                      <span className="text-[9px] bg-sky-50 border border-sky-100 rounded px-1.5 py-0.5 font-bold text-sky-700 uppercase">SYS_ADMIN</span>
                      <span className="text-[9px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-semibold text-slate-600">Pure Role</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5">
                    <Button className="h-7 text-xs py-0 px-2.5 rounded-lg" variant="secondary" onClick={() => editAdmin(adm)}>Edit</Button>
                    <Button className="h-7 text-xs py-0 px-2.5 rounded-lg" variant="danger" onClick={() => removeAdmin(adm)}>Hapus</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {asnToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Konfirmasi Hapus ASN</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin menghapus data ASN <span className="text-slate-800 font-bold">{asnToDelete.nama}</span> (NIP. {asnToDelete.nip})? Tindakan ini bersifat permanen dan akan menghapus semua ulasan, tugas kuesioner, draf sengketa, dan relasi multi-rater terkait.
            </p>
            <div className="mt-4 flex justify-end gap-2 text-xs">
              <Button type="button" variant="secondary" onClick={() => setAsnToDelete(null)}>Batal</Button>
              <Button type="button" variant="danger" onClick={confirmDelete}>Ya, Hapus Permanen</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function UnitCrudPage({ state, setState, toast }: PageProps) {
  const currentUnits = state.orgUnits && state.orgUnits.length > 0 ? state.orgUnits : orgUnitCatalog;
  const blank = (): OrgUnit => ({ id: 0, name: "", parentId: null, type: "Bidang" });
  const [form, setForm] = useState<OrgUnit>(blank());
  const [editing, setEditing] = useState(false);
  const [parentInput, setParentInput] = useState<string>("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<OrgUnit | null>(null);

  const save = () => {
    if (!form.name.trim()) return toast("Nama unit kerja wajib diisi.");
    const duplicate = currentUnits.some((u) => u.name.toLowerCase() === form.name.toLowerCase() && u.id !== form.id);
    if (duplicate) return toast("Nama unit kerja sudah ada.");

    const parsedParentId = parentInput === "" ? null : Number(parentInput);
    const payload: OrgUnit = { ...form, parentId: parsedParentId };

    setState((s) => {
      const orgUnits = s.orgUnits && s.orgUnits.length > 0 ? s.orgUnits : orgUnitCatalog;
      const exists = orgUnits.some((u) => u.id === payload.id);
      const newId = Math.max(0, ...orgUnits.map((u) => u.id)) + 1;
      return {
        ...s,
        orgUnits: exists
          ? orgUnits.map((u) => (u.id === payload.id ? payload : u))
          : [...orgUnits, { ...payload, id: newId }],
      };
    });

    setForm(blank());
    setParentInput("");
    setEditing(false);
    setShowFormModal(false);
    toast(editing ? "Unit kerja berhasil diperbarui." : "Unit kerja berhasil ditambahkan.");
  };

  const edit = (unit: OrgUnit) => {
    setForm(unit);
    setParentInput(unit.parentId === null ? "" : String(unit.parentId));
    setEditing(true);
    setShowFormModal(true);
  };

  const remove = (unit: OrgUnit) => {
    const hasChild = currentUnits.some((u) => u.parentId === unit.id);
    const usedByAsn = state.employees.some((e) => e.unit === unit.name);
    if (hasChild) return toast("Unit masih memiliki turunan. Hapus atau pindahkan turunannya terlebih dahulu.");
    if (usedByAsn) return toast("Unit masih digunakan pada data ASN.");
    setUnitToDelete(unit);
  };

  const confirmDeleteUnit = () => {
    if (!unitToDelete) return;
    setState((s) => ({
      ...s,
      orgUnits: (s.orgUnits && s.orgUnits.length > 0 ? s.orgUnits : orgUnitCatalog).filter((u) => u.id !== unitToDelete.id),
    }));
    toast(`Unit kerja '${unitToDelete.name}' berhasil dihapus.`);
    setUnitToDelete(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <h2 className="font-black text-blue-950 font-display">Master Unit Kerja BKPSDM Dairi</h2>
        <p className="mt-1 text-sm leading-6 text-blue-900">
          Struktur disusun dari bagan organisasi: Kepala Badan, Kelompok Jabatan Fungsional, Sekretariat Badan, dua Subbagian, dua Bidang, dan kelompok jabatan fungsional pada masing-masing bidang.
        </p>
      </Card>
      
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h3 className="text-lg font-black text-slate-950 font-display">
                {editing ? "Edit Unit Kerja" : "Tambah Unit Kerja"}
              </h3>
              <button
                id="btn-close-unit-modal"
                onClick={() => { setShowFormModal(false); setForm(blank()); setParentInput(""); setEditing(false); }}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition animate-scale-up"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-4">
              <Field label="Nama Unit">
                <input id="input-unit-name" className="w-full rounded-xl border p-3 font-semibold text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Induk Unit">
                <select id="select-unit-parent" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={parentInput} onChange={(e) => setParentInput(e.target.value)}>
                  <option value="">Tidak ada</option>
                  {currentUnits.filter((u) => u.id !== form.id).map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Jenis Unit">
                <select id="select-unit-type" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="Pucuk Pimpinan">Pucuk Pimpinan</option>
                  <option value="Sekretariat">Sekretariat</option>
                  <option value="Subbagian">Subbagian</option>
                  <option value="Bidang">Bidang</option>
                  <option value="Kelompok Jabatan Fungsional">Kelompok Jabatan Fungsional</option>
                  <option value="Kelompok">Kelompok</option>
                </select>
              </Field>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 p-5 bg-slate-50 rounded-b-2xl">
              <Button id="btn-cancel-unit-modal" variant="secondary" onClick={() => { setShowFormModal(false); setForm(blank()); setParentInput(""); setEditing(false); }}>Batal</Button>
              <Button id="btn-save-unit-modal" onClick={save}>{editing ? "Simpan Perubahan" : "Tambah Unit"}</Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900">Daftar Unit Kerja</h2>
            <p className="text-xs text-slate-500 font-medium font-sans">Katalog hierarki unit kerja di lingkungan BKPSDM.</p>
          </div>
          <Button id="btn-open-add-unit-modal" onClick={() => { setForm(blank()); setParentInput(""); setEditing(false); setShowFormModal(true); }} className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold">
            <Plus className="h-4 w-4" /> Tambah Unit Kerja
          </Button>
        </div>
        
        <div className="overflow-auto font-display">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3">Unit</th>
                <th>Induk</th>
                <th>Jenis</th>
                <th>ASN</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentUnits.map((u) => {
                const parent = currentUnits.find((p) => p.id === u.parentId);
                const count = state.employees.filter((e) => e.unit === u.name).length;
                return (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="py-3 font-bold text-slate-900">{u.name}</td>
                    <td>{parent?.name || "-"}</td>
                    <td>
                      <Badge className="border-slate-200 bg-slate-50 text-slate-700">{u.type}</Badge>
                    </td>
                    <td>{count}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button id={`btn-edit-unit-${u.id}`} variant="secondary" onClick={() => edit(u)}>Edit</Button>
                        <Button id={`btn-delete-unit-${u.id}`} variant="danger" onClick={() => remove(u)}>Hapus</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {unitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Konfirmasi Hapus Unit Kerja</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin menghapus Unit Kerja <span className="text-slate-800 font-bold">{unitToDelete.name}</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex justify-end gap-2 text-xs">
              <Button id="btn-cancel-delete-unit" type="button" variant="secondary" onClick={() => setUnitToDelete(null)}>Batal</Button>
              <Button id="btn-confirm-delete-unit" type="button" variant="danger" onClick={confirmDeleteUnit}>Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function JobCrudPage({ state, setState, toast }: PageProps) {
  const orgs = state.orgUnits && state.orgUnits.length > 0 ? state.orgUnits : orgUnitCatalog;
  const currentJobs = state.jobs && state.jobs.length > 0 ? state.jobs : jobCatalog;
  const blank = (): Job => ({ id: 0, name: "", type: "Pelaksana", defaultUnit: orgs[0]?.name || "Kepala Badan", leadership: false, description: "" });
  const [form, setForm] = useState<Job>(blank());
  const [editing, setEditing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const save = () => {
    if (!form.name.trim()) return toast("Nama jabatan wajib diisi.");
    const duplicate = currentJobs.some((j) => j.name.toLowerCase() === form.name.toLowerCase() && j.id !== form.id);
    if (duplicate) return toast("Nama jabatan sudah ada.");

    setState((s) => {
      const jobs = s.jobs && s.jobs.length > 0 ? s.jobs : jobCatalog;
      const exists = jobs.some((j) => j.id === form.id);
      const newId = Math.max(0, ...jobs.map((j) => j.id)) + 1;
      return {
        ...s,
        jobs: exists
          ? jobs.map((j) => (j.id === form.id ? form : j))
          : [...jobs, { ...form, id: newId }],
      };
    });

    setForm(blank());
    setEditing(false);
    setShowFormModal(false);
    toast(editing ? "Jabatan berhasil diperbarui." : "Jabatan berhasil ditambahkan.");
  };

  const edit = (job: Job) => {
    setForm(job);
    setEditing(true);
    setShowFormModal(true);
  };

  const remove = (job: Job) => {
    const usedByAsn = state.employees.some((e) => e.jabatan === job.name);
    if (usedByAsn) return toast("Jabatan masih digunakan pada data ASN.");
    setJobToDelete(job);
  };

  const confirmDeleteJob = () => {
    if (!jobToDelete) return;
    setState((s) => ({
      ...s,
      jobs: (s.jobs && s.jobs.length > 0 ? s.jobs : jobCatalog).filter((j) => j.id !== jobToDelete.id),
    }));
    toast(`Jabatan '${jobToDelete.name}' berhasil dihapus.`);
    setJobToDelete(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <h2 className="font-black text-blue-950 font-display">Master Jabatan BKPSDM Dairi</h2>
        <p className="mt-1 text-sm leading-6 text-blue-900">
          Admin dapat mengatur nama jabatan, jenis jabatan, unit default, dan apakah jabatan tersebut memicu kuesioner dimensi Kepemimpinan dalam survei 360 derajat.
        </p>
      </Card>
      
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-xl rounded-2xl border border-slate-100 bg-white shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h3 className="text-lg font-black text-slate-950 font-display">
                {editing ? "Edit Jabatan" : "Tambah Jabatan"}
              </h3>
              <button
                id="btn-close-job-modal"
                onClick={() => { setShowFormModal(false); setForm(blank()); setEditing(false); }}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition animate-scale-up"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-4">
              <Field label="Nama Jabatan">
                <input id="input-job-name" className="w-full rounded-xl border p-3 font-semibold text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Jenis Jabatan">
                <select id="select-job-type" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="JPT Pratama">JPT Pratama</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Pengawas">Pengawas</option>
                  <option value="Fungsional">Fungsional</option>
                  <option value="Pelaksana">Pelaksana</option>
                </select>
              </Field>
              <Field label="Unit Default">
                <select id="select-job-unit" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.defaultUnit} onChange={(e) => setForm({ ...form, defaultUnit: e.target.value })}>
                  {orgs.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
              </Field>
              <Field label="Pertanyaan Kepemimpinan">
                <select id="select-job-leadership" className="w-full rounded-xl border p-3 font-semibold text-sm bg-white" value={form.leadership ? "Ya" : "Tidak"} onChange={(e) => setForm({ ...form, leadership: e.target.value === "Ya" })}>
                  <option value="Ya">Ya</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </Field>
              <Field label="Deskripsi">
                <input id="input-job-description" className="w-full rounded-xl border p-3 font-semibold text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 p-5 bg-slate-50 rounded-b-2xl">
              <Button id="btn-cancel-job-modal" variant="secondary" onClick={() => { setShowFormModal(false); setForm(blank()); setEditing(false); }}>Batal</Button>
              <Button id="btn-save-job-modal" onClick={save}>{editing ? "Simpan Perubahan" : "Tambah Jabatan"}</Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900">Daftar Jabatan</h2>
            <p className="text-xs text-slate-500 font-medium font-sans">Katalog daftar jabatan di lingkungan BKPSDM.</p>
          </div>
          <Button id="btn-open-add-job-modal" onClick={() => { setForm(blank()); setEditing(false); setShowFormModal(true); }} className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold">
            <Plus className="h-4 w-4" /> Tambah Jabatan
          </Button>
        </div>
        
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm font-display">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3">Jabatan</th>
                <th>Jenis</th>
                <th>Unit Default</th>
                <th>Kepemimpinan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.map((j) => (
                <tr key={j.id} className="border-b border-slate-100">
                  <td className="py-3">
                    <b className="text-slate-900">{j.name}</b>
                    <div className="text-xs text-slate-500">{j.description}</div>
                  </td>
                  <td>
                    <Badge className="border-slate-200 bg-slate-50 text-slate-700">{j.type}</Badge>
                  </td>
                  <td>{j.defaultUnit}</td>
                  <td>
                    {j.leadership ? (
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Ya</Badge>
                    ) : (
                      <Badge className="border-slate-200 bg-slate-50 text-slate-700">Tidak</Badge>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button id={`btn-edit-job-${j.id}`} variant="secondary" onClick={() => edit(j)}>Edit</Button>
                      <Button id={`btn-delete-job-${j.id}`} variant="danger" onClick={() => remove(j)}>Hapus</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in font-display">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Konfirmasi Hapus Jabatan</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-semibold">
              Apakah Anda yakin ingin menghapus Jabatan <span className="text-slate-800 font-bold">{jobToDelete.name}</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex justify-end gap-2 text-xs">
              <Button id="btn-cancel-delete-job" type="button" variant="secondary" onClick={() => setJobToDelete(null)}>Batal</Button>
              <Button id="btn-confirm-delete-job" type="button" variant="danger" onClick={confirmDeleteJob}>Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
