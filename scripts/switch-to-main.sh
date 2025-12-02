#!/usr/bin/env bash
set -euo pipefail

echo "Fetching remote refs..."
git fetch origin --prune

if git show-ref --verify --quiet refs/heads/main; then
  echo "Local branch 'main' already exists. Setting upstream to origin/main..."
  git branch --set-upstream-to=origin/main main
else
  if git ls-remote --exit-code --heads origin main >/dev/null 2>&1; then
    echo "Creating local 'main' to track origin/main..."
    git checkout -b main origin/main
  else
    echo "Remote branch 'origin/main' not found. If you have a local 'master', you can rename it:"
    echo "  git branch -m master main"
    exit 1
  fi
fi

echo "Updating remote HEAD to point at main (local)"
git remote set-head origin main || true

echo "Done. You can now run: git pull"
