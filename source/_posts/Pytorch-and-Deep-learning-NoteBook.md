---
layout: blog
title: Pytorch and Deep-learning NoteBook
date: 2024-09-28 16:06:09
index_img: https://ai-market.jp/wp-content/uploads/2024/06/PyTorch.png
tags:
- 机器学习
- 深度学习
categories: 
- [人工智能与深度学习]
---

{% note success %}

PyTorch与深度学习笔记，持续更新....

不要着急，扎扎实实打好基本功！

{% endnote %}

## 参考学习资料

小土堆-pytorch学习教程：https://www.bilibili.com/video/BV1hE411t7RN/?p=10&spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=f093c3d64ba399e149cbffa6cd31a7b0

李沐-动手学深度学习：https://www.bilibili.com/video/BV1wM4m117mp/?spm_id_from=333.337.search-card.all.click&vd_source=f093c3d64ba399e149cbffa6cd31a7b0

李宏毅深度学习教程LeeDL-Tutorial（苹果书）：https://github.com/datawhalechina/leedl-tutorial?tab=readme-ov-file

张贤同学pytorch学习笔记：https://pytorch.zhangxiann.com/

《pytorch实用教程(第二版)》https://tingsongyu.github.io/PyTorch-Tutorial-2nd/

## conda常用指令

~~~shell
# 创建环境
conda create -n your_env_name python=x.x(x.x为python版本)
eg: conda create -n pytorch_tutorial python=3.7
# 激活环境
source avtivate your_env_name
eg: source activate pytorch_tutorial
# 推出环境
source deactivate
# 删除环境
conda remove -n your_env_name -all
eg: conda remove -n pytorch_tutorial -all
# 查看已有的虚拟环境
conda env list / conda info -e
~~~

## PyTorch  CookBook

### PyTorch安装

CPU版本的安装：

~~~python
pip install torch torchvision torchaudio
~~~

GPU版本：

安装指令可以去官网查看与之适配的CUDA版本，选择合适的操作系统、编程语言与CUDA版本安装即可

https://pytorch.org/get-started/locally/

### PyTorch常用子文件

执行完pip install torch后，Torch的安装路径为：/Users/mungeryang/anaconda3/lib/python3.11/site-packages/torch，在程序中import torch其实是从安装路径中进行导入。

torch中重要的组件：

~~~shell
_pycache: 该文件夹存放python解释器生成的字节码,目的是通过牺牲一定的存储空间来提高加载速度
_C: 辅助C语言代码调用的一个模块,PyTorch的底层计算代码采用的是C++语言编写，并封装成库，供pytorch的python语言进行调用
include: 存放着上面描述底层计算所需的C++代码
lib: lib文件夹下包含大量的.lib .dll文件（分别是静态链接库和动态链接库）,torch文件夹中98%内容都在lib中
autograd: pytorch的核心模块与概念，它实现了梯度的自动求导，开发人员只需编写前向传播代码，反向传播部分由autograd自动实现
nn: 使用频率最高的模块，搭建网络的网络层就在nn.modules里边
onnx: pytorch模型转换到onnx模型表示的核心模块
optim: 优化使用的方法函数，都在optim文件夹中
utils: utils是各种软件工程中常见的文件夹，包含了各类常用工具，其中比较关键的是data文件夹，tensorboard文件夹
datasets: 常用的数据集写的数据读取函数，例如常见的cifar, coco, mnist,svhn,voc都是有对应的函数支持
torchvision:
models: 它里边存放了经典的、可复现的、有训练权重参数可下载的深度学习模型
ops: 视觉任务特殊的功能函数
transforms: transforms是pytorch自带的图像预处理、增强、转换工具
~~~

*菜鸟使用pytorch实现图像分类任务时可能考虑到的任务点*：

图像数据是哪用一行代码读取进来的？

transforms.Compose是如何工作对图像数据进行转换的？

ToTensor又有哪些操作？

如何编写Dataset？

DataLoader有什么功能？如何使用？有什么需要注意的？

模型如何按自己的数据流程搭建？

nn有哪些网络层可以调用？

损失函数有哪些？

优化器是如何更新model参数的？

学习率调整有哪些方法？如何设置它们的参数？

model.train()与model.eval()作用是什么？

optimizer.zero_grad()是做什么？为什么要梯度清零？

scheduler.step() 作用是什么？应该放在哪个for循环里？

## 核心板块 - Tensor

Pytorch中核心的数据结构就是张量——Tensor

张量表示的是一个多维数组，它是标量、向量、矩阵的拓展。标量(Scaler)是零维张量，向量(Vector)是一维张量，矩阵(Matrix)是二维张量，一个RGB数组是三维张量。

torch.Tensor的八大属性：

1. data: 多维数组
2. dtype: 多维数组的数据类型
3. shape: 多维数组的形状
4. device: tensor所在设备，cpu或GPU
5. grad,  grad_fn, is_leaf, requires_grad: 梯度计算中需要的

Pytorch训练的五大要素：数据、模型、损失函数、优化器、迭代训练

多维数组是主要的数据处理形式

## 数据模块 - DataSet、DataLoader、transforms

DataSet是一个抽象基类，提供给用户自定义数据读取方式，核心在于**getitem**方法中对数据的处理。

DataLoader是pytorch数据加载核心，包括了大乱数据、采样机制、多进程数据加载、组装Batch。

### DataSet类代码实战

虽然DataLoader是pytorch核心数据模块，但是改动最多与原数据最为接近的是DataSet。

DataSet类中核心功能：

1. **getitem**：实现读取一个样本的功能。通常是传入索引，然后实现从磁盘中读取数据，并行处理数据，返回样本数据。getitem返回的数据会在dataloader中组装成一个batch。
2. **len**：返回数据集大小

Dataset负责与磁盘打交道，将磁盘上的数据读取并预处理好，提供给DataLoader，而DataLoader只需要关心如何组装成批数据，以及如何采样。

### DataLoader类代码实战



## 模型板块

nn.Module





## 创建简单的神经网络

使用Pytorch创建一个神经网络意味着创建一个新的类

~~~python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.optim import SGD

class BasicNet(nn.Module):
  def __init__(self):
    super(BasicNet,self).__init__()
    
    #初始化所有的权重和偏差
    self.w00 = nn.Parameter(torch.tensor(1.7), requires_gard = False)
    self.b00 = nn.Parameter(torch.tensor(-0.85), requires_gard = False)
    self.w01 = nn.Parameter(torch.tensor(-40.8), requires_gard = False)
    
    self.w10 = nn.Parameter(torch.tensor(12.6), requires_gard = False)
    self.b10 = nn.Parameter(torch.tensor(0.0), requires_gard = False)
    self.w11 = nn.Parameter(torch.tensor(2.7), requires_gard = False)
    
    self.final_bias = nn.Parameter(torch.tensor(-16.0), requires_grad = False)
    
  # 前向传播
  def forward(self,input):
    
    input_to_top_relu = input * self.w00 + self.b00
    top_relu_output = F.relu(input_to_top_relu)
    scaled_top_relu_output = top_relu_output * self.w01
    
    input_to_buttom_relu = input * self.w10 + self.b10
    buttom_relu_output = F.relu(input_to_buttom_relu)
    scaled_buttom_relu_output = buttom_relu_output * self.w11
    
    input_to_final_relu = scaled_top_relu_output + scaled_buttom_relu_output + self.final_bias
    output = F.relu(input_to_final_relu)
    
    return output
  
input_doses = torch.linspace(start = 0,end = 1,step = 11)
model = BasicNet()
output = model(input_doses)
~~~

从创建网络到训练的完整流程：

~~~python
# 创建神经网络
class BasicNet(nn.Module):
  def __init__(self):
    super(BasicNet,self).__init__()
    
    #初始化所有的权重和偏差
    self.w00 = nn.Parameter(torch.tensor(1.7), requires_gard = False)
    self.b00 = nn.Parameter(torch.tensor(-0.85), requires_gard = False)
    self.w01 = nn.Parameter(torch.tensor(-40.8), requires_gard = False)
    
    self.w10 = nn.Parameter(torch.tensor(12.6), requires_gard = False)
    self.b10 = nn.Parameter(torch.tensor(0.0), requires_gard = False)
    self.w11 = nn.Parameter(torch.tensor(2.7), requires_gard = False)
    
    self.final_bias = nn.Parameter(torch.tensor(0.0), requires_grad = True)
    
  # 前向传播
  def forward(self,input):
    
    input_to_top_relu = input * self.w00 + self.b00
    top_relu_output = F.relu(input_to_top_relu)
    scaled_top_relu_output = top_relu_output * self.w01
    
    input_to_buttom_relu = input * self.w10 + self.b10
    buttom_relu_output = F.relu(input_to_buttom_relu)
    scaled_buttom_relu_output = buttom_relu_output * self.w11
    
    input_to_final_relu = scaled_top_relu_output + scaled_buttom_relu_output + self.final_bias
    output = F.relu(input_to_final_relu)
    
    return output

# 定义优化器
optimizer = SGD(model.parameters(),lr = 0.1)

# 模型训练
for epoch in range(100):
  
  total_loss = 0.0
  
  for iteration in range(len(inputs)):
    input_i = inputs[iteration]
    label_i = labels[iteration]
    output_i = model(input_i)
    
    loss = (output_i - label_i) ** 2
    
    loss.backward()
    total_loss += float(loss)
    
	if(total_loss < 0.0001):
    print("Num steps:" + str(epoch))
  	break
  optimizer.step()
  optimizer.zero_grad()
  
  print("Step: " + str(epoch) + "Final bias: " + str(model.final_bias) + "\n")

~~~







