# Backlog — Vanilla-BLoC-Extension

Sorgente unica del lavoro da fare. Ogni item ha un **`id` stabile** (non
riusare/rinumerare) e una **milestone** (vedi `roadmap.md`). Non sparpagliare
TODO altrove: aggiungerli qui. Gli item chiusi restano con stato `done` per
tracciabilità.

Legenda stato: `todo` · `wip` · `done` · `wontfix`
Legenda priorità: `P0` (bloccante) · `P1` (importante) · `P2` (nice-to-have)

## Milestone `v0.1.0` — Correttezza (in corso)

| id | prio | stato | item |
|----|------|-------|------|
| VB-1 | P0 | done | *Event State Builder* generava il template Event State (collisione `getBlocEventStateTemplate`). Rinominata funzione builder. |
| VB-2 | P0 | done | `createDirectory` con resolve/reject invertiti + `createDirectoryV2` senza await. Unificate in `await mkdirp`. |
| VB-3 | P0 | done | Dart generato da Event State non compilava (import `bloc_base.dart` mancante, typo `VanilleBlocState`). |
| VB-4 | P0 | done | `lodash`/`mkdirp`/`change-case` importate ma non in `dependencies`. Dichiarate. |
| VB-5 | P1 | done | `vsce`/`webpack`/`webpack-cli` erano in `dependencies` → spostate in `devDependencies`. |
| VB-6 | P1 | done | CHANGELOG disallineato (fermo a 0.0.13, versione 0.0.16). Riallineato + formato Keep a Changelog. |
| VB-7 | P1 | done | Backlog + roadmap + `new-release.sh` + workflow release (questo lavoro). |
| VB-19 | P0 | done | `npm run lint`/`pretest` erano rotti: mancava la config ESLint. Aggiunto `.eslintrc.json`. |

## Milestone `v0.2.0` — Hardening & DX

| id | prio | stato | item |
|----|------|-------|------|
| VB-8  | P1 | todo | Rimuovere/gate i `console.log` di debug in `extension.ts` (usare un output channel o `NODE_ENV`). |
| VB-9  | P1 | todo | Sostituire l'anti-pattern `new Promise(async …)` con `fs.promises.writeFile` + `await` in tutte le `create*Template`. |
| VB-10 | P2 | todo | Usare `path.join`/`path.sep` invece della concatenazione `${dir}/…`. |
| VB-11 | P1 | todo | Aggiungere test reali sulla generazione file (oggi solo un placeholder in `extension.test.ts`). |
| VB-12 | P2 | todo | Rinominare `.vscode/estension.json` → `extensions.json` (typo: la raccomandazione non viene raccolta). |
| VB-13 | P1 | todo | Riscrivere `SECURITY.md` (ora è il template GitHub con versioni "5.1.x" senza senso). |
| VB-14 | P1 | todo | Aggiungere un file `LICENSE` (README dichiara "open source", header dicono "All rights reserved" → chiarire). |

## Milestone `v0.3.0` — Modernizzazione toolchain

| id | prio | stato | item |
|----|------|-------|------|
| VB-15 | P1 | todo | `npm audit fix` per le 32 vuln (1 critica, 20 high); valutare `--force` dove non breaking. |
| VB-16 | P2 | todo | Aggiornare TypeScript (3.8 → 5.x), `@types/node`, eslint (6 → 9 flat config), mocha. |
| VB-17 | P2 | todo | Alzare `engines.vscode` (`^1.45` è del 2020) e rimuovere gli `activationEvents` ridondanti (auto dal 1.74). |
| VB-18 | P2 | todo | Rimuovere `@types/change-case` (v4 porta i tipi built-in). |

## Come si lavora sul backlog

- Chiudere un item = stato `done` + riga nel CHANGELOG (`[Unreleased]`) + eventuale codice.
- Nuovo item = nuova riga con `id` = `VB-<max+1>`, milestone e priorità.
- Gli item `P2`/hardening NON vanno proposti come "next" spontaneamente: sono qui apposta.
