#!/usr/bin/env bash
#
# Chirpy live demo script.
# Walks through the full API surface with curl, printing each request and
# its response so it can be followed along with during a presentation.
#
# Usage:
#   ./scripts/demo.sh            # run straight through
#   ./scripts/demo.sh -i         # interactive: pause before each step
#
set -uo pipefail

# ---- config -----------------------------------------------------------

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

PORT="${PORT:-8080}"
BASE_URL="http://localhost:${PORT}"
INTERACTIVE=false
[[ "${1:-}" == "-i" || "${1:-}" == "--interactive" ]] && INTERACTIVE=true

BOLD="\033[1m"
DIM="\033[2m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
RESET="\033[0m"

# ---- helpers ------------------------------------------------------------

step() {
  echo
  echo -e "${BOLD}${CYAN}=== $1 ===${RESET}"
  if $INTERACTIVE; then
    read -r -p "$(echo -e "${DIM}press enter to run this step...${RESET}")"
  fi
}

# run <curl args...> — prints the command, runs it, pretty-prints JSON body + status
run() {
  echo -e "${YELLOW}\$ curl $*${RESET}"
  local response status body
  response=$(curl -s -w '\n%{http_code}' "$@")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  echo -e "${DIM}< HTTP ${status}${RESET}"
  if [[ -n "$body" ]]; then
    if echo "$body" | jq . >/dev/null 2>&1; then
      echo "$body" | jq .
    else
      echo "$body"
    fi
  fi
  LAST_STATUS="$status"
  LAST_BODY="$body"
}

require_healthy() {
  if ! curl -s -o /dev/null "${BASE_URL}/api/healthz"; then
    echo "Chirpy doesn't seem to be running at ${BASE_URL}." >&2
    echo "Start it first with: npm run dev" >&2
    exit 1
  fi
}

# ---- demo ---------------------------------------------------------------

require_healthy

step "Reset the dev database (so this script is repeatable across runs)"
run -X POST "${BASE_URL}/admin/reset"

step "Health check"
run "${BASE_URL}/api/healthz"

step "Register two users (Alice and Bob)"
run -X POST "${BASE_URL}/api/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@chirpy.dev","password":"alice-pw-123"}'
ALICE_ID=$(echo "$LAST_BODY" | jq -r .id)

run -X POST "${BASE_URL}/api/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@chirpy.dev","password":"bob-pw-123"}'
BOB_ID=$(echo "$LAST_BODY" | jq -r .id)

step "Log in as Alice (get an access token + refresh token)"
run -X POST "${BASE_URL}/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@chirpy.dev","password":"alice-pw-123"}'
ALICE_TOKEN=$(echo "$LAST_BODY" | jq -r .token)
ALICE_REFRESH=$(echo "$LAST_BODY" | jq -r .refreshToken)

step "Log in as Bob"
run -X POST "${BASE_URL}/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@chirpy.dev","password":"bob-pw-123"}'
BOB_TOKEN=$(echo "$LAST_BODY" | jq -r .token)

step "Alice posts a chirp"
run -X POST "${BASE_URL}/api/chirps" \
  -H "Authorization: Bearer ${ALICE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"body":"hello world, this is my first chirp!"}'
CHIRP_ID=$(echo "$LAST_BODY" | jq -r .id)

step "Profanity filter: banned words get censored, not rejected"
run -X POST "${BASE_URL}/api/chirps" \
  -H "Authorization: Bearer ${ALICE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"body":"this is such a kerfuffle honestly"}'

step "Validation: chirps over 140 characters are rejected (400)"
run -X POST "${BASE_URL}/api/chirps" \
  -H "Authorization: Bearer ${ALICE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"body\":\"$(printf 'a%.0s' {1..141})\"}"

step "Auth is enforced: posting without a token is rejected (401)"
run -X POST "${BASE_URL}/api/chirps" \
  -H "Content-Type: application/json" \
  -d '{"body":"anonymous chirp"}'

step "List all chirps (default sort: oldest first)"
run "${BASE_URL}/api/chirps"

step "List chirps newest first"
run "${BASE_URL}/api/chirps?sort=desc"

step "Filter chirps by author"
run "${BASE_URL}/api/chirps?authorId=${ALICE_ID}"

step "Get a single chirp by id"
run "${BASE_URL}/api/chirps/${CHIRP_ID}"

step "Ownership is enforced: Bob can't delete Alice's chirp (403)"
run -X DELETE "${BASE_URL}/api/chirps/${CHIRP_ID}" \
  -H "Authorization: Bearer ${BOB_TOKEN}"

step "Alice deletes her own chirp (204)"
run -X DELETE "${BASE_URL}/api/chirps/${CHIRP_ID}" \
  -H "Authorization: Bearer ${ALICE_TOKEN}"

step "Refresh token: exchange Alice's refresh token for a new access token"
run -X POST "${BASE_URL}/api/refresh" \
  -H "Authorization: Bearer ${ALICE_REFRESH}"

step "Revoke Alice's refresh token"
run -X POST "${BASE_URL}/api/revoke" \
  -H "Authorization: Bearer ${ALICE_REFRESH}"

step "The revoked refresh token no longer works (401)"
run -X POST "${BASE_URL}/api/refresh" \
  -H "Authorization: Bearer ${ALICE_REFRESH}"

step "Chirpy Red upgrade via authenticated webhook"
run -X POST "${BASE_URL}/api/polka/webhooks" \
  -H "Authorization: ApiKey ${POLKA_KEY:-}" \
  -H "Content-Type: application/json" \
  -d "{\"event\":\"user.upgraded\",\"data\":{\"userId\":\"${BOB_ID}\"}}"

step "Admin metrics page"
run "${BASE_URL}/admin/metrics"

echo
echo -e "${GREEN}${BOLD}Demo complete.${RESET}"
