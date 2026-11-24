---
layout: blog
title: Visual Document Retrieval最新综述
date: 2026-02-26 14:22:01
index_img: https://img.bim99.cn/ssd/ssd4/103/2026-02-25/103_17719952251826.webp
math: true
tags:
- MLLM
- VQA
categories: 
- [论文研读]
- [大模型相关]
---

## 要点提炼

视觉文档的主要特征：

1. 密集的文本内容

2. 复杂布局

3. 细粒度语义依赖

文章将现有方法(Method)总结归纳为三大范式：

- ❶作为检索基础的embedding模型
- ❷用于精炼初始检索结果的reranker模型
- ❸日益突出的RAG管道和智能体系统。

VDR领域的评估指标：

1. nDCG：通过考虑相关文档的位置来衡量排序质量
2. MRR：评估第一个相关文档的倒数排名的平均值
3. Recall@k：查询结果中相关文档排在前 k 名的比例



## 未来方向

### 重构架构范式

生成式检索 (Generative Retrieval)： 探索“自回归检索”范式，例如：Embed-via-answering： 通过让模型回答问题来提取嵌入向量。生成式软标记： 让模型生成不可读的“软标记（Soft Tokens）”来迭代优化表征。

混合专家模型 (Mixture of Experts, MoE)： 为不同的文档模态（如纯文本、复杂图表、音频等）训练专门的专家，提升处理异构数据的灵活性和专业性。

先思考再嵌入 (Think-then-Embed)： 在生成向量前，先让模型生成一段推理轨迹（Rationale），使得最终的嵌入向量包含深层逻辑信息。



### 性能-效率

自适应修剪与合并： 动态识别并丢弃文档中的冗余补丁，例如 DocPruner

Matryoshka表征学习： 训练具有层次化结构的嵌入向量，允许在推理时根据性能需求动态截断维度



### 交互式与 Agentic 检索

主动感知： 赋予 Agent 在检索页面后执行“缩放（Zoom-in）”、“裁剪（Crop）”等动作的能力，以获取细则知识。

深度研究工作流： 研究 Agent 如何分解复杂查询，并根据中间检索结果动态修正后续的搜索路径。

Agent 与 VDR 工具的协同设计： 不再是简单的调用，而是让检索器感知 Agent 的当前状态，提供更具上下文相关性的反馈。

