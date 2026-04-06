import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
  barChart,
  doctorRows,
  doctors,
  patients,
  summaryCards,
  upcomingAppointments,
  users,
} from "./dashboardData";
import type { AppointmentRecord, SidebarNavId } from "./dashboardData";

/* ——— Dashboard ——— */

type AppointmentRow = (typeof upcomingAppointments)[number];

function BarChartBlock() {
  return (
    <section className="card chart-card">
      <h2 className="card-title">{barChart.title}</h2>
      <div className="chart-area">
        <div className="chart-grid">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="chart-grid-line" />
          ))}
        </div>
        <div className="chart-bars">
          {barChart.heights.map((h, i) => (
            <div
              key={i}
              className="chart-bar"
              style={{
                height: `${h * 100}%`,
                backgroundColor: barChart.colors[i % barChart.colors.length],
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingTable({ rows }: { rows: readonly AppointmentRow[] }) {
  return (
    <section className="card table-card">
      <h2 className="card-title">Yaklaşan Randevular</h2>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hasta</th>
              <th>Doktor</th>
              <th>Saat</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="data-table-empty">
                  Aramanızla eşleşen randevu yok.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${row.patient}-${row.time}`}>
                  <td>{row.patient}</td>
                  <td>{row.doctor}</td>
                  <td>{row.time}</td>
                  <td>
                    <span className="pill" style={{ backgroundColor: row.statusBg }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DoctorList() {
  return (
    <section className="card list-card">
      <ul className="doctor-list">
        {doctorRows.map((row) => (
          <li key={row.name} className="doctor-row">
            <span className="doctor-avatar" aria-hidden />
            <span className="doctor-name">{row.name}</span>
            <span className="pill pill--right" style={{ backgroundColor: row.badgeBg }}>
              {row.badge}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type DashboardProps = {
  search: string;
  onNavigate: (id: SidebarNavId) => void;
};

export function DashboardView({ search, onNavigate }: DashboardProps) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [...upcomingAppointments];
    return upcomingAppointments.filter(
      (r) =>
        r.patient.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.time.includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      <div className="summary-grid">
        {summaryCards.map((c, idx) => (
          <button
            key={c.title}
            type="button"
            className="stat-card stat-card--btn"
            style={{ background: c.bg }}
            onClick={() => {
              if (idx === 0 || idx === 1 || idx === 3) onNavigate("randevular");
              else onNavigate("takvim");
            }}
          >
            <p className="stat-title">{c.title}</p>
            <p className="stat-value">{c.value}</p>
            <p className="stat-sub">{c.sub}</p>
          </button>
        ))}
      </div>

      <div className="mid-grid">
        <BarChartBlock />
        <UpcomingTable rows={filtered} />
      </div>

      <div className="bottom-grid">
        <DoctorList />
        <div className="bottom-placeholder" aria-hidden />
      </div>
    </>
  );
}

/* ——— Randevular ——— */

export type MutableAppointment = {
  id: string;
  date: string;
  patient: string;
  doctor: string;
  time: string;
  status: string;
  statusBg: string;
};

function toMutable(a: AppointmentRecord): MutableAppointment {
  return { ...a };
}

const STATUS_OPTIONS = [
  { label: "Bekliyor", value: "Bekliyor", bg: "#EAB308" },
  { label: "Onaylandı", value: "Onaylandı", bg: "#22C55E" },
  { label: "İptal Edildi", value: "İptal Edildi", bg: "#EF4444" },
] as const;

function defaultDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type NewAppointmentForm = {
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: (typeof STATUS_OPTIONS)[number]["value"];
};

type RandevularProps = {
  appointments: MutableAppointment[];
  setAppointments: Dispatch<SetStateAction<MutableAppointment[]>>;
};

export function RandevularView({ appointments: rows, setAppointments: setRows }: RandevularProps) {
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formId = useId();
  const titleId = useId();

  const [form, setForm] = useState<NewAppointmentForm>(() => ({
    patient: "",
    doctor: doctors[0].name,
    date: defaultDate(),
    time: "09:00",
    status: "Bekliyor",
  }));

  const resetForm = useCallback(() => {
    setForm({
      patient: "",
      doctor: doctors[0].name,
      date: defaultDate(),
      time: "09:00",
      status: "Bekliyor",
    });
    setFormError(null);
  }, []);

  const openModal = useCallback(() => {
    resetForm();
    setModalOpen(true);
  }, [resetForm]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setFormError(null);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    setFormError(null);
  }, [form.patient, form.date, form.time, form.doctor, form.status, modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen, closeModal]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.patient.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.date.includes(q) ||
        r.time.includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [rows, filter]);

  const remove = useCallback((id: string) => {
    if (window.confirm("Bu randevuyu iptal etmek istiyor musunuz?")) {
      setRows((r) => r.filter((x) => x.id !== id));
    }
  }, [setRows]);

  const edit = useCallback((r: MutableAppointment) => {
    const t = window.prompt("Saat (HH:MM)", r.time);
    if (t == null || !/^\d{2}:\d{2}$/.test(t)) return;
    setRows((rows) => rows.map((x) => (x.id === r.id ? { ...x, time: t } : x)));
  }, [setRows]);

  const submitNew = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const patient = form.patient.trim();
      if (!patient) {
        setFormError("Hasta adı zorunludur.");
        return;
      }
      if (!form.date) {
        setFormError("Tarih seçin.");
        return;
      }
      let timeStr = form.time;
      if (timeStr.length >= 8) timeStr = timeStr.slice(0, 5);
      if (!/^\d{2}:\d{2}$/.test(timeStr)) {
        setFormError("Geçerli bir saat seçin.");
        return;
      }
      const opt = STATUS_OPTIONS.find((o) => o.value === form.status);
      const statusBg = opt?.bg ?? "#EAB308";
      const id = `n-${Date.now()}`;
      setRows((r) => [
        ...r,
        {
          id,
          date: form.date,
          patient,
          doctor: form.doctor,
          time: timeStr,
          status: form.status,
          statusBg,
        },
      ]);
      closeModal();
    },
    [form, closeModal, setRows]
  );

  return (
    <div className="page-view">
      {modalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id={titleId} className="modal-title">
                Yeni randevu
              </h2>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="Kapat">
                ×
              </button>
            </div>
            <form id={formId} className="modal-form" onSubmit={submitNew}>
              <label className="modal-field">
                <span>Hasta</span>
                <input
                  type="text"
                  className="modal-input"
                  value={form.patient}
                  onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))}
                  placeholder="Ad soyad"
                  list={`${formId}-patients`}
                  autoComplete="off"
                  autoFocus
                />
                <datalist id={`${formId}-patients`}>
                  {patients.map((p) => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
              </label>
              <label className="modal-field">
                <span>Doktor</span>
                <select
                  className="modal-input"
                  value={form.doctor}
                  onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} — {d.branch}
                    </option>
                  ))}
                </select>
              </label>
              <div className="modal-row">
                <label className="modal-field">
                  <span>Tarih</span>
                  <input
                    type="date"
                    className="modal-input"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    min="2020-01-01"
                    max="2035-12-31"
                    required
                  />
                </label>
                <label className="modal-field">
                  <span>Saat</span>
                  <input
                    type="time"
                    className="modal-input"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    required
                  />
                </label>
              </div>
              <label className="modal-field">
                <span>Durum</span>
                <select
                  className="modal-input"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as NewAppointmentForm["status"],
                    }))
                  }
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              {formError && <p className="modal-error">{formError}</p>}
              <div className="modal-actions">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn--primary">
                  Randevuyu kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-toolbar">
        <input
          type="search"
          className="page-input"
          placeholder="Hasta, doktor, tarih ara..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Randevu ara"
        />
        <button type="button" className="btn btn--primary" onClick={openModal}>
          + Yeni randevu
        </button>
      </div>
      <section className="card table-card table-card--wide">
        <h2 className="card-title">Tüm randevular</h2>
        <div className="table-wrap">
          <table className="data-table data-table--dense">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Hasta</th>
                <th>Doktor</th>
                <th>Durum</th>
                <th className="th-actions">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.time}</td>
                  <td>{row.patient}</td>
                  <td>{row.doctor}</td>
                  <td>
                    <span className="pill" style={{ backgroundColor: row.statusBg }}>
                      {row.status}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button type="button" className="btn btn--ghost" onClick={() => edit(row)}>
                      Düzenle
                    </button>
                    <button type="button" className="btn btn--danger" onClick={() => remove(row.id)}>
                      İptal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ——— Takvim ——— */

const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;
const WEEKDAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] as const;

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function formatYMD(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

type TakvimProps = {
  appointments: MutableAppointment[];
};

export function TakvimView({ appointments }: TakvimProps) {
  /** Demo verisi Nisan 2026 — appointments tarihleriyle uyumlu */
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const m = new Map<string, MutableAppointment[]>();
    for (const a of appointments) {
      const list = m.get(a.date) ?? [];
      list.push(a);
      m.set(a.date, list);
    }
    return m;
  }, [appointments]);

  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const startPad = (first.getDay() + 6) % 7;
    const cells: { key: string; day: number | null; ymd: string | null }[] = [];
    for (let i = 0; i < startPad; i++) {
      cells.push({ key: `p-${i}`, day: null, ymd: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = formatYMD(year, month, d);
      cells.push({ key: ymd, day: d, ymd });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ key: `e-${cells.length}`, day: null, ymd: null });
    }
    return cells;
  }, [year, month]);

  const selectedList = selected ? byDate.get(selected) ?? [] : [];

  const prevMonth = () => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const nextMonth = () => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  return (
    <div className="page-view">
      <div className="calendar-head">
        <button type="button" className="btn btn--ghost" onClick={prevMonth} aria-label="Önceki ay">
          ‹
        </button>
        <h2 className="calendar-title">
          {MONTHS_TR[month]} {year}
        </h2>
        <button type="button" className="btn btn--ghost" onClick={nextMonth} aria-label="Sonraki ay">
          ›
        </button>
      </div>

      <div className="calendar card">
        <div className="calendar-weekdays">
          {WEEKDAYS_TR.map((w) => (
            <div key={w} className="calendar-wd">
              {w}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {grid.map((cell) => {
            if (cell.day == null || cell.ymd == null) {
              return <div key={cell.key} className="calendar-cell calendar-cell--empty" />;
            }
            const count = byDate.get(cell.ymd)?.length ?? 0;
            const active = selected === cell.ymd;
            return (
              <button
                key={cell.key}
                type="button"
                className={`calendar-cell ${active ? "calendar-cell--selected" : ""} ${count ? "calendar-cell--has" : ""}`}
                onClick={() => setSelected(cell.ymd)}
              >
                <span className="calendar-daynum">{cell.day}</span>
                {count > 0 && <span className="calendar-dot">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <section className="card table-card">
          <h2 className="card-title">{selected} randevuları</h2>
          {selectedList.length === 0 ? (
            <p className="muted">Bu gün için kayıtlı randevu yok.</p>
          ) : (
            <ul className="calendar-day-list">
              {selectedList.map((r) => (
                <li key={r.id}>
                  <strong>{r.time}</strong> — {r.patient} · {r.doctor}{" "}
                  <span className="pill" style={{ backgroundColor: r.statusBg }}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

/* ——— Hastalar ——— */

export function HastalarView() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [...patients];
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.phone.includes(s) ||
        p.id.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="page-view">
      <div className="page-toolbar">
        <input
          type="search"
          className="page-input"
          placeholder="Hasta adı veya telefon ara..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Hasta ara"
        />
      </div>
      <section className="card table-card">
        <h2 className="card-title">Hasta kayıtları</h2>
        <div className="table-wrap">
          <table className="data-table data-table--dense">
            <thead>
              <tr>
                <th>Kimlik</th>
                <th>Ad Soyad</th>
                <th>Telefon</th>
                <th>Doğum</th>
                <th>Son ziyaret</th>
                <th className="th-actions">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.birth}</td>
                  <td>{p.lastVisit}</td>
                  <td className="td-actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => window.alert(`${p.name} dosyası (demo)`)}
                    >
                      Dosya
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ——— Doktorlar ——— */

export function DoktorlarView() {
  return (
    <div className="page-view">
      <section className="card table-card">
        <h2 className="card-title">Doktorlar</h2>
        <div className="table-wrap">
          <table className="data-table data-table--dense">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Branş</th>
                <th>Dahili</th>
                <th>Bugün slot</th>
                <th className="th-actions">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.branch}</td>
                  <td>{d.phone}</td>
                  <td>{d.slots}</td>
                  <td className="td-actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => window.alert(`${d.name} — ${d.branch} (demo)`)}
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ——— Kullanıcılar ——— */

export function KullanicilarView() {
  return (
    <div className="page-view">
      <section className="card table-card">
        <h2 className="card-title">Sistem kullanıcıları</h2>
        <div className="table-wrap">
          <table className="data-table data-table--dense">
            <thead>
              <tr>
                <th>Ad</th>
                <th>E-posta</th>
                <th>Rol</th>
                <th>Durum</th>
                <th className="th-actions">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`pill ${u.active ? "" : "pill--muted"}`}>
                      {u.active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => window.alert(`${u.email} şifre sıfırlama (demo)`)}
                    >
                      Şifre sıfırla
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ——— Ayarlar ——— */

export function AyarlarView() {
  const [mail, setMail] = useState(true);
  const [sms, setSms] = useState(false);
  const [lang, setLang] = useState("tr");

  return (
    <div className="page-view page-view--settings">
      <section className="card settings-card">
        <h2 className="card-title">Bildirimler</h2>
        <label className="settings-row">
          <input type="checkbox" checked={mail} onChange={(e) => setMail(e.target.checked)} />
          <span>E-posta ile randevu hatırlatması</span>
        </label>
        <label className="settings-row">
          <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} />
          <span>SMS ile hatırlatma</span>
        </label>
      </section>
      <section className="card settings-card">
        <h2 className="card-title">Genel</h2>
        <label className="settings-field">
          <span className="settings-label">Dil</span>
          <select className="page-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </label>
        <button
          type="button"
          className="btn btn--primary settings-save"
          onClick={() =>
            window.alert(
              `Kaydedildi (demo): e-posta=${mail}, sms=${sms}, dil=${lang}`
            )
          }
        >
          Kaydet
        </button>
      </section>
    </div>
  );
}
