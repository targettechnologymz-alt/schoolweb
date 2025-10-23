// Sistema de autenticação administrativa
class AuthSystem {
    constructor() {
        this.adminPassword = 'abernateamo2023'; // Senha padrão - altere isso!
        this.isAuthenticated = false;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        this.init();
    }

    init() {
        this.verificarSessao();
        this.criarModalLogin();
    }

    // Criar modal de login
    criarModalLogin() {
        const modalHTML = `
            <div id="login-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-lock"></i> Acesso Administrativo</h3>
                        <button class="btn-fechar" onclick="authSystem.fecharLogin()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="login-password">Senha de Administrador:</label>
                            <input type="password" id="login-password" placeholder="Digite a senha" class="form-input">
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-secondary" onclick="authSystem.fecharLogin()">Cancelar</button>
                            <button class="btn btn-primary" onclick="authSystem.fazerLogin()">Entrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Verificar sessão existente
    verificarSessao() {
        const sessao = localStorage.getItem('admin_session');
        if (sessao) {
            const { timestamp, hash } = JSON.parse(sessao);
            const agora = Date.now();
            
            if (agora - timestamp < this.sessionTimeout) {
                const verificarHash = this.gerarHash(this.adminPassword + timestamp);
                if (verificarHash === hash) {
                    this.isAuthenticated = true;
                    this.iniciarTimeoutSessao();
                    return true;
                }
            }
        }
        
        this.isAuthenticated = false;
        localStorage.removeItem('admin_session');
        return false;
    }

    // Fazer login
    fazerLogin() {
        const password = document.getElementById('login-password').value;
        
        if (password === this.adminPassword) {
            this.isAuthenticated = true;
            const timestamp = Date.now();
            const hash = this.gerarHash(password + timestamp);
            
            localStorage.setItem('admin_session', JSON.stringify({
                timestamp,
                hash
            }));
            
            this.fecharLogin();
            this.iniciarTimeoutSessao();
            adminInterface.abrir();
            
            console.log('🔓 Acesso administrativo concedido');
        } else {
            alert('❌ Senha incorreta!');
            document.getElementById('login-password').value = '';
        }
    }

    // Fazer logout
    fazerLogout() {
        this.isAuthenticated = false;
        localStorage.removeItem('admin_session');
        adminInterface.fechar();
        console.log('🔒 Sessão administrativa encerrada');
    }

    // Verificar autenticação
    verificarAuth() {
        if (!this.isAuthenticated) {
            this.abrirLogin();
            return false;
        }
        return true;
    }

    // Abrir modal de login
    abrirLogin() {
        document.getElementById('login-modal').style.display = 'block';
        document.getElementById('login-password').focus();
    }

    // Fechar modal de login
    fecharLogin() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-password').value = '';
    }

    // Gerar hash simples
    gerarHash(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Iniciar timeout da sessão
    iniciarTimeoutSessao() {
        setTimeout(() => {
            if (this.isAuthenticated) {
                this.fazerLogout();
                alert('⏰ Sua sessão expirou. Faça login novamente.');
            }
        }, this.sessionTimeout);
    }
}

// Instância global do sistema de auth
const authSystem = new AuthSystem();