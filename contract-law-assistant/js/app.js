const App = {
    currentPage: 'search',
    
    async init() {
        console.log('应用初始化开始...');
        
        Utils.showLoading();
        
        try {
            await Database.init();
            
            this.bindNavEvents();
            
            Search.init();
            Learning.init();
            
            this.handleRoute();
            
            Utils.hideLoading();
            
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            Utils.hideLoading();
            alert('应用初始化失败，请刷新页面重试');
        }
    },
    
    bindNavEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                window.location.hash = page;
            });
        });
        
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
    },
    
    handleRoute() {
        const hash = window.location.hash || '#search';
        
        if (hash.startsWith('#learning')) {
            this.showPage('learning');
        } else {
            this.showPage('search');
        }
        
        this.updateNavHighlight();
    },
    
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

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});