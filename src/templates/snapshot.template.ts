/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * snapshot.template.ts
 * Created  20/05/2020.
 * Updated  20/05/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 *--------------------------------------------------------*/
///
import * as changeCase from "change-case";
///
export function getSnapshotTemplate(): string {
  return getDefaultSnapshotTemplate();
}
///
function getDefaultSnapshotTemplate() {
    return `import 'package:flutter/material.dart';

typedef SnapshotBuilder<T> = Widget Function(AsyncSnapshot<T>);

class SnapshotHelper<T> {
  final AsyncSnapshot<T> snapshot;

  SnapshotHelper._(this.snapshot);

  factory SnapshotHelper.of(AsyncSnapshot snapshot) =>
      SnapshotHelper._(snapshot);
  Widget getWidget(
      {SnapshotBuilder<T> onData,
      SnapshotBuilder<T> onError,
      SnapshotBuilder<T> onLoading}) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return onLoading(snapshot);
    } else if (snapshot.hasData && !snapshot.hasError) {
      return onData(snapshot);
    } else if (snapshot.hasError) {
      return onError(snapshot);
    }
    return null;
  }
}

//usage:
//StreamBuilder<YourDataType>(
//  stream: yourStream,
//  builder: (context, snapshot) =>
//    SnapshotHelper<YourDataType>.of(snapshot)
//      .getWidget(
//        onData:(snapshot) => yourOnData(),
//        onLoading:(snapshot) => yourOnLoading(),
//        onError:(snapshot) => yourOnError(),
//       )
// );    `
}