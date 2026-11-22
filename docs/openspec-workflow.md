# Mobile OpenSpec workflow

Use the Codex workflows in `.agents/skills/openspec-*` with `openspec/config.yaml` and root `AGENTS.md`. `$openspec-propose` creates planning artifacts; explore, apply-change, verify-change, sync-specs and archive-change cover the other lifecycle phases. Read each selected skill and the current CLI instructions before proceeding.

Use `npm run openspec -- <arguments>` for every CLI command in this repo, including generated skills' bare `openspec` examples. `package.json` requires `@fission-ai/openspec` `^1.14.3` and the lockfile records the installed release; run `npm install` first. Node must meet the CLI's `>=20.19.0` engine requirement. The previously locked 1.3.1 did not support tooling-only `skip_specs` metadata, so a successful global CLI check does not establish that the repository-local workflow works.

Use [Core's canonical workflow](../../tmd_core/docs/openspec-workflow.md) and [review template](../../tmd_core/openspec/templates/cross-repo-review.md) for the shared review and coordination policy, adapting its Core/Theme participant rows to the actual affected repos. Mobile remains the owner of its local changes/specs. Core owns domain/data/API/server authorization; Mobile owns API consumption, routes, presentation, interaction, offline caches and Worker Assets delivery. Theme public behavior is parity evidence, not another API contract.

## Orient and plan

Inspect local `git status --short`, `npm run openspec -- list`, instructions, config, relevant specs and changes. Resolve the actual Core checkout (normally `../tmd_core`) and relevant Theme checkout (`../tmd_theme`); record revisions and dirty state. Inspect `src/lib/api/tmd.ts`, `src/lib/types.ts`, affected routes and the provider's actual API contracts before choosing patterns. Preserve unrelated work.

Keep mobile-only work in this repo after recording Core and relevant Theme impact with source evidence and an appropriate consumer regression check or a reason it is unnecessary. When partner edits are required, create linked local changes, select one coordinator (usually Core for provider contract changes), and use repo-qualified tasks/dependencies. Provider requirements stay with Core; Mobile scenarios link them. Record branch/revision, issue/PR URLs, prerequisites and rollout/rollback order. Do not create empty partner changes.

Run from each participating repo root, replacing `example-change`:

```sh
npm run openspec -- new change example-change
npm run openspec -- instructions proposal --change example-change
npm run openspec -- instructions design --change example-change
npm run openspec -- instructions specs --change example-change
npm run openspec -- instructions tasks --change example-change
npm run openspec -- status --change example-change
npm run openspec -- validate example-change --strict --no-interactive
```

Follow the dependency order reported by status. Every design records architecture/pattern reuse, security, error handling/recovery, compatibility/rollout and verification with concrete file/symbol evidence or a justified not-applicable decision. Changed behavior needs scenario-backed `SHALL` requirements, including loading, empty, malformed data, error, offline, direct-route and accessibility behavior where applicable. Tooling/docs-only work may declare `skip_specs: true` in `.openspec.yaml` with an explicit no-runtime-behavior rationale. This does not waive review.

## Apply and verify

Read `npm run openspec -- instructions apply --change example-change` and linked designs/tasks before implementation. Missing review evidence, invalid target specs or unmet prerequisites block dependent edits. A CLI ready state does not satisfy review. Keep static compatibility, existing Svelte patterns and Core contract ownership; never bypass server authorization in the client.

Review authentication, authorization/ownership, public/private response data, storage/cache privacy, validation, safe rendering and redacted diagnostics as applicable. Define safe errors, timeout/dependency loss, partial writes, retry/idempotency and user recovery. Account-specific cache data must be assessed on session/account transitions. Preserve documented compatibility with old/new provider versions and fail closed for unavailable privileged capabilities.

Execute tasks in prerequisite order and update artifacts when findings change scope, contracts or assumptions. Choose checks from actual scripts/config: `npm run check` and `npm run build` for route/deployment changes, API fixtures for normalization, and relevant mobile/browser, accessibility, offline and failure/recovery scenarios. For tooling/docs-only changes inspect generated instructions/config, validate the target strictly, check links and run `git diff --check`; an unrelated app build is unnecessary.

The coordinator's `verification.md` records commands/scenarios, expected and observed results, exit/status, environment, tested revisions/dirty state, partner status and blockers. Skipped checks remain unverified. Keep tracked issues synchronized with OpenSpec and explicitly target the owning repository (for example `gh ... -R danieldekay/tmd_mobile`).

## Sync and close

Use verify and sync-specs skills to reconcile implementation with local requirements. Review archive instructions and strictly validate each participating target. Required partner acceptance, security, recovery and rollout evidence must be complete before initiative closure. Archive local deltas in each owning root, repair reciprocal links and record partial archive failures. A build or deployment alone does not establish acceptance.

If a partner checkout is unavailable, resolve it or use [Core's repository guide](https://github.com/danieldekay/tmd_core/blob/HEAD/docs/openspec-workflow.md) for policy orientation; record inability to inspect the actual revision as a blocker to dependent work.
