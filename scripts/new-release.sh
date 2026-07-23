#!/usr/bin/env bash
#
# new-release.sh — versionamento automatizzato per Vanilla-BLoC-Extension
#
# Uso:
#   scripts/new-release.sh <patch|minor|major|X.Y.Z>
#
# Cosa fa (NON fa push — lo fa sempre l'utente):
#   1. verifica working tree pulito
#   2. calcola la nuova versione e la scrive in package.json (senza tag/commit di npm)
#   3. promuove la sezione [Unreleased] del CHANGELOG a [X.Y.Z] - AAAA-MM-GG
#      e reinserisce una [Unreleased] vuota
#   4. build di verifica (compile + webpack)
#   5. commit "release: vX.Y.Z" (package.json, package-lock.json, CHANGELOG.md)
#   6. tag annotato vX.Y.Z
#
# NON aggiunge Co-Authored-By. Il push (commit + tag) resta manuale:
#   git push && git push --tags
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BUMP="${1:-}"
if [[ -z "$BUMP" ]]; then
  echo "Uso: $0 <patch|minor|major|X.Y.Z>" >&2
  exit 2
fi

# 1. working tree pulito
if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERRORE: working tree non pulito. Committa o stasha prima di rilasciare." >&2
  git status --short >&2
  exit 1
fi

CURRENT="$(node -p "require('./package.json').version")"

# 2. calcola nuova versione
if [[ "$BUMP" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  NEW="$BUMP"
elif [[ "$BUMP" =~ ^(patch|minor|major)$ ]]; then
  # --no-git-tag-version: aggiorna solo package.json (+lock), niente commit/tag
  NEW="$(npm version "$BUMP" --no-git-tag-version | tr -d 'v')"
else
  echo "ERRORE: argomento non valido '$BUMP' (usa patch|minor|major|X.Y.Z)" >&2
  exit 2
fi

# se è stata passata una versione esplicita, applicala al manifest
if [[ "$BUMP" == "$NEW" ]]; then
  npm version "$NEW" --no-git-tag-version --allow-same-version >/dev/null
fi

TAG="v${NEW}"
DATE="$(date +%Y-%m-%d)"
echo "Release: ${CURRENT} → ${NEW}  (tag ${TAG}, ${DATE})"

# 3. CHANGELOG: promuovi [Unreleased] → [X.Y.Z] - data e reinserisci Unreleased vuota
if ! grep -q '## \[Unreleased\]' CHANGELOG.md; then
  echo "ERRORE: CHANGELOG.md non contiene una sezione '## [Unreleased]'." >&2
  exit 1
fi
node - "$NEW" "$DATE" <<'NODE'
const fs = require('fs');
const [, , version, date] = process.argv;
const f = 'CHANGELOG.md';
let c = fs.readFileSync(f, 'utf8');
const fresh = `## [Unreleased]\n\n## [${version}] - ${date}`;
c = c.replace(/## \[Unreleased\]/, fresh);
fs.writeFileSync(f, c);
console.log(`CHANGELOG aggiornato: [${version}] - ${date}`);
NODE

# 4. build di verifica
npm run compile
npm run webpack >/dev/null

# 5. commit (niente Co-Authored-By)
git add package.json package-lock.json CHANGELOG.md
git commit -m "release: ${TAG}"

# 6. tag annotato
git tag -a "$TAG" -m "Release ${NEW}"

echo ""
echo "✔ Creato commit + tag ${TAG}. NON ho fatto push."
echo "  Per pubblicare:  git push && git push origin ${TAG}"
echo "  (il workflow release.yml crea/pubblica il .vsix al push del tag)"
