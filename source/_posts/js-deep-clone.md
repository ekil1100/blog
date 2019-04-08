---
title: JavaScript 对象的深度拷贝
description: ' '
date: 2019-04-08 13:53:16
categories:
  - notes
tags:
  - js
---

## 浅克隆

在 javaScript 中 `=` 和 `Object.assign()` 包括 ES6 的 `spread operator` 都是浅克隆，`=` 只会对原对象进行引用，后两种方法只会对对象的第一层进行克隆。

## 深度克隆

深度克隆指生成一个独立的对象，和原对象之间不会互相影响。

对一个对象深度克隆，完全取决于你所要拷贝的数据类型。

```js
let obj = {
  a: 1,
  b: {
    c: 1
  }
}

let obj2 = JSON.parse(JSON.stringify(obj))
```

上面的例子是可以实现深度克隆的，但是它的缺陷是只能复制对象返回的值，不能对实例进行复制。

```js
let obj = {
  name: 'Bob',
  date: {
    now: new Date()
  }
}

let obj2 = JSON.parse(JSON.stringify(obj))
```

这个例子中，当我们要复制一个 Date 实例时，`JSON.parse(JSON.stringify(obj))` 只会先把实例返回的值转成字符串，然后再转换成对象，所有 Date 支持的方法和继承的方法都是没有被克隆的。最后的结果 `obj2.date.now` 只是一个字符串显示了你复制时的时间。

### 通过 [NodeJs Serialization API](https://nodejs.org/dist/latest-v10.x/docs/api/v8.html#v8_serialization_api) 实现深度克隆

可以使用 nodejs API 来实现深度克隆。v8 是 nodejs version 8 新加的库。其中包含了 `serialize` 和 `deserialize` 方法，实现深度克隆。

```js
const v8 = require('v8')

let obj = {
  name: 'Bob',
  date: {
    now: new Date()
  }
}

let obj2 = v8.deserialize(serialize(obj))
```

### 通过第三方函数库实现深度克隆

Loadash

```js
const cloneDeep = require('lodash.cloneDeep')

let obj2 = cloneDeep(obj)
```

类似的函数库还有很多，比如 Underscore，Ramda 都提供了 deep clone 的方法。

### 原理

Deep clone 并不是完美的，它依旧存在局限性。目前大部分方法都是基于[结构化克隆算法（The structured clone algorithm）](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)。
