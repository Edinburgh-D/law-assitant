# 合同法智能助手

一个帮助用户快速查询合同法条款、理解法律风险的静态网页工具。

## 功能特性

- 条目速查：输入合同条目，智能匹配相关法律条款
- 学习中心：按章节浏览合同法，深度解读每个条款
- 利益分析：针对甲方/乙方展示风险点和建议
- 学习进度：记录已读条款，支持笔记功能
- SQL 查询：支持完整的 SQL 查询，查询速度快

## 技术栈

- HTML5 + CSS3 + JavaScript (原生)
- SQL.js：浏览器端 SQLite 数据库
- IndexedDB：数据持久化存储
- 纯静态应用，无需后端服务器

## 使用方法

1. 直接在浏览器中打开 `index.html`
2. 或部署到 GitHub Pages / Vercel / Netlify

## 数据来源

合同法数据存储在 SQLite 数据库中，可根据需要更新。

## SQL.js 说明

SQL.js 是 SQLite 的 JavaScript 实现，通过 WebAssembly 在浏览器中运行完整的 SQLite 数据库，支持所有标准 SQL 查询功能。