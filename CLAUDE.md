# Claude Code Instructions

@AGENTS.md

## 1. Shared Project Environment

- Treat the repository as the shared source of truth with Codex. Do not assume access to the other agent's memory or conversation; rely on project files, Git, and `docs/STATUS.md`.
- Follow `AGENTS.md` for all shared Git, branch, commit, push, deployment, and project status policies.
- Do not duplicate or override rules defined in `AGENTS.md`.

## 2. Cross-Agent Collaboration

- Other agents may have work in progress. Check `git status` and relevant diffs before editing.
- Preserve changes you did not make. Never overwrite, revert, or discard unrelated work.
- If simultaneous work or ownership is unclear, stop and ask the user before proceeding.
- Build upon existing implementations instead of recreating completed work.
- Keep changes focused and consistent with the project's architecture and conventions.

## 3. Shared Knowledge and Handoffs

- Use source code, tests, documentation, Git history, and `docs/STATUS.md` as the primary handoff between agents.
- Avoid unnecessary notes, logs, and coordination files.
- When another agent needs to continue unfinished work, leave a concise handoff in an existing project document or task tracker, including completed work, pending tasks, relevant files, and important decisions.

## 4. Implementation and Verification

- Follow existing project patterns and conventions.
- Prefer minimal, targeted changes over unnecessary refactoring.

## 5. Completion Reports

- Keep final reports concise: changes made, files modified, tests run, pending work, and `git status`.
- For small tasks, limit reports to 2–3 lines.
