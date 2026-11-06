#!/usr/bin/env bash
# Installe les dépendances des deux apps fédérées (pas de workspace pnpm).
# Les lockfiles n'ont pas le même format : storefront est en lockfile v6
# (pnpm 8), adminpanel en lockfile v9 (pnpm 9). pnpm 9+ refuse le v6 avec
# --frozen-lockfile, d'où une version de pnpm par app.
#
# Usage : bash scripts/agent/install.sh [storefront|adminpanel]...   (défaut : les deux)
set -euo pipefail

export CI="${CI:-true}" # pnpm ne pose pas de question interactive
apps=("$@")
[ ${#apps[@]} -gt 0 ] || apps=(storefront adminpanel)

for app in "${apps[@]}"; do
  case "$app" in
    storefront) pnpm_version=8.15.9 ;;
    adminpanel) pnpm_version=9.15.9 ;;
    *) echo "App inconnue : $app (storefront ou adminpanel)" >&2; exit 2 ;;
  esac
  echo "— $app (pnpm $pnpm_version)"
  (cd "$app" && npx -y "pnpm@$pnpm_version" install --frozen-lockfile)
done
