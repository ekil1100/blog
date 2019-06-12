---
title: 键盘弹出时 Flutter 部件溢出问题
slug: fix-flutter-bottom-overflow
description: ' '
date: 2019-06-13 00:31:54
categories:
  - flutter
tags:
  - flutter
  - note
---

## 方案 1

- 把 `Column` 部件改为 `ListView` 并。
- 加上 `shrinkWrap: true` 属性达到垂直方向居中效果。
- 加上 `physics: NeverScrollableScrollPhysics()` 属性达到禁止滑动。
- 再在外层包 `Center` 达到横向居中。

```dart
class Example extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Form(
        child: Center(
          child: ListView(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            children: <Widget>[],
          ),
        ),
      ),
    );
  }
}
```

{% cdn QmeN9jDejVyDxuuZ4ux1VezvswxXrvSrjBsNfdbxQCYN4r, true %}

## 方案 2

在 `Column` 外层包 `SingleChildScrollView`。

```dart
class Example extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Form(
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: <Widget>[],
            ),
          ),
        ),
      ),
    );
  }
}
```

{% cdn QmSoUSCWMnbSRDf7YpBg1NmmZSrAX5UQKh7fmErfVNkty9, true %}

两者的区别就是 `ListView` 不是 flex 的，它会填满横向的宽度。而 `SingleChildScrollView` 不会。
