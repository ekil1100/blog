---
title: 二叉树
description: ' '
date: 2019-04-08 13:53:43
categories:
  - algorithm
tags:
  - algorithem
  - binary tree
---

树是一种数据结构，用来模拟具有树状结构的数据集合。二叉树是指每个节点至多有两个子节点的树。

## 二叉树的遍历

二叉树常见有三种遍历方式：前序遍历（preorder traversal），中序遍历（inorder traversal），后序遍历（postorder traversal）。

实现二叉树的遍历有两种方法：递归和迭代。

_注：左 - 左子树， 右 - 右子数，中 - 根节点。_

### 前序遍历 - Preorder Traversal

遍历顺序 - 中左右

#### 前序递归

```python
def preorderTraversal(root):
    if root == None:
        return
    print(root.val)
    preorderTraversal(root.left)
    preorderTraversal(root.right)
    return
```

#### 前序迭代

```python
# Method 1
def preorderTraversal(root):
    stack = []
    if root == None:
        return
    stack.append(root)
    while stack:
        # 退出顶部节点
        temp = stack.pop()
        print(temp.val)
        # 利用栈后进先出的原理，先压入右子树，再压入左子树
        if temp.right:
            stack.append(temp.right)
        if temp.left:
            stack.append(temp.left)
    return

# Method 2
def preorderTraversal(root):
    stack = []
    if root == None:
        return
    stack.append(root)
    while stack:
        temp = stack.pop()
        print(temp.val)
        while temp.left:
            if temp.right:
                stack.append(temp.right)
            temp = temp.left
            print(temp.val)
        if temp.right:
            stack.append(temp.right)
    return
```

### 中序遍历 - Inorder Traversal

遍历顺序 - 左中右

#### 中序递归

```python
def preorderTraversal(root):
    if root == None:
        return
    preorderTraversal(root.left)
    print(root.val)
    preorderTraversal(root.right)
    return
```

#### 中序迭代

```python
def inorderTraversal(root):
    if not root:
        return
    stack = []
    temp = root
    while temp or stack:
        if temp:
            stack.append(temp)
            temp = temp.left
        else:
            temp = stack.pop()
            print(temp.val)
            temp = temp.right
    return
```

### 后序遍历 - Postorder Traversal

遍历顺序 - 左右中

#### 后序递归

```python
def preorderTraversal(root):
    if root == None:
        return
    preorderTraversal(root.left)
    preorderTraversal(root.right)
    print(root.val)
    return
```

#### 后序迭代

```python
def postorderTraversal(root):
    # 方案二：后序遍历有一种巧妙的方式：前序遍历根节点，先后将左右子节点压栈。
    # 这样的遍历顺序为：中，右，左。最后reverse结果，则遍历结果变为：左，右，中。
    stack = []
    if not root:
        return
    stack.append(root)
    while stack:
        temp = stack.pop()
        self.list.append(temp.val)
        if temp.left:
            stack.append(temp.left)
        if temp.right:
            stack.append(temp.right)
    self.list.reverse()
    return self.list
```
