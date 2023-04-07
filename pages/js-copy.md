---
title: JavaScript 的引用与复制
date: 2019-04-08 13:35:57
description: ' '
categories:
  - notes
tags:
  - js
---

首先我们看下面这个例子：

```js
let age = 18
let age2 = age
console.log(age, age2)
```

我们会得到以下的值：

```js
18 18
```

这个相信大家都能很好理解。

那么如果我们改变 `age` 的值呢？输出会有什么变化？

```js
age = 20
console.log(age, age2)
```

我们会得到：

```js
20 18
```

看到这里大家就奇怪了，上面的结果都很正常啊。

但在 JavaScript 中是有例外的，对于普通数据类型如 integer，string，boolean 可以通过 `=` 来复制这个变量，但对于 array 和 object 数据类型，`=` 只能起到引用的效果。

大家可以看下面这个例子：

```js
let arr = ['wes', 'bob', 'faker']
let arr2 = arr
console.log(arr2, arr)
arr[2] = 'dean'
console.log(arr2, arr)
```

得到的结果是：

```js
;['wes', 'bob', 'faker'][('wes', 'bob', 'faker')][('wes', 'bob', 'dean')][('wes', 'bob', 'dean')]
```

我们会发现随着 `arr` 的改变，`arr2` 也会跟着改变。

说明 `arr2` 并没有复制 `arr` 的值，只是引用了它，它们都指向同一个内存中的值。

object 也是一样的：

```js
let obj = {
  age: 19,
  name: 'like',
  last: 'jam'
}
let obj2 = obj
console.log(obj, obj2)
obj.age = 50
console.log(obj, obj2)
```

得到的结果是：

```js
{age: 19, name: "like", last: "jam"} {age: 19, name: "like", last: "jam"}
{age: 50, name: "like", last: "jam"} {age: 50, name: "like", last: "jam"}
```

那么如何复制 array 和 object 呢？

复制 array 的方法：

方法 1：

```js
let arr2 = [].concat(arr)
```

方法 2：

```js
let arr2 = arr.slice()
```

方法 3：

```js
let arr2 = Array.from(arr)
```

方法 4：

```js
let arr2 = [...arr]
```

一般我们比较常用的是方法 3 和方法 4，方法 1 和方法 2 比较取巧，但都是可以达到复制 array 的目的的。

_ps: `[...arr]` 是 ES6 中的方法。_

复制 object 的方法：

方法 1：

```js
let obj2 = Object.assign({}, obj)
```

方法 2：

```js
let obj2 = { ...obj }
```

方法 1 和方法 2 都有个缺点，它们只会复制对象的第一层。

看下面这个例子：

```js
let obj = {
  number: 12,
  name: {
    first: 'bob',
    last: 'evil'
  }
}
let obj2 = Object.assign({}, obj)
obj.number = 50
console.log(obj, obj2)
```

我们会得到下面的结果：

```js
obj = {
  number: 50,
  name: {
    first: 'bob',
    last: 'evil'
  }
}

obj2 = {
  number: 12,
  name: {
    first: 'bob',
    last: 'evil'
  }
}
```

但如果我们改变第二层的值：

```js
obj.name.first = 'sam'
console.log(obj, obj2)
```

```js
obj = {
  number: 50,
  name: {
    first: 'sam',
    last: 'evil'
  }
}

obj2 = {
  number: 12,
  name: {
    first: 'sam',
    last: 'evil'
  }
}
```

我们发现对象第二层依旧是引用的，并没有实现复制。

那么怎么复制一个完整的 object 呢？

最简单的方法就是使用第三方函数库 lodash ，它提供了 clone 和 deepclone 完全可以满足日常的需求。

object 的复制因为要考虑到很多因素，我会另开一篇，专门整理。

完~
