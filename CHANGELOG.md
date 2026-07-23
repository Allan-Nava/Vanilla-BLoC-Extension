# Change Log

Tutte le modifiche rilevanti di **Vanilla BLoC Flutter** sono documentate qui.
Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/); il
progetto segue [Semantic Versioning](https://semver.org/lang/it/). Ogni versione
corrisponde a un tag git `vX.Y.Z`. La sezione `[Unreleased]` raccoglie il lavoro
non ancora rilasciato; `scripts/new-release.sh` la promuove a versione datata.

## [Unreleased]

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
