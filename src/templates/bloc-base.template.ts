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

abstract class BlocVanillaBase {
  void dispose();
}

class BlocVanillaProvider<T extends BlocVanillaBase> extends StatefulWidget {
  BlocVanillaProvider({
    Key key,
    @required this.child,
    @required this.bloc,
  }): super(key: key);

  final Widget child;
  final T bloc;

  @override
  _BlocVanillaProviderState<T> createState() => _BlocVanillaProviderState<T>();

  static T of<T extends BlocVanillaBase>(BuildContext context){
    _BlocVanillaProviderInherited<T> provider = context.getElementForInheritedWidgetOfExactType<_BlocVanillaProviderInherited<T>>()?.widget;

    return provider?.bloc;
  }
}

class _BlocVanillaProviderState<T extends BlocVanillaBase> extends State<BlocVanillaProvider<T>>{
  @override
  void dispose(){
    widget.bloc?.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context){
    return new _BlocVanillaProviderInherited<T>(
      bloc: widget.bloc,
      child: widget.child,
    );
  }
}

class _BlocVanillaProviderInherited<T> extends InheritedWidget {
  _BlocVanillaProviderInherited({
    Key key,
    @required Widget child,
    @required this.bloc,
  }) : super(key: key, child: child);

  final T bloc;

  @override
  bool updateShouldNotify(_BlocVanillaProviderInherited oldWidget) => false;
}
`;
}
