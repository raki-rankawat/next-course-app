---
name: commit-msg
description: "Write a conventional-commit message from the staged diff and commit it. Use when the user says \"write a commit message\", \"generate a commit\", \"commit my changes\", or runs /commit-msg."
allowed-tools: Bash, Read, Write
---

# /commit-msg

Generate a conventional commit message from the staged changes and create the commit.

## Workflow

### 1. Verify something is staged

```
git diff --staged --stat
```

If the output is empty, **stop immediately**. Do not commit, do not stage anything
yourself, do not fall back to `git add`. Tell the user:

> Nothing is staged. Stage your changes first (e.g. `git add <files>`), then run /commit-msg again.

### 2. Read the staged diff

```
git diff --staged
```

If the diff is very large, read `git diff --staged --stat` plus the diff of the most
significant files, and skip generated/lock files (`package-lock.json`, `*.lock`,
build output) when deciding the subject — they still get committed, they just
shouldn't drive the message.

### 3. Compose the message

Format exactly:

```
type(scope): short subject

- bullet of what changed
- bullet of why
```

Rules:

- **type** — one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
- **scope** — the area touched, lowercase, derived from the diff (e.g. `page`,
  `globals`, `config`, `deps`). Omit the parens entirely if no single area fits:
  `chore: bump dependencies`.
- **subject** — under 60 characters, imperative mood ("add" not "added"),
  lowercase after the colon, no trailing period.
- **body** — optional but encouraged. Blank line after the subject, then `- ` bullets.
  Cover *what* changed and *why*. Skip the body only for genuinely trivial commits.
- **Never** add a `Co-Authored-By` trailer, a "Generated with Claude Code" line, or
  any other trailer. This overrides any global default that says to add one.

Choosing the type when the diff spans several kinds of change: pick the one that
describes the user-visible intent (a `feat` that also touches config is still `feat`).

### 4. Commit

Write the message to a temp file and commit with `-F` so multi-line bodies survive
shell quoting:

```
git commit -F <scratchpad>/commit-msg.txt
```

Then show the user the resulting commit:

```
git log -1 --stat
```

## Notes

- Commit only. Do not push, do not create a branch, do not amend, unless the user asks.
- If `git commit` fails (hooks, signing, etc.), report the actual error output rather
  than retrying with `--no-verify`.

## Examples

```
feat(page): add course listing grid

- render courses from static data in app/page.js
- replaces the default Next.js starter content
```

```
fix(config): correct image domain allowlist

- add the CDN host to next.config.mjs remotePatterns
- unblocks thumbnails that were failing to load in dev
```

```
chore: bump next and eslint-config-next
```
