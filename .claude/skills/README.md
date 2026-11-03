# Skills

Most of these skills are copied from [mattpocock/skills](https://github.com/mattpocock/skills) (commit `4ae2317`, MIT license; see `LICENSE-mattpocock-skills`).
Only the planning and building flow was copied. The `agents/openai.yaml` files were dropped because Claude Code doesn't use them.

Main flow: `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` (which drives `/tdd`).
Run `/setup-matt-pocock-skills` once before `/to-spec` or `/to-tickets`.
Not sure which one to use? Run `/ask-matt`.

| Skill | Purpose |
| --- | --- |
| grill-with-docs | Interview to sharpen a design; writes GLOSSARY.md and ADRs as it goes |
| grilling, grill-me | The interview itself (grill-me = no docs) |
| domain-modeling | Glossary and ADR rules used by grill-with-docs |
| setup-matt-pocock-skills | One-time setup: issue tracker and doc layout |
| to-spec | Turn the conversation into a spec |
| to-tickets | Split a spec into tracer-bullet tickets with blockers |
| implement | Build a ticket, using tdd |
| tdd | Red-green-refactor, one slice at a time |
| prototype | Throwaway prototype to answer a design question |
| handoff | Summarize the session for a fresh agent |
| ask-matt | Explains which skill fits your situation |

To remove one, delete its folder.

**Local change:** `disable-model-invocation: true` was removed from `to-spec`, `to-tickets` and `implement`. That lets Claude start them partway through a session (newly added slash commands only appear in a new session). It also means Claude may start them on its own when a request clearly calls for one.
