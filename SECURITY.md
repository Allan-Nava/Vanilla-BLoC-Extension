# Security Policy

## Supported Versions

Only the latest published release of **Vanilla BLoC Flutter** receives fixes.
Please upgrade to the newest version before reporting an issue.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

The extension runs locally in VS Code and only writes Dart scaffolding files to
the folder you choose — it makes no network calls and handles no credentials.
If you still find a security issue (for example a path-traversal or file-overwrite
concern in the generated paths):

1. **Do not** open a public GitHub issue for it.
2. Email the maintainer at **allannava95@gmail.com** with:
   - the extension version (`Vanilla BLoC Flutter` in the Extensions view),
   - VS Code version and OS,
   - clear reproduction steps and the impact.

You can expect an initial acknowledgement within about **7 days**. If the report
is confirmed, a fix will be released and the advisory noted in `CHANGELOG.md`;
if declined, you will get an explanation. Please allow a reasonable disclosure
window before making details public.
