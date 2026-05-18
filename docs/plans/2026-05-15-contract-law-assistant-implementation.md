# 合同法智能助手 - 实施计划（SQL.js 版）

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个帮助用户快速查询合同法条款、理解法律风险的静态网页工具

**Architecture:** 纯前端单页应用，使用 SQL.js 在浏览器中运行 SQLite 数据库，支持完整的 SQL 查询，无需后端服务器

**Tech Stack:** 
- 前端: HTML5, CSS3, JavaScript (ES6+)
- 数据库: SQL.js（浏览器端 SQLite）
- 存储: IndexedDB（持久化数据库）

---

## 文件结构

```
contract-law-assistant/
├── index.html                 # 主入口文件
├── css/
│   ├── common.css            # 公共样式
│   ├── search.css            # 搜索页样式
│   └── learning.css          # 学习页样式
├── js/
│   ├── app.js                # 主应用逻辑
│   ├── database.js           # SQL.js 数据库管理
│   ├── search.js             # 搜索功能
│   ├── learning.js           # 学习功能
│   ├── utils.js              # 工具函数
│   └── sql-wasm.js           # SQL.js WASM 文件（从 CDN 加载）
├── data/
│   └── contract-law.db       # SQLite 数据库文件（预生成）
└── README.md                 # 项目说明
```

---

## Task 1: 项目初始化和 SQL.js 配置

**Files:**
- Create: `contract-law-assistant/index.html`
- Create: `contract-law-assistant/README.md`
- Create: `contract-law-assistant/css/common.css`
- Create: `contract-law-assistant/js/database.js`

- [ ] **Step 1: 创建项目目录结构**

```bash
mkdir -p contract-law-assistant/css
mkdir -p contract-law-assistant/js
mkdir -p contract-law-assistant/data
```

- [ ] **Step 2: 创建 README.md**

```markdown
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
```

- [ ] **Step 3: 创建基础 HTML 结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>合同法智能助手</title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/search.css">
    <link rel="stylesheet" href="css/learning.css">
</head>
<body>
    <div id="loading-screen" class="loading-screen">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在加载数据库...</div>
        </div>
    </div>
    
    <header class="header">
        <h1 class="header-title">合同法智能助手</h1>
        <nav class="nav">
            <a href="#search" class="nav-link active" data-page="search">速查</a>
            <a href="#learning" class="nav-link" data-page="learning">学习中心</a>
        </nav>
    </header>
    
    <main class="main">
        <section id="search-page" class="page active">
            <div class="search-container">
                <div class="search-box">
                    <div class="search-input-wrapper">
                        <input 
                            type="text" 
                            id="search-input" 
                            class="search-input" 
                            placeholder="输入合同条目关键词，如：无效、违约、解除..."
                            autocomplete="off"
                        >
                        <button id="search-btn" class="search-btn">查询</button>
                    </div>
                    <div class="search-tips">
                        💡 提示：支持多个关键词搜索，用空格分隔
                    </div>
                </div>
                <div id="search-results" class="search-results"></div>
            </div>
        </section>
        
        <section id="learning-page" class="page">
            <div class="learning-container">
                <nav class="chapter-nav" id="chapter-nav"></nav>
                <div class="content-area" id="content-area"></div>
            </div>
        </section>
    </main>
    
    <!-- SQL.js 从 CDN 加载 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/database.js"></script>
    <script src="js/search.js"></script>
    <script src="js/learning.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 4: 创建公共样式**

```css
/* css/common.css */
:root {
    --primary-color: #1890ff;
    --success-color: #52c41a;
    --warning-color: #faad14;
    --danger-color: #f5222d;
    --text-color: #333;
    --border-color: #d9d9d9;
    --bg-color: #f5f5f5;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    color: var(--text-color);
    background-color: var(--bg-color);
    line-height: 1.6;
}

/* 加载屏幕 */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-screen.hidden {
    display: none;
}

.loading-content {
    text-align: center;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    font-size: 16px;
    color: var(--text-color);
}

.header {
    background: white;
    padding: 16px 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-title {
    font-size: 24px;
    color: var(--primary-color);
}

.nav {
    display: flex;
    gap: 16px;
}

.nav-link {
    padding: 8px 16px;
    text-decoration: none;
    color: var(--text-color);
    border-radius: 4px;
    transition: all 0.3s;
}

.nav-link:hover {
    background-color: var(--bg-color);
}

.nav-link.active {
    background-color: var(--primary-color);
    color: white;
}

.main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

.page {
    display: none;
}

.page.active {
    display: block;
}

/* 模态框样式 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
}

.modal-close {
    font-size: 24px;
    cursor: pointer;
    color: #8c8c8c;
    transition: color 0.3s;
}

.modal-close:hover {
    color: var(--text-color);
}

.modal-body {
    padding: 24px;
}

.interest-section {
    margin-bottom: 24px;
}

.interest-section h4 {
    font-size: 16px;
    margin-bottom: 12px;
    color: var(--primary-color);
}

.interest-section p {
    line-height: 1.8;
    color: var(--text-color);
}

.case-item {
    margin-bottom: 20px;
    padding: 16px;
    background: #fafafa;
    border-radius: 4px;
    border-left: 3px solid var(--primary-color);
}

.case-item h4 {
    font-size: 16px;
    margin-bottom: 12px;
}

.case-item p {
    margin-bottom: 8px;
    line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header {
        flex-direction: column;
        gap: 12px;
    }
    
    .learning-container {
        grid-template-columns: 1fr;
    }
    
    .chapter-nav {
        position: static;
        max-height: 300px;
    }
    
    .interest-box {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 5: 创建 SQL.js 数据库管理模块**

```javascript
// js/database.js
const Database = {
    db: null,
    DB_NAME: 'contract_law_db',
    DB_VERSION: 1,
    
    // 初始化数据库
    async init() {
        console.log('开始初始化 SQL.js 数据库...');
        
        try {
            // 加载 SQL.js WASM
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });
            
            // 尝试从 IndexedDB 加载已保存的数据库
            const savedDb = await this.loadFromIndexedDB();
            
            if (savedDb) {
                console.log('从 IndexedDB 加载数据库');
                this.db = new SQL.Database(savedDb);
            } else {
                console.log('创建新数据库并填充数据');
                this.db = new SQL.Database();
                this.createTables();
                this.seedData();
                await this.saveToIndexedDB();
            }
            
            console.log('数据库初始化完成');
            return true;
        } catch (error) {
            console.error('数据库初始化失败:', error);
            throw error;
        }
    },
    
    // 创建表结构
    createTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS articles (
                id TEXT PRIMARY KEY,
                chapter TEXT NOT NULL,
                chapter_title TEXT NOT NULL,
                article_number INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                interpretation TEXT NOT NULL,
                party_a_analysis TEXT NOT NULL,
                party_b_analysis TEXT NOT NULL
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS keywords (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id TEXT NOT NULL,
                keyword TEXT NOT NULL,
                FOREIGN KEY (article_id) REFERENCES articles(id)
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS cases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id TEXT NOT NULL,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                result TEXT NOT NULL,
                FOREIGN KEY (article_id) REFERENCES articles(id)
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS related_articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id TEXT NOT NULL,
                related_article_id TEXT NOT NULL,
                FOREIGN KEY (article_id) REFERENCES articles(id)
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (article_id) REFERENCES articles(id)
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS learning_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (article_id) REFERENCES articles(id),
                UNIQUE(article_id)
            )
        `);
        
        // 创建索引
        this.db.run('CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_keywords_article ON keywords(article_id)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_articles_chapter ON articles(chapter)');
        
        console.log('表结构创建完成');
    },
    
    // 填充初始数据
    seedData() {
        // 插入条款
        const articles = [
            ['article_1', '第一章', '一般规定', 1, '立法目的', 
             '为了保护合同当事人的合法权益，维护社会经济秩序，促进社会主义现代化建设，制定本法。',
             '本条规定了合同法的立法目的，包括三个层面：保护当事人权益、维护经济秩序、促进现代化建设。',
             '了解立法目的有助于理解合同法的价值取向，在合同签订和履行中遵循公平原则。',
             '合同法保护双方合法权益，在争议解决时可以援引立法目的进行主张。'],
            
            ['article_2', '第一章', '一般规定', 2, '合同定义',
             '本法所称合同是平等主体的自然人、法人、其他组织之间设立、变更、终止民事权利义务关系的协议。婚姻、收养、监护等有关身份关系的协议，适用其他法律的规定。',
             '本条明确了合同的定义和适用范围。合同是平等主体之间的协议，涉及身份关系的协议不适用合同法。',
             '确认合同主体地位平等，避免利用优势地位订立不公平条款。',
             '明确合同适用范围，身份关系协议不适用合同法，需注意区分。'],
            
            ['article_52', '第三章', '合同的效力', 52, '合同无效的法定情形',
             '有下列情形之一的，合同无效：（一）一方以欺诈、胁迫的手段订立合同，损害国家利益；（二）恶意串通，损害国家、集体或者第三人利益；（三）以合法形式掩盖非法目的；（四）损害社会公共利益；（五）违反法律、行政法规的强制性规定。',
             '本条规定了合同无效的五种法定情形。无效合同自始没有法律约束力，当事人不需要履行。',
             '作为甲方，应注意避免欺诈、胁迫等行为，确保合同目的合法，避免损害公共利益。',
             '作为乙方，如果发现甲方存在欺诈、胁迫等情形，可以主张合同无效，保护自身权益。']
        ];
        
        articles.forEach(article => {
            this.db.run(`
                INSERT INTO articles (id, chapter, chapter_title, article_number, title, content, interpretation, party_a_analysis, party_b_analysis)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, article);
        });
        
        // 插入关键词
        const keywords = [
            ['article_1', '立法目的'], ['article_1', '合法权益'], ['article_1', '经济秩序'],
            ['article_2', '合同定义'], ['article_2', '平等主体'], ['article_2', '民事权利义务'], ['article_2', '身份关系'],
            ['article_52', '合同无效'], ['article_52', '欺诈'], ['article_52', '胁迫'],
            ['article_52', '恶意串通'], ['article_52', '非法目的'], ['article_52', '公共利益'], ['article_52', '强制性规定']
        ];
        
        keywords.forEach(([articleId, keyword]) => {
            this.db.run('INSERT INTO keywords (article_id, keyword) VALUES (?, ?)', [articleId, keyword]);
        });
        
        // 插入案例
        const cases = [
            ['article_1', '案例：合同纠纷中的公平原则适用',
             '某买卖合同纠纷中，法院援引立法目的，认定格式条款显失公平。',
             '法院判决格式条款无效，保护了消费者权益。'],
            
            ['article_2', '案例：身份关系协议的认定',
             '离婚协议中的财产分割条款，法院认定不适用合同法关于撤销权的规定。',
             '法院适用婚姻法相关规定处理。'],
            
            ['article_52', '案例：欺诈订立的合同无效',
             '卖方故意隐瞒房屋质量问题，买方主张欺诈要求确认合同无效。',
             '法院认定卖方构成欺诈，但未损害国家利益，判决撤销合同而非无效。'],
            
            ['article_52', '案例：恶意串通损害第三人利益',
             '债务人与他人恶意串通低价转让财产，债权人主张合同无效。',
             '法院认定恶意串通成立，判决合同无效。']
        ];
        
        cases.forEach(caseItem => {
            this.db.run('INSERT INTO cases (article_id, title, summary, result) VALUES (?, ?, ?, ?)', caseItem);
        });
        
        // 插入相关条款
        const related = [
            ['article_1', 'article_2'], ['article_1', 'article_5'],
            ['article_2', 'article_1'], ['article_2', 'article_3'],
            ['article_52', 'article_54'], ['article_52', 'article_56'], ['article_52', 'article_58']
        ];
        
        related.forEach(([articleId, relatedId]) => {
            this.db.run('INSERT INTO related_articles (article_id, related_article_id) VALUES (?, ?)', [articleId, relatedId]);
        });
        
        console.log('初始数据填充完成');
    },
    
    // 从 IndexedDB 加载数据库
    async loadFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('database')) {
                    db.createObjectStore('database');
                }
            };
            
            request.onsuccess = (event) => {
                const idb = event.target.result;
                const transaction = idb.transaction(['database'], 'readonly');
                const store = transaction.objectStore('database');
                const getRequest = store.get('sqliteDb');
                
                getRequest.onsuccess = () => resolve(getRequest.result);
                getRequest.onerror = () => reject(getRequest.error);
            };
        });
    },
    
    // 保存到 IndexedDB
    async saveToIndexedDB() {
        const data = this.db.export();
        
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('database')) {
                    db.createObjectStore('database');
                }
            };
            
            request.onsuccess = (event) => {
                const idb = event.target.result;
                const transaction = idb.transaction(['database'], 'readwrite');
                const store = transaction.objectStore('database');
                store.put(data, 'sqliteDb');
                
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            };
        });
    },
    
    // 执行查询
    query(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            stmt.bind(params);
            const results = [];
            
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            
            stmt.free();
            return results;
        } catch (error) {
            console.error('查询失败:', error);
            throw error;
        }
    },
    
    // 执行单条查询
    queryOne(sql, params = []) {
        const results = this.query(sql, params);
        return results.length > 0 ? results[0] : null;
    },
    
    // 执行更新
    run(sql, params = []) {
        try {
            this.db.run(sql, params);
            await this.saveToIndexedDB();
            return true;
        } catch (error) {
            console.error('执行失败:', error);
            throw error;
        }
    }
};
```

- [ ] **Step 6: 提交基础结构**

```bash
git add contract-law-assistant/
git commit -m "feat: 初始化项目并配置 SQL.js"
```

---

## Task 2: 搜索功能实现（使用 SQL.js）

**Files:**
- Create: `contract-law-assistant/js/search.js`
- Create: `contract-law-assistant/css/search.css`
- Create: `contract-law-assistant/js/utils.js`

- [ ] **Step 1: 创建工具函数模块**

```javascript
// js/utils.js
const Utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 高亮关键词
    highlightKeywords(text, keywords) {
        if (!keywords || keywords.length === 0) return text;
        
        let result = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(`(${keyword})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });
        return result;
    },
    
    // 显示加载屏幕
    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
    },
    
    // 隐藏加载屏幕
    hideLoading() {
        document.getElementById('loading-screen').classList.add('hidden');
    }
};
```

- [ ] **Step 2: 创建搜索页样式**

（样式与之前版本相同，参考原计划的 Task 3 Step 1）

- [ ] **Step 3: 创建搜索功能模块（使用 SQL.js）**

```javascript
// js/search.js
const Search = {
    // 初始化搜索模块
    init() {
        this.bindEvents();
        console.log('搜索模块初始化成功');
    },
    
    // 绑定事件
    bindEvents() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        searchBtn.addEventListener('click', () => {
            this.performSearch();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        searchInput.addEventListener('input', Utils.debounce(() => {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                this.performSearch();
            }
        }, 300));
    },
    
    // 执行搜索（使用 SQL 查询）
    performSearch() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();
        
        if (!query) {
            this.showTip('请输入搜索关键词');
            return;
        }
        
        const keywords = query.toLowerCase().split(/\s+/);
        const results = this.searchBySQL(keywords);
        this.displayResults(results, query);
    },
    
    // 使用 SQL 进行搜索
    searchBySQL(keywords) {
        const results = [];
        
        keywords.forEach(keyword => {
            // 通过关键词表搜索
            const keywordResults = Database.query(`
                SELECT DISTINCT a.id, a.chapter, a.chapter_title, a.article_number, a.title, a.content,
                       a.interpretation, a.party_a_analysis, a.party_b_analysis
                FROM articles a
                JOIN keywords k ON a.id = k.article_id
                WHERE LOWER(k.keyword) LIKE LOWER(?)
            `, [`%${keyword}%`]);
            
            keywordResults.forEach(result => {
                const existing = results.find(r => r.id === result.id);
                if (existing) {
                    existing.score += 10;
                } else {
                    results.push({ ...result, score: 10 });
                }
            });
            
            // 通过标题和内容搜索
            const contentResults = Database.query(`
                SELECT id, chapter, chapter_title, article_number, title, content,
                       interpretation, party_a_analysis, party_b_analysis
                FROM articles
                WHERE LOWER(title) LIKE LOWER(?) OR LOWER(content) LIKE LOWER(?)
            `, [`%${keyword}%`, `%${keyword}%`]);
            
            contentResults.forEach(result => {
                const existing = results.find(r => r.id === result.id);
                if (existing) {
                    existing.score += 5;
                } else {
                    results.push({ ...result, score: 5 });
                }
            });
        });
        
        // 按分数排序并获取完整信息
        results.sort((a, b) => b.score - a.score);
        
        return results.map(result => {
            const keywords = Database.query('SELECT keyword FROM keywords WHERE article_id = ?', [result.id]);
            const cases = Database.query('SELECT title, summary, result FROM cases WHERE article_id = ?', [result.id]);
            
            return {
                ...result,
                keywords: keywords.map(k => k.keyword),
                cases,
                interestAnalysis: {
                    partyA: result.party_a_analysis,
                    partyB: result.party_b_analysis
                }
            };
        });
    },
    
    // 显示搜索结果
    displayResults(results, query) {
        const resultsContainer = document.getElementById('search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div>未找到相关法条</div>
                    <div style="margin-top: 8px; font-size: 14px;">
                        试试其他关键词，如：无效、违约、解除
                    </div>
                </div>
            `;
            return;
        }
        
        const keywords = query.split(/\s+/);
        
        resultsContainer.innerHTML = results.map(article => `
            <div class="result-card" data-id="${article.id}">
                <div class="result-header">
                    <div class="result-title">
                        《合同法》第${article.article_number}条 ${article.title}
                    </div>
                    <div class="result-chapter">${article.chapter} ${article.chapter_title}</div>
                </div>
                <div class="result-content">
                    ${Utils.highlightKeywords(article.content, keywords)}
                </div>
                <div class="result-actions">
                    <button class="action-btn primary" onclick="Search.showDetail('${article.id}')">
                        详细解读
                    </button>
                    <button class="action-btn" onclick="Search.showInterestAnalysis('${article.id}')">
                        利益分析
                    </button>
                    <button class="action-btn" onclick="Search.showCases('${article.id}')">
                        相关案例
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // 显示详细解读
    showDetail(articleId) {
        window.location.hash = `learning/${articleId}`;
    },
    
    // 显示利益分析
    showInterestAnalysis(articleId) {
        const article = Database.queryOne(`
            SELECT article_number, party_a_analysis, party_b_analysis
            FROM articles WHERE id = ?
        `, [articleId]);
        
        if (!article) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>利益分析 - 第${article.article_number}条</h3>
                    <span class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</span>
                </div>
                <div class="modal-body">
                    <div class="interest-section">
                        <h4>甲方视角</h4>
                        <p>${article.party_a_analysis}</p>
                    </div>
                    <div class="interest-section">
                        <h4>乙方视角</h4>
                        <p>${article.party_b_analysis}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // 显示相关案例
    showCases(articleId) {
        const article = Database.queryOne('SELECT article_number FROM articles WHERE id = ?', [articleId]);
        const cases = Database.query('SELECT title, summary, result FROM cases WHERE article_id = ?', [articleId]);
        
        if (!article) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>相关案例 - 第${article.article_number}条</h3>
                    <span class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</span>
                </div>
                <div class="modal-body">
                    ${cases.map(c => `
                        <div class="case-item">
                            <h4>${c.title}</h4>
                            <p><strong>案情：</strong>${c.summary}</p>
                            <p><strong>结果：</strong>${c.result}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // 显示提示
    showTip(message) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div>${message}</div>
            </div>
        `;
    }
};
```

- [ ] **Step 4: 提交搜索功能**

```bash
git add contract-law-assistant/js/utils.js contract-law-assistant/js/search.js contract-law-assistant/css/search.css
git commit -m "feat: 实现搜索功能（使用 SQL.js）"
```

---

## Task 3: 学习中心功能实现（使用 SQL.js）

**Files:**
- Create: `contract-law-assistant/js/learning.js`
- Create: `contract-law-assistant/css/learning.css`

- [ ] **Step 1: 创建学习页样式**

（样式与之前版本相同，参考原计划的 Task 4 Step 1）

- [ ] **Step 2: 创建学习功能模块（使用 SQL.js）**

```javascript
// js/learning.js
const Learning = {
    currentArticle: null,
    readArticles: new Set(),
    
    // 初始化学习模块
    init() {
        this.loadProgress();
        this.renderChapterNav();
        this.bindEvents();
        this.handleHashChange();
        console.log('学习模块初始化成功');
    },
    
    // 绑定事件
    bindEvents() {
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    },
    
    // 处理 hash 变化
    handleHashChange() {
        const hash = window.location.hash;
        const match = hash.match(/#learning\/(.+)/);
        
        if (match) {
            this.showArticle(match[1]);
        } else {
            // 默认显示第一个条款
            const firstArticle = Database.queryOne('SELECT id FROM articles ORDER BY article_number LIMIT 1');
            if (firstArticle) {
                this.showArticle(firstArticle.id);
            }
        }
    },
    
    // 加载学习进度
    loadProgress() {
        const progress = Database.query('SELECT article_id FROM learning_progress WHERE is_read = TRUE');
        this.readArticles = new Set(progress.map(p => p.article_id));
    },
    
    // 渲染章节导航
    renderChapterNav() {
        const navContainer = document.getElementById('chapter-nav');
        const chapters = Database.query(`
            SELECT DISTINCT chapter, chapter_title
            FROM articles
            ORDER BY chapter
        `);
        
        let html = '<div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div>';
        html += '<div class="progress-text">学习进度：0%</div>';
        
        chapters.forEach(chapter => {
            const articles = Database.query(`
                SELECT id, article_number, title
                FROM articles
                WHERE chapter = ?
                ORDER BY article_number
            `, [chapter.chapter]);
            
            html += `
                <div class="chapter-section">
                    <div class="chapter-title">${chapter.chapter} ${chapter.chapter_title}</div>
                    <ul class="article-list">
                        ${articles.map(article => `
                            <li class="article-item ${this.readArticles.has(article.id) ? 'read' : ''}" 
                                data-id="${article.id}"
                                onclick="Learning.showArticle('${article.id}')">
                                <span class="article-number">第${article.article_number}条</span>
                                <span>${article.title}</span>
                                ${this.readArticles.has(article.id) ? '<span class="article-read">✓</span>' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        
        navContainer.innerHTML = html;
        this.updateProgress();
    },
    
    // 显示条款详情
    showArticle(articleId) {
        const article = Database.queryOne(`
            SELECT id, chapter, chapter_title, article_number, title, content,
                   interpretation, party_a_analysis, party_b_analysis
            FROM articles WHERE id = ?
        `, [articleId]);
        
        if (!article) return;
        
        this.currentArticle = article;
        this.markAsRead(articleId);
        
        const keywords = Database.query('SELECT keyword FROM keywords WHERE article_id = ?', [articleId]);
        const cases = Database.query('SELECT title, summary, result FROM cases WHERE article_id = ?', [articleId]);
        const related = Database.query(`
            SELECT a.id, a.article_number, a.title
            FROM related_articles ra
            JOIN articles a ON ra.related_article_id = a.id
            WHERE ra.article_id = ?
        `, [articleId]);
        
        const note = Database.queryOne('SELECT content FROM notes WHERE article_id = ? ORDER BY updated_at DESC LIMIT 1', [articleId]);
        
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="article-header">
                <h2>第${article.article_number}条 ${article.title}</h2>
                <div class="article-meta">${article.chapter} ${article.chapter_title}</div>
            </div>
            
            <div class="article-section">
                <h3>📝 条款原文</h3>
                <div class="article-content">${article.content}</div>
            </div>
            
            <div class="article-section">
                <h3>💡 条款解读</h3>
                <div class="article-content">${article.interpretation}</div>
            </div>
            
            <div class="article-section">
                <h3>⚖️ 利益分析</h3>
                <div class="interest-box">
                    <div class="interest-item party-a">
                        <h4>甲方视角</h4>
                        <p>${article.party_a_analysis}</p>
                    </div>
                    <div class="interest-item party-b">
                        <h4>乙方视角</h4>
                        <p>${article.party_b_analysis}</p>
                    </div>
                </div>
            </div>
            
            <div class="article-section">
                <h3>📚 相关案例</h3>
                ${cases.map(c => `
                    <div class="case-item">
                        <h4>${c.title}</h4>
                        <p><strong>案情：</strong>${c.summary}</p>
                        <p><strong>结果：</strong>${c.result}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="article-section">
                <h3>🔗 相关条款</h3>
                <div class="related-articles">
                    ${related.map(r => `
                        <a href="#learning/${r.id}" class="related-link">
                            第${r.article_number}条 ${r.title}
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <div class="note-section">
                <h3>📋 我的笔记</h3>
                <textarea 
                    id="note-textarea" 
                    class="note-textarea" 
                    placeholder="在此记录你的学习笔记..."
                >${note ? note.content : ''}</textarea>
                <div class="note-actions">
                    <button class="action-btn primary" onclick="Learning.saveNote()">保存笔记</button>
                    <button class="action-btn" onclick="Learning.clearNote()">清空</button>
                </div>
            </div>
        `;
        
        // 更新导航高亮
        document.querySelectorAll('.article-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.id === articleId) {
                item.classList.add('active');
            }
        });
        
        window.location.hash = `learning/${articleId}`;
    },
    
    // 标记为已读
    markAsRead(articleId) {
        this.readArticles.add(articleId);
        
        // 使用 SQL 更新进度
        const existing = Database.queryOne('SELECT id FROM learning_progress WHERE article_id = ?', [articleId]);
        
        if (existing) {
            Database.run('UPDATE learning_progress SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE article_id = ?', [articleId]);
        } else {
            Database.run('INSERT INTO learning_progress (article_id, is_read) VALUES (?, TRUE)', [articleId]);
        }
        
        this.updateProgress();
        
        // 更新导航项样式
        const navItem = document.querySelector(`.article-item[data-id="${articleId}"]`);
        if (navItem && !navItem.classList.contains('read')) {
            navItem.classList.add('read');
            const readMark = document.createElement('span');
            readMark.className = 'article-read';
            readMark.textContent = '✓';
            navItem.appendChild(readMark);
        }
    },
    
    // 更新学习进度
    updateProgress() {
        const total = Database.queryOne('SELECT COUNT(*) as count FROM articles').count;
        const read = this.readArticles.size;
        const percentage = Math.round((read / total) * 100);
        
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `学习进度：${percentage}% (${read}/${total})`;
        }
    },
    
    // 保存笔记
    saveNote() {
        if (!this.currentArticle) return;
        
        const textarea = document.getElementById('note-textarea');
        const content = textarea.value.trim();
        
        if (content) {
            Database.run('INSERT INTO notes (article_id, content) VALUES (?, ?)', [this.currentArticle.id, content]);
            alert('笔记已保存');
        }
    },
    
    // 清空笔记
    clearNote() {
        if (!this.currentArticle) return;
        
        const textarea = document.getElementById('note-textarea');
        textarea.value = '';
    }
};
```

- [ ] **Step 3: 提交学习功能**

```bash
git add contract-law-assistant/js/learning.js contract-law-assistant/css/learning.css
git commit -m "feat: 实现学习中心功能（使用 SQL.js）"
```

---

## Task 4: 主应用逻辑和启动

**Files:**
- Create: `contract-law-assistant/js/app.js`

- [ ] **Step 1: 创建主应用逻辑**

```javascript
// js/app.js
const App = {
    currentPage: 'search',
    
    // 初始化应用
    async init() {
        console.log('应用初始化开始...');
        
        Utils.showLoading();
        
        try {
            // 初始化数据库
            await Database.init();
            
            // 初始化各模块
            Search.init();
            Learning.init();
            
            // 处理初始路由
            this.handleRoute();
            
            // 隐藏加载屏幕
            Utils.hideLoading();
            
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            Utils.hideLoading();
            alert('应用初始化失败，请刷新页面重试');
        }
    },
    
    // 绑定导航事件
    bindNavEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });
        
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
    },
    
    // 导航到指定页面
    navigateTo(page) {
        this.currentPage = page;
        window.location.hash = page;
    },
    
    // 处理路由
    handleRoute() {
        const hash = window.location.hash || '#search';
        
        if (hash.startsWith('#learning')) {
            this.showPage('learning');
        } else {
            this.showPage('search');
        }
        
        this.updateNavHighlight();
    },
    
    // 显示指定页面
    showPage(pageName) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        this.currentPage = pageName;
    },
    
    // 更新导航高亮
    updateNavHighlight() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === this.currentPage) {
                link.classList.add('active');
            }
        });
    }
};

// 应用启动
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
```

- [ ] **Step 2: 提交主应用逻辑**

```bash
git add contract-law-assistant/js/app.js
git commit -m "feat: 完成主应用逻辑"
```

---

## Task 5: 测试和优化

- [ ] **Step 1: 测试数据库加载**

在浏览器中打开 `index.html`，检查：
- 加载屏幕是否正常显示
- 数据库是否成功初始化
- IndexedDB 是否正确保存数据

- [ ] **Step 2: 测试搜索功能**

测试：
- 搜索"无效"
- 搜索"欺诈"
- 搜索"合同定义"
- 测试利益分析弹窗
- 测试相关案例弹窗

- [ ] **Step 3: 测试学习中心功能**

测试：
- 章节导航
- 条款详情展示
- 学习进度标记
- 笔记保存和加载
- 相关条款跳转

- [ ] **Step 4: 测试数据持久化**

刷新页面，检查：
- 学习进度是否保留
- 笔记是否保留
- 数据库是否从 IndexedDB 加载

- [ ] **Step 5: 提交最终版本**

```bash
git add .
git commit -m "feat: 完成合同法智能助手开发（SQL.js 版）"
```

---

## 部署说明

### 本地运行
直接在浏览器中打开 `index.html`

### GitHub Pages 部署
```bash
git push origin main
```
访问 `https://your-username.github.io/contract-law-assistant`

### Vercel / Netlify 部署
上传整个项目文件夹即可

---

## SQL.js 优势

1. **无需后端**：纯前端实现，无需服务器
2. **完整 SQL 支持**：支持所有标准 SQL 查询
3. **查询速度快**：SQLite 的查询性能优秀
4. **数据持久化**：使用 IndexedDB 保存数据库
5. **静态部署**：可以部署到任何静态托管服务

---

## 后续优化建议

1. **数据扩展**：添加更多合同法条款和案例数据
2. **FTS 搜索**：使用 SQLite FTS5 全文搜索模块
3. **数据导入**：支持导入外部 SQLite 数据库文件
4. **性能优化**：优化查询语句、添加缓存
5. **功能增强**：
   - 支持导出数据库
   - 添加书签功能
   - 支持多用户数据隔离