# Codex Repository Instructions

## Main-only Git and Vercel policy

- Codex must make repository changes, commits, pushes, and deployments directly on `main`.
- Do not create, commit on, push, or deploy `codex/*`, feature, preview, or any other non-`main` branch.
- At the start of every mutating task, verify that the current branch is `main`, fetch `origin`, and synchronize with `origin/main` before editing. If switching or synchronizing is not safe, stop and ask the user instead of using another branch.
- Before every commit, push, or Vercel deployment, verify again that `git branch --show-current` is exactly `main`.
- Push explicitly with `git push origin main`; do not use a branch-implicit `git push`.
- Let the Vercel Git integration deploy the pushed `main` commit. Do not create Preview deployments. Run a manual production deployment only when the user explicitly requests it and the checked-out commit belongs to `origin/main`.
- When useful work exists on another branch, reconcile it into `main`, verify the result, and remove the stale branch after the `main` deployment succeeds.
