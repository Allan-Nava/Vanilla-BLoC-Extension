/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * bloc-base.template.ts
 * Created  20/05/2020.
 * Updated  20/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
import * as changeCase from "change-case";
///
export function getBlocBaseTemplate(blocName: string,): string {
    return getDefaultBlocBaseTemplate(blocName);
  }
  function getDefaultBlocBaseTemplate(blocName: string) {
    const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    const blocState = `${pascalCaseBlocName}State`;
    const blocEvent = `${pascalCaseBlocName}Event`;
    return `
  import 'package:flutter/material.dart';

abstract class BlocBase {
  void dispose();
}

class BlocProvider<T extends BlocBase> extends StatefulWidget {
  BlocProvider({
    Key key,
    @required this.child,
    @required this.bloc,
  }): super(key: key);

  final Widget child;
  final T bloc;

  @override
  _BlocProviderState<T> createState() => _BlocProviderState<T>();

  static T of<T extends BlocBase>(BuildContext context){
    _BlocProviderInherited<T> provider = context.getElementForInheritedWidgetOfExactType<_BlocProviderInherited<T>>()?.widget;

    return provider?.bloc;
  }
}

class _BlocProviderState<T extends BlocBase> extends State<BlocProvider<T>>{
  @override
  void dispose(){
    widget.bloc?.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context){
    return new _BlocProviderInherited<T>(
      bloc: widget.bloc,
      child: widget.child,
    );
  }
}

class _BlocProviderInherited<T> extends InheritedWidget {
  _BlocProviderInherited({
    Key key,
    @required Widget child,
    @required this.bloc,
  }) : super(key: key, child: child);

  final T bloc;

  @override
  bool updateShouldNotify(_BlocProviderInherited oldWidget) => false;
}
`;
}