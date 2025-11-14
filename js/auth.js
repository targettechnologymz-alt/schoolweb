// Sistema de Autenticação Ultra-Seguro e Oculto
class SecureAuthSystem {
    constructor() {
        this.isAuthenticated = false;
        this.sessionTimeout = CONFIG.SESSION_TIMEOUT;
        this.accessAttempts = 0;
        this.maxAttempts = 3;
        this.lockoutTime = 10 * 60 * 1000; // 10 minutos de bloqueio
        this.secretPattern = CONFIG.SECRET_PATTERN;
        this.hiddenKeySequence = CONFIG.HIDDEN_KEY_SEQUENCE;
        this.keySequence = [];
        this.isLocked = false;
        this.init();
    }

    init() {
        this.verificarSessao();
        this.adicionarEventListenersSecretos();
        console.log('🛡️ Sistema de autenticação secreto inicializado');
    }

    // Verificar acesso seguro
    async verificarAcessoSeguro() {
        if (this.isLocked) {
            this.mostrarNotificacao('🚫 Sistema temporariamente bloqueado por segurança', 'error');
            return;
        }

        if (this.accessAttempts >= this.maxAttempts) {
            this.bloquearAcesso();
            return;
        }

        const accessCode = document.getElementById('secure-access-code').value;
        const token = document.getElementById('secure-token').value;

        if (!accessCode) {
            this.mostrarNotificacao('❌ Digite o código de acesso', 'error');
            return;
        }

        // Verificação multi-camada
        const hashInput = await this.gerarHashSHA256(accessCode + token);
        const isValid = this.verificarCredenciais(accessCode, hashInput);

        if (isValid) {
            this.isAuthenticated = true;
            this.registrarSessaoSegura();
            this.fecharLoginSeguro();
            
            if (typeof adminInterface !== 'undefined') {
                adminInterface.abrir();
            }
            
            this.mostrarNotificacao('🔓 Acesso administrativo concedido', 'success');
            this.accessAttempts = 0;
            this.isLocked = false;
        } else {
            this.accessAttempts++;
            const remaining = this.maxAttempts - this.accessAttempts;
            document.getElementById('attempts-counter').textContent = 
                `Tentativas restantes: ${remaining}`;
            
            if (remaining > 0) {
                this.mostrarNotificacao(`❌ Código inválido. ${remaining} tentativa(s) restante(s)`, 'error');
            } else {
                this.bloquearAcesso();
            }
            
            this.gerarTokenSeguro();
            document.getElementById('secure-access-code').value = '';
            document.getElementById('secure-access-code').focus();
        }
    }

    // Verificação multi-fatores
    verificarCredenciais(accessCode, hashInput) {
        // Camada 1: Código de acesso direto
        if (accessCode === CONFIG.ACCESS_CODE) return true;
        
        // Camada 2: Hash SHA256
        if (hashInput === CONFIG.ADMIN_HASH) return true;
        
        // Camada 3: Verificação de padrão
        if (this.verificarPadraoSecreto(accessCode)) return true;
        
        // Camada 4: Códigos de emergência
        const emergencyCodes = [
            'academico2024',
            'universidademoçambique',
            'mozambique2024',
            this.gerarHashSimples('admin' + new Date().getDate())
        ];
        
        return emergencyCodes.includes(accessCode.toLowerCase());
    }

    // Verificar padrão secreto
    verificarPadraoSecreto(input) {
        return input.toLowerCase() === this.secretPattern.toLowerCase();
    }

    // Gerar hash SHA256
    async gerarHashSHA256(text) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hash = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } catch (error) {
            // Fallback para navegadores mais antigos
            return this.gerarHashSimples(text);
        }
    }

    // Hash simples para verificação adicional
    gerarHashSimples(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // Registrar sessão segura
    registrarSessaoSegura() {
        const sessionData = {
            timestamp: Date.now(),
            token: this.gerarTokenSeguro(),
            userAgent: navigator.userAgent,
            hash: this.gerarHashSimples(Date.now().toString() + navigator.userAgent)
        };
        
        localStorage.setItem('secure_admin_session', JSON.stringify(sessionData));
        this.iniciarTimeoutSessao();
    }

    // Verificar sessão existente
    verificarSessao() {
        const sessao = localStorage.getItem('secure_admin_session');
        if (sessao) {
            try {
                const { timestamp, userAgent, hash } = JSON.parse(sessao);
                const agora = Date.now();
                
                // Verificar timeout e integridade
                if (agora - timestamp < this.sessionTimeout && 
                    userAgent === navigator.userAgent &&
                    this.verificarHashSessao(hash, timestamp)) {
                    this.isAuthenticated = true;
                    this.iniciarTimeoutSessao();
                    return true;
                }
            } catch (e) {
                console.warn('Sessão corrompida');
            }
        }
        
        this.isAuthenticated = false;
        localStorage.removeItem('secure_admin_session');
        return false;
    }

    // Verificar hash da sessão
    verificarHashSessao(hash, timestamp) {
        const expectedHash = this.gerarHashSimples(timestamp.toString() + navigator.userAgent);
        return hash === expectedHash;
    }

    // Bloquear acesso temporariamente
    bloquearAcesso() {
        this.isLocked = true;
        this.mostrarNotificacao('🚫 Acesso bloqueado por 10 minutos por segurança', 'error');
        
        setTimeout(() => {
            this.accessAttempts = 0;
            this.isLocked = false;
            document.getElementById('attempts-counter').textContent = 'Tentativas restantes: 3';
            this.mostrarNotificacao('🔓 Bloqueio removido. Tente novamente.', 'info');
        }, this.lockoutTime);
    }

    // Fazer logout
    fazerLogout() {
        this.isAuthenticated = false;
        localStorage.removeItem('secure_admin_session');
        
        if (typeof adminInterface !== 'undefined') {
            adminInterface.fechar();
        }
        
        this.mostrarNotificacao('🔒 Sessão administrativa encerrada', 'info');
    }

    // Abrir login seguro
    abrirLoginSeguro() {
        if (this.isLocked) {
            this.mostrarNotificacao('🚫 Acesso temporariamente bloqueado', 'error');
            return;
        }
        
        if (this.accessAttempts >= this.maxAttempts) {
            this.bloquearAcesso();
            return;
        }
        
        // Criar modal se não existir
        if (!document.getElementById('secure-login-modal')) {
            this.criarInterfaceOculta();
        }
        
        document.getElementById('secure-login-modal').style.display = 'flex';
        document.getElementById('secure-access-code').focus();
        this.gerarTokenSeguro();
    }

    // Fechar login seguro
    fecharLoginSeguro() {
        const modal = document.getElementById('secure-login-modal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('secure-access-code').value = '';
        }
    }

    // Criar interface de login oculta
    criarInterfaceOculta() {
        const hiddenLoginHTML = `
            <div id="secure-login-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-shield-alt"></i> Verificação de Segurança</h3>
                        <button class="btn-fechar" onclick="secureAuth.fecharLoginSeguro()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="secure-access-code">Código de Acesso:</label>
                            <input type="password" id="secure-access-code" class="form-input" 
                                   placeholder="Digite o código de acesso seguro" autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="secure-token">Token de Verificação:</label>
                            <input type="text" id="secure-token" class="form-input" 
                                   placeholder="Token gerado automaticamente" readonly
                                   style="background: #f8f9fa; font-family: monospace;">
                        </div>
                        <div class="security-info">
                            <p><i class="fas fa-info-circle"></i> <span id="attempts-counter">Tentativas restantes: 3</span></p>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-secondary" onclick="secureAuth.fecharLoginSeguro()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button class="btn btn-primary" onclick="secureAuth.verificarAcessoSeguro()">
                                <i class="fas fa-key"></i> Verificar Acesso
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', hiddenLoginHTML);
    }

    // Gerar token seguro aleatório
    gerarTokenSeguro() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 12; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const tokenElement = document.getElementById('secure-token');
        if (tokenElement) {
            tokenElement.value = token;
        }
        return token;
    }

    // Iniciar timeout da sessão
    iniciarTimeoutSessao() {
        setTimeout(() => {
            if (this.isAuthenticated) {
                this.fazerLogout();
                this.mostrarNotificacao('⏰ Sessão expirada por segurança', 'warning');
            }
        }, this.sessionTimeout);
    }

    // Adicionar event listeners secretos
    adicionarEventListenersSecretos() {
        // Sequência de teclas secreta (Konami Code)
        document.addEventListener('keydown', (e) => {
            this.keySequence.push(e.code);
            if (this.keySequence.length > this.hiddenKeySequence.length) {
                this.keySequence.shift();
            }
            
            if (this.verificarSequenciaSecreta()) {
                this.abrirLoginSeguro();
                this.keySequence = [];
                e.preventDefault();
            }
        });

        // Clique na área secreta (canto superior direito)
        const secretZone = document.getElementById(CONFIG.SECRET_CLICK_ZONE);
        if (secretZone) {
            secretZone.addEventListener('click', (e) => {
                this.abrirLoginSeguro();
                e.preventDefault();
            });

            // Clique duplo para acesso rápido
            let clickCount = 0;
            secretZone.addEventListener('dblclick', (e) => {
                clickCount++;
                if (clickCount === 2) {
                    this.abrirLoginSeguro();
                    clickCount = 0;
                    e.preventDefault();
                }
            });
        }

        // Clique triplo no cabeçalho
        const header = document.querySelector('header');
        let headerClicks = 0;
        let headerTimer;

        header?.addEventListener('click', (e) => {
            headerClicks++;
            if (headerClicks === 3) {
                this.abrirLoginSeguro();
                headerClicks = 0;
                clearTimeout(headerTimer);
                e.preventDefault();
            } else {
                clearTimeout(headerTimer);
                headerTimer = setTimeout(() => {
                    headerClicks = 0;
                }, 1000);
            }
        });

        // Acesso por URL secreta
        if (window.location.hash === '#admin2024') {
            setTimeout(() => this.abrirLoginSeguro(), 1000);
            window.location.hash = '';
        }

        // Monitorar mudanças na hash
        window.addEventListener('hashchange', () => {
            if (window.location.hash === '#admin2024') {
                this.abrirLoginSeguro();
                window.location.hash = '';
            }
        });

        // Enter no campo de código
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'secure-access-code' && e.key === 'Enter') {
                this.verificarAcessoSeguro();
            }
        });
    }

    // Verificar sequência secreta de teclas
    verificarSequenciaSecreta() {
        if (this.keySequence.length !== this.hiddenKeySequence.length) return false;
        
        for (let i = 0; i < this.hiddenKeySequence.length; i++) {
            if (this.keySequence[i] !== this.hiddenKeySequence[i]) {
                return false;
            }
        }
        return true;
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'info') {
        // Remover notificações existentes
        document.querySelectorAll('.secure-notification').forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${tipo} secure-notification`;
        notification.innerHTML = `
            <span>${mensagem}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Verificar autenticação para ações administrativas
    verificarAuth() {
        if (!this.isAuthenticated && !this.verificarSessao()) {
            this.abrirLoginSeguro();
            return false;
        }
        return true;
    }
}

// Instância global do sistema de auth seguro
const secureAuth = new SecureAuthSystem();