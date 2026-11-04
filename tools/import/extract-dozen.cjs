// Runs the data section (JOBS, S, SUMMARY) of an old "Dozen" page in a sandbox and saves it as JSON.
const fs = require('fs'); const vm = require('vm');
const html = fs.readFileSync(process.argv[2], 'utf8');
const grab = (name) => {
  const start = html.indexOf(`const ${name} =`);
  const open = html.indexOf(name === 'JOBS' ? '{' : '[', start);
  let depth = 0, i = open, q = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{' || c === '[') depth++;
    if (c === '}' || c === ']') { depth--; if (depth === 0) break; }
  }
  return html.slice(open, i + 1);
};
const ctx = {}; vm.createContext(ctx);
const out = {};
for (const n of ['JOBS', 'S', 'SUMMARY']) out[n] = vm.runInContext('(' + grab(n) + ')', ctx);
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
console.log('sentences:', out.S.length, 'summary:', out.SUMMARY.length, 'jobs:', Object.keys(out.JOBS).join(','));
