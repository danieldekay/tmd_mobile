## Cross-repo impact

Coordinator: [Core design](../../../../tmd_core/openspec/changes/setup-cross-repo-openspec-workflow/design.md); [Theme partner](../../../../tmd_theme/openspec/changes/setup-cross-repo-openspec-workflow/design.md). Mobile owns local workflow/config/skills and tasks. Core owns canonical policy/template and combined verification. Source/API contracts remain unchanged. Current revisions/dirty states are recorded in the coordinator verification.

## Architecture and pattern reuse

Reuse `spec-driven`, existing Mobile `openspec/config.yaml`, root AGENTS.md and Core's docs/openspec-workflow.md plus openspec/templates/cross-repo-review.md. The existing `.agents/skills/openspec/SKILL.md` stays intact; `openspec init --tools codex --no-animation` adds official propose/explore/apply/verify/sync/archive workflows. Preserve other provider integrations and existing feature artifacts. Config retains Mobile's Svelte/static/API/size guidance while adding ownership/review entrypoints. The CLI rejects `rules.code` as an unknown artifact: move those four unchanged code rules into supported apply guidance and quote `Hard limit:` so YAML treats it as a string. Runtime patterns in src/lib/api/tmd.ts and src/lib/types.ts remain the consumer boundary; no source edit is needed.

## Security analysis

Only policy and generated skill files change. No input, permissions, auth/session, API field exposure, network/cache handling or credentials change. Core remains the authority for server authorization; Mobile guide requires future cache privacy and negative-path review. Guidance is advisory, so root instructions require evidence and do not treat CLI validation as a completed security review. No secrets retained.

## Error handling and recovery

Missing provider checkout/guide, incomplete reviews or failed target validation block dependent implementation. Skipped runtime/browser checks remain unverified when applicable. Current unrelated runtime change failures remain outside setup scope. Revert only this setup's added skill/policy sections and partner record; no data migration/recovery or runtime retry/error change is applicable.

## Compatibility and rollout

### Repository-local CLI compatibility

The documented `npm run openspec --` resolves the devDependency locked at 1.3.1, which rejects this tooling-only change for missing deltas despite `skip_specs: true`; the global 1.13.1 check did not establish local-script compatibility. Upgrade only `@fission-ai/openspec` to `^1.14.3` and its required lock entries. The official npm registry lists 1.14.3 and Node `>=20.19.0`; local Node v24.15.0 satisfies that engine. Compare the lockfile against its pre-upgrade snapshot to preserve unrelated dependencies. Install with lifecycle scripts disabled, and inspect the installed official validator/instructions source before relying on its behavior. Run the documented npm script for strict target validation, config and artifact/apply/archive instructions. No application dependency or runtime behavior changes; rollback restores only this devDependency/lock change in addition to setup files.

Depend on Core tasks 4.1/4.2 for canonical review and guide availability before Mobile task 2.2. Existing application versions and deployments work unchanged. Native local OpenSpec roots remain independent, linked by provider ownership and coordinator evidence; no registry/custom schema is introduced. All provider integrations and prior feature proposals remain usable to their existing extent.

## Verification

Strictly validate this tooling-only target and inspect generated proposal/design/specs/tasks/apply/archive instructions, config warnings, local links, skill visibility and whitespace. Record commands/results in [Core verification](../../../../tmd_core/openspec/changes/setup-cross-repo-openspec-workflow/verification.md). No runtime build or browser check is applicable because application behavior is unchanged; no broad validation pass is claimed.
