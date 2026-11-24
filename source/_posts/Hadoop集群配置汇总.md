---
layout: blog
title: Hadoop集群配置汇总
date: 2024-10-12 22:40:30
tags:
- big data
- 分布式计算
- 存储
categories: 
- [数据科学与数据开发]
---

## 汇总目的

1. 老师给的参考教程看的头大
2. 畅哥在用Ubuntu，之前自己都很懒用的配置好的Centos7，所以决定学一学Ubuntu系统

## 啥是伪分布式？与集群有啥区别？

伪分布式模式是一种在单节点上模拟多节点运行的方式，‌Hadoop进程以分离的‌Java进程运行，节点既作为‌NameNode也作为DataNode，同时读取‌HDFS中的文件。这种模式虽然不是真正的分布式，但可以在单台机器上模拟多节点环境，方便调试和理解分布式系统的运行机制。

在分布式部署中，Hadoop集群由多台计算机组成，每台计算机都可以独立运行Hadoop的各个组件，如HDFS（Hadoop分布式文件系统）和MapReduce。数据会被分散存储在不同的节点上，任务也会并行执行在不同的节点上，从而提高了整个系统的性能和可靠性。

我是这样理解的：严格意义上来讲，一台计算机中开多台虚拟机属于伪分布式操作；但是多虚拟机恰恰模拟出了多计算机的效果，所以叫它集群配置。真正的分布式最好的例子就是阿里云买三台服务器，统一配置，最直观，可惜成本最大。。。。

## 操作系统的选择

Ubuntu	18.04/22.04

Centos7	

## 虚拟机的选择

Vmare

Virtual Box

云服务器

推荐的组合：Centos7+Vmare、Vmare+Ubuntu、云服务器(单机版，集群费用成本太高)

# 以下都是高质量教程(我的除外)

## 基于Ubuntu的集群搭建详细教程

### 高质量博客推荐

厦门大学林子雨老师的大数据博客网站非常不错，里面文章内容也非常有料：

https://dblab.xmu.edu.cn/blog/category/big-data/

老师秉持着开源精神，将大部分资源全部开源了，推荐给每一个我的博客的读者！！！羊毛该薅就得薅

### 简略版本：

https://dblab.xmu.edu.cn/blog/94/

### 集群版本：

https://dblab.xmu.edu.cn/blog/8/

### 伪分布式版本：

https://dblab.xmu.edu.cn/blog/7/

### CSDN-blog教程：

金州饿霸: https://blog.csdn.net/wangjian530/article/details/142781899

## 基于Centos7的集群搭建详细教程

### 伪分布式版本：

https://dblab.xmu.edu.cn/blog/190/

### 我自己的配置(不详细、慎重参考)

#### 配置core-site.xml

~~~shell
[root@node1 hadoop]# vim core-site.xml
<configuration>
<!-- 指定HDFS 中NameNode 的地址-->
<property>
    <name>fs.defaultFS</name>
    <value>hdfs://node1:8020</value>
</property>
<!-- 指定Hadoop 运行时产生文件的存储目录-->
<property>
    <name>hadoop.tmp.dir</name>
    <value>/export/server/hadoop-3.3.0/data</value>
</property>
<!-- 在web UI访问HDFS使用的用户名 -->
<property>
    <name>hadoop.http.staticuser.user</name>
    <value>root</value>
</property>
~~~

配置hdfs-site.xml

~~~shell
[root@node1 hadoop]# vim hdfs-site.xml
<!-- 指定Hadoop 辅助名称节点主机配置-->
<property>
    <name>dfs.namenode.secondary.http-address</name>
    <value>node2:9868</value>
</property>
~~~

#### 配置mapred-site.xml

~~~shell
[root@node1 hadoop]# vim mapred-site.xml
<configuration>
    <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
<!-- 指定MR 运行在YARN 上-->
<property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
</property>

<!-- MR App Master环境变量 -->
<property>
    <name>yarn.app.mapreduce.am.env</name>
    <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>

<!-- MR MapTask环境变量 -->
<property>
    <name>mapreduce.map.env</name>
    <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<!-- MR ReduceTask环境变量 -->
<property>
    <name>mapreduce.reduce.env</name>
    <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
</configuration> 
~~~

#### 配置yarn-site.xml

~~~shell
[root@node1 hadoop]# vim yarn-site.xml
<configuration>
<!-- Reducer 获取数据的方式-->
<property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
</property>

<!-- 指定YARN 的ResourceManager 的地址-->
<property>
    <name>yarn.resourcemanager.hostname</name>
    <value>node1</value>
</property>

<!-- 服务器请求最小内存 -->
<property>
    <name>yarn.scheduler.minimum-allocation-mb</name>
    <value>512</value>
</property>

<!-- 服务器请求最大内存 -->
<property>
    <name>yarn.scheduler.maximum-allocation-mb</name>
    <value>2048</value>
</property>

<!-- 容器虚拟内存与物理内存之间的比率 -->
<property>
    <name>yarn.nodemanager.vmem-pmem-ratio</name>
    <value>4</value>
</property>
</configuration>
~~~

#### 配置workers

~~~shell
[root@node1 hadoop]# vim workers 
node1
node2
node3
~~~

#### 配置hadoop-env.sh

~~~shell
[root@node1 hadoop]# vim hadoop-env.sh
export JAVA_HOME=/export/server/jdk1.8.0_241

export HDFS_NAMENODE_USER=root
export HDFS_DATANODE_USER=root
export HDFS_SECONDARYNAMENODE_USER=root
export YARN_RESOURCEMANAGER_USER=root
export YARN_NODEMANAGER_USER=root
~~~

#### 配置环境变量

~~~shell
[root@node1 hadoop]# vim /etc/profile
export HADOOP_HOME=/export/server/hadoop-3.3.0
export PATH=$PATH:${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin
~~~



#### 配置文件传输到其他节点

~~~shell
[root@node1 server]# scp -r /etc/profile node2:$PWD  
[root@node1 server]# scp -r /etc/profile node3:$PWD
[root@node1 server]# scp /etc/profile node2:/etc 
[root@node1 server]# scp /etc/profile node3:/etc
~~~

格式化与一键启动

~~~shell
#只能格式化一次
[root@node1 hadoop-3.3.0]# bin/hdfs namenode -format

[root@node1 sbin]# start-dfs.sh
[root@node1 sbin]# stop-dfs.sh
[root@node1 sbin]# start-yarn.sh
[root@node1 sbin]# stop-yarn.sh
#一键启动YARN、HDFS
start-all.sh
#一键关闭YARN、HDFS
start-all.sh

#单独启动或关闭集群
hdfs -daemon start namenode
hdfs -daemon stop namenode
hdfs -daemon start datanode
hdfs -daemon stop datanode
~~~





