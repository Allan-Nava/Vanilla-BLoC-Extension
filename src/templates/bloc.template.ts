/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc.template.ts
 * Created  20/05/2020.
 * Updated  20/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
import * as changeCase from "change-case";
///
export function getBlocTemplate(blocName: string,): string {
  return getDefaultBlocTemplate(blocName);
}
function getDefaultBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
  const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';
class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  @override
  ${blocState} get initialState => ${pascalCaseBlocName}Initial();
  @override
  Stream<${blocState}> mapEventToState(
    ${blocEvent} event,
  ) async* {
    // TODO: implement mapEventToState
  }
}
`;
}