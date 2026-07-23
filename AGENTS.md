# AGENTS.md — Vanilla-BLoC-Extension

Estensione VSCode (`github.com/Allan-Nava/Vanilla-BLoC-Extension`, publisher `Allan-Nava`, id `vanilla-bloc`) che genera scaffolding Dart/Flutter per il pattern **Vanilla BLoC**. TypeScript + webpack (target `node`).

Questo file definisce le regole operative per gli agent AI (Copilot, Claude, altri tool) in questo repository. Per il contesto tecnico completo vedi `CLAUDE.md`.

## Regole di lavoro (SEMPRE)

- **MAI `git push`**: lo fa sempre l'utente. **MAI `Co-Authored-By`** nei commit.
- **Release = `scripts/new-release.sh <patch|minor|major|X.Y.Z>`**: bumpa `package.json`, promuove `[Unreleased]` del `CHANGELOG.md` a versione datata, builda, commit `release: vX.Y.Z` + tag. Non fa push. Annotare ogni modifica sotto `[Unreleased]`. Al push del tag `v*`, `.github/workflows/release.yml` fa release + publish Marketplace (secret `VSCE_PAT`).
- **Todo → `docs/backlog.md`** (`id` stabile `VB-N`, milestone in `docs/roadmap.md`). Non sparpagliare TODO; gli item hardening restano lì, non proporli come "next".
- **Un comando nuovo tocca 4+ punti** e vanno propagati tutti: `package.json` (`contributes.commands` + `menus.explorer/context` + `activationEvents`), `src/extension.ts` (`registerCommand` + `context.subscriptions.push`), template in `src/templates/` + barrel `index.ts`, README/CHANGELOG.
- **Il `command` deve combaciare esattamente** tra `package.json` e `registerCommand(...)`.
- **`.vscodeignore` decide il pacchetto**: `src/`, `*.ts`, `*.map`, `out/test/**` sono esclusi. Verificare con `vsce ls` prima di pubblicare.
- **Testare a mano** (F5 → "Run Extension" → genera un file → ispeziona il `.dart`) prima di dichiarare fatto: la suite automatica non copre la generazione file.

## Trappole note / regole tecniche

- **Collisione nomi template**: `bloc-event-state.template.ts` e `bloc-event-state-builder.template.ts` esportano entrambe `getBlocEventStateTemplate()`; il barrel `index.ts` le riesporta ambiguamente. Il comando *Event State Builder* genera per sbaglio il template Event State. Rinominare la funzione del builder prima di modificarla.
- **Dipendenze runtime non dichiarate**: `lodash`, `mkdirp`, `change-case` importate ma assenti da `dependencies` (ci sono solo i `@types/*`). Vanno dichiarate.
- **`vsce`/`webpack`/`webpack-cli` in `dependencies`** → spostare in `devDependencies`.
- **`createDirectory()` ha la logica di resolve/reject invertita**; **`createDirectoryV2()` non aspetta** la Promise di `mkdirp`. Non usarle come modello: preferire `await mkdirp(dir)`.
- **Anti-pattern `new Promise(async …)`** ovunque (ingoia le eccezioni sincrone). Preferire `fs.promises.writeFile` con `await`.
- **Path con `${dir}/…`** invece di `path.join`.
- **Toolchain 2020** con molte vuln (`npm audit`): aggiornare con cautela, un bump di `engines.vscode` alza il minimo richiesto agli utenti.
- **`.vscode/estension.json`**: typo, dovrebbe essere `extensions.json`.
- **`console.log` di debug** da ripulire prima della pubblicazione.

## Comandi

```bash
npm run compile   # tsc -p ./
npm run webpack   # bundle dev
npm run lint      # eslint src --ext ts
npm test          # compile + lint + vscode-test
npx vsce ls       # contenuto del .vsix
npx vsce package  # crea il .vsix
```
Debug: F5 → **"Run Extension"** (Extension Development Host).

## Puntatori

- Backlog: `docs/backlog.md` · Roadmap: `docs/roadmap.md` · Release: `scripts/new-release.sh` + `.github/workflows/release.yml`
- Repo/issue: `github.com/Allan-Nava/Vanilla-BLoC-Extension` · Owner: `@Allan-Nava` (`.github/CODEOWNERS`) · Docs: `docs/` (GitHub Pages)
- Contesto tecnico esteso: `CLAUDE.md`
