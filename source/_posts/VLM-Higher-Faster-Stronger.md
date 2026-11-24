---
layout: blog
title: VLM Higher,Faster,Stronger
date: 2026-07-09 22:12:18
index_img: https://huggingface.co/blog/assets/vlms2/vlms2.png
math: true
tags:
- 深度学习
- LLM
categories: 
- [人工智能与深度学习]
- [大模型相关]
---

>  基于对两篇hugging face Blog的学习梳理与摘录

## 视觉语言模型(Vision Language Model)

视觉语言模型是可以同时从图像和文本中学习的多模态模型，其属于生成模型，输入为图像和文本，输出为文本。其拥有广泛的应用，包括基于图像的聊天、根据指令的图像识别、视觉问答、文档理解、图像描述等。现有的大视觉语言模型在训练数据、图像编码方式等方面采用的方法很多样，因而其能力差异也很大。

![VLM](https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/vlm/visual.jpg)

开源视觉语言模型List(截止2024)：

|                             模型                             | 可否商用 | 模型尺寸 | 图像分辨率 |       其它能力       |
| :----------------------------------------------------------: | :------: | :------: | :--------: | :------------------: |
| [LLaVA 1.6 (Hermes 34B)](https://huggingface.co/llava-hf/llava-v1.6-34b-hf) |    ✅     |   34B    |  672x672   |                      |
| [deepseek-vl-7b-base](https://huggingface.co/deepseek-ai/deepseek-vl-7b-base) |    ✅     |    7B    |  384x384   |                      |
| [DeepSeek-VL-Chat](https://huggingface.co/deepseek-ai/deepseek-vl-7b-chat) |    ✅     |    7B    |  384x384   |         聊天         |
|   [moondream2](https://huggingface.co/vikhyatk/moondream2)   |    ✅     |   ~2B    |  378x378   |                      |
| [CogVLM-base](https://huggingface.co/THUDM/cogvlm-base-490-hf) |    ✅     |   17B    |  490x490   |                      |
|  [CogVLM-Chat](https://huggingface.co/THUDM/cogvlm-chat-hf)  |    ✅     |   17B    |  490x490   |      接地、聊天      |
|       [Fuyu-8B](https://huggingface.co/adept/fuyu-8b)        |    ❌     |    8B    |  300x300   |   图像中的文本检测   |
| [KOSMOS-2](https://huggingface.co/microsoft/kosmos-2-patch14-224) |    ✅     |   ~2B    |  224x224   | 接地、零样本目标检测 |
|        [Qwen-VL](https://huggingface.co/Qwen/Qwen-VL)        |    ✅     |    4B    |  448x448   |    零样本目标检测    |
|   [Qwen-VL-Chat](https://huggingface.co/Qwen/Qwen-VL-Chat)   |    ✅     |    4B    |  448x448   |         聊天         |
|     [Yi-VL-34B](https://huggingface.co/01-ai/Yi-VL-34B)      |    ✅     |   34B    |  448x448   |  双语 (英文、中文)   |

## VLM技术细节

视觉语言模型预训练的主要技巧是是统一图像和文本表征以将其输入给文本解码器用于文本生成。最常见且表现最好的模型通常由图像编码器、用于对齐图像和文本表征的嵌入投影子模型 (通常是一个稠密神经网络) 以及文本解码器按序堆叠而成。

![视觉语言模型典型结构](https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/vlm/vlm-structure.png)

例如，LLaVA 由 CLIP 图像编码器、多模态投影子模型和 Vicuna 文本解码器组合而成。作者将包含图像和描述文本的数据集输入 GPT-4，让其描述文本和图像生成相关的问题。作者冻结了图像编码器和文本解码器，仅通过给模型馈送图像与问题并将模型输出与描述文本进行比较来训练多模态投影子模型，从而达到对齐图像和文本特征的目的。在对投影子模型预训练之后，作者把图像编码器继续保持在冻结状态，解冻文本解码器，然后继续对解码器和投影子模型进行训练。这种预训练加微调的方法是训练视觉语言模型最常见的做法。

**大多数时候，我们不需要预训练视觉语言模型，仅需使用现有的模型进行推理，抑或是根据自己的场景对其进行微调。**







