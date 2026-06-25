#!/usr/bin/env bash
# Pre-flight check: ist adb-proxy-socket für Premiere MCP up?
# Nutzung: bash scripts/check-proxy.sh [--start]

set -euo pipefail

PROXY_DIR="/c/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/tools/adb-mcp/adb-proxy-socket"
PROXY_URL="http://localhost:3001"

check_proxy() {
  curl -sf --max-time 2 "$PROXY_URL" > /dev/null 2>&1
}

if check_proxy; then
  echo "✅ Proxy RUNNING on $PROXY_URL"
  exit 0
fi

echo "❌ Proxy OFFLINE"

if [[ "${1:-}" == "--start" ]]; then
  echo "→ Starting proxy in background..."
  cd "$PROXY_DIR"
  nohup node proxy.js > /tmp/adb-proxy.log 2>&1 &
  PID=$!
  echo "→ PID $PID, log /tmp/adb-proxy.log"
  sleep 3
  if check_proxy; then
    echo "✅ Proxy started"
    exit 0
  else
    echo "❌ Proxy failed to start - check /tmp/adb-proxy.log"
    exit 1
  fi
fi

echo "→ Start with: bash $(realpath "$0") --start"
exit 1
