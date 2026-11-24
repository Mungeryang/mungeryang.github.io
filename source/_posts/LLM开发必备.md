---
layout: blog
title: LLM开发必备
date: 2025-02-26 16:11:45
index_img: https://cdn.mos.cms.futurecdn.net/56FGudiPwbT8pAD3aSzJsm.jpg
tags:
  - LLM
  - 部署
  - RAG
categories: 
- [大模型相关]
---

2025年2月26日，星期三，晴，第50篇博客。

{% note danger %}
困扰的问题：在进行RAG、多模态检索的实践中难免要调用大模型，但是由于“网络”和注册等诸多因素，使得我们很难方便调用的Open API。
{% endnote %}

推荐一个API网站：https://www.dmxapi.com/ ，网站集成了当前主流的大模型的调用方法。

## openai接口

使用openai库调用大模型：

~~~python
from openai import OpenAI

# 1. 创建客户端 -> 将API密钥和base_url传给OpenAI对象
client = OpenAI(
    api_key="sk-........................",
    base_url="https://www.dmxapi.com/v1"
)

# 2. chat_completion -> 实现chat 
chat_completion = client.chat.completions.create(
    # message的形式是以列表存储的json串
    messages=[
        {
            "role": "user",
            "content": "9.11和9.12哪个更大？",
        }
    ],
    model="gpt-4o-mini"
)

print(chat_completion)
~~~

Embedding模型调用：

~~~python
import openai

# 设置openai密钥和基础URL
openai.api_key = "sk-*********************"
openai.base_url = "https://www.dmxapi.com/v1/" # 做嵌入时base_url后面要添加 /

def get_embedding(text):
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

text = "你好世界，我爱你！"

# 获取文本嵌入
embedding = get_embedding(text)

print(f"文本：{text}")
print(f"嵌入的向量维度：{len(embedding)}")
print(f"嵌入的向量前5个元素：{embedding[:6]}")
~~~

文本：你好世界，我爱你！
嵌入的向量维度：1536
嵌入的向量前5个元素：[0.02944854088127613, -0.059522904455661774, -0.03096095100045204, 0.06727617979049683, 0.013377008028328419]

langchain - Ollama调用嵌入模型：

~~~python
from langchain_community.embeddings import OllamaEmbeddings

# 使用本地Ollama运行嵌入模型
embed = OllamaEmbeddings(
    model='milkey/dmeta-embedding-zh',
)
~~~



## Deepseek API

opanai库也提供了Deepseek API的调用方法。

通过使用Deepseek API调用Deepseek - R1模型：

~~~python
client = OpenAI(api_key="sk-********",base_url="https://api.deepseek.com")
messages = [{"role": "user", "content": "9.11 and 9.8,which is greater?"}]
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    stream=False
)
# reasoning_content = response.choices[0].message.reasoning_content
content = response.choices[0].message.content
~~~









