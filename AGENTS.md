# Repository Instructions

These are the shared project rules for all agents. `CLAUDE.md` imports this file and may contain additional Claude-specific collaboration instructions, but may not override these rules unless told otherwise.

## 1. Git Workflow

- Use `main` as the only working, commit, and push branch. Never create, switch to, commit on, or push non-`main` branches, including `codex/*`, feature, development, or preview branches.
- Before modifying the repository, verify the current branch with `git branch --show-current`, inspect `git status`, fetch `origin`, and synchronize with `origin/main` using fast-forward only.
- Switch to `main` only when safe. If the working tree contains changes that could be lost or overwritten, or the branches have diverged, stop and inform the user.
- Preserve existing user and agent changes. Never discard, reset, stash, clean, or overwrite existing work without explicit authorization.
- Keep modifications scoped to the requested task. Do not alter unrelated files.
- Commit and push only when explicitly requested or clearly authorized. Before each operation, verify that the current branch is exactly `main`.
- Push explicitly with `git push origin main`. Never force-push.

## 2. Existing Branches

- If relevant work exists on another branch, inspect it without checking out or switching to that branch.
- Integrate only necessary changes into `main`, and only with user authorization.
- Never push or deploy from a non-`main` branch.
- Do not delete local or remote branches without explicit authorization.

## 3. Vercel Deployment

- Use Vercel Git integration for production deployments triggered by pushes to `main`.
- Never create Preview deployments or deploy from non-`main` branches.
- Perform manual production deployments only when explicitly requested.
- Before a manual deployment, verify that the current branch is `main` and `HEAD` matches `origin/main`.
- Never deploy unpushed or unverified commits.

## 4. Project Status

- Treat `docs/STATUS.md` as the shared, concise snapshot of the project's current state, not as a changelog.
- After completing a task that meaningfully changes the project state, update `docs/STATUS.md`.
- Keep the three existing sections: `Feito`, `Em andamento`, and `Próximos passos`.
- Update only relevant information. Remove outdated entries and avoid repeating unchanged information.
- Mark work as completed only after verification. Keep unfinished work under `Em andamento` or `Próximos passos`.
- Before updating, preserve relevant changes made by other agents.
- Do not update the file for read-only tasks or tasks that do not change the project state.

## 5. Project Context and Resource Efficiency

- At the start of each coding task, read `docs/STATUS.md`. Do not explore other files in `docs/` unless relevant.
- Project: Sheetfy, a D&D 5e character sheet generator built with HTML/JavaScript and PDF generation, deployed on Vercel and using Upstash Redis.
- Main directories: `api/` (API endpoints), `server/` (server-side logic), `src/` (application source), and `scripts/` (automation and development tools).
- Do not scan `node_modules/`, `.git-codex-*/`, `output/`, `tmp/`, or `server-data/`.
- Do not read actual `.env*` files. Only `.env.example` may be inspected. Never expose secrets or environment variable values.
- Avoid reading `package-lock.json`, image assets, and logs unless directly required by the task. When necessary, inspect only the relevant content.
- For `docs/level-N-class-audit.md`, read only the file relevant to the current task.
- For large HTML files, use targeted searches (`grep` or `rg`) and inspect relevant sections instead of loading the entire file.
- Prefer targeted file inspection. Avoid exploring unrelated files or repeating context already available.

## 6. Testing

- Run only the most targeted check or test relevant to the change (e.g., `check`, `test:unit`, `test:pdf:5e`, or `test:e2e:account`).
- Run the full `npm test` suite only before an explicitly authorized commit or push, or when requested by the user.
- Do not repeat expensive checks without a reason.
- Never claim that a test or build succeeded unless it was actually executed and verified.
