# TMD Mobile Develop Branch CI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create `develop` as a testing branch while limiting production deployments to `main`.

**Architecture:** Create `develop` from the current `main` ref. Extend CI push and pull-request filters to cover `main` and `develop`; retain the production deploy's main-only push trigger and guard manual runs by ref.

**Tech Stack:** GitHub branches, GitHub Actions, SvelteKit, Cloudflare Wrangler.

---

### Task 1: Create the testing branch

**Files:**
- No files; create remote branch `develop` from current `main`.

**Step 1:** Confirm `develop` does not exist and record the current `main` SHA.

**Step 2:** Create `develop` from `main`.

**Expected result:** `develop` points at the commit that was `main` when branch creation began.

### Task 2: Extend CI and guard production deployment

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/deploy.yml`
- Modify: `DEPLOY.md`

**Step 1:** Add `develop` to the push and pull-request branch filters in CI.

**Step 2:** Keep deploy pushes restricted to `main`; add a job-level condition requiring `refs/heads/main`, so a manual run on `develop` is skipped.

**Step 3:** Document the branch policy.

### Task 3: Validate the change

**Files:**
- No test files are needed; existing GitHub Actions jobs run `npm run check` and `npm run build`.

**Step 1:** Commit the setup to `develop` and confirm the branch ref advances from the original `main` SHA.

**Step 2:** Verify GitHub Actions starts CI for the develop push and that the deploy workflow has no push trigger for `develop`.

**Step 3:** Review the branch changes and confirm the shared dirty checkout is untouched.
