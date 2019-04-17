---
title: JavsScript Array Method
description: ' '
date: 2019-04-08 13:53:32
categories:
  - notes
tags:
  - js
---

### Array.prototype.filter()

返回一个新的数组对象包含原对象中满足回调函数里判断条件的所有数据。

```js
let words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present']

let result = words.filter(word => word.length > 6)

console.log(result) // Array ["exuberant", "destruction", "present"]
```

### Array.prototype.map()

迭代数组，返回操作后的值。

```js
let array1 = [1, 4, 9, 16]

let map1 = array1.map(x => x * 2)

console.log(map1) // Array [2, 8, 18, 32]
```

### Array.prototype.sort()

默认把元素转换为字符串，然后比较它们 UTF-16 的值进行排序。

```js
let months = ['March', 'Jan', 'Feb', 'Dec']
months.sort()
console.log(months) // Array ["Dec", "Feb", "Jan", "March"]

let array1 = [1, 30, 4, 21]
array1.sort()
console.log(array1) // Array [1, 21, 30, 4]
```

compare function - 传入 sort 的函数，决定排序的顺序。

1. 如果返回的值小于 0，a 的下标小于 b 的下标，a 在 b 前面。
2. 如果返回的值大于 0，a 的下标大于 b 的下标，a 在 b 后面。
3. 如果返回的值等于 0，顺序不变。

```js
function compare(a, b) {
  if (a < b) return -1

  if (a > b) return 1

  // a == b
  return 0
}
```

数字排序

```js
let numbers = [4, 2, 5, 1, 3]
numbers.sort((a, b) => a - b)
console.log(numbers) // [1, 2, 3, 4, 5]
```

字符串排序

```js
let arr = ['Edward', 'Shargpe', 'And', 'The', 'Magnetic', 'Zeros']

arr.sort((a, b) => {
  let tempa = a.toUpperCase()
  let tempb = b.toUpperCase()
  if (tempa < tempb) return -1
  if (tempa > tempb) return 1
  return 0
})
```

### Array.prototype.reduce()

reduce() 方法会执行回调函数对每一个数据进行处理然后返回一个统一的结果。

```js
// 返回数组所有数字的和
let sum = [0, 1, 2, 3].reduce((accumulator, currentValue) => {
  return accumulator + currentValue
}, 0)
```

### Array.prototype.some()

some() 方法和 filter() 有点类似，只是返回的是个 boolean 值。测试是否至少有一个元素能通过测试。

### Array.prototype.every()

测试是否所有元素通过测试。

### Array.prototype.find()

查询并返回第一个满足条件的元素。

### Array.prototype.findIndex()

查询并返回第一个满足条件的元素的下标。
