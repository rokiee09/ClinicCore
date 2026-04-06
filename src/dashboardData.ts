/**
 * PDF ile aynı içerik (generate_hastane_dashboard_pdf.py ile uyumlu).
 */
export const summaryCards = [
  {
    title: "Bugünkü Randevular",
    value: "24",
    sub: "Toplam",
    bg: "#3B82F6",
  },
  {
    title: "Bekleyen Randevular",
    value: "5",
    sub: "Onay Bekliyor",
    bg: "#EAB308",
  },
  {
    title: "Muayene Edilen",
    value: "15",
    sub: "Tamamlandı",
    bg: "#22C55E",
  },
  {
    title: "İptal Edilen",
    value: "3",
    sub: "Reddedildi",
    bg: "#EF4444",
  },
] as const;

export const barChart = {
  title: "Yoğun Doktorlar",
  heights: [0.42, 0.68, 0.52, 0.88, 0.58, 0.95, 0.48, 0.72, 0.62] as const,
  colors: [
    "#60A5FA",
    "#3B82F6",
    "#2563EB",
    "#1D4ED8",
    "#93C5FD",
    "#38BDF8",
    "#7DD3FC",
    "#0EA5E9",
    "#1E40AF",
  ] as const,
};

export const upcomingAppointments = [
  {
    patient: "Zeynep Kaya",
    doctor: "Dr. Ali Yılmaz",
    time: "10:00",
    status: "Bekliyor",
    statusBg: "#EAB308",
  },
  {
    patient: "Ahmet Demir",
    doctor: "Dr. Ayşe Demir",
    time: "10:30",
    status: "Onaylandı",
    statusBg: "#22C55E",
  },
  {
    patient: "Selin Korkmaz",
    doctor: "Dr. Hasan Kurt",
    time: "11:00",
    status: "Onaylandı",
    statusBg: "#22C55E",
  },
  {
    patient: "Mehmet Öztürk",
    doctor: "Dr. Elif Arslan",
    time: "11:30",
    status: "İptal Edildi",
    statusBg: "#EF4444",
  },
] as const;

export const doctorRows = [
  { name: "Dr. Ali Yılmaz", badge: "12 Randevu", badgeBg: "#3B82F6" },
  { name: "Dr. Ayşe Demir", badge: "9 Randevu", badgeBg: "#EAB308" },
  { name: "Dr. Hasan Kurt", badge: "Onaylandı", badgeBg: "#22C55E" },
  { name: "Mehmet Öztürk", badge: "İptal Edildi", badgeBg: "#EF4444" },
] as const;

export const sidebarItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "randevular", label: "Randevular" },
  { id: "takvim", label: "Takvim" },
  { id: "hastalar", label: "Hastalar" },
  { id: "doktorlar", label: "Doktorlar" },
  { id: "kullanicilar", label: "Kullanıcılar" },
  { id: "ayarlar", label: "Ayarlar" },
] as const;

export type SidebarNavId = (typeof sidebarItems)[number]["id"];

/** Takvim / randevu listesi (demo tarihler — ay 2026-04) */
export const allAppointments = [
  {
    id: "a1",
    date: "2026-04-06",
    patient: "Zeynep Kaya",
    doctor: "Dr. Ali Yılmaz",
    time: "10:00",
    status: "Bekliyor",
    statusBg: "#EAB308",
  },
  {
    id: "a2",
    date: "2026-04-06",
    patient: "Ahmet Demir",
    doctor: "Dr. Ayşe Demir",
    time: "10:30",
    status: "Onaylandı",
    statusBg: "#22C55E",
  },
  {
    id: "a3",
    date: "2026-04-08",
    patient: "Selin Korkmaz",
    doctor: "Dr. Hasan Kurt",
    time: "11:00",
    status: "Onaylandı",
    statusBg: "#22C55E",
  },
  {
    id: "a4",
    date: "2026-04-09",
    patient: "Mehmet Öztürk",
    doctor: "Dr. Elif Arslan",
    time: "11:30",
    status: "İptal Edildi",
    statusBg: "#EF4444",
  },
  {
    id: "a5",
    date: "2026-04-12",
    patient: "Can Yıldız",
    doctor: "Dr. Ali Yılmaz",
    time: "09:00",
    status: "Bekliyor",
    statusBg: "#EAB308",
  },
  {
    id: "a6",
    date: "2026-04-15",
    patient: "Ayşe Kılıç",
    doctor: "Dr. Ayşe Demir",
    time: "14:00",
    status: "Onaylandı",
    statusBg: "#22C55E",
  },
] as const;

export type AppointmentRecord = (typeof allAppointments)[number];

export const patients = [
  { id: "p1", name: "Zeynep Kaya", phone: "+90 532 111 2233", birth: "1990-03-12", lastVisit: "2026-04-06" },
  { id: "p2", name: "Ahmet Demir", phone: "+90 533 444 5566", birth: "1985-07-22", lastVisit: "2026-04-06" },
  { id: "p3", name: "Selin Korkmaz", phone: "+90 534 777 8899", birth: "1992-11-05", lastVisit: "2026-04-08" },
  { id: "p4", name: "Mehmet Öztürk", phone: "+90 535 000 1122", birth: "1978-01-30", lastVisit: "2026-03-20" },
] as const;

export const doctors = [
  { id: "d1", name: "Dr. Ali Yılmaz", branch: "Kardiyoloji", phone: "Dahili 101", slots: "12" },
  { id: "d2", name: "Dr. Ayşe Demir", branch: "Dahiliye", phone: "Dahili 102", slots: "9" },
  { id: "d3", name: "Dr. Hasan Kurt", branch: "Ortopedi", phone: "Dahili 103", slots: "7" },
  { id: "d4", name: "Dr. Elif Arslan", branch: "Göz", phone: "Dahili 104", slots: "5" },
] as const;

export const users = [
  { id: "u1", name: "Admin", email: "admin@klinik.local", role: "Yönetici", active: true },
  { id: "u2", name: "Sekreter Ayşe", email: "sekreter@klinik.local", role: "Sekreter", active: true },
  { id: "u3", name: "Dr. Ali Yılmaz", email: "ali@klinik.local", role: "Doktor", active: true },
  { id: "u4", name: "Eski Kullanıcı", email: "pasif@klinik.local", role: "Sekreter", active: false },
] as const;
