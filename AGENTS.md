# Repository Guidelines

<!-- long-task-dev:start -->
## Long-Task Workflow
- Use `$long-task-dev` for work that spans multiple sessions, milestones, or agent handoffs.
- Keep exactly one active long task at a time.
- Store one task folder per long-running effort under `tasks/<task-slug>/`.
- Global task registry: `tasks/registry.json`.
- Default task file set:
  - `prompt.md`
  - `plan.md`
  - `status.md`
- Current active task folder: `tasks/remove-handcrafted-visualizations-and-unify-tutorial-layouts`.
- Previous task folder: `tasks/add-travel-assistant-playable-simulator-example`.
- Most recent completed task: `tasks/add-travel-assistant-playable-simulator-example`.
- Session floor for the active task: at least `15` minutes and `3` cycles, rule `all`, self-check every `5` minutes.
- Read order when resuming: `AGENTS.md` -> `tasks/registry.json` -> active task `prompt.md` -> active task `plan.md` -> active task `status.md` or `documentation.md` -> optional `feature-list.json`.
- When a new long task starts, rerun the scaffold so this active pointer moves to the new folder and the prior task is marked in `tasks/registry.json`.
- Before starting the new task in earnest, read the previous-task summary file recorded for it.
- Start a guarded work session before deep implementation, and do not end it early unless the task is blocked or the session floor is satisfied.
- Treat `plan.md` as the source of truth for execution order, validation, and scope boundaries.
- Leave the repo in a clean state at the end of each session and update the status file before stopping.
- If the repo does not yet have a one-command bootstrap or smoke-test path, add one and document it here.
<!-- long-task-dev:end -->

## Project Structure & Module Organization
- Main learning content lives at the repo root:
  - `agents/`: progressive Python agent examples (`s01`-`s12`)
  - `docs/`: supporting documentation assets
  - `skills/`: local skill definitions used by the examples
- The interactive tutorial site lives in `web/`:
  - `web/src/app/`: Next.js App Router pages
  - `web/src/components/`: docs, layout, simulator, and visualization UI
  - `web/src/data/`: tutorial markdown, generated docs, annotations, and scenarios
  - `web/scripts/`: content extraction utilities run before dev/build
- Keep long-task files under `tasks/<task-slug>/`.

## Build, Test, and Development Commands
- Install web dependencies: `cd web && npm install`
- Dev start: `cd web && npm run dev`
- Content extraction only: `cd web && npm run extract`
- Smoke validation: `cd web && npm run build`
- There is currently no dedicated root test or lint script; use `cd web && npm run build` as the required validation pass for UI/content changes.

## Validation Rules
- Keep changes scoped to the active task.
- Prefer one bootstrap command or script for repeated startup.
- For changes in `web/src/data` or docs rendering, verify with `cd web && npm run build` before marking the task done.
- When closing one long task and opening the next, update the active pointer by rerunning the scaffold instead of editing multiple files by hand.
