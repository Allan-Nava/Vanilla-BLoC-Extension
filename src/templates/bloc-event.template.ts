/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc-event.template.ts
 * Created  20/05/2020.
 * Updated  20/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
import * as changeCase from "change-case";
///
export function getBlocEventTemplate(
    blocName: string,
  ): string {
    return getDefaultBlocEventTemplate(blocName);
}
///
function getDefaultBlocEventTemplate(blocName: string): string {
    const pascalCaseBlocName    = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName     = changeCase.snakeCase(blocName.toLowerCase());
    return `part of '${snakeCaseBlocName}_bloc.dart';
  @immutable
  abstract class ${pascalCaseBlocName}Event {}
  `;
}
///