const Search = {
    init() {
        this.bindEvents();
        console.log('搜索模块初始化成功');
    },
    
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
    
    searchBySQL(keywords) {
        const results = [];
        
        keywords.forEach(keyword => {
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
    
    showDetail(articleId) {
        window.location.hash = `learning/${articleId}`;
    },
    
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
    
    showTip(message) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div>${message}</div>
            </div>
        `;
    }
};