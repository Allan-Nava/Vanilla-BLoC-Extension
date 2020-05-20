/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc-state.template.ts
 * Created  20/05/2020.
 * Updated  20/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
import * as changeCase from "change-case";
///
export function getBlocStateTemplate(
    blocName: string,
  ): string {
    return getDefaultBlocStateTemplate(blocName);
}
///
function getDefaultBlocStateTemplate(blocName: string): string {
    const pascalCaseBlocName    = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName     = changeCase.snakeCase(blocName.toLowerCase());
    return `part of '${snakeCaseBlocName}_bloc.dart';
  @immutable
  abstract class ${pascalCaseBlocName}State {}
  class ${pascalCaseBlocName}Initial extends ${pascalCaseBlocName}State {}
  `;
}
///