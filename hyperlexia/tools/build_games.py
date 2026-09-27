#!/usr/bin/env python3
"""Bundle src/ into one self-contained HTML file: hyperlexia/Lexiverse.html"""
import os, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
read = lambda p: open(p, encoding='utf-8').read()
css = '\n'.join(read(p) for p in sorted(glob.glob(os.path.join(SRC, 'css', '*.css'))))
js_files = ([os.path.join(SRC, 'js', 'data', 'words.js')]
            + sorted(p for p in glob.glob(os.path.join(SRC, 'js', 'data', '*.js')) if not p.endswith('words.js'))
            + [os.path.join(SRC, 'js', 'core', f) for f in ('core.js', 'fx.js', 'lex.js', 'app.js')]
            + sorted(glob.glob(os.path.join(SRC, 'js', 'games', '*.js'))))
js = '\n'.join(f'/* ---- {os.path.relpath(p, SRC)} ---- */\n' + read(p) for p in js_files)
js += "\nwindow.addEventListener('DOMContentLoaded', () => App.start());\n"
html = read(os.path.join(SRC, 'shell.html')).replace('/*__CSS__*/', css).replace('/*__JS__*/', js.replace('</script', '<\\/script'))
out = os.path.join(ROOT, 'Lexiverse.html')
open(out, 'w', encoding='utf-8').write(html)
print(f'wrote {out} ({os.path.getsize(out)/1024:.0f} KB, {len(js_files)} js files)')
