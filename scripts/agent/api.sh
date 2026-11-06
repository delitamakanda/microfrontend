#!/usr/bin/env bash
# Appelle l'API locale merch_store (lancée par start-app.sh) pour vérifier un endpoint.
# Seule l'app locale est joignable : l'URL de base est figée et le chemin
# validé, ce qui permet d'autoriser ce script aux agents sans leur ouvrir le
# réseau.
#
# Usage : bash scripts/agent/api.sh [--as demo-admin|demo-customer] METHODE /chemin [corps-json]
#   bash scripts/agent/api.sh GET /api/store/product/
#   bash scripts/agent/api.sh --as demo-customer GET /api/store/customers-order/
#   bash scripts/agent/api.sh --as demo-admin POST /api/store/coupon/create/ '{"code":"X","discount":5,...}'
#
# Authentification : Basic (activée dans REST_FRAMEWORK), mot de passe de démo.
# La réponse est affichée et copiée dans .agent-out/api/last.json.
set -euo pipefail

BASE_URL=http://127.0.0.1:8000
PASSWORD=demo-password-123
user=""

if [ "${1:-}" = "--as" ]; then
  user="${2:-}"
  shift 2
fi
method="${1:-}"
path="${2:-}"
body="${3:-}"

usage() {
  sed -n '7,10p' "$0" >&2
  exit 2
}

case "$user" in
  "" | demo-admin | demo-customer) ;;
  *) echo "Compte inconnu : $user (demo-admin ou demo-customer)" >&2; exit 2 ;;
esac
case "$method" in
  GET | POST | PUT | PATCH | DELETE | OPTIONS) ;;
  *) usage ;;
esac
if ! [[ "$path" =~ ^/[A-Za-z0-9._~/?\&=%+,-]*$ ]] || [[ "$path" == //* ]]; then
  echo "Chemin invalide : $path (doit commencer par /, sans hôte)" >&2
  exit 2
fi

args=(-sS -X "$method" -H 'Accept: application/json' -o .agent-out/api/last.json -w '%{http_code}')
if [ -n "$user" ]; then
  args+=(-u "$user:$PASSWORD")
fi
if [ -n "$body" ]; then
  args+=(-H 'Content-Type: application/json' --data-binary "$body")
fi

mkdir -p .agent-out/api
status=$(curl "${args[@]}" -- "$BASE_URL$path")
echo "HTTP $status — $method $path${user:+ (en tant que $user)}"
python3 -m json.tool .agent-out/api/last.json 2>/dev/null | head -c 8000 || head -c 4000 .agent-out/api/last.json
echo
