// Interface Administrativa (Completamente Ocultada)
class AdminInterface {
    constructor() {
        this.abaAtual = 'upload';
        this.init();
    }

    init() {
        this.criarInterfaceAdmin();
    }

    // Criar interface administrativa
    criarInterfaceAdmin() {
        // A interface será criada quando o modal for aberto
    }

    // Carregar conteúdo administrativo
    carregarInterfaceAdmin() {
        const modalBody = document.querySelector('#admin-modal .modal-body');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="admin-tabs">
                <button class="tab-btn active" data-tab="upload">
                    <i class="fas fa-upload"></i> Adicionar Conteúdo
                </button>
                <button class="tab-btn" data-tab="gerenciar">
                    <i class="fas fa-list"></i> Gerenciar Materiais
                </button>
                <button class="tab-btn" data-tab="estatisticas">
                    <i class="fas fa-chart-bar"></i> Estatísticas
                </button>
            </div>

            <div class="admin-content">
                <!-- Tab Upload -->
                <div id="tab-upload" class="tab-content active">
                    ${this.criarTabUpload()}
                </div>

                <!-- Tab Gerenciar -->
                <div id="tab-gerenciar" class="tab-content">
                    ${this.criarTabGerenciar()}
                </div>

                <!-- Tab Estatísticas -->
                <div id="tab-estatisticas" class="tab-content">
                    ${this.criarTabEstatisticas()}
                </div>
            </div>
        `;

        this.adicionarEventListenersAdmin();
    }

    // Criar tab de upload
    criarTabUpload() {
        return `
            <div class="form-grid">
                <div class="form-group">
                    <label>Tipo de Material:</label>
                    <select id="admin-tipo" class="form-select">
                        ${TIPOS_CONTEUDO.map(tipo => 
                            `<option value="${tipo.valor}">${tipo.texto}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>Instituição:</label>
                    <select id="admin-instituicao" class="form-select">
                        ${INSTITUICOES.map(inst => 
                            `<option value="${inst.sigla}">${inst.nome}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>Ano:</label>
                    <input type="number" id="admin-ano" class="form-input" value="2024" min="2000" max="2030">
                </div>

                <div class="form-group">
                    <label>Disciplina/Curso:</label>
                    <input type="text" id="admin-disciplina" class="form-input" placeholder="Ex: Matemática, Direito, etc.">
                </div>

                <div class="form-group full-width">
                    <label>Título:</label>
                    <input type="text" id="admin-titulo" class="form-input" placeholder="Título do conteúdo">
                </div>

                <div class="form-group full-width">
                    <label>Descrição:</label>
                    <textarea id="admin-descricao" class="form-input" rows="3" placeholder="Descrição breve do conteúdo"></textarea>
                </div>

                <div class="form-group">
                    <label>Arquivo PDF:</label>
                    <input type="file" id="admin-arquivo" class="form-input" accept=".pdf">
                    <small style="color: #666; margin-top: 5px; display: block;">
                        ⚠️ Faça upload no Google Drive e cole o link abaixo
                    </small>
                </div>

                <div class="form-group full-width">
                    <label>URL do Google Drive:</label>
                    <input type="url" id="admin-url" class="form-input" placeholder="https://drive.google.com/...">
                </div>
            </div>

            <div class="form-actions">
                <button class="btn btn-secondary" onclick="adminInterface.limparFormulario()">
                    <i class="fas fa-times"></i> Limpar
                </button>
                <button class="btn btn-primary" onclick="adminInterface.publicarConteudo()">
                    <i class="fas fa-upload"></i> Publicar Conteúdo
                </button>
            </div>
        `;
    }

    // Criar tab de gerenciamento
    criarTabGerenciar() {
        return `
            <div class="management-tools">
                <input type="text" id="search-materiais" placeholder="Buscar materiais..." class="search-input">
                <button class="btn btn-secondary" onclick="adminInterface.recarregarMateriais()">
                    <i class="fas fa-sync"></i> Atualizar
                </button>
            </div>
            <div id="lista-materiais" class="materiais-list">
                ${this.carregarListaMateriais()}
            </div>
        `;
    }

    // Criar tab de estatísticas
    criarTabEstatisticas() {
        return `
            <div class="stats-grid" id="admin-stats">
                ${this.carregarEstatisticasAdmin()}
            </div>
        `;
    }

    // Carregar lista de materiais
    carregarListaMateriais() {
        const materiais = mainSystem.materiais;
        
        if (materiais.length === 0) {
            return '<div class="empty-state">Nenhum material cadastrado</div>';
        }

        return materiais.map(material => `
            <div class="material-item" data-id="${material.id}">
                <div class="material-info">
                    <div class="material-title">${material.titulo}</div>
                    <div class="material-meta">
                        <span class="badge">${material.instituicao}</span>
                        <span class="badge">${material.ano}</span>
                        <span class="badge">${material.tipo}</span>
                        <span class="badge">${material.disciplina || 'Geral'}</span>
                    </div>
                    <div class="material-details">
                        <small>${material.visualizacoes || 0} visualizações • ${material.downloads || 0} downloads • ${mainSystem.formatarData(material.dataPublicacao)}</small>
                    </div>
                </div>
                <div class="material-actions">
                    <button class="btn btn-sm btn-danger" onclick="adminInterface.removerMaterial(${material.id})">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Carregar estatísticas admin
    carregarEstatisticasAdmin() {
        const stats = mainSystem.materiais.reduce((acc, material) => {
            acc.totalDocumentos++;
            acc[material.tipo] = (acc[material.tipo] || 0) + 1;
            acc.totalVisualizacoes += material.visualizacoes || 0;
            acc.totalDownloads += material.downloads || 0;
            return acc;
        }, {
            totalDocumentos: 0,
            exame: 0,
            edital: 0,
            noticia: 0,
            manual: 0,
            resumo: 0,
            totalVisualizacoes: 0,
            totalDownloads: 0
        });

        const instituicoesUnicas = new Set(mainSystem.materiais.map(m => m.instituicao)).size;
        const anosUnicos = new Set(mainSystem.materiais.map(m => m.ano)).size;

        return `
            <div class="stat-card">
                <div class="stat-number">${stats.totalDocumentos}</div>
                <div class="stat-label">Total Documentos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.exame}</div>
                <div class="stat-label">Exames</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.edital}</div>
                <div class="stat-label">Editais</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${instituicoesUnicas}</div>
                <div class="stat-label">Instituições</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalVisualizacoes}</div>
                <div class="stat-label">Visualizações</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalDownloads}</div>
                <div class="stat-label">Downloads</div>
            </div>
        `;
    }

    // Adicionar event listeners do admin
    adicionarEventListenersAdmin() {
        // Tabs
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn') || e.target.parentElement.classList.contains('tab-btn')) {
                const tabBtn = e.target.classList.contains('tab-btn') ? e.target : e.target.parentElement;
                const tabName = tabBtn.getAttribute('data-tab');
                this.abrirTab(tabName);
            }
        });
    }

    // Abrir interface admin
    abrir() {
        if (secureAuth.verificarAuth()) {
            document.getElementById('admin-modal').style.display = 'flex';
            this.carregarInterfaceAdmin();
            this.carregarConteudoAbaAtual();
        }
    }

    // Fechar interface admin
    fechar() {
        document.getElementById('admin-modal').style.display = 'none';
        this.limparFormulario();
    }

    // Trocar abas
    abrirTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const tabElement = document.getElementById(`tab-${tabName}`);
        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);

        if (tabElement && tabBtn) {
            tabElement.classList.add('active');
            tabBtn.classList.add('active');
            this.abaAtual = tabName;
        }
    }

    // Carregar conteúdo da aba atual
    carregarConteudoAbaAtual() {
        const container = document.getElementById('lista-materiais');
        const statsContainer = document.getElementById('admin-stats');
        
        if (container) {
            container.innerHTML = this.carregarListaMateriais();
        }
        if (statsContainer) {
            statsContainer.innerHTML = this.carregarEstatisticasAdmin();
        }
    }

    // Publicar conteúdo
    async publicarConteudo() {
        if (!secureAuth.verificarAuth()) return;

        const tipo = document.getElementById('admin-tipo').value;
        const instituicao = document.getElementById('admin-instituicao').value;
        const titulo = document.getElementById('admin-titulo').value;
        const ano = document.getElementById('admin-ano').value;
        const disciplina = document.getElementById('admin-disciplina').value;
        const descricao = document.getElementById('admin-descricao').value;
        const url = document.getElementById('admin-url').value;

        if (!titulo) {
            secureAuth.mostrarNotificacao('❌ Preencha o título do conteúdo', 'error');
            return;
        }

        if (!url) {
            secureAuth.mostrarNotificacao('❌ Forneça a URL do Google Drive', 'error');
            return;
        }

        const novoMaterial = {
            id: Date.now(),
            titulo: titulo,
            instituicao: instituicao,
            tipo: tipo,
            disciplina: disciplina,
            ano: ano,
            descricao: descricao,
            url: url,
            dataPublicacao: new Date().toISOString().split('T')[0],
            visualizacoes: 0,
            downloads: 0
        };

        mainSystem.materiais.push(novoMaterial);
        mainSystem.salvarMateriais();
        mainSystem.atualizarConteudo();
        
        if (typeof estatisticasSystem !== 'undefined') {
            estatisticasSystem.atualizarEstatisticas();
        }

        this.limparFormulario();
        this.carregarConteudoAbaAtual();
        
        secureAuth.mostrarNotificacao('✅ Conteúdo publicado com sucesso!', 'success');
    }

    // Remover material
    removerMaterial(id) {
        if (!secureAuth.verificarAuth()) return;
        
        if (confirm('Tem certeza que deseja remover este material?')) {
            const index = mainSystem.materiais.findIndex(m => m.id === id);
            if (index !== -1) {
                mainSystem.materiais.splice(index, 1);
                mainSystem.salvarMateriais();
                mainSystem.atualizarConteudo();
                this.carregarConteudoAbaAtual();
                
                if (typeof estatisticasSystem !== 'undefined') {
                    estatisticasSystem.atualizarEstatisticas();
                }
                
                secureAuth.mostrarNotificacao('🗑️ Material removido com sucesso!', 'success');
            }
        }
    }

    // Limpar formulário
    limparFormulario() {
        document.getElementById('admin-titulo').value = '';
        document.getElementById('admin-disciplina').value = '';
        document.getElementById('admin-descricao').value = '';
        document.getElementById('admin-url').value = '';
    }

    // Recarregar materiais
    recarregarMateriais() {
        this.carregarConteudoAbaAtual();
        secureAuth.mostrarNotificacao('🔄 Lista atualizada!', 'success');
    }
}

// Instância global da interface admin
const adminInterface = new AdminInterface();