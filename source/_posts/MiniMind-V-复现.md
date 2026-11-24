---
layout: blog
title: MiniMind-V 复现
date: 2026-09-30 23:13:17
index_img: https://github.com/jingyaogong/minimind-v/blob/master/images/logo.png
tags:
  - LLM
  - 部署
  - 微调技术
  - RAG
categories: 
- [大模型相关]
---

# MiniMind-V源码学习

## 视觉编码器

VLM的输入依然是一段文本，其中包含特殊的`<image>`占位符。 在计算文本嵌入后，可以将图像编码器生成的向量投影到该占位符对应的嵌入部分，替换掉原先的占位符embedding。

```python
<image>\n这个图像中有什么内容？
```

在`minimind-v`中，使用64个`<|image_pad|>`组成的占位符代替图像（SigLIP2 P32 直接输出 64 个 patch token，经 MLP 投影为 64 个 visual token），因此`minimind-v`的prompt为：

```python
<|image_pad|><|image_pad|>...<|image_pad|>(×64)\n这个图片描述的是什么内容？
```

计算完embedding和projection，用视觉特征替换掉对应占位符的embedding后，整个计算过程到输出则和LLM部分没有差异。

![](https://github.com/jingyaogong/minimind-v/blob/master/images/minimind-v-input.jpg)







## 连接层



## 语言解码器
