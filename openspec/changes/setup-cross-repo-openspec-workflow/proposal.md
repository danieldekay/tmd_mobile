## Why

Mobile has local OpenSpec artifacts but lacks root guidance for the official Codex lifecycle skills and shared Core contract review. Planning and execution need discoverable local entrypoints and explicit partner ownership.

## What Changes

- Generate the six official Codex lifecycle skills while preserving the existing generic skill and provider integrations.
- Add AGENTS/config pointers and a Mobile workflow entrypoint to Core's canonical review policy.
- Record linked ownership, dependencies and combined verification for this setup.
- Upgrade the repository-local OpenSpec devDependency from locked 1.3.1 to a supported current release so documented npm workflows handle tooling-only changes and operation guidance.

## Capabilities

No runtime capability changes. This is tooling/docs-only work with `skip_specs: true`; no behavior spec delta is applicable.

## Impact

- Coordinator: [tmd_core:setup-cross-repo-openspec-workflow](../../../../tmd_core/openspec/changes/setup-cross-repo-openspec-workflow/proposal.md).
- Other partner: [tmd_theme:setup-cross-repo-openspec-workflow](../../../../tmd_theme/openspec/changes/setup-cross-repo-openspec-workflow/proposal.md).
- Local owners: `.agents/skills/openspec-*`, AGENTS.md, openspec/config.yaml and docs/openspec-workflow.md.
- No API, application, deployment or migration changes. Only the OpenSpec development dependency and its required lock entries change; no issues/PRs created for this setup.
