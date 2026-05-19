---
title: Contributing
description: How to contribute code, docs, translations, and listings to CasaStudente.
---

# Contributing

CasaStudente is built in public, by people who care about Forlì. Contributions of every size are welcome — fix a typo, translate a string, ship a feature, or document a neighborhood.

## Ways to help

| You can… | How |
| -------- | --- |
| Report a bug | [Open an issue](https://github.com/ForliLabs/casa-studente/issues/new). Include the `x-request-id` header from the failing response. |
| Suggest a feature | [Start a discussion](https://github.com/ForliLabs/casa-studente/discussions). |
| Improve documentation | Edit any page on this site via the "Edit this page" link. |
| Translate the UI | Add a locale file in `src/lib/i18n/locales/`. |
| Write a neighborhood guide | New MDX page under `docs/guides/neighborhoods/`. |
| Onboard a landlord | The friendliest contribution. Send them a link to [Landlord Onboarding](./guides/landlord-onboarding). |

## Development workflow

1. **Fork & clone**

   ```bash
   git clone git@github.com:<your-handle>/casa-studente.git
   cd casa-studente
   npm install
   cp .env.example .env
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feat/<short-description>
   ```

3. **Run locally**

   ```bash
   npm run dev
   ```

4. **Add tests**. Every PR should ship with at least one of:

   - A Vitest unit test in `tests/unit/`
   - A Playwright E2E spec in `e2e/`

5. **Lint & typecheck**

   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```

6. **Open a PR**. Use a Conventional Commit style title:

   - `feat: roommate match score now considers study programme`
   - `fix: stripe webhook retries no longer double-charge`
   - `docs: clarify cedolare-secca eligibility`

## Code style

- TypeScript strict mode, no `any`.
- Server Components by default, Client Components only where needed.
- Validation via Zod schemas in `src/lib/validation.ts`.
- Server Actions in `src/lib/actions/**`. Never call `fetch('/api/...')` from app code.
- One concern per file. If a file exceeds 300 lines, split it.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>)?: <subject>

[body]

[footer]
```

Types: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `chore`.

## PR checklist

- [ ] Tests added or updated
- [ ] `npm run lint && npm run typecheck && npm test` all pass
- [ ] Docs updated (if you changed user-facing behaviour)
- [ ] Screenshot or screencast for UI changes
- [ ] Linked issue or discussion (if applicable)

## Releases

We cut a release whenever there's a meaningful change. Each release is documented in [`CHANGELOG.md`](https://github.com/ForliLabs/casa-studente/blob/main/CHANGELOG.md) and announced on [the changelog page](./changelog).

## Code of conduct

By contributing you agree to follow our [Code of Conduct](./code-of-conduct). Be kind. Forlì is a small city.
