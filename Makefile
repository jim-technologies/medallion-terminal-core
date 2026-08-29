# Router only, per MAKEFILE-CONTRACT.md: targets delegate to native tooling
# (pnpm) or guard; logic lives in scripts/.
.DEFAULT_GOAL := help

.PHONY: help help-all fmt test test-unit test-storybook test-browser validate public-surface build build-storybook generate release check-dist run

help: ## One-screen help (make help-all for every target)
	@echo "Daily:"
	@echo "  make fmt        rewrite formatting in place"
	@echo "  make test       full test suite (unit + storybook + browser)"
	@echo "  make validate   the gate — exactly what CI runs"
	@echo "  make run        start the Vite dev server"
	@echo "  make generate   regenerate proto-derived types"
	@echo ""
	@echo "Everything else: make help-all"

help-all: ## Every target with its description
	@grep -hE '^[a-zA-Z0-9_-]+:.*##' $(MAKEFILE_LIST) | sed -E 's/:.*## /\t/'

fmt: ## Rewrite formatting in place (buf format; TypeScript is gated by tsc, not a rewriter).
	pnpm format

test: test-unit test-storybook test-browser ## Run the full test suite.

test-unit: ## Run the Node unit test project.
	pnpm test

test-storybook: ## Render every Storybook story in headless Chromium.
	pnpm test:storybook

test-browser: ## Run the Playwright browser suite against Storybook.
	pnpm test:browser

validate: ## The gate — exactly what CI runs: deps, surface guard, version parity, lint, tests, builds, artifact checks.
	pnpm install --frozen-lockfile
	pnpm exec playwright install chromium
	pnpm validate

public-surface: ## Guard the public surface: tracked content, paths, and unpushed commit messages (the first step of validate).
	pnpm check:surface

build: ## Build the app and library bundles.
	pnpm build && pnpm build:lib

build-storybook: ## Build the static Storybook catalog (the docs/pages artifact).
	pnpm install --frozen-lockfile
	pnpm build:storybook

generate: ## Regenerate proto-derived types (validate fails if committed output is stale).
	pnpm gen:proto

check-dist: ## Rebuild library dist and fail if committed artifacts are stale.
	pnpm check:dist

release: ## Tag and publish to npm from a clean, pushed tree (maintainer machine only).
	node scripts/release.mjs

run: ## Start the Vite dev server.
	pnpm dev
