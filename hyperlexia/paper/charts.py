# Minimal SVG chart helpers for a print (light-mode) scientific paper.
# Palette: validated reference categorical order (blue, orange, aqua ...).
import math
from html import escape

FONT = "'Liberation Sans', Arial, Helvetica, sans-serif"
C = dict(blue='#2a78d6', orange='#eb6834', aqua='#1baf7a', yellow='#eda100',
         magenta='#e87ba4', green='#008300', violet='#4a3aa7', red='#e34948',
         ink='#0b0b0b', ink2='#52514e', muted='#8a8983', grid='#e6e5e1',
         axis='#b9b8b2', surface='#ffffff', neutral='#f0efec')
SEQ = ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#104281']  # ordinal blue 250..650


def svg(w, h, body, label=''):
    return (f'<svg class="chart" viewBox="0 0 {w} {h}" width="100%" role="img" '
            f'aria-label="{escape(label)}" xmlns="http://www.w3.org/2000/svg" '
            f'font-family="{FONT}">{body}</svg>')


def t(x, y, s, size=9, anchor='start', color=None, weight=400, italic=False, baseline='auto'):
    color = color or C['ink2']
    st = ' font-style="italic"' if italic else ''
    db = f' dominant-baseline="{baseline}"' if baseline != 'auto' else ''
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" '
            f'fill="{color}" font-weight="{weight}"{st}{db}>{s}</text>')


def hbar_path(x0, x1, y, h, r=4):
    """Horizontal bar anchored at x0 with a rounded data-end at x1."""
    if x1 - x0 < 0.5:
        return ''
    r = min(r, h / 2, (x1 - x0))
    return (f'M{x0:.1f},{y:.1f} H{x1 - r:.1f} A{r},{r} 0 0 1 {x1:.1f},{y + r:.1f} '
            f'V{y + h - r:.1f} A{r},{r} 0 0 1 {x1 - r:.1f},{y + h:.1f} H{x0:.1f} Z')


def vbar_path(x, w, y0, y1, r=4):
    """Vertical bar anchored at baseline y0 with rounded top at y1 (y1 < y0)."""
    if y0 - y1 < 0.5:
        return ''
    r = min(r, w / 2, (y0 - y1))
    return (f'M{x:.1f},{y0:.1f} V{y1 + r:.1f} A{r},{r} 0 0 1 {x + r:.1f},{y1:.1f} '
            f'H{x + w - r:.1f} A{r},{r} 0 0 1 {x + w:.1f},{y1 + r:.1f} V{y0:.1f} Z')


def legend(items, x, y, size=8.5):
    out, cx = [], x
    for name, color in items:
        out.append(f'<rect x="{cx:.1f}" y="{y - 7:.1f}" width="9" height="9" rx="2" fill="{color}"/>')
        out.append(t(cx + 12, y, escape(name), size, color=C['ink2']))
        cx += 12 + len(name) * size * 0.52 + 12
    return ''.join(out)


def hbar(rows, xmax, ticks, fmt=lambda v: f'{v:g}', w=340, label_w=128, bar_h=13,
         gap=9, color=None, unit='', title_x=None, top=8):
    """rows: (label, value, value_text or None)."""
    color = color or C['blue']
    x0, x1 = label_w, w - 34
    h = top + len(rows) * (bar_h + gap) + 22
    sx = lambda v: x0 + (x1 - x0) * v / xmax
    out = []
    for tk in ticks:
        out.append(f'<line x1="{sx(tk):.1f}" x2="{sx(tk):.1f}" y1="{top - 2}" y2="{h - 20}" stroke="{C["grid"]}" stroke-width="1"/>')
        out.append(t(sx(tk), h - 8, fmt(tk) + unit, 8, 'middle', C['muted']))
    for i, (lab, v, vt) in enumerate(rows):
        y = top + i * (bar_h + gap)
        out.append(t(x0 - 6, y + bar_h / 2 + 3, lab, 8.6, 'end', C['ink']))
        out.append(f'<path d="{hbar_path(x0, sx(v), y, bar_h)}" fill="{color}"/>')
        out.append(t(sx(v) + 4, y + bar_h / 2 + 3, vt if vt else fmt(v) + unit, 8.6, 'start', C['ink'], 700))
    out.append(f'<line x1="{x0}" x2="{x0}" y1="{top - 2}" y2="{h - 20}" stroke="{C["axis"]}" stroke-width="1"/>')
    return svg(w, h, ''.join(out))


def grouped_hbar(groups, series, xmax, ticks, fmt=lambda v: f'{v:g}', unit='', w=340,
                 label_w=92, bar_h=11, inner=2, gap=12):
    """groups: labels; series: [(name, color, [values])]."""
    x0, x1 = label_w, w - 34
    top = 22
    gh = len(series) * (bar_h + inner) - inner
    h = top + len(groups) * (gh + gap) + 18
    sx = lambda v: x0 + (x1 - x0) * v / xmax
    out = [legend([(s[0], s[1]) for s in series], x0, 10)]
    for tk in ticks:
        out.append(f'<line x1="{sx(tk):.1f}" x2="{sx(tk):.1f}" y1="{top - 3}" y2="{h - 18}" stroke="{C["grid"]}"/>')
        out.append(t(sx(tk), h - 6, fmt(tk) + unit, 8, 'middle', C['muted']))
    for gi, g in enumerate(groups):
        gy = top + gi * (gh + gap)
        out.append(t(x0 - 6, gy + gh / 2 + 3, g, 8.6, 'end', C['ink']))
        for si, (name, color, vals) in enumerate(series):
            y = gy + si * (bar_h + inner)
            v = vals[gi]
            out.append(f'<path d="{hbar_path(x0, sx(v), y, bar_h)}" fill="{color}"/>')
            out.append(t(sx(v) + 4, y + bar_h / 2 + 3, fmt(v) + unit, 8.2, 'start', C['ink'], 700))
    out.append(f'<line x1="{x0}" x2="{x0}" y1="{top - 3}" y2="{h - 18}" stroke="{C["axis"]}"/>')
    return svg(w, h, ''.join(out))


def forest(rows, xmin, xmax, ticks, ref=None, log=False, w=340, label_w=132, row_h=22,
           fmt=lambda v: f'{v:g}', left_note='', right_note='', est_w=62, color=None):
    """rows: (label, est, lo, hi, text). Square marker + CI line; text column at right."""
    color = color or C['blue']
    x0, x1 = label_w, w - est_w
    top = 8
    h = top + len(rows) * row_h + (34 if (left_note or right_note) else 22)
    f = (lambda v: math.log10(v)) if log else (lambda v: v)
    sx = lambda v: x0 + (x1 - x0) * (f(max(min(v, xmax), xmin)) - f(xmin)) / (f(xmax) - f(xmin))
    out = []
    axis_y = top + len(rows) * row_h + 2
    for tk in ticks:
        out.append(f'<line x1="{sx(tk):.1f}" x2="{sx(tk):.1f}" y1="{top - 2}" y2="{axis_y}" stroke="{C["grid"]}"/>')
        out.append(t(sx(tk), axis_y + 11, fmt(tk), 8, 'middle', C['muted']))
    if ref is not None:
        out.append(f'<line x1="{sx(ref):.1f}" x2="{sx(ref):.1f}" y1="{top - 2}" y2="{axis_y}" stroke="{C["ink2"]}" stroke-dasharray="3 2"/>')
    for i, (lab, est, lo, hi, txt) in enumerate(rows):
        cy = top + i * row_h + row_h / 2
        out.append(t(x0 - 6, cy + 3, lab, 8.4, 'end', C['ink']))
        out.append(f'<line x1="{sx(lo):.1f}" x2="{sx(hi):.1f}" y1="{cy:.1f}" y2="{cy:.1f}" stroke="{color}" stroke-width="2" stroke-linecap="round"/>')
        if hi > xmax:
            out.append(f'<path d="M{sx(xmax) - 5:.1f},{cy - 4:.1f} L{sx(xmax):.1f},{cy:.1f} L{sx(xmax) - 5:.1f},{cy + 4:.1f}" fill="none" stroke="{color}" stroke-width="1.6"/>')
        if lo < xmin:
            out.append(f'<path d="M{sx(xmin) + 5:.1f},{cy - 4:.1f} L{sx(xmin):.1f},{cy:.1f} L{sx(xmin) + 5:.1f},{cy + 4:.1f}" fill="none" stroke="{color}" stroke-width="1.6"/>')
        out.append(f'<rect x="{sx(est) - 4.5:.1f}" y="{cy - 4.5:.1f}" width="9" height="9" rx="1.5" fill="{color}" stroke="#fff" stroke-width="1.5"/>')
        out.append(t(w - 2, cy + 3, txt, 7.8, 'end', C['ink']))
    if left_note:
        out.append(t(sx(ref) - 4 if ref is not None else x0, axis_y + 24, '← ' + left_note, 7.8, 'end', C['ink2'], italic=True))
    if right_note:
        out.append(t(sx(ref) + 4 if ref is not None else x1, axis_y + 24, right_note + ' →', 7.8, 'start', C['ink2'], italic=True))
    return svg(w, h, ''.join(out))


def stacked100(rows, cats, colors, w=340, label_w=92, bar_h=16, gap=12):
    """rows: (label, [values summing ~100]). 2px surface gaps between segments."""
    x0, x1 = label_w, w - 8
    top = 34
    h = top + len(rows) * (bar_h + gap) + 16
    out = []
    # legend in two lines if needed
    lx, ly = x0, 10
    for name, col in zip(cats, colors):
        wd = 12 + len(name) * 4.4 + 12
        if lx + wd > w:
            lx, ly = x0, ly + 13
        out.append(f'<rect x="{lx:.1f}" y="{ly - 7:.1f}" width="9" height="9" rx="2" fill="{col}"/>')
        out.append(t(lx + 12, ly, escape(name), 8.2, color=C['ink2']))
        lx += wd
    for i, (lab, vals) in enumerate(rows):
        y = top + i * (bar_h + gap)
        tot = sum(vals)
        out.append(t(x0 - 6, y + bar_h / 2 + 3, lab, 8.6, 'end', C['ink']))
        cx = x0
        for j, v in enumerate(vals):
            wd = (x1 - x0) * v / tot
            if wd <= 0:
                continue
            out.append(f'<rect x="{cx:.1f}" y="{y}" width="{max(wd - 2, 0.5):.1f}" height="{bar_h}" rx="2" fill="{colors[j]}"/>')
            if wd > 18:
                tc = '#ffffff' if j >= 2 else C['ink']
                out.append(t(cx + (wd - 2) / 2, y + bar_h / 2 + 3, f'{v:g}%', 7.8, 'middle', tc, 700))
            cx += wd
    out.append(t(x1, h - 3, 'Share of group (%)', 7.6, 'end', C['muted']))
    return svg(w, h, ''.join(out))


def vbar(labels, values, w=340, h=150, ymax=None, ticks=(), color=None, note=''):
    color = color or C['blue']
    x0, x1, y0, y1 = 28, w - 6, h - 20, 12
    ymax = ymax or max(values)
    n = len(values)
    slot = (x1 - x0) / n
    bw = slot * 0.62
    sy = lambda v: y0 - (y0 - y1) * v / ymax
    out = []
    for tk in ticks:
        out.append(f'<line x1="{x0}" x2="{x1}" y1="{sy(tk):.1f}" y2="{sy(tk):.1f}" stroke="{C["grid"]}"/>')
        out.append(t(x0 - 4, sy(tk) + 3, f'{tk:g}', 8, 'end', C['muted']))
    for i, (lab, v) in enumerate(zip(labels, values)):
        x = x0 + i * slot + (slot - bw) / 2
        out.append(f'<path d="{vbar_path(x, bw, y0, sy(v))}" fill="{color}"/>')
        out.append(t(x + bw / 2, sy(v) - 3, f'{v:g}', 8.4, 'middle', C['ink'], 700))
        out.append(t(x + bw / 2, y0 + 12, lab, 8.2, 'middle', C['ink2']))
    out.append(f'<line x1="{x0}" x2="{x1}" y1="{y0}" y2="{y0}" stroke="{C["axis"]}"/>')
    if note:
        out.append(t(x0, 8, note, 7.8, 'start', C['muted']))
    return svg(w, h, ''.join(out))


def dotrange(rows, xmax=100, ticks=(0, 25, 50, 75, 100), w=340, label_w=150, row_h=24, top=8):
    """rows: (label, value or None, lo, hi, text, color). Range drawn as a bar, point as dot."""
    x0, x1 = label_w, w - 40
    h = top + len(rows) * row_h + 22
    sx = lambda v: x0 + (x1 - x0) * v / xmax
    out = []
    for tk in ticks:
        out.append(f'<line x1="{sx(tk):.1f}" x2="{sx(tk):.1f}" y1="{top - 2}" y2="{h - 20}" stroke="{C["grid"]}"/>')
        out.append(t(sx(tk), h - 8, f'{tk:g}%', 8, 'middle', C['muted']))
    for i, (lab, v, lo, hi, txt, col) in enumerate(rows):
        cy = top + i * row_h + row_h / 2
        col = col or C['blue']
        # label may contain a line break marker "|"
        parts = lab.split('|')
        for k, p in enumerate(parts):
            out.append(t(x0 - 6, cy + 3 + (k - (len(parts) - 1) / 2) * 9.5, p, 8.1, 'end', C['ink']))
        if lo is not None:
            out.append(f'<line x1="{sx(lo):.1f}" x2="{sx(hi):.1f}" y1="{cy:.1f}" y2="{cy:.1f}" stroke="{col}" stroke-width="7" stroke-linecap="round" opacity="0.35"/>')
        if v is not None:
            out.append(f'<circle cx="{sx(v):.1f}" cy="{cy:.1f}" r="4.5" fill="{col}" stroke="#fff" stroke-width="1.5"/>')
        xe = sx(max(x for x in (v, hi) if x is not None))
        out.append(t(xe + 8, cy + 3, txt, 8.2, 'start', C['ink'], 700))
    return svg(w, h, ''.join(out))
