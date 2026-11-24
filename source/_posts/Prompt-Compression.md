---
layout: blog
title: Prompt Compression
date: 2025-07-29 15:37:51
index_img: https://miro.medium.com/v2/resize:fit:1400/0*7IVmK73xcJdHjeb8.png
math: true
tags:
- LLM
categories: 
- [大模型相关]
- [论文研读]
---

# Prompt Compression for LLM - 提示压缩

提示词压缩提出的背景：大语言模型处理复杂的NLP任务需要详细的长格式提示信息

- [Prompt Compression for Large Language Models: A Survey](https://aclanthology.org/2025.naacl-long.368.pdf) ACL2025

提出问题：大模型进行复杂的NLP任务通常需要长上下文进行详细的提示，这会导致内存使用量和推理成本增加，提示压缩技术可以缓解长山下文所带来的挑战

主要方法：软提示(Soft Prompt)和硬提示(Hard Prompt)

提示压缩的机制：注意力最优化、参数的高效微调、模态融合、新合成语言视角

未来方向：优化压缩编码器、软硬提示结合方法、多模态见解

硬提示：移除低信息词元或进行同义词改写

软提示：将文本压缩成更少的特殊词元

提高大语言模型效率的方法大致分为两类：以模型为中心的方法和以提示为中心的方法；提示压缩最佳架构和潜在机制仍然不明确，凸显出了进一步研究的必要性。

提示压缩的基本机制有：注意力机制的修改、参数的高效微调、模态整合和新的合成语言

提示的结构：instruction, input, output format(指令-输入-输出格式)和context, question, answer format(上下文-问题-答案格式)

提示压缩主要的两种方法：删除不必要的或低信息量的内容 以及 在嵌入空间中学习提示信息的连续表示。

![prompt](https://moonlight-paper-snapshot.s3.ap-northeast-2.amazonaws.com/arxiv/prompt-compression-for-large-language-models-a-survey-2.png)

## 硬提示

从原始提示中移除不必要的词元，同时保持使用紫檀语言的词语和子词。这种方法对于仅接受自然语言输入的大语言模型特别有用，而不是词嵌入。

三种典型的硬提示方法：

- 过滤的SelectiveContext
- LLMLingua
- 用于改写 paraphrasing 的 Nano-Capsulator

![hard-prompt](https://github.com/ZongqianLi/Prompt-Compression-Survey/blob/main/Figures/hard_prompt_methods.png?raw=true)

### **SelectiveContext**

Compressing Context to Enhance Inference Efficiency of Large Language Models：https://arxiv.org/pdf/2310.06201

使用自信息量化词汇单元的信息量，识别并删除输入提示中的冗余或较少的信息部分。为了保持文本的连贯性，使用Spacy句法解析功能将单独词元分词为名词短语。SelectiveContext不依赖任何外部模型和额外参数，可以适用于任何模型架构。

SelectiveContext三个主要缺点：

- 过滤后的提示必须由大语言模型重新编码，限制了效率
- 依赖于Spacy的准确短语边界检测
- 目前没有合并动词短语的方法

### **LLMLingua**

LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models：https://arxiv.org/pdf/2310.05736

使用一个较小的语言模型(如GPT-2)来计算自信息和困惑度并在自然语言提示被输入到LLM之前删除冗余的词元。

LLMLingua对结构为{Instruction,Input,Question}的提示进行操作，根据困惑度得分选择关键的示例，然后在提示上应用词元级别过滤，允许将词语拆分成子词单元并避免名词短语合并。

对于数字和单位等关键元素，LLMLingua 结合了词元保留算法，优先考虑这些元素在指令和问题中的位置。

LLMLingua两大局限性：

- 较小的语言模型需要额外的内存，并且可能使用与较大 LLM 不同的词元分析器。
- 并非所有提示都包含大量上下文示例，因此区分提示压缩和上下文示例选择非常重要。

### **Nano-Capsulator**

本质上是微调一个Vicuna-7B作为摘要模型

将原始提示总结成简洁的自然语言版本，然后输入到 LLM。此过程会删除不相关信息，并将提示重 构为流畅的句子。

LongLLMLingua，它通过应用文档重排序和子序列恢复，具有比 LLMLingua 更长的压缩窗口

AdaComp根据查询复杂性和检索质量动态选择相关文档

LLMLingua-2 使用数据蒸馏创建压缩数据集，并训练分类器以保留关键词元

CPC 使用上下文感知嵌入对句子相关性进行排序

TCRA-LLM 使用嵌入进行摘要和语义压缩



## 软提示

处理向量的编码-解码架构

软提示由编码-解码架构组成：一个将提示压缩成较短的连续特殊标记序列的编码器，以及处理压缩后的提示以生成相应响应的解码器。

经典的软提示压缩架构：CC、GIST、Auto-Compressor、ICAE、500xCompressor、UniICL

![soft-prompt](https://github.com/ZongqianLi/Prompt-Compression-Survey/blob/main/Figures/soft_prompt_methods.png?raw=true)

### **CC**

是一种Decoder-Only方法，最小化跨词元序列的 Kullback-Leibler（KL）散度，训练一个较短的软提示以近似自然语言提示的输出分布，从而与期望的响应模式对齐。

缺点：每个软提示都是针对特定的自然语言提示进行唯一训练的，限制了 CC 的泛化能力，因为新提示需要从头开始重新训练。

### **GIST**

修改了LLM的注意力机制，一系列新的可训练词元，被追加在原始提示词元之后。新生成的词元只能关注压缩词元，从而在注意力流中实现分离。

原始提示→(经过编码器)压缩词元→(经过解码器)新词元

缺点：由于微调数据集中的提示较短，其受到最大压缩提示长度的限制。此外，压缩词元无法与原 始未微调的 LLM 一起使用，限制了其更广泛的应用。

### **Auto-Compressor**

原始提示被分为几个子提示，每次迭代中，子提示被压缩成一组少量的词元，然后将这些词元与一个新的子提示一起传递到下一次迭代进行进一步压缩。

缺点：训练过程耗时较长，且压缩后的词元无法被原始未调优的 LLM 使用。

**问题**：为什么压缩后的词元无法被LLM使用？？？

### **ICAE**

增加了压缩长度，并将冻结的 LLM作为解码器。它将长而信息丰富的上下文压缩成少量的词元，用于问答。问题本身保持未压缩，答案是基于压缩后的上下文和未压缩的问题生成的。

与 GIST 不同，GIST 压缩的是大约 30 个词元的低信息文本，专注于问题和指令，而 ICAE可以处理详细且复杂的上下文。

由于解码器冻结，压缩后的词元可以直接与原始LLM一起使用，无需微调。

缺点：压缩率相比GIST 有所下降，ICAE 在 Pile 数据集上进行训练和测试，该数据集可能与 LLM 的训练语料库重叠，引发了关于潜在数据泄露以及从 LLM 内存中检索答案的可能性的担忧。

### **500xCompressor**

探索了在高压缩比下的提示压缩，在编码器中使用可训练的 LoRA 参数，同时在解码器中保持原始 LLM 冻结。

与 ICAE 不同的是，500xCompressor 向解码器提供压缩词元的 K V 值，而不是词元本身，证明了K V值比嵌入向量保留了更多的详细信息，尤其是在高压缩比条件下。

### **xRAG**

使用一个冻结的嵌入模型作为编码器，仅在编码器和解码器大语言模型之间放置一个适配器，包含可训练参数。

xRAG 证明了当前的嵌入模型可以将信息压缩到单个词元中用于问答任务。虽然原始论文中测试了几种嵌入模型，但最终选择的是SFR-Embedding-Mistra(仍然基于大语言模型,需要大量内存)

缺点：xRAG 需要加载两个大语言模型和一个投影器，而 ICAE 和 500xCompressor 只需加载一个大语言模型和一组 LoRA 参数。

### **UniICL**

UniICL中唯一可训练的组件是位于编码器和解码器之间的投影器。它的编码器和解码器都使用的相同的冻结的大语言模型，从而在训练过程中减少梯度计算并节省加载大型语言模型的内存。

UniICL 中的压缩词元可以被视为各种上下文示例的嵌入，从而在选择上下文示例时无需额外的嵌入过程。

其它方法：COCOM、LLoCO、QGC

COCOM 和 LLoCO 使用微调的编码器-解码器设置，而 QGC 采用冻结的解码器。COCOM 和 LLoCO都是为 RAG 任务设计的：COCOM 将多个文档压缩成上下文嵌入组，并将它们一起输入解码器，而 LLoCO 存储并检索特定的 LoRA 参数以使解码器适应特定的文本类型和任务。
