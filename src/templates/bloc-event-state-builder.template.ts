/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc-event-state-builder.template.ts
 * Created  26/05/2020.
 * Updated  26/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
export function getBlocEventStateTemplate(): string {
    return getDefaultBlocEventStateTemplate();
}
function getDefaultBlocEventStateTemplate() {
  let dateTime = new Date();
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
* Copyright (C) Allan Nava. All rights reserved.
*--------------------------------------------------------*/
import 'package:flutter/material.dart';

typedef Widget AsyncBlocEventStateBuilder<VanillaBlocState>(BuildContext context, VanillaBlocState state);

class VanillaBlocEventStateBuilder<VanillaBlocEvent,VanillaBlocState> extends StatelessWidget {
  const VanillaBlocEventStateBuilder({
    Key key,
    @required this.builder,
    @required this.bloc,
  }): assert(builder != null),
      assert(bloc != null),
      super(key: key);

  final VanillaBlocEventStateBase<VanillaBlocEvent,VanillaBlocState> bloc;
  final AsyncBlocEventStateBuilder<VanillaBlocState> builder;

  @override
  Widget build(BuildContext context){
    return StreamBuilder<VanillaBlocState>(
      stream: bloc.state,
      initialData: bloc.initialState,
      builder: (BuildContext context, AsyncSnapshot<VanillaBlocState> snapshot){
        return builder(context, snapshot.data);
      },
    );
  }
}
`;
}
