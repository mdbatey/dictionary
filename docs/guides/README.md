# Content guides

How to grow the site. Each guide says what to decide first, which files to touch, and how to know it worked. Terms follow `GLOSSARY.md`, and the architecture follows `docs/adr/0001-frames-are-code-switchboards-and-breakdowns-are-data.md`.

| When the owner asks to… | Follow | Size |
|---|---|---|
| Add a new Language (e.g. Danish, Spanish) | [adding-a-language.md](adding-a-language.md) | A short grilling, then 1–3 tickets |
| Add a Set of Sentences to an existing Language | [adding-a-set.md](adding-a-set.md) | Usually 1 ticket |
| Add a Switchboard, or Words to a word list | [adding-a-switchboard.md](adding-a-switchboard.md) | 1 ticket, or 2 if it needs a new Frame |

## Applies to every guide

- **One branch and one pull request per piece of work.** The owner merges, and every push to `main` publishes the site (see `CLAUDE.md`).
- **`npm run check` must pass.** It typechecks and runs the content checks and tests. A content mistake (unknown Role, missing pronunciation, broken Sentence link, a Word missing a Form its Frame needs…) fails the build, so it can't reach the live site.
- **Look at it in a browser before opening the PR:** phone width (390 px), light and dark mode, and the detail panel on a few Pieces.
- **Colours only come from design tokens** in `src/styles/tokens.css`. Never put a raw colour anywhere else.
- **Accuracy:**
  - Content moved from an old page is checked against that page with a one-off script.
  - Content written from scratch has no answer key. Say so in the PR, and ask the owner how it should be checked (the owner, a native speaker, or a named reference) before it's merged.
- **Old pages** live in `reference/`. The scripts that import them are in `tools/import/`.
