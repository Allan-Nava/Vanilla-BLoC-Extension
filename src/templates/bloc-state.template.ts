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
    let dateTime = new Date()
    return `
/*---------------------------------------------------------
* Vanilla BLoC VSCode Extension
*
* bloc_base.dart
* Created  ${dateTime}.
* Updated  ${dateTime}.
* Author   Allan Nava.
* Created by Allan Nava.
* Copyright (C) Allan Nava. All rights reserved.
*--------------------------------------------------------*/
part of '${snakeCaseBlocName}_bloc.dart';
@immutable
abstract class ${pascalCaseBlocName}State {}
class ${pascalCaseBlocName}Initial extends ${pascalCaseBlocName}State {}
  `;
}
///