const Learning = {
    currentArticle: null,
    readArticles: new Set(),
    
    init() {
        this.loadProgress();
        this.renderChapterNav();
        this.bindEvents();
        console.log('学习模块初始化成功');
    },
    
    bindEvents() {
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    },
    
    handleHashChange() {
        const hash = window.location.hash;
        
        if (!hash.startsWith('#learning')) {
            return;
        }
        
        const match = hash.match(/#learning\/(.+)/);
        
        if (match) {
            this.showArticle(match[1]);
        } else {
            const firstArticle = Database.queryOne('SELECT id FROM articles ORDER BY article_number LIMIT 1');
            if (firstArticle) {
                this.showArticle(firstArticle.id);
            }
        }
    },
    
    loadProgress() {
        const progress = Database.query('SELECT article_id FROM learning_progress WHERE is_read = TRUE');
        this.readArticles = new Set(progress.map(p => p.article_id));
    },
    
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
        
        document.querySelectorAll('.article-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.id === articleId) {
                item.classList.add('active');
            }
        });
        
        window.location.hash = `learning/${articleId}`;
    },
    
    markAsRead(articleId) {
        this.readArticles.add(articleId);
        
        const existing = Database.queryOne('SELECT id FROM learning_progress WHERE article_id = ?', [articleId]);
        
        if (existing) {
            Database.run('UPDATE learning_progress SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE article_id = ?', [articleId]);
        } else {
            Database.run('INSERT INTO learning_progress (article_id, is_read) VALUES (?, TRUE)', [articleId]);
        }
        
        this.updateProgress();
        
        const navItem = document.querySelector(`.article-item[data-id="${articleId}"]`);
        if (navItem && !navItem.classList.contains('read')) {
            navItem.classList.add('read');
            const readMark = document.createElement('span');
            readMark.className = 'article-read';
            readMark.textContent = '✓';
            navItem.appendChild(readMark);
        }
    },
    
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
    
    saveNote() {
        if (!this.currentArticle) return;
        
        const textarea = document.getElementById('note-textarea');
        const content = textarea.value.trim();
        
        if (content) {
            Database.run('INSERT INTO notes (article_id, content) VALUES (?, ?)', [this.currentArticle.id, content]);
            alert('笔记已保存');
        }
    },
    
    clearNote() {
        if (!this.currentArticle) return;
        
        const textarea = document.getElementById('note-textarea');
        textarea.value = '';
    }
};