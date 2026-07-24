# Change Log

Tutte le modifiche rilevanti di **Vanilla BLoC Flutter** sono documentate qui.
Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/); il
progetto segue [Semantic Versioning](https://semver.org/lang/it/). Ogni versione
corrisponde a un tag git `vX.Y.Z`. La sezione `[Unreleased]` raccoglie il lavoro
non ancora rilasciato; `scripts/new-release.sh` la promuove a versione datata.

## [Unreleased]

### Changed
- **`displayName`: "Vanilla BLoC Flutter" → "Vanilla BLoC Scaffolding (Flutter)"**
  (anche il displayName è univoco su tutto il Marketplace e il precedente era
  già occupato dal vecchio listing).

## [0.2.4] - 2026-07-24

### Changed
- **`name`: `vanilla-bloc` → `vanilla-bloc-generator`** (il `name` è univoco su
  tutto il Marketplace e `vanilla-bloc` è già occupato dal vecchio listing).
  `displayName` "Vanilla BLoC Flutter" invariato. Nuovo id:
  `allannava95.vanilla-bloc-generator`.
- Command id allineati: `vanilla-bloc.new-*` → `vanilla-bloc-generator.new-*`
  (manifest `contributes`/`menus`/`activationEvents` + `registerCommand`).

## [0.2.3] - 2026-07-24

### Fixed
- Pacchetto `.vsix` gonfio: con le `dependencies` runtime, `vsce` includeva
  ~1180 file da `node_modules` (813 KB). Aggiunto `node_modules/**` a
  `.vscodeignore` — l'estensione è bundlata da webpack in `out/extension.js`,
  quindi non serve. `.vsix` tornato a ~11 file / 70 KB (verificato con `vsce ls`).

### Changed
- **Publisher Marketplace: `Allan-Nava` → `allannava95`** (l'account che possiede
  il vecchio publisher non è più accessibile). L'extension id diventa
  `allannava95.vanilla-bloc`: è un **nuovo listing**, installazioni/recensioni del
  vecchio non si trasferiscono. Prerequisiti publish: publisher `allannava95`
  creato su marketplace.visualstudio.com/manage + `VSCE_PAT` di quell'account.

## [0.2.2] - 2026-07-24

### Fixed
- CI: `npm ci` falliva (`package.json`/`package-lock.json` fuori sync). Lock
  rigenerato pulito e verificato con `npm ci` in locale.

### Changed
- Toolchain aggiornata (necessaria per un lock rigenerabile: TS 3.9 non
  compilava più i `@types/*` moderni): **TypeScript 3.8 → 5.4**, **ts-loader
  7 → 9**, **`@types/node` 13 → 20**. `@types/vscode` pinnato a `~1.45.0` (=
  minimo `engines.vscode`, evita di usare per errore API più recenti).
- CI: workflow `release.yml` su **Node 20** (era 18, EOL).

_Nota: bump solo di toolchain/build — nessuna modifica al comportamento
utente né al bundle pubblicato._

## [0.2.1] - 2026-07-24

### Fixed
- Workflow `release.yml` non valido → falliva allo startup (0s) su ogni push:
  il contesto `secrets` non è usabile in un `if:` di step. Il secret `VSCE_PAT`
  è ora mappato su una `env` a livello job e lo step di publish gata su `env`.
- Build GitHub Pages rotta (`The just-the-docs theme could not be found`):
  rimosso `theme: just-the-docs` dal `docs/_config.yml` (la gem non è nel set
  `github-pages`), tenuto solo `remote_theme: just-the-docs/just-the-docs@v0.3.3`
  (ultima compatibile con Jekyll 3.10) + plugin `jekyll-remote-theme`. `docs/Gemfile`
  allineato alla pipeline classica; corretto anche l'HTML rotto in `footer_content`.

## [0.2.0] - 2026-07-23

### Added
- Suite di test reali sulla generazione file (`src/test/suite/generators.test.ts`):
  copre nomi/percorsi dei file, contenuto atteso, la regressione VB-1
  (Event State ≠ Event State Builder) e l'errore su file già esistente.
- `LICENSE` (MIT) + campo `"license": "MIT"` nel manifest; header sorgente e
  Dart generato allineati alla MIT (via `bloc_base.dart` ecc.).

### Changed
- Refactor: la logica di generazione è stata estratta in `src/generators.ts`
  (senza dipendenza da `vscode`, quindi testabile headless); `extension.ts`
  resta solo command/UI layer, con la boilerplate dei comandi deduplicata.
- Scrittura file via `fs.promises.writeFile` + `await` (rimosso l'anti-pattern
  `new Promise(async …)`); percorsi costruiti con `path.join` invece di `${dir}/…`.

### Removed
- `console.log` di debug sparsi in `extension.ts`.
- Import inutilizzato `change-case` in `snapshot.template.ts`.

### Fixed
- Rinominato `.vscode/estension.json` → `.vscode/extensions.json` (typo: la
  raccomandazione ESLint ora viene raccolta da VS Code).
- `SECURITY.md` riscritto (era il template GitHub con versioni "5.1.x").
- `.vscodeignore` esteso: il `.vsix` non imbarca più file interni/dev
  (`.claude/`, `docs/`, `.github/`, `scripts/`, `CLAUDE.md`, `AGENTS.md`,
  output tsc ridondante). Verificato con `vsce ls`.

## [0.1.0] - 2026-07-23

### Fixed
- Il comando **New Event State Builder** generava per errore il template
  *Event State* (collisione di nome: due file esportavano
  `getBlocEventStateTemplate`). Ora il builder usa
  `getBlocEventStateBuilderTemplate` e produce il file corretto.
- `createDirectory()` aveva la logica resolve/reject invertita e rifiutava la
  Promise quando la cartella veniva creata davvero; `createDirectoryV2()` non
  attendeva `mkdirp` (race). Unificate in un'unica `createDirectory` con
  `await mkdirp`.
- Il Dart generato da *Event State* non compilava: mancava l'import di
  `bloc_base.dart` (`VanillaBlocBase`) e c'era il typo `VanilleBlocState`.
- `npm run lint` (e quindi `pretest`) era rotto: mancava del tutto la config
  ESLint. Aggiunto `.eslintrc.json`; `lint` ora passa (0 errori).

### Added
- `change-case`, `lodash`, `mkdirp` dichiarate come `dependencies` runtime
  (prima erano importate ma assenti dal manifest, solo i `@types/*`).
- `CLAUDE.md`, `AGENTS.md`, `docs/backlog.md`, `docs/roadmap.md`.
- `scripts/new-release.sh` per il versionamento automatizzato + workflow
  GitHub Actions `release.yml` (package/publish del `.vsix` sul tag `v*`).

### Changed
- `vsce`, `webpack`, `webpack-cli` spostate da `dependencies` a `devDependencies`.

## [0.0.16]

- Comando New Vanilla BLoC Event State / Event State Builder.

## [0.0.13]

- Version with command new BLoC Snapshot.

## [0.0.11]

- Version with command new BLoC base.

## [0.0.10]

- Initial release.
