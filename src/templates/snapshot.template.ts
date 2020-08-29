/*---------------------------------------------------------
 * Vanilla BLoC VSCode Extension
 *
 * snapshot.template.ts
 * Created  20/05/2020.
 * Updated  09/07/2020.
 * Author   Allan Nava.
 * Created by Allan Nava.
 * Copyright (C) Allan Nava. All rights reserved.
 * 
 * Code provided by magicleon94
 * https://gist.github.com/magicleon94/8ae4f73d42fe6c60c5f1f5c08fc20b39
 * A simple helper to map states of a snapshot coming from a StreamBuilder 
 * 
 *--------------------------------------------------------*/
///
import * as changeCase from "change-case";
///
export function getSnapshotTemplate(): string {
  return getDefaultSnapshotTemplate();
}
///
function getDefaultSnapshotTemplate() {
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
import 'package:flutter/material.dart';

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
    if (snapshot.hasError) {
      return onError(snapshot);
    } else if (snapshot.connectionState == ConnectionState.waiting) {
      return onLoading(snapshot);
    } else if (snapshot.connectionState == ConnectionState.active &&
        !snapshot.hasData) {
      return onLoading(snapshot);
    } else if (snapshot.hasData && !snapshot.hasError) {
      return onData(snapshot);
    }
    return null;
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
