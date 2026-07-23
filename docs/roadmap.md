# Roadmap — Vanilla-BLoC-Extension

Milestone per versione. Dettaglio degli item in [`backlog.md`](backlog.md).
Ogni milestone = una release taggata `vX.Y.Z` (vedi `../CLAUDE.md` §Release).

| Milestone | Tema | Stato | Item |
|-----------|------|-------|------|
| **v0.1.0** | Correttezza — i comandi generano il file giusto e compilabile | ✅ rilasciata (tag `v0.1.0`) | VB-1 … VB-7, VB-19 |
| **v0.2.0** | Hardening & DX — test reali, cleanup, licenza/security | ✅ pronta per release | VB-8 … VB-14 |
| **v0.3.0** | Modernizzazione toolchain — vuln, TS/eslint, engine VSCode | 🔜 pianificata | VB-15 … VB-18 |

## Criteri di release

- **`v0.1.0`**: tutti i P0 chiusi, `npm run compile` + `npm run webpack` verdi,
  smoke test manuale dei 6 comandi (F5 → genera → ispeziona `.dart`).
- **`v0.2.0`**: suite di test che copre la generazione file; `SECURITY.md` e
  `LICENSE` reali.
- **`v0.3.0`**: `npm audit` senza high/critical; toolchain aggiornata.
