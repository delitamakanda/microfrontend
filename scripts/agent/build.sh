#!/usr/bin/env bash
# Build de production des apps fédérées, dans .agent-out/build/<app>/ : le
# dist/ du storefront est celui que sert `vite preview` pendant la session de
# l'agent, il ne faut pas l'écraser. Échoue si le remote storefrontEntry.js
# n'est pas produit.
#
# Usage : bash scripts/agent/build.sh [storefront|adminpanel]...   (défaut : les deux)
set -uo pipefail

root=$PWD
apps=("$@")
[ ${#apps[@]} -gt 0 ] || apps=(storefront adminpanel)
status=0
for app in "${apps[@]}"; do
  case "$app" in
    storefront | adminpanel) ;;
    *) echo "App inconnue : $app (storefront ou adminpanel)" >&2; exit 2 ;;
  esac
  dest="$root/.agent-out/build/$app"
  echo "— $app → .agent-out/build/$app"
  if ! (cd "$app" && npx vite build --outDir "$dest" --emptyOutDir --logLevel warn); then
    status=1
    continue
  fi
  if [ "$app" = storefront ] && [ ! -f "$dest/assets/storefrontEntry.js" ]; then
    echo "::error::remote storefrontEntry.js absent du build du storefront"
    status=1
  fi
done
[ "$status" = 0 ] && echo OK
exit "$status"
