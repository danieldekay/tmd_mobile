# TMD Mobile Branch and Deployment Design

Date: 2026-10-13

## Goal

Use `develop` for validation and keep production deployments restricted to `main`.

## Current State

The repository has a `main` branch but no `develop` branch. CI currently runs for pushes and pull requests targeting `main`. The deploy workflow automatically deploys pushes to `main` and supports manual runs. Cloudflare Worker Assets and the production Worker configuration remain unchanged.

## Decision

Create `develop` from the current `main` commit. CI will run on pushes and pull requests targeting either branch. The existing production deploy will continue to run on pushes to `main`; a job-level ref check will skip manual runs selected from any other branch.

This change does not deploy the app to a staging Worker. Staging deployment is deferred; `develop` is the testing branch only.

## Safety and Validation

The production Worker name, Wrangler route, and API settings stay unchanged. A push to `develop` starts CI but cannot start the production deploy workflow. GitHub Actions check and build jobs validate the branch.

The project currently documents a pending production domain/DNS setup and anonymous API access returning 401. Those deployment prerequisites are outside this branch-only change.
