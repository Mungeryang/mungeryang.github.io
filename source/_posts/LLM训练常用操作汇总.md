---
layout: blog
title: LLM训练常用操作-从训练到崩溃
date: 2024-11-22 13:58:17
index_img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbV0nsS-UXj2CFrm4REkgNl0D3o7Oa5SGIdQ&s
tags:
  - LLM
  - 部署
  - RAG
categories: 
- [大模型相关]
---

## Conda相关

### 虚拟环境

~~~shell
#创建虚拟环境(指定python版本)
(base) root@I1dc83206c700201ce5:~/Echo/EchoSight# conda create --name echosight python=3.10

#激活虚拟环境
(base) root@I1dc83206c700201ce5:~/Echo/EchoSight# conda activate echosight
(echosight) root@I1dc83206c700201ce5:~/Echo/EchoSight#

#退出虚拟环境
(echosight) root@I1dc83206c700201ce5:~/Echo/EchoSight# conda deactivate echosight
(base) root@I1dc83206c700201ce5:~/Echo/EchoSight#

#查看虚拟环境列表
(base) root@I1dc83206c700201ce5:~/Echo/EchoSight# conda env list

#删除虚拟环境
(base) root@I1dc83206c700201ce5:~/Echo/EchoSight# conda remove --name echosight --all


~~~

## Git

引用自ACwing笔记：

### git基本概念

工作区：仓库的目录。工作区是独立于各个分支的。

暂存区：数据暂时存放的区域，类似于工作区写入版本库前的缓存区。暂存区是独立于各个分支的。

版本库：存放所有已经提交到本地仓库的代码版本。

版本结构：树结构，树中每个节点代表一个代码版本。

### 常用指令

~~~shell
git config --global user.name xxx：设置全局用户名，信息记录在~/.gitconfig文件中
git config --global user.email xxx@xxx.com：设置全局邮箱地址，信息记录在~/.gitconfig文件中
git init：将当前目录配置成git仓库，信息记录在隐藏的.git文件夹中
git add XX：将XX文件添加到暂存区
git add .：将所有待加入暂存区的文件加入暂存区
git rm --cached XX：将文件从仓库索引目录中删掉
git commit -m "给自己看的备注信息"：将暂存区的内容提交到当前分支
git status：查看仓库状态
git diff XX：查看XX文件相对于暂存区修改了哪些内容
git log：查看当前分支的所有版本
git reflog：查看HEAD指针的移动历史（包括被回滚的版本）
git reset --hard HEAD^ 或 git reset --hard HEAD~：将代码库回滚到上一个版本
git reset --hard HEAD^^：往上回滚两次，以此类推
git reset --hard HEAD~100：往上回滚100个版本
git reset --hard 版本号：回滚到某一特定版本
git checkout — XX或git restore XX：将XX文件尚未加入暂存区的修改全部撤销
git remote add origin git@git.acwing.com:xxx/XXX.git：将本地仓库关联到远程仓库
git push -u (第一次需要-u以后不需要)：将当前分支推送到远程仓库
git push origin branch_name：将本地的某个分支推送到远程仓库
git clone git@git.acwing.com:xxx/XXX.git：将远程仓库XXX下载到当前目录下
git checkout -b branch_name：创建并切换到branch_name这个分支
git branch：查看所有分支和当前所处分支
git checkout branch_name：切换到branch_name这个分支
git merge branch_name：将分支branch_name合并到当前分支上
git branch -d branch_name：删除本地仓库的branch_name分支
git branch branch_name：创建新分支
git push --set-upstream origin branch_name：设置本地的branch_name分支对应远程仓库的branch_name分支
 --set-upstream-to=origin/branch_name1 branch_name2：将远程的branch_name1分支与本地的branch_name2分支对应
git checkout -t origin/branch_name 将远程的branch_name分支拉取到本地
git stash：将工作区和暂存区中尚未提交的修改存入栈中
git stash apply：将栈顶存储的修改恢复到当前分支，但不删除栈顶元素
git stash drop：删除栈顶存储的修改
git stash pop：将栈顶存储的修改恢复到当前分支，同时删除栈顶元素
git stash list：查看栈中所有元素
~~~



## Hugging Face

### Access authority

Hugging  Face拉取模型-恒源云服务器为例

服务器上要开启AI学术加速，对于GitHub、hugging face等网站可以实现上传、下载加速

~~~shell
(base) root@I1dc83206c700201ce5:/hy-tmp/EchoProject/LLM-model#export https_proxy=http://turbo.gpushare.http_proxy=http://turbo.gpushare.com:30000
(base) root@I1dc83206c700201ce5:/hy-tmp/EchoProject/LLM-model#export https_proxy=http://turbo2.gpushare.http_proxy=http://turbo2.gpushare.com:30000
~~~

由于Hugging  Face属于国外网站，正常访问需要科学上网，所以使用git clone时同样也需要**ssh认证**

~~~shell
#ssh秘钥创建
(base) root@I1dc83206c700201ce5:~/.ssh# ssh-keygen -t ed25519 -C "youremail@gmail.com"

#复制公钥给Hugging Face设置
(base) root@I1dc83206c700201ce5:~/.ssh# ls
authorized_keys  id_ed25519  id_ed25519.pub
(base) root@I1dc83206c700201ce5:~/.ssh# vim id_ed25519.pub 

# 运行报错
# OSError: We couldn't connect to 'https://huggingface.co' to load this file, couldn't find it in the cached files and it looks like BAAI/EVA-CLIP-8B is not the path to a directory containing a file named config.json.
(echosight) root@I1dc83206c700201ce5:/hy-tmp/EchoProject/hf-llm/Mistral-7B-Instruct-v0.2# cd /usr/local/miniconda3/envs/echosight/lib/python3.10/site-packages/huggingface_hub/
(echosight)root@I1dc83206c700201ce5:/usr/local/miniconda3/envs/echosight/lib/python3.10/site-packages/huggingface_hub/# ls
(echosight)root@I1dc83206c700201ce5:/usr/local/miniconda3/envs/echosight/lib/python3.10/site-packages/huggingface_hub/# vim constants.py
# 修改constants.py里面的hugging face参数为镜像网站
HUGGINGFACE_CO_URL_HOME = "https://hf-mirror.com/"
_HF_DEFAULT_ENDPOINT = "https://hf-mirror.com/"
~~~

### 拉取仓库模型

首先在hf官网创建model的token，之后提供两种方式下载模型到服务器或者本地

第一种方法：使用huggingface_hub直接下载

~~~python
from huggingface_hub import snapshot_download
# snapshot_download(repo_id="decapoda-research/llama-7b-hf")
snapshot_download(repo_id="THUDM/chatglm3-6b")
~~~

第一种方法：使用huggingface-cli下载

~~~shell
(echosight)root@I1dc83206c700201ce5:/hy-tmp/# huggingface-cli download --resume-download <repo/name> --local-dir <path/to/local/dir>
~~~

- <repo/name>：替换为你要下载的Hugging Face Hub上的模型或数据集的仓库名称
- <path/to/local/dir>：替换为你想要保存模型或数据集的本地目录路径
- `–resume-download`：可以尝试恢复一个之前中断的下载，这个选项特别有用，当你的网络连接不稳定，或者下载过程中因为某种原因被中断



## Ollama常用操作

~~~shell
# 启动服务
ollama serve

# 显示模型信息
ollama show

# 运行模型
ollama run model

# 从注册表中拉取模型
ollama pull modelname

# 列出模型
ollama list

# 删除模型
ollama rm modelname

# 模型使用提示符
/set | set session variables
/show | show model information
/load <model> | load a session or model
/save <model> | save your current session
/clear | clear session context
/bye | exit
/? /help | help for a command
~~~











