---
layout: blog
title: Claude Code与codex使用
date: 2026-03-15 14:13:58
index_img: https://www.malwarebytes.com/wp-content/uploads/sites/2/2026/02/OpenClaw_logo.png?w=600
tags:
- RAG
- LLM
categories: 
- [论文研读]
- [人工智能与深度学习]
- [大模型相关]
---

## Claude Code 安装

```shell
npm install -g @anthropic-ai/claude-code
-----

 ~  claude -version                                                                     ok  14:15:30
2.1.129 (Claude Code)
```

##  .claude/settings.json  -> DeepSeekV4 配置                        

```shell
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-92bf447420bb42fdae0f3cae60ee015a",
    "ANTHROPIC_MODEL": "deepseek-v4-flash",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-flash",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  },
  "model": "opus",
  "extraKnownMarketplaces": {
    "paperspine-marketplace": {
      "source": {
        "source": "git",
        "url": "https://github.com/WUBING2023/PaperSpine.git"
      }
    }
  },
  "effortLevel": "xhigh",
  "enabledPlugins": {
    "paper-spine@paperspine-marketplace": true
  }
}
```
