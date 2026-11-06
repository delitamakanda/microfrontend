#!/usr/bin/env bash
# Tests unitaires (node:test) des apps fédérées, lancés depuis le dossier de
# chaque app (le runner y découvre les fichiers *.test.js, hors node_modules).
#
# Usage : bash scripts/agent/test.sh [storefront|adminpanel]...   (défaut : les deux)
set -uo pipefail

apps=("$@")
[ ${#apps[@]} -gt 0 ] || apps=(storefront adminpanel)
status=0
for app in "${apps[@]}"; do
  case "$app" in
    storefront | adminpanel) ;;
    *) echo "App inconnue : $app (storefront ou adminpanel)" >&2; exit 2 ;;
  esac
  echo "— $app"
  (cd "$app" && node --test) || status=1
done
exit "$status"
