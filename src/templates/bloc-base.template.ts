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
