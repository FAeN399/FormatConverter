Below is a cross-platform (macOS / Linux / WSL) shell script you can drop at the repository root as setup.sh.
It automates every first-run step:
	•	checks that Node ≥ 16 and npm are installed
	•	installs all project dependencies (npm ci when a lock file exists, else npm install)
	•	runs ESLint and the full Mocha + fast-check test suite to be sure everything passes
	•	(optional) builds the Docker image so you can launch the web app in a container immediately

#!/usr/bin/env bash
###############################################################################
# setup.sh – one-command bootstrap for the Format Converter (Prompt-Castle)  #
###############################################################################
# Usage:   bash setup.sh [--no-docker]
#          Run from the repository root after cloning.
# Notes:   • Requires Node (>=16) + npm on host.                           #
#          • Docker build is skipped if the --no-docker flag is supplied. #
###############################################################################

set -euo pipefail

CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${CYAN}🛠  Format Converter – Setup Script${NC}"

# --------------------------------------------------------------------------- #
# 1. Verify prerequisites                                                    #
# --------------------------------------------------------------------------- #
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}❌ Node.js is not installed. Please install Node ≥16 and re-run.${NC}"
  exit 1
fi

NODE_VERSION=$(node -v)
REQUIRED_MAJOR=16
MAJOR=${NODE_VERSION#v}
MAJOR=${MAJOR%%.*}
if (( MAJOR < REQUIRED_MAJOR )); then
  echo -e "${RED}❌ Node $NODE_VERSION detected – need ≥16. Upgrade Node and retry.${NC}"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo -e "${RED}❌ npm is not installed or not in PATH. Install Node.js (includes npm).${NC}"
  exit 1
fi

echo -e "${GREEN}✔ Node ${NODE_VERSION} and npm detected${NC}"

# --------------------------------------------------------------------------- #
# 2. Install dependencies                                                    #
# --------------------------------------------------------------------------- #
if [[ -f package-lock.json ]]; then
  echo -e "${CYAN}📦 Installing dependencies via npm ci …${NC}"
  npm ci
else
  echo -e "${CYAN}📦 Installing dependencies via npm install …${NC}"
  npm install
fi
echo -e "${GREEN}✔ Dependencies installed${NC}"

# --------------------------------------------------------------------------- #
# 3. Lint & Test                                                             #
# --------------------------------------------------------------------------- #
echo -e "${CYAN}🔍 Running ESLint …${NC}"
npm run lint
echo -e "${GREEN}✔ Lint passed${NC}"

echo -e "${CYAN}🧪 Running tests …${NC}"
npm test
echo -e "${GREEN}✔ All tests passed${NC}"

# --------------------------------------------------------------------------- #
# 4. (Optional) Build Docker image                                           #
# --------------------------------------------------------------------------- #
if [[ "${1:-}" != "--no-docker" ]]; then
  if command -v docker >/dev/null 2>&1; then
    echo -e "${CYAN}🐳 Building Docker image 'format-converter' …${NC}"
    docker build -t format-converter .
    echo -e "${GREEN}✔ Docker image built. Launch with:${NC}"
    echo -e "   docker run -p 8080:80 format-converter"
  else
    echo -e "${RED}⚠ Docker not found – skipping container build.${NC}"
    echo -e "   (Run setup again with Docker installed or pass --no-docker to silence.)"
  fi
else
  echo -e "${CYAN}⏭  Docker build skipped (--no-docker).${NC}"
fi

echo -e "${GREEN}\n🎉 Setup complete!${NC}"
echo -e "• To start a local dev server: run ${CYAN}npm start${NC} (opens at http://localhost:8080)"
echo -e "• To serve via Docker:        run ${CYAN}docker run -p 8080:80 format-converter${NC}"

How to use

chmod +x setup.sh     # once
./setup.sh            # full bootstrap inc. Docker build
./setup.sh --no-docker  # skip the Docker image if you only need npm workflow

That’s it! Place this script at the root of the Prompt-Castle repo.
New contributors can now clone the project and run bash setup.sh for a zero-friction start.
