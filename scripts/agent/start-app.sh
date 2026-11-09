#!/usr/bin/env bash
# Démarre la plateforme complète pour les agents, en arrière-plan :
#   1. l'API Django (dépôt privé delitamakanda/merch_store) sur 127.0.0.1:8000,
#      avec son propre scripts/agent/start-app.sh : base SQLite jetable, données
#      de `manage.py seed_demo`, `runserver` ;
#   2. le storefront, qui est le *remote* de la fédération : avec
#      @originjs/vite-plugin-federation, `storefrontEntry.js` n'existe qu'après
#      un build. Il tourne donc en `vite build --watch` (rebuild à chaque
#      modification, ~3 s) + `vite preview` sur http://localhost:3000 ;
#   3. l'admin (hôte de la fédération) en `vite` dev sur http://localhost:5001,
#      qui charge http://localhost:3000/assets/storefrontEntry.js.
# Les ports 3000 et 5001 sont imposés : ce sont les seules origines locales
# acceptées par le CORS de l'API (ouvrir via « localhost », pas 127.0.0.1).
# Attend que tout réponde. Logs dans .agent-out/*.log.
#
# Le backend est attendu dans $BACKEND_DIR (défaut : .agent-out/backend), avec
# ses dépendances Python installées. En CI, le workflow le récupère avec
# actions/checkout (dépôt privé : jeton requis). En local, le script le clone
# s'il est absent (BACKEND_REF : branche, défaut main) — installe alors toi-même
# `pip install -r requirements-dev.txt` dans ce dossier.
#
# Prérequis : bash scripts/agent/install.sh
set -euo pipefail

root=$PWD
out=$root/.agent-out
backend="${BACKEND_DIR:-$out/backend}"
timeout_s="${START_TIMEOUT:-120}"
storefront_build_timeout_s="${STOREFRONT_BUILD_TIMEOUT:-300}"
mkdir -p "$out/playwright" "$out/api"

wait_for() { # url nom log
  if ! timeout "$timeout_s" bash -c "until curl -sf '$1' >/dev/null; do sleep 2; done"; then
    echo "::error::$2 n'a pas démarré à temps"
    tail -n 50 "$3"
    exit 1
  fi
}

if [ ! -f "$backend/manage.py" ]; then
  git clone --depth 1 --branch "${BACKEND_REF:-main}" \
    https://github.com/delitamakanda/merch_store "$backend"
fi

# 1. API, avec le script du backend (même procédure que ses propres agents).
# Ses variables (DEBUG, DATABASE_URL…) visent le backend : on ne les propage pas
# aux étapes suivantes, d'où un GITHUB_ENV vide.
(
  cd "$backend"
  GITHUB_ENV="" START_TIMEOUT="$timeout_s" bash scripts/agent/start-app.sh
) > "$out/backend.log" 2>&1 || { tail -n 60 "$out/backend.log"; echo "::error::l'API n'a pas démarré"; exit 1; }

# 2. Storefront : l'URL de l'API est figée dans le bundle au build.
export VITE_API_URL=http://127.0.0.1:8000/
if [ -n "${GITHUB_ENV:-}" ]; then
  echo "VITE_API_URL=$VITE_API_URL" >> "$GITHUB_ENV"
fi
cd "$root/storefront"
nohup npx vite build --watch > "$out/storefront-build.log" 2>&1 < /dev/null &
if ! timeout "$storefront_build_timeout_s" bash -c "until grep -q 'built in' '$out/storefront-build.log'; do sleep 2; done"; then
  echo "::error::le premier build du storefront a échoué ou n'a pas fini à temps"
  tail -n 50 "$out/storefront-build.log"
  exit 1
fi
nohup npx vite preview --host localhost --port 3000 --strictPort > "$out/storefront.log" 2>&1 < /dev/null &
wait_for http://localhost:3000/assets/storefrontEntry.js "le storefront" "$out/storefront.log"

# 3. Admin (dev, rechargement à chaud).
cd "$root/adminpanel"
nohup npx vite --host localhost --port 5001 --strictPort > "$out/adminpanel.log" 2>&1 < /dev/null &
wait_for http://localhost:5001/ "l'admin" "$out/adminpanel.log"

echo "Storefront : http://localhost:3000 (remote : /assets/storefrontEntry.js)"
echo "Admin      : http://localhost:5001 (charge le remote du storefront)"
echo "API        : http://127.0.0.1:8000/api/ (Swagger : /api/schema/swagger-ui/)"
echo "Comptes    : demo-admin (staff) / demo-customer, mot de passe demo-password-123"
