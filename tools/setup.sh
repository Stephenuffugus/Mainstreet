#!/usr/bin/env bash
# Dev-only setup for the replay tests. Nothing here ships.
# Installs Playwright and two browser engines. WebKit on Linux needs system
# libraries; if --with-deps cannot install them, fall back to Chromium + Firefox
# and name the engines that actually ran in STATUS.md.
set -euo pipefail
cd "$(dirname "$0")/.."
npm install
if npx playwright install --with-deps chromium webkit; then
  echo "engines: chromium, webkit"
else
  echo "WebKit system deps unavailable; installing chromium + firefox instead"
  npx playwright install chromium firefox
  echo "engines: chromium, firefox"
fi
npx playwright --version
echo "setup done"
