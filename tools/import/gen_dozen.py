# Converts an old "Dozen" page's data (from extract-dozen.cjs) into a Language content file.
# Usage: gen_dozen.py <old.json> <out.ts> <config.json>
import json, re, sys, html
d = json.load(open(sys.argv[1])); cfg = json.load(open(sys.argv[3]))
ROLE = cfg['roles']; PTYPE = {'subject':'subject','verbphrase':'verb-phrase','object':'object','modifier':'modifier','question':'question'}
q = lambda s: json.dumps(s, ensure_ascii=False)
def md(text):
    """The old pages' small HTML subset as Markdown: <b> → **bold**, <a data-goto="N">x</a> → [x](sentence:N)."""
    t = re.sub(r'<b>(.*?)</b>', r'**\1**', text)
    t = re.sub(r'<a data-goto="(\d+)">(.*?)</a>', r'[\2](sentence:\1)', t)
    if re.search(r'<[a-z/]', t): raise SystemExit(f'unconverted HTML in: {t}')
    return html.unescape(t)
site = cfg['siteLabels']
out = ["import type { Language } from '../model';", "", f"// Moved over as-is from {cfg['source']}.",
       "// Intended changes only: site-wide colours, and Markdown instead of HTML.",
       f"export const {cfg['var']}: Language = {{", f"  id: {q(cfg['id'])},", f"  nativeName: {q(cfg['nativeName'])},",
       f"  name: {q(cfg['name'])},", f"  tag: {q(cfg['tag'])},"]
if cfg.get('tones'): out.append(f"  tones: {q(cfg['tones'])},")
out.append("  roles: {")
for key, job in d['JOBS'].items():
    rid = ROLE[key]; label = job['label']
    extra = '' if label == site.get(rid) else f"label: {q(label)}, "
    out.append(f"    {q(rid) if '-' in rid else rid}: {{ {extra}rule: {q(md(job['desc']))} }},")
out += ["  },", "  pronunciationSystems: [" + ", ".join(f"{{ id: {q(p['id'])}, label: {q(p['label'])} }}" for p in cfg['systems']) + "],",
        f"  defaultPronunciation: {q(cfg['systems'][0]['id'])},", "  sets: [", "    {", f"      id: {q(cfg['setId'])},", f"      name: {q(cfg['setName'])},", "      sentences: ["]
sys_id = cfg['systems'][0]['id']
for s in d['S']:
    out += ["        {", f"          id: '{s['num']}',", f"          translation: {q(s['en'])},", f"          explanation: {q(md(s['what']))},"]
    if s.get('pair'): out.append(f"          compareWith: '{s['pair']['with']}',")
    out.append("          parts: [")
    for w in s['words']:
        out.append(f"            {{ type: '{PTYPE[w['cat']]}', caption: {q(w['cap'])}, pieces: [")
        for m in w['m']:
            script, pron, gloss, job = m[:4]
            note = m[4] if len(m) > 4 and m[4] else None
            fields = [f"script: {q(script)}", f"pron: {{ {sys_id}: {q(pron)} }}", f"gloss: {q(gloss)}", f"role: '{ROLE[job]}'"]
            if note: fields.append(f"note: {q(md(note))}")
            if len(m) > 5 and m[5]: fields.append("changed: true")
            out.append(f"              {{ {', '.join(fields)} }},")
        out.append("            ] },")
    if s.get('punct', cfg.get('punct')): out.append(f"            {q(s.get('punct', cfg['punct']))},")
    out += ["          ],", "        },"]
out += ["      ],", "      summary: ["]
for text in d['SUMMARY']:
    out.append(f"        {{ text: {q(md(text))} }},")
out += ["      ],", "    },", "  ],", "  words: [],", "  switchboards: [],", "};", ""]
open(sys.argv[2], 'w').write('\n'.join(out))
print('wrote', sys.argv[2])
