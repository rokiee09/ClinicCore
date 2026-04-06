import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { allAppointments, sidebarItems, type SidebarNavId } from "./dashboardData";
import {
  AyarlarView,
  DashboardView,
  DoktorlarView,
  HastalarView,
  KullanicilarView,
  type MutableAppointment,
  RandevularView,
  TakvimView,
} from "./panelViews";

function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;
    const handle = (e: MouseEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside, active]);
}

function SidebarIcon({ id, active }: { id: SidebarNavId; active: boolean }) {
  const stroke = active ? "#1d4ed8" : "#94a3b8";
  const sw = 1.5;
  return (
    <span className="sidebar-icon" aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}>
        {id === "dashboard" && (
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
        )}
        {id === "randevular" && (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </>
        )}
        {id === "takvim" && (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4" />
          </>
        )}
        {id === "hastalar" && (
          <>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        )}
        {id === "doktorlar" && (
          <>
            <path d="M12 4v16M4 12h16" />
            <circle cx="12" cy="12" r="9" />
          </>
        )}
        {id === "kullanicilar" && (
          <>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </>
        )}
        {id === "ayarlar" && (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </>
        )}
      </svg>
    </span>
  );
}

function Logo() {
  return (
    <div className="header-logo" aria-hidden>
      <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
        <circle cx="12" cy="14" r="6" stroke="white" strokeWidth="1.2" />
        <circle cx="22" cy="14" r="7" stroke="white" strokeWidth="1.2" />
        <circle cx="32" cy="14" r="6" stroke="white" strokeWidth="1.2" />
        <path
          d="M8 20 Q20 26 34 20"
          stroke="white"
          strokeWidth="1.2"
          fill="none"
        />
        <rect x="18" y="8" width="4" height="10" fill="#2563EB" stroke="white" strokeWidth="0.5" />
        <rect x="14" y="12" width="12" height="4" fill="#2563EB" stroke="white" strokeWidth="0.5" />
      </svg>
      <span className="header-title">Randevu Yönetim Paneli</span>
    </div>
  );
}

function Sidebar({
  activeId,
  onNavigate,
}: {
  activeId: SidebarNavId;
  onNavigate: (id: SidebarNavId) => void;
}) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Ana menü">
        {sidebarItems.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${active ? "sidebar-item--active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <SidebarIcon id={item.id} active={active} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

const NOTIFICATIONS = [
  "Yeni randevu talebi: Ahmet Y.",
  "Dr. Demir — randevu iptal bildirimi",
  "Sistem: yedekleme tamamlandı",
] as const;

function MainContent({
  activeNav,
  search,
  onNavigate,
  appointments,
  setAppointments,
}: {
  activeNav: SidebarNavId;
  search: string;
  onNavigate: (id: SidebarNavId) => void;
  appointments: MutableAppointment[];
  setAppointments: Dispatch<SetStateAction<MutableAppointment[]>>;
}) {
  switch (activeNav) {
    case "dashboard":
      return <DashboardView search={search} onNavigate={onNavigate} />;
    case "randevular":
      return (
        <RandevularView appointments={appointments} setAppointments={setAppointments} />
      );
    case "takvim":
      return <TakvimView appointments={appointments} />;
    case "hastalar":
      return <HastalarView />;
    case "doktorlar":
      return <DoktorlarView />;
    case "kullanicilar":
      return <KullanicilarView />;
    case "ayarlar":
      return <AyarlarView />;
    default:
      return null;
  }
}

export function App() {
  const [activeNav, setActiveNav] = useState<SidebarNavId>("dashboard");
  const [appointments, setAppointments] = useState<MutableAppointment[]>(() =>
    allAppointments.map((a) => ({ ...a }))
  );
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeUser = useCallback(() => setUserOpen(false), []);

  useClickOutside(notifRef, closeNotif, notifOpen);
  useClickOutside(userRef, closeUser, userOpen);

  const sectionLabel =
    sidebarItems.find((i) => i.id === activeNav)?.label ?? "Dashboard";

  const searchPlaceholder =
    activeNav === "dashboard"
      ? "Ara..."
      : "Genel arama (dashboard’da tablo süzülür)";

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <Logo />
          <div className="search">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" />
            </svg>
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Ara"
              autoComplete="off"
              disabled={activeNav !== "dashboard"}
            />
          </div>
          <div className="topbar-actions">
            <div className="popover-wrap" ref={notifRef}>
              <button
                type="button"
                className="icon-btn"
                aria-label="Bildirimler"
                aria-expanded={notifOpen}
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setUserOpen(false);
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
                  <path d="M9 17a3 3 0 006 0" />
                </svg>
              </button>
              {notifOpen && (
                <div className="dropdown dropdown--notif" role="menu">
                  <p className="dropdown-title">Bildirimler</p>
                  <ul className="dropdown-list">
                    {NOTIFICATIONS.map((t) => (
                      <li key={t}>
                        <button type="button" className="dropdown-item" role="menuitem" onClick={closeNotif}>
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="popover-wrap" ref={userRef}>
              <button
                type="button"
                className="user-menu-btn"
                aria-expanded={userOpen}
                aria-haspopup="true"
                onClick={() => {
                  setUserOpen((v) => !v);
                  setNotifOpen(false);
                }}
              >
                <div className="avatar-wrap">
                  <div className="avatar" />
                  <span className="avatar-badge">3</span>
                </div>
                <span className="user-name">Admin</span>
                <svg
                  className={`chevron ${userOpen ? "chevron--open" : ""}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {userOpen && (
                <div className="dropdown dropdown--user" role="menu">
                  <button
                    type="button"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => {
                      closeUser();
                      setActiveNav("ayarlar");
                    }}
                  >
                    Hesap ayarları
                  </button>
                  <button
                    type="button"
                    className="dropdown-item dropdown-item--danger"
                    role="menuitem"
                    onClick={() => {
                      closeUser();
                      window.alert("Çıkış (demo)");
                    }}
                  >
                    Çıkış
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="shell">
        <Sidebar activeId={activeNav} onNavigate={setActiveNav} />
        <main className="main">
          <div className="main-section-bar">
            <h1 className="main-section-title">{sectionLabel}</h1>
            <p className="main-section-hint">
              {activeNav === "dashboard" && "Özet ve yaklaşan randevular."}
              {activeNav === "randevular" && "Tüm randevuları yönetin: yeni ekleyin, düzenleyin veya iptal edin."}
              {activeNav === "takvim" && "Ay görünümünde günlere tıklayarak o günkü randevuları görün."}
              {activeNav === "hastalar" && "Hasta listesi ve kayıt bilgileri."}
              {activeNav === "doktorlar" && "Branş ve iletişim bilgileri."}
              {activeNav === "kullanicilar" && "Panel kullanıcıları ve roller."}
              {activeNav === "ayarlar" && "Bildirim ve genel tercihler."}
            </p>
          </div>

          <MainContent
            activeNav={activeNav}
            search={search}
            onNavigate={setActiveNav}
            appointments={appointments}
            setAppointments={setAppointments}
          />
        </main>
      </div>
    </div>
  );
}
