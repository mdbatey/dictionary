// Runs the old Cantonese Switchboard's grammar code and records its output for every allowed combination.
const fs = require('fs'); const vm = require('vm');
const html = fs.readFileSync(process.argv[2], 'utf8');
const js = html.slice(html.indexOf('/* ===== LANGUAGE-SPECIFIC: grammar jobs'), html.indexOf('/* ===== SHARED ENGINE'));
const ctx = {}; vm.createContext(ctx);
vm.runInContext(js.replace(/\bconst (\w+)\s*=/g, 'this.$1 =').replace(/^function (\w+)/gm, 'this.$1 = function $1'), ctx);
const piece = (m) => ({ script: m[0], jyutping: m[1], gloss: m[2], role: m[3], note: m[4] ?? null });
const out = []; const SW = ctx.SW; const ids = SW.map((s) => s.id);
const rec = (i, s) => {
  if (i === ids.length) {
    if (ids.some((id) => ctx.blocked(id, s[id], s))) return;
    out.push({ settings: { ...s }, subject: ctx.subject(s).map(piece), verb: ctx.verb(s).map(piece), object: ctx.object(s).map(piece), receiver: ctx.receiver(s).map(piece), punct: s.q === 'st' ? '。' : '？', english: ctx.english(s) });
    return;
  }
  for (const [v] of SW[i].opts) rec(i + 1, { ...s, [ids[i]]: v });
};
rec(0, {});
fs.writeFileSync(process.argv[3], JSON.stringify({ combos: out, default: ctx.DEFAULT }));
console.log('allowed combinations recorded:', out.length, 'of', SW.reduce((n, s) => n * s.opts.length, 1));
