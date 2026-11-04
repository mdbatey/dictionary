# Import tools

Scripts for bringing an old page from `reference/` into the site's content files. They're run by hand, and none of them is part of the build. See `docs/guides/adding-a-language.md` (step 5) and `docs/guides/adding-a-switchboard.md` (Tests).

| Script | What it does |
|---|---|
| `extract-dozen.cjs` | Runs the data section (`JOBS`, `S`, `SUMMARY`) of a "Dozen" page in a sandbox and writes it as JSON: `node extract-dozen.cjs <page.html> <out.json>` |
| `gen_dozen.py` | Turns that JSON into a Language file: `python3 gen_dozen.py <out.json> <src/content/name.ts> <config.json>`. It converts `<b>` → `**bold**` and `<a data-goto="N">` → `[…](sentence:N)`, and stops on any other HTML. |
| `*-dozen.config.json` | The configs used for Mandarin and Cantonese: ids, names, the old Role key → site Role id map, Pronunciation Systems and the Set name. Copy one for a new page. |
| `extract-switchboard.example.cjs` | How the Cantonese Switchboard's answer key was recorded: it runs the old page's grammar functions for every allowed combination. Each old Switchboard page names its functions slightly differently, so adapt it per page. |

The generated file is a starting point. Review it, add anything the old page didn't have (e.g. derived Pronunciation Systems), and run a one-off fidelity check against the JSON before committing.
