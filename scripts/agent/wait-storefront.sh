#!/usr/bin/env bash
# À lancer après avoir modifié un fichier de storefront/ : attend que
# `vite build --watch` (lancé par start-app.sh) ait fini de reconstruire le
# remote, puis vérifie que http://localhost:3000/assets/storefrontEntry.js
# répond. Pendant un rebuild, le remote renvoie 404 quelques secondes : l'admin
# (et le storefront) doivent être rechargés *après* ce script.
# Sort en erreur, avec la fin du log, si le build a échoué.
set -euo pipefail

log=.agent-out/storefront-build.log
[ -f "$log" ] || { echo "Pas de $log : lance d'abord bash scripts/agent/start-app.sh" >&2; exit 1; }

sleep 2 # laisse au watcher le temps de voir la modification
for _ in $(seq 1 60); do
  last=$(grep -E '(build started|built in)|^\[vite[^]]*\]|^(Error|error)\b|failed' "$log" | tail -n 1 || true)
  case "$last" in
    *"built in"*)
      if curl -sf http://localhost:3000/assets/storefrontEntry.js >/dev/null; then
        echo "Storefront reconstruit ($last) : recharge les pages."
        exit 0
      fi
      ;;
    "build started"*) ;;
    *)
      echo "Le build du storefront a échoué :" >&2
      tail -n 30 "$log" >&2
      exit 1
      ;;
  esac
  sleep 1
done
echo "Le storefront n'a pas fini de se reconstruire en 60 s :" >&2
tail -n 30 "$log" >&2
exit 1
