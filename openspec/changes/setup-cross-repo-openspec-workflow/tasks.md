## 1. Review

- [x] 1.1 [tmd_mobile] Review Core coordinator and existing Mobile config/skills; record architecture/reuse, security, recovery and compatibility evidence in design.md.

## 2. Setup

- [x] 2.1 [tmd_mobile] Generate official Codex lifecycle skills without replacing existing generic skill/provider integrations; depends on 1.1.
- [x] 2.2 [tmd_mobile] Add AGENTS/config/workflow pointers and linked tooling-only record; depends on Core 4.1/4.2.

## 3. Verification

- [x] 3.1 [tmd_mobile] Strictly validate target; inspect generated artifact/apply/archive instructions, config warning absence, skill visibility, links and whitespace; report results to Core 4.5.

## 4. Repository-local CLI compatibility

- [x] 4.1 [tmd_mobile] Reproduce local CLI failure, inspect package/lock and official release metadata, and confirm Node engine support; record scope and rollback in design.md.
- [x] 4.2 [tmd_mobile] Upgrade only OpenSpec devDependency/required lock entries and inspect official installed source; depends on 4.1.
- [x] 4.3 [tmd_mobile] Verify strict target/config/artifact/apply/archive commands through npm run openspec, compare unrelated lock entries and record current coordinator evidence; depends on 4.2.
