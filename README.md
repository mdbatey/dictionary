# Dictionary Layers

A personal language-study site: sentences taken apart piece by piece (Breakdowns), and sentences whose grammar you change by flipping switches (Switchboards). It's live at https://mdbatey.github.io/dictionary/.

- **Plan and roadmap:** `docs/plan/`
- **Vocabulary:** `GLOSSARY.md`
- **Decisions:** `docs/adr/`
- **Old reference pages:** `reference/`

## Working on it

```sh
npm install
npm run dev      # local site at http://localhost:5173/dictionary/
npm run check    # typecheck + content checks + tests
npm run build    # check, then build into dist/
```

Every push to `main` runs the checks and publishes the site through GitHub Actions. A content mistake (e.g. a Piece with a Role its Language doesn't use) fails the build, and the live site keeps its last good version.
