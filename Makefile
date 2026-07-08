.DEFAULT_GOAL := help

.PHONY: help check check-dist test build run

help: ## Show available make targets.
	@awk 'BEGIN {FS = ":.*##"; print "Available targets:"} /^[a-zA-Z0-9_.-]+:.*##/ { printf "  %-10s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

check: ## Run lint, tests, app build, and library build.
	pnpm check

check-dist: ## Rebuild library dist and fail if committed artifacts are stale.
	pnpm check:dist

test: ## Run the test suite.
	pnpm test

build: ## Build the app and library bundles.
	pnpm build && pnpm build:lib

run: ## Start the Vite dev server.
	pnpm dev
