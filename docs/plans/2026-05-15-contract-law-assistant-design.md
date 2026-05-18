# 合同法智能助手 - 设计文档

## 项目概述

一个帮助用户快速查询合同法条款、理解法律风险的静态网页工具。

## 核心功能

### 1. 条目速查
- 输入合同条目关键词
- 智能匹配相关法律条款
- 展示法条原文、解读、利益分析

### 2. 学习中心
- 按章节浏览合同法
- 深度解读每个条款
- 实际案例分析
- 学习进度标记

## 技术架构

### 技术栈
- HTML5 + CSS3 + JavaScript（原生）
- 纯静态应用，无框架依赖
- 数据存储：JSON文件 + localStorage

### 文件结构
```
contract-law-assistant/
├── index.html              # 主页
├── learning.html           # 学习中心
├── css/
│   ├── common.css          # 公共样式
│   ├── search.css          # 搜索页样式
│   └── learning.css        # 学习页样式
├── js/
│   ├── app.js              # 主应用逻辑
│   ├── search.js           # 搜索功能
│   ├── learning.js         # 学习功能
│   └── data-loader.js      # 数据加载
├── data/
│   ├── contract-law.json    # 合同法数据
│   └── keywords.json        # 关键词索引
└── assets/
    └── icons/               # 图标资源
```

## 数据结构

### 条款数据结构
```json
{
  "articles": [
    {
      "id": "article_52",
      "chapter": "第三章",
      "chapterTitle": "合同的效力",
      "articleNumber": "52",
      "title": "合同无效的法定情形",
      "content": "有下列情形之一的，合同无效...",
      "keywords": ["无效", "欺诈", "胁迫", "恶意串通"],
      "interpretation": "本条规定了合同无效的五种法定情形...",
      "interestAnalysis": {
        "partyA": "作为甲方，应注意避免...",
        "partyB": "作为乙方，可以主张..."
      },
      "cases": [
        {
          "title": "案例：XX合同纠纷",
          "summary": "...",
          "result": "法院判决..."
        }
      ],
      "relatedArticles": ["article_54", "article_56"]
    }
  ]
}
```

## 界面设计

### 主页（条目速查）
- 顶部导航：[合同法智能助手] [速查] [学习中心]
- 搜索框：支持自然语言输入
- 结果展示：相关法条卡片（原文 + 利益分析 + 详细解读按钮）

### 学习中心
- 左侧：章节导航树
- 右侧：条款详情（原文 + 解读 + 案例 + 笔记）

## 核心功能实现

### 1. 智能搜索
- 关键词提取
- 模糊匹配算法
- 相关度排序

### 2. 利益分析
- 甲方视角：风险点、注意事项
- 乙方视角：权益保护、应对策略

### 3. 学习进度
- localStorage存储已读条款
- 进度百分比显示
- 书签功能

### 4. 笔记功能
- 本地存储用户笔记
- Markdown支持

## 部署方案

- GitHub Pages / Vercel / Netlify
- 纯静态托管，无需服务器

## 后续优化方向

1. 数据爬取：从公开法律数据库自动获取法条
2. AI增强：接入AI进行智能解读
3. 用户反馈：收集用户反馈优化数据
4. 多法规支持：扩展到民法典、公司法等