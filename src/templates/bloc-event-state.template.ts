/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc-event-state.template.ts
 * Created  20/05/2020.
 * Updated  27/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (c) 2020-2026 Allan Nava. Licensed under the MIT License.
 *--------------------------------------------------------*/
///
export function getBlocEventStateTemplate(): string {
    return getDefaultBlocEventStateTemplate();
}
function getDefaultBlocEventStateTemplate() {
  const dateTime = new Date();
///
return `
/*---------------------------------------------------------
* Vanilla BLoC VSCode Extension
*
* bloc-event-state.dart
* Created  ${dateTime}.
* Updated  ${dateTime}.
* Author   Allan Nava.
* Created by Allan Nava.
* Copyright (c) 2020-2026 Allan Nava. Licensed under the MIT License.
*--------------------------------------------------------*/
import 'package:meta/meta.dart';
import 'package:rxdart/rxdart.dart';
import 'bloc_base.dart';

abstract class VanillaBlocEvent extends Object {}
abstract class VanillaBlocState extends Object {}

abstract class VanillaBlocEventStateBase<VanillaBlocEvent, VanillaBlocState> implements VanillaBlocBase {
  PublishSubject<VanillaBlocEvent> _eventController = PublishSubject<VanillaBlocEvent>();
  BehaviorSubject<VanillaBlocState> _stateController = BehaviorSubject<VanillaBlocState>();
  ///
  /// To be invoked to emit an event
  ///
  Function(VanillaBlocEvent) get emitEvent => _eventController.sink.add;
  ///
  /// Current/New state
  ///
  Stream<VanillaBlocState> get state => _stateController.stream;
  ///
  /// External processing of the event
  ///
  Stream<VanillaBlocState> eventHandler(VanillaBlocEvent event, VanillaBlocState currentState);
  ///
  /// initialState
  ///
  final VanillaBlocState initialState;
  //
  // Constructor
  //
  VanillaBlocEventStateBase({
    @required this.initialState,
  }){
    //
    // For each received event, we invoke the [eventHandler] and
    // emit any resulting newState
    //
    _eventController.listen((VanillaBlocEvent event){
      VanillaBlocState currentState = _stateController.value ?? initialState;
      eventHandler(event, currentState).forEach((VanillaBlocState newState){
        _stateController.sink.add(newState);
      });
    });
  }
  @override
  void dispose() {
    _eventController.close();
    _stateController.close();
  }
}
`;
}
