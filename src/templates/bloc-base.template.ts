/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc-base.template.ts
 * Created  20/05/2020.
 * Updated  21/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
///
export function getBlocBaseTemplate(): string {
    return getDefaultBlocBaseTemplate();
}
function getDefaultBlocBaseTemplate() {
  let dateTime = new Date();
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
import 'package:flutter/material.dart';

typedef BlocBuilder<T> = T Function();
typedef BlocDisposer<T> = Function(T);

abstract class VanillaBlocBase {
  void dispose();
}

class VanillaBlocProvider<T extends VanillaBlocBase> extends StatefulWidget {
  VanillaBlocProvider({
    Key key,
    @required this.child,
    @required this.blocBuilder,
    this.blocDispose,
  }): super(key: key);

  final Widget child;
  final BlocBuilder<T> blocBuilder;
  final BlocDisposer<T> blocDispose;

  @override
  _VanillaBlocProviderState<T> createState() => _VanillaBlocProviderState<T>();

  static T of<T extends VanillaBlocBase>(BuildContext context){
    _VanillaBlocProviderInherited<T> provider = context.getElementForInheritedWidgetOfExactType<_VanillaBlocProviderInherited<T>>()?.widget;

    return provider?.bloc;
  }
}

class _VanillaBlocProviderState<T extends VanillaBlocBase> extends State<VanillaBlocProvider<T>>{

  T bloc;

  @override
  void initState() {
    super.initState();
    bloc = widget.blocBuilder();
  }

  @override
  void dispose(){
    if (widget.blocDispose != null){
      widget.blocDispose(bloc);
    } else {
      bloc?.dispose();
    }
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context){
    return new _VanillaBlocProviderInherited<T>(
      bloc: bloc,
      child: widget.child,
    );
  }
}

class _VanillaBlocProviderInherited<T> extends InheritedWidget {
  _VanillaBlocProviderInherited({
    Key key,
    @required Widget child,
    @required this.bloc,
  }) : super(key: key, child: child);

  final T bloc;

  @override
  bool updateShouldNotify(_VanillaBlocProviderInherited oldWidget) => false;
}
`;
}
