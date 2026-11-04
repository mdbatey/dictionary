# Roadmap

The site is built in versions. Each version has a theme and ends with something usable. Vocabulary follows `GLOSSARY.md`, and the architecture decisions are in `docs/adr/`.

| Version | Theme | Status | Plan |
|---|---|---|---|
| **v1** | **Base:** rebuild what the old pages already do | Planned: 12 tickets, issues #2–#13 | [v1-base.md](v1-base.md) |
| **v2** | **More Switchboards:** grow what Words can do | Ideas and decisions captured; needs its own grilling and spec | [v2-more-switchboards.md](v2-more-switchboards.md) |
| **v3** | **Explore words:** find and connect vocabulary | Ideas and decisions captured; needs its own grilling and spec | [v3-explore-words.md](v3-explore-words.md) |
| **v4** | **Practice:** study, not just look | Ideas and decisions captured; needs its own grilling and spec | [v4-practice.md](v4-practice.md) |

## How a version goes from idea to built

1. **`/grill-with-docs`** settles the design and updates `GLOSSARY.md` and the ADRs.
2. **`/to-spec`** publishes the spec as a GitHub issue.
3. **`/to-tickets`** splits it into tickets: GitHub issues titled with the version (e.g. "v1.3 …"), with a "Blocked by" list.
4. **`/implement`** builds one ticket per session, test-first.

v1 has finished steps 1–3. Its tickets are issues #2–#13, listed in `v1-base.md`.

## Why this order

- **v1 before anything:** every later feature sits on the shared base (content model, design tokens, display, publishing).
- **v2 before v3:** Word pages and search are only worth having once the word lists are larger and used by more Switchboards.
- **v3 before v4:** flashcards and audio work best on a word list that is large and connected to Sentences.

## Ideas not yet placed in a version

- **More Phrase Types, only if a Sentence needs them:**
  - **Subject complement:** what the subject is or becomes ("She is **a student**", "The apple is **red**").
  - **Prepositional phrase:** a preposition with its noun ("**to John**", "**i morgen**").
  - **Clauses, independent and dependent:** a Sentence with more than one clause ("I eat **because I'm hungry**"). Unlike the others, this means Phrases grouped inside a clause, so it changes the shape of a Sentence, not just its list of Phrase Types. It needs its own design pass.

- **Danish** (#9) was deferred out of v1, to be the first Language added with `docs/guides/adding-a-language.md`. Its old page is ready to import.
- **New Languages, such as Spanish or French.** The design already allows this: a new Language is content plus Frame code. See `docs/guides/`. Person/number agreement (hablo / hablas / habla) is handled by Forms labelled with the "who" Option.
- **Not planned:** an on-site editing form, user accounts, and syncing progress between devices. GitHub Pages has no server; revisit only if that changes.
