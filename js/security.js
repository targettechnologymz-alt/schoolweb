// Sistema de Segurança Avançado
class AdvancedSecurity {
    constructor() {
        this.init();
    }

    init() {
        this.protegerVariaveis();
        this.detectarFerramentas();
        this.monitorarComportamento();
        this.ofuscarCodigo();
    }

    // Proteger variáveis sensíveis
    protegerVariaveis() {
        const sensitive = ['CONFIG', 'secureAuth', 'adminInterface', 'AdvancedSecurity'];
        
        sensitive.forEach(name => {
            if (window[name]) {
                Object.defineProperty(window, name, {
                    configurable: false,
                    writable: false,
                    enumerable: false
                });
            }
        });

        // Esconder funções do console
        this.esconderFuncoesConsole();
    }

    // Esconder funções sensíveis do console
    esconderFuncoesConsole() {
        const originalDir = console.dir;
        const originalKeys = Object.keys;
        
        console.dir = function(obj) {
            if (obj && typeof obj === 'object') {
                const filtered = {};
                for (let key in obj) {
                    if (!key.includes('auth') && !key.includes('admin') && !key.includes('secure')) {
                        filtered[key] = obj[key];
                    }
                }
                return originalDir.call(this, filtered);
            }
            return originalDir.call(this, obj);
        };

        Object.keys = function(obj) {
            const keys = originalKeys.call(this, obj);
            return keys.filter(key => !key.includes('auth') && !key.includes('admin') && !key.includes('secure'));
        };
    }

    // Detectar ferramentas de desenvolvedor
    detectarFerramentas() {
        // Detectar console aberto
        const detector = new Function("try { return this.console.firebug ? true : false } catch(e) {}")();
        if (detector) {
            this.ativarProtecaoMaxima();
        }

        // Detectar por performance
        const start = performance.now();
        debugger;
        const end = performance.now();
        
        if (end - start > 100) {
            this.ativarProtecaoMaxima();
        }

        // Monitorar abertura do console
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
                this.ativarProtecaoMaxima();
            }
        }, 1000);
    }

    // Ativar proteção máxima
    ativarProtecaoMaxima() {
        // Limpar dados sensíveis
        localStorage.removeItem('secure_admin_session');
        sessionStorage.clear();
        
        // Redirecionar após delay
        setTimeout(() => {
            window.location.href = window.location.href.split('#')[0];
        }, 2000);
    }

    // Monitorar comportamento suspeito
    monitorarComportamento() {
        // Detectar cópia de código
        document.addEventListener('copy', (e) => {
            const selected = window.getSelection().toString();
            if (this.isCodigoSensivel(selected)) {
                e.preventDefault();
                secureAuth.mostrarNotificacao('🚫 Ação não permitida', 'error');
            }
        });

        // Detectar abas em segundo plano
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && secureAuth.isAuthenticated) {
                secureAuth.mostrarNotificacao('⚠️ Monitoramento de segurança ativo', 'warning');
            }
        });

        // Detectar mudanças no DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'id' || mutation.attributeName === 'class')) {
                    const target = mutation.target;
                    if (target && 
                        (target.id.includes('admin') || 
                         target.className.includes('admin') ||
                         target.innerHTML.includes('secureAuth'))) {
                        target.remove();
                    }
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['id', 'class']
        });
    }

    // Verificar se texto contém código sensível
    isCodigoSensivel(text) {
        const sensitiveKeywords = [
            'secureAuth', 'CONFIG', 'ACCESS_CODE', 'ADMIN_HASH',
            'verificarAcessoSeguro', 'adminInterface'
        ];
        
        return sensitiveKeywords.some(keyword => 
            text.includes(keyword)
        );
    }

    // Ofuscar código
    ofuscarCodigo() {
        // Remover source maps
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                script.removeAttribute('src');
            }
        });

        // Proteger against debugging
        const blockDebugger = function() {
            setInterval(function() {
                (function() {})['constructor']('debugger')();
            }, 5000);
        };

        try {
            blockDebugger();
        } catch (e) {
            // Ignore errors
        }
    }
}

// Inicializar segurança avançada
document.addEventListener('DOMContentLoaded', function() {
    new AdvancedSecurity();
});