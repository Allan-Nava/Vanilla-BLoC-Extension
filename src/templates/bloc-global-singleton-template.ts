
/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc-global-singleton.template.ts
 * Created  21/05/2020.
 * Updated  21/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
export function getBlocGlobalSingletonTemplate(): string {
    return getBlocSingletonBaseTemplate();
}
function getBlocSingletonBaseTemplate() {
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
import 'package:rxdart/rxdart.dart';

class GlobalBloc {
///
/// Streams related to this BLoC
///
BehaviorSubject<String> _controller = BehaviorSubject<String>();
Function(String) get push => _controller.sink.add;
Stream<String> get stream => _controller;

///
/// Singleton factory
///
static final GlobalBloc _bloc = new GlobalBloc._internal();
factory GlobalBloc(){
    return _bloc;
}
GlobalBloc._internal();
///
/// Resource disposal
///
void dispose(){
    _controller?.close();
}
}
    
GlobalBloc globalBloc = GlobalBloc();
`;
}