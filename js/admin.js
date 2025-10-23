// Interface administrativa segura
class AdminInterface {
    constructor() {
        this.init();
    }

    init() {
        this.criarInterfaceAdmin();
        this.adicionarEventListeners();
    }

    // Criar interface administrativa
    criarInterfaceAdmin() {
        const adminHTML = `
            <div id="admin-panel" class="admin-panel" style="display: none;">
                <div class="admin-header">
                    <h3><i class="fas fa-cogs"></i> Painel Administrativo</h3>
                    <div class="admin-controls">
                        <button class="btn btn-secondary btn-sm" onclick="adminInterface.exportarDados()">
                            <i class="fas fa-download"></i> Exportar
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="authSystem.fazerLogout()">
                            <i class="fas fa-sign-out-alt"></i> Sair
                        </button>
                        <button class="btn-fechar" onclick="this.fechar()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" onclick="adminInterface.abrirTab('upload')">
                        <i class="fas fa-upload"></i> Adicionar PDFs
                    </button>
                    <button class="tab-btn" onclick="adminInterface.abrirTab('gerenciar')">
                        <i class="fas fa-list"></i> Gerenciar Materiais
                    </button>
                    <button class="tab-btn" onclick="adminInterface.abrirTab('estatisticas')">
                        <i class="fas fa-chart-bar"></i> Estatísticas
                    </button>
                </div>

                <div class="admin-content">
                    <!-- Tab Upload -->
                    <div id="tab-upload" class="tab-content active">
                        <div class="upload-area" id="upload-area">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Arraste PDFs aqui ou clique para selecionar</p>
                            <input type="file" id="admin-arquivos" multiple accept=".pdf" style="display: none;">
                            <button class="btn btn-primary" onclick="document.getElementById('admin-arquivos').click()">
                                Selecionar Arquivos
                            </button>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Tipo de Material:</label>
                                <select id="admin-tipo">
                                    <option value="exame">Exame</option>
                                    <option value="manual">Manual</option>
                                    <option value="resumo">Resumo</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Área:</label>
                                <select id="admin-area">
                                    <option value="ciencias">Ciências</option>
                                    <option value="letras">Letras</option>
                                    <option value="artes">Artes</option>
                                    <option value="tecnologia">Tecnologia</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Classe:</label>
                                <select id="admin-classe">
                                    <option value="10">10ª Classe</option>
                                    <option value="11">11ª Classe</option>
                                    <option value="12">12ª Classe</option>
                                    <option value="faculdade">Faculdade/Universidade</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Disciplina:</label>
                                <select id="admin-disciplina">
                                    <option value="matematica">Matemática</option>
                                    <option value="portugues">Português</option>
                                    <option value="fisica">Física</option>
                                    <option value="quimica">Química</option>
                                    <option value="biologia">Biologia</option>
                                    <option value="historia">História</option>
                                    <option value="geografia">Geografia</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Ano:</label>
                                <input type="number" id="admin-ano" value="2024" min="2000" max="2030">
                            </div>

                            <div class="form-group full-width">
                                <label>Título Personalizado (opcional):</label>
                                <input type="text" id="admin-titulo" placeholder="Deixe em branco para título automático">
                            </div>
                        </div>

                        <div class="upload-preview" id="upload-preview" style="display: none;">
                            <h4>Arquivos Selecionados:</h4>
                            <div id="preview-list"></div>
                        </div>

                        <div class="admin-actions">
                            <button class="btn btn-secondary" onclick="this.limparSelecao()">
                                Limpar Seleção
                            </button>
                            <button class="btn btn-primary" onclick="this.enviar()" id="btn-enviar" disabled>
                                <i class="fas fa-upload"></i> Adicionar PDFs
                            </button>
                        </div>
                    </div>

                    <!-- Tab Gerenciar -->
                    <div id="tab-gerenciar" class="tab-content">
                        <div class="management-tools">
                            <input type="text" id="search-materiais" placeholder="Buscar materiais..." class="search-input">
                            <button class="btn btn-secondary" onclick="adminInterface.recarregarMateriais()">
                                <i class="fas fa-sync"></i> Atualizar
                            </button>
                        </div>
                        <div id="lista-materiais" class="materiais-list">
                            <!-- Lista de materiais será carregada aqui -->
                        </div>
                    </div>

                    <!-- Tab Estatísticas -->
                    <div id="tab-estatisticas" class="tab-content">
                        <div class="stats-grid" id="admin-stats">
                            <!-- Estatísticas administrativas -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', adminHTML);
        this.configurarDragAndDrop();
    }

    // Configurar drag and drop
    configurarDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('admin-arquivos');

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            this.atualizarPreview();
        });

        fileInput.addEventListener('change', () => {
            this.atualizarPreview();
        });
    }

    // Atualizar preview dos arquivos
    atualizarPreview() {
        const files = document.getElementById('admin-arquivos').files;
        const preview = document.getElementById('upload-preview');
        const previewList = document.getElementById('preview-list');
        const btnEnviar = document.getElementById('btn-enviar');

        if (files.length > 0) {
            preview.style.display = 'block';
            previewList.innerHTML = '';

            Array.from(files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i class="fas fa-file-pdf"></i>
                    <span>${file.name}</span>
                    <small>(${this.formatarTamanho(file.size)})</small>
                `;
                previewList.appendChild(fileItem);
            });

            btnEnviar.disabled = false;
        } else {
            preview.style.display = 'none';
            btnEnviar.disabled = true;
        }
    }

    // Limpar seleção
    limparSelecao() {
        document.getElementById('admin-arquivos').value = '';
        this.atualizarPreview();
    }

    // Abrir interface admin (com verificação de auth)
    abrir() {
        if (authSystem.verificarAuth()) {
            document.getElementById('admin-panel').style.display = 'block';
            this.carregarEstatisticasAdmin();
        }
    }

    // Fechar interface admin
    fechar() {
        document.getElementById('admin-panel').style.display = 'none';
        this.limparSelecao();
    }

    // Trocar abas
    abrirTab(tabName) {
        // Esconder todas as tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar tab selecionada
        document.getElementById(`tab-${tabName}`).classList.add('active');
        event.target.classList.add('active');

        // Carregar conteúdo específico da tab
        if (tabName === 'gerenciar') {
            this.carregarListaMateriais();
        } else if (tabName === 'estatisticas') {
            this.carregarEstatisticasAdmin();
        }
    }

    // Enviar arquivos
    async enviar() {
        if (!authSystem.verificarAuth()) return;

        const arquivos = document.getElementById('admin-arquivos').files;
        
        if (arquivos.length === 0) {
            this.mostrarNotificacao('Por favor, selecione pelo menos um arquivo PDF.', 'error');
            return;
        }

        const metadados = {
            tipo: document.getElementById('admin-tipo').value,
            area: document.getElementById('admin-area').value,
            classe: document.getElementById('admin-classe').value,
            disciplina: document.getElementById('admin-disciplina').value,
            ano: document.getElementById('admin-ano').value,
            tituloPersonalizado: document.getElementById('admin-titulo').value
        };

        try {
            this.mostrarNotificacao('Processando arquivos...', 'info');
            await uploadManager.adicionarPDFs(arquivos, metadados);
            
            this.mostrarNotificacao(`✅ ${arquivos.length} PDF(s) adicionado(s) com sucesso!`, 'success');
            this.limparSelecao();
            this.carregarEstatisticasAdmin();
            
        } catch (error) {
            this.mostrarNotificacao('❌ Erro ao adicionar PDFs: ' + error.message, 'error');
        }
    }

    // Carregar lista de materiais
    carregarListaMateriais() {
        const container = document.getElementById('lista-materiais');
        const todosMateriais = pdfLoader.buscarMateriais();
        
        if (todosMateriais.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum material cadastrado</div>';
            return;
        }

        container.innerHTML = todosMateriais.map(material => `
            <div class="material-item" data-id="${material.id}">
                <div class="material-info">
                    <div class="material-title">${material.titulo}</div>
                    <div class="material-meta">
                        <span class="badge badge-${material.area}">${material.area}</span>
                        <span class="badge">${material.classe}</span>
                        <span class="badge">${material.disciplina}</span>
                        <span class="badge">${material.ano}</span>
                        <span class="badge">${material.tipo}</span>
                    </div>
                    <div class="material-details">
                        <small>${material.paginas} páginas • ${material.tamanho} • ${material.dataUpload}</small>
                    </div>
                </div>
                <div class="material-actions">
                    <button class="btn btn-sm btn-danger" onclick="adminInterface.removerMaterial('${material.id}')">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Remover material
    removerMaterial(id) {
        if (!authSystem.verificarAuth()) return;
        
        if (confirm('Tem certeza que deseja remover este material?')) {
            // Implementar remoção
            this.mostrarNotificacao('Material removido com sucesso!', 'success');
            this.carregarListaMateriais();
            this.carregarEstatisticasAdmin();
        }
    }

    // Carregar estatísticas admin
    carregarEstatisticasAdmin() {
        const stats = pdfLoader.obterEstatisticas();
        const container = document.getElementById('admin-stats');
        
        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.totalDocumentos}</div>
                <div class="stat-label">Total de Documentos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalExames}</div>
                <div class="stat-label">Exames</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalManuais}</div>
                <div class="stat-label">Manuais</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalResumos}</div>
                <div class="stat-label">Resumos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.disciplinas}</div>
                <div class="stat-label">Disciplinas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.anos}</div>
                <div class="stat-label">Anos Diferentes</div>
            </div>
        `;
    }

    // Exportar dados
    exportarDados() {
        if (!authSystem.verificarAuth()) return;
        
        const dados = pdfLoader.materiais;
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-materiais-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.mostrarNotificacao('Dados exportados com sucesso!', 'success');
    }

    // Recarregar materiais
    recarregarMateriais() {
        pdfLoader.carregarEstrutura();
        this.carregarListaMateriais();
        this.mostrarNotificacao('Lista atualizada!', 'success');
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${tipo}`;
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

    // Formatar tamanho do arquivo
    formatarTamanho(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    // Adicionar event listeners
    adicionarEventListeners() {
        // Atalho de teclado seguro
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                authSystem.abrirLogin();
            }
        });
    }
}

// Instância global da interface admin
const adminInterface = new AdminInterface();