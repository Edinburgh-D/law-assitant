const Utils = {
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
    
    highlightKeywords(text, keywords) {
        if (!keywords || keywords.length === 0) return text;
        
        let result = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(`(${keyword})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });
        return result;
    },
    
    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
    },
    
    hideLoading() {
        document.getElementById('loading-screen').classList.add('hidden');
    }
};