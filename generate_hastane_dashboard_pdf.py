# -*- coding: utf-8 -*-
"""
Randevu Yönetim Paneli — dashboard görünümünde PDF üretir.
Çıktı: Desktop\hastane Yönetim Paneli.pdf

İçerik metrikleri web paneli ile aynı tutulmalıdır: src/dashboardData.ts
"""
from __future__ import annotations

import os
import sys

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


def _register_fonts() -> tuple[str, str]:
    """Windows Arial; yoksa Helvetica (Türkçe eksik olabilir)."""
    windir = os.environ.get("WINDIR", r"C:\Windows")
    arial = os.path.join(windir, "Fonts", "arial.ttf")
    arial_bold = os.path.join(windir, "Fonts", "arialbd.ttf")
    if os.path.isfile(arial) and os.path.isfile(arial_bold):
        pdfmetrics.registerFont(TTFont("UI", arial))
        pdfmetrics.registerFont(TTFont("UIBold", arial_bold))
        return "UI", "UIBold"
    return "Helvetica", "Helvetica-Bold"


def _rounded_rect(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    r: float,
    fill: object,
    stroke: object = None,
) -> None:
    c.setFillColor(fill)
    if stroke is None:
        c.setStrokeColor(fill)
    else:
        c.setStrokeColor(stroke)
    c.roundRect(x, y, w, h, r, stroke=1 if stroke else 0, fill=1)


def _pill(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    bg: colors.Color,
    text: str,
    font: str,
    font_bold: str,
    size: float = 7,
    text_color: colors.Color = colors.white,
) -> None:
    _rounded_rect(c, x, y, w, h, h / 2, bg)
    c.setFillColor(text_color)
    fn = font_bold if font_bold else font
    c.setFont(fn, size)
    tw = pdfmetrics.stringWidth(text, fn, size)
    c.drawString(x + (w - tw) / 2, y + (h - size) / 2 + 1, text)


def _shadow_card(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    r: float,
    fill: colors.Color,
) -> None:
    c.setFillColor(colors.HexColor("#00000020"))
    c.roundRect(x - 1, y - 2, w + 2, h + 2, r + 1, stroke=0, fill=1)
    _rounded_rect(c, x, y, w, h, r, fill, stroke=colors.HexColor("#00000008"))


def draw_header(c: canvas.Canvas, W: float, H: float, font: str, font_bold: str) -> float:
    """Üst bar; yükseklik döner (pt)."""
    h_bar = 52
    y0 = H - h_bar
    # gradient benzeri: iki ton mavi
    c.setFillColor(colors.HexColor("#1D4ED8"))
    c.rect(0, y0, W, h_bar, stroke=0, fill=1)
    c.setFillColor(colors.HexColor("#2563EB"))
    c.rect(0, y0 + h_bar * 0.45, W, h_bar * 0.55, stroke=0, fill=1)

    # logo: bulut + artı
    lx, ly = 18, y0 + 14
    c.setFillColor(colors.white)
    c.setStrokeColor(colors.white)
    c.setLineWidth(1.2)
    # basit bulut (üst yaylar)
    c.circle(lx + 8, ly + 10, 6, stroke=1, fill=0)
    c.circle(lx + 18, ly + 10, 7, stroke=1, fill=0)
    c.circle(lx + 28, ly + 10, 6, stroke=1, fill=0)
    c.arc(lx + 4, ly + 2, lx + 32, ly + 14, 180, 180)
    c.line(lx + 4, ly + 8, lx + 32, ly + 8)
    c.setFillColor(colors.HexColor("#2563EB"))
    c.setStrokeColor(colors.white)
    c.line(lx + 16, ly + 4, lx + 16, ly + 12)
    c.line(lx + 12, ly + 8, lx + 20, ly + 8)

    c.setFillColor(colors.white)
    c.setFont(font_bold, 13)
    c.drawString(52, y0 + 18, "Randevu Yönetim Paneli")

    # arama kutusu
    sw, sh = 320, 28
    sx = (W - sw) / 2
    _rounded_rect(c, sx, y0 + 12, sw, sh, 6, colors.white)
    c.setFillColor(colors.HexColor("#94A3B8"))
    c.setFont(font, 10)
    c.drawString(sx + 32, y0 + 19, "Ara...")
    # büyüteç
    c.setStrokeColor(colors.HexColor("#64748B"))
    c.setLineWidth(1)
    c.circle(sx + 12, y0 + 25, 4, stroke=1, fill=0)
    c.line(sx + 15, y0 + 21, sx + 18, y0 + 18)

    # sağ: zil, avatar, admin
    rx = W - 160
    c.setStrokeColor(colors.white)
    c.setLineWidth(1.5)
    # zil
    bx, by = rx, y0 + 22
    c.arc(bx - 6, by - 4, bx + 6, by + 8, 200, 140)
    c.line(bx - 7, by - 2, bx - 9, by + 2)
    c.line(bx + 7, by - 2, bx + 9, by + 2)
    # avatar
    ax = rx + 36
    c.setFillColor(colors.HexColor("#CBD5E1"))
    c.circle(ax, y0 + 26, 12, stroke=0, fill=1)
    c.setFillColor(colors.HexColor("#64748B"))
    c.circle(ax, y0 + 28, 5, stroke=0, fill=1)
    # badge 3
    c.setFillColor(colors.HexColor("#EF4444"))
    c.circle(ax + 9, y0 + 34, 6, stroke=0, fill=1)
    c.setFillColor(colors.white)
    c.setFont(font_bold, 7)
    c.drawString(ax + 6.5, y0 + 31, "3")

    c.setFillColor(colors.white)
    c.setFont(font_bold, 10)
    c.drawString(ax + 22, y0 + 22, "Admin")
    c.line(ax + 68, y0 + 20, ax + 72, y0 + 16)
    c.line(ax + 68, y0 + 16, ax + 72, y0 + 20)

    return h_bar


def draw_sidebar(
    c: canvas.Canvas,
    H: float,
    top: float,
    sidebar_w: float,
    font: str,
    font_bold: str,
) -> None:
    y1 = H - top
    c.setFillColor(colors.HexColor("#E8F0FE"))
    c.rect(0, 0, sidebar_w, y1, stroke=0, fill=1)

    items = [
        ("Dashboard", True),
        ("Randevular", False),
        ("Takvim", False),
        ("Hastalar", False),
        ("Doktorlar", False),
        ("Kullanıcılar", False),
        ("Ayarlar", False),
    ]
    row_h = 36
    yy = y1 - 8
    for label, active in items:
        iy = yy - row_h
        if active:
            _rounded_rect(c, 10, iy + 4, sidebar_w - 20, row_h - 4, 8, colors.HexColor("#BFDBFE"))
            c.setFillColor(colors.HexColor("#1D4ED8"))
            c.setFont(font_bold, 10)
            c.drawString(44, iy + 14, label)
            # ev ikonu
            c.setStrokeColor(colors.HexColor("#1D4ED8"))
            c.setLineWidth(1.2)
            c.rect(22, iy + 16, 12, 10, stroke=1, fill=0)
            c.line(28, iy + 26, 28, iy + 30)
            c.line(22, iy + 26, 34, iy + 26)
        else:
            c.setFillColor(colors.HexColor("#475569"))
            c.setFont(font, 10)
            c.drawString(44, iy + 14, label)
            c.setStrokeColor(colors.HexColor("#94A3B8"))
            c.setLineWidth(1)
            c.rect(22, iy + 16, 12, 10, stroke=1, fill=0)
        yy = iy - 6


def draw_stat_cards(
    c: canvas.Canvas,
    x0: float,
    y_top: float,
    card_w: float,
    gap: float,
    font: str,
    font_bold: str,
) -> float:
    """Özet kartlar; alt kenar y'si."""
    h = 78
    r = 10
    specs = [
        (colors.HexColor("#3B82F6"), "Bugünkü Randevular", "24", "Toplam"),
        (colors.HexColor("#EAB308"), "Bekleyen Randevular", "5", "Onay Bekliyor"),
        (colors.HexColor("#22C55E"), "Muayene Edilen", "15", "Tamamlandı"),
        (colors.HexColor("#EF4444"), "İptal Edilen", "3", "Reddedildi"),
    ]
    y = y_top
    for i, (col, title, num, sub) in enumerate(specs):
        x = x0 + i * (card_w + gap)
        c.setFillColor(colors.HexColor("#00000020"))
        c.roundRect(x - 1, y - 2, card_w + 2, h + 2, r + 1, stroke=0, fill=1)
        c.setFillColor(col)
        c.roundRect(x, y, card_w, h, r, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont(font, 8.5)
        c.drawString(x + 12, y + h - 18, title)
        c.setFont(font_bold, 22)
        c.drawString(x + 12, y + h - 44, num)
        c.setFont(font, 8)
        c.drawString(x + 12, y + 10, sub)
    return y - 8


def draw_bar_chart(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    font: str,
    font_bold: str,
) -> None:
    _shadow_card(c, x, y, w, h, 10, colors.white)
    c.setFillColor(colors.HexColor("#0F172A"))
    c.setFont(font_bold, 11)
    c.drawString(x + 14, y + h - 22, "Yoğun Doktorlar")

    chart_x = x + 18
    chart_y = y + 18
    chart_w = w - 36
    chart_h = h - 52
    # grid
    c.setStrokeColor(colors.HexColor("#E2E8F0"))
    c.setLineWidth(0.5)
    c.setDash(2, 3)
    for g in range(5):
        gy = chart_y + chart_h * g / 4
        c.line(chart_x, gy, chart_x + chart_w, gy)
    c.setDash()

    heights = [0.42, 0.68, 0.52, 0.88, 0.58, 0.95, 0.48, 0.72, 0.62]
    blues = ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#93C5FD", "#38BDF8", "#7DD3FC", "#0EA5E9", "#1E40AF"]
    n = len(heights)
    bw = (chart_w - (n - 1) * 4) / n
    for i, hi in enumerate(heights):
        bh = chart_h * hi
        bx = chart_x + i * (bw + 4)
        c.setFillColor(colors.HexColor(blues[i % len(blues)]))
        c.roundRect(bx, chart_y, bw, bh, 2, stroke=0, fill=1)


def draw_table(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    font: str,
    font_bold: str,
) -> None:
    _shadow_card(c, x, y, w, h, 10, colors.white)
    c.setFillColor(colors.HexColor("#0F172A"))
    c.setFont(font_bold, 11)
    c.drawString(x + 14, y + h - 22, "Yaklaşan Randevular")

    headers = ["Hasta", "Doktor", "Saat", "Durum"]
    col_w = [w * 0.22, w * 0.32, w * 0.14, w * 0.22]
    hx = x + 14
    hy = y + h - 40
    c.setFillColor(colors.HexColor("#64748B"))
    c.setFont(font_bold, 8)
    cx = hx
    for i, head in enumerate(headers):
        c.drawString(cx, hy, head)
        cx += col_w[i]

    rows = [
        ("Zeynep Kaya", "Dr. Ali Yılmaz", "10:00", "Bekliyor", colors.HexColor("#EAB308")),
        ("Ahmet Demir", "Dr. Ayşe Demir", "10:30", "Onaylandı", colors.HexColor("#22C55E")),
        ("Selin Korkmaz", "Dr. Hasan Kurt", "11:00", "Onaylandı", colors.HexColor("#22C55E")),
        ("Mehmet Öztürk", "Dr. Elif Arslan", "11:30", "İptal Edildi", colors.HexColor("#EF4444")),
    ]
    ry = hy - 16
    c.setFont(font, 9)
    for patient, doctor, time, status, scol in rows:
        c.setFillColor(colors.HexColor("#0F172A"))
        cx = hx
        c.drawString(cx, ry, patient)
        cx += col_w[0]
        c.drawString(cx, ry, doctor)
        cx += col_w[1]
        c.drawString(cx, ry, time)
        cx += col_w[2]
        tw = pdfmetrics.stringWidth(status, font_bold, 7) + 12
        _pill(c, cx, ry - 2, tw, 14, scol, font, font_bold, 7)
        ry -= 18


def draw_doctor_list(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    font: str,
    font_bold: str,
) -> None:
    _shadow_card(c, x, y, w, h, 10, colors.white)
    rows = [
        ("Dr. Ali Yılmaz", "12 Randevu", colors.HexColor("#3B82F6")),
        ("Dr. Ayşe Demir", "9 Randevu", colors.HexColor("#EAB308")),
        ("Dr. Hasan Kurt", "Onaylandı", colors.HexColor("#22C55E")),
        ("Mehmet Öztürk", "İptal Edildi", colors.HexColor("#EF4444")),
    ]
    ry = y + h - 28
    for name, badge, bg in rows:
        c.setFillColor(colors.HexColor("#CBD5E1"))
        c.circle(x + 22, ry + 6, 10, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#64748B"))
        c.setFont(font_bold, 9)
        c.drawString(x + 40, ry + 4, name)
        tw = pdfmetrics.stringWidth(badge, font_bold, 7) + 14
        _pill(c, x + w - tw - 18, ry + 1, tw, 16, bg, font, font_bold, 7)
        ry -= 28


def build_pdf(path: str) -> None:
    font, font_bold = _register_fonts()
    W, H = landscape(A4)

    c = canvas.Canvas(path, pagesize=landscape(A4))
    c.setTitle("Randevu Yönetim Paneli")

    # arka plan ana alan
    c.setFillColor(colors.HexColor("#F1F5F9"))
    c.rect(0, 0, W, H, stroke=0, fill=1)

    header_h = draw_header(c, W, H, font, font_bold)
    sidebar_w = 132
    draw_sidebar(c, H, header_h, sidebar_w, font, font_bold)

    margin = 14
    content_left = sidebar_w + margin
    content_right = W - margin
    cw = content_right - content_left
    y_content_top = H - header_h - margin

    # 4 özet kartı
    gap = 10
    card_w = (cw - 3 * gap) / 4
    y_cards = y_content_top - 78
    draw_stat_cards(c, content_left, y_cards, card_w, gap, font, font_bold)

    # alt grid: sol grafik + sağ tablo; alt sol doktor listesi
    mid_y = y_cards - 14
    chart_w = cw * 0.52
    table_w = cw - chart_w - gap
    row1_h = 168
    chart_x = content_left
    table_x = content_left + chart_w + gap
    y_row1 = mid_y - row1_h

    draw_bar_chart(c, chart_x, y_row1, chart_w, row1_h, font, font_bold)
    draw_table(c, table_x, y_row1, table_w, row1_h, font, font_bold)

    # alt liste (grafik altı)
    list_h = mid_y - row1_h - margin - margin
    list_y = margin
    draw_doctor_list(c, chart_x, list_y, chart_w, list_h, font, font_bold)

    c.save()


def main() -> None:
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    out = os.path.join(desktop, "hastane Yönetim Paneli.pdf")
    try:
        build_pdf(out)
    except Exception as e:
        print("Hata:", e, file=sys.stderr)
        sys.exit(1)
    print(out)


if __name__ == "__main__":
    main()
