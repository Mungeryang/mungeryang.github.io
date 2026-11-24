---
layout: blog
title: Multi-agent RAG Systems调研报告
date: 2024-12-18 09:08:02
index_img: https://weaviate.io/assets/images/Multi_Agent_RAG_System-73e480f62a52e172a78a0ac344dcdcb5.png
math: true
tags:
- RAG
- LLM
- 多模态
categories: 
- [人工智能与深度学习]
- [大模型相关]
---

# Agentic RAG调研报告—探索搭建适配多数据源的Multi-agent RAG System

## Multi-agent RAG架构设计

### 应用场景与需求

根据不同的知识库与应用特点构造了不同的**查询引擎**，它们面向不同的领域知识，采用了不同的索引(比如VectorIndex与GraphIndex)。我们需要给使用者(可能是人或应用)提供一致性体验，他们无须关心后端使用的真实查询引擎是哪一个，只需要输入问题即可获得正确的答案。$^{[1]}$

![Multi-agent RAG](./img/fig/agentrag.jpg)

### **适配多数据源**

计算机中的文档：`TXT文档`、`PDF文档`、`Office文档`

存储在多种类型数据库中的结构化数据、半结构化数据：`MySQL`、`PostageSQL`、`Redis`、`MongDB`

存储在图数据库中图数据：`Neo4j`

存储在向量数据库中的向量数据：`Milvus`、`Chroma`、`Elastic`

## 项目调研

1. https://docs.llamaindex.ai/en/stable/examples/agent/openai_agent_query_cookbook/ - OpenAI Agent + Query Engine Experimental Cookbook: 融合了vector_tool和sql_tool
1. https://github.com/karthik-codex/Autogen_GraphRAG_Ollama - GraphRAG + AutoGen + Ollama + Chainlit UI = Local Multi-Agent RAG Superbot：这个应用程序将 **GraphRAG** 与 **AutoGen** 代理集成在一起，由 Ollama 的本地LLM提供支持，可实现免费的离线嵌入和推理。





## 参考资料

[1] 基于大模型的RAG应用开发与优化—构建企业级LLM应用. 严灿平. 中国工信出版集团

[2] [RAG行业问答博客观点开源整理：从RAG评估、应用参考、开源框架到操作实践总结](https://mp.weixin.qq.com/s?__biz=MzAxMjc3MjkyMg==&mid=2648407123&idx=2&sn=80ddf495e6c08af3355d8bf4a5109328&chksm=83836f06b4f4e610a99aa86e9882b7416c8f3ff42519c7aaff7d99a8ce936493e43a623f6e83&scene=178&cur_album_id=3276284267911856128#rd)

[3] https://github.com/lizhe2004/Awesome-LLM-RAG-Application?tab=readme-ov-file
