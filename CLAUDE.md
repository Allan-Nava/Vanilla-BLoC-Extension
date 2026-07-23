# CLAUDE.md — Vanilla-BLoC-Extension

Estensione VSCode (`github.com/Allan-Nava/Vanilla-BLoC-Extension`, marketplace publisher `Allan-Nava`, id `vanilla-bloc`) che genera scaffolding Dart/Flutter per il pattern **Vanilla BLoC** (Snapshot, BLoC Base + `BlocProvider`, Singleton, Event/State, Event/State Builder). Scritta in **TypeScript**, bundlata con **webpack**, target `node`.

## Layout

- `src/extension.ts` — entrypoint: `activate()` registra i 6 comandi (`vanilla-bloc.new-*`), ognuno chiede nome/cartella e scrive un file `.dart`.
- `src/templates/*.template.ts` — funzioni `get*Template()` che ritornano stringhe Dart. Riesportate dal barrel `src/templates/index.ts`.
- `src/utils/index.ts` — attualmente vuoto (solo header).
- `src/test/` — suite Mocha via `vscode-test` (`runTest.ts` + `suite/`), oggi solo un test placeholder.
- `package.json` `contributes.commands` + `menus.explorer/context` — i comandi appaiono nel menu contestuale su cartelle (`when: explorerResourceIsFolder`).
- Build: `out/extension.js` (webpack, `main` del manifest). `docs/` è il sito GitHub Pages (Jekyll), non codice.

## Regole di lavoro (SEMPRE)

- **MAI `git push`** — lo fa sempre l'utente. **MAI `Co-Authored-By`** nei commit.
- **Ogni release bump** = nuova voce in `CHANGELOG.md` (Keep a Changelog) **+** bump di `version` in `package.json`. Oggi il CHANGELOG è fermo a 0.0.13 mentre la versione è 0.0.16: riallinearlo. Bump `minor` per nuovi comandi/template, `patch` per fix.
- **Il pubblicabile lo decide `.vscodeignore`** — `src/`, `**/*.ts`, `**/*.map`, `out/test/**`, `.vscode/**` sono esclusi dal `.vsix`. Verificare cosa finisce nel pacchetto con `vsce ls` prima di pubblicare.
- **Allineare tutto**: un comando nuovo tocca almeno 4 punti — `package.json` (`contributes.commands` + `menus` + `activationEvents`), `src/extension.ts` (`registerCommand` + `context.subscriptions.push`), un template in `src/templates/`, il barrel `index.ts`, e README/CHANGELOG. Se cambi un punto, propaga agli altri.
- **`command` deve combaciare esattamente** tra `package.json` e `registerCommand(...)` — un mismatch = comando che non parte.
- **Testare a mano il comando** (F5 → "Run Extension", genera un file, verifica il `.dart` prodotto) prima di dichiarare fatto: i test automatici non coprono la generazione file.

## Trappole note / regole tecniche

- **Nomi funzione template duplicati**: `bloc-event-state.template.ts` **e** `bloc-event-state-builder.template.ts` esportano entrambe `getBlocEventStateTemplate()`. Il barrel `index.ts` fa `export *` da entrambi → collisione ambigua. Il comando *Event State Builder* oggi genera per errore il template Event State. Rinominare la funzione del builder prima di toccarci sopra.
- **Dipendenze runtime non dichiarate**: `lodash`, `mkdirp`, `change-case` sono importate in `extension.ts` ma in `package.json` compaiono solo i loro `@types/*`. Funziona solo perché webpack le bundla da `node_modules` transitivi. Vanno in `dependencies`.
- **`vsce`, `webpack`, `webpack-cli` sono in `dependencies`** ma sono tool di build → spostare in `devDependencies`.
- **`createDirectory()` ha la logica invertita**: rifiuta la Promise quando `mkdirp` crea davvero la cartella. **`createDirectoryV2()` non aspetta** la Promise di mkdirp (race). Non copiarle come modello — usare `await mkdirp(dir)` diretto.
- **Anti-pattern `new Promise(async (resolve,reject) => …)`** ovunque: l'executor async ingoia le eccezioni sincrone. Preferire `fs.promises.writeFile` con `await`.
- **Path costruiti con `${dir}/…`** invece di `path.join` — su percorsi VSCode `fsPath` regge, ma usare `path.join`/`path.sep` per robustezza.
- **Toolchain 2020** (TS 3.8, `@types/node` 13, eslint 6, engine `vscode ^1.45`) → `npm audit` segnala molte vuln. Aggiornare con cautela: un bump di `engines.vscode` alza il minimo VSCode richiesto agli utenti.
- **`.vscode/estension.json`** è un typo (dovrebbe essere `extensions.json`) → la raccomandazione ESLint non viene raccolta da VSCode.
- **`console.log` di debug** sparsi in `extension.ts` — rimuovere/ridurre prima della pubblicazione.

## Comandi utili

```bash
npm run compile      # tsc -p ./  (type-check + emit in out/)
npm run webpack      # bundle dev
npm run lint         # eslint src --ext ts
npm test             # compile + lint + vscode-test (scarica VSCode)
npx vsce ls          # cosa finisce nel .vsix
npx vsce package     # crea il .vsix
```
Debug interattivo: F5 in VSCode → config **"Run Extension"** (apre Extension Development Host).

## Puntatori

- Repo: `github.com/Allan-Nava/Vanilla-BLoC-Extension` · Issue/bug: `bugs.url` nel manifest · Docs site: `docs/` (GitHub Pages/Jekyll)
- Ispirazione pattern BLoC: articolo Didier Boelens (link nel README)
- Owner unico: `@Allan-Nava` (`.github/CODEOWNERS`)
