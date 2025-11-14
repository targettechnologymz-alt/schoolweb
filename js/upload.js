// Sistema de Upload com Google Drive
class UploadSystem {
    constructor() {
        this.uploadQueue = [];
        this.isProcessing = false;
    }

    // Processar upload de arquivos
    async processarUpload(arquivos) {
        for (const arquivo of arquivos) {
            if (arquivo.type !== 'application/pdf') {
                this.mostrarNotificacao(`⚠️ Arquivo ignorado (não é PDF): ${arquivo.name}`, 'warning');
                continue;
            }

            this.uploadQueue.push(arquivo);
        }

        if (!this.isProcessing) {
            await this.processarFila();
        }
    }

    // Processar fila de uploads
    async processarFila() {
        if (this.uploadQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const arquivo = this.uploadQueue.shift();

        try {
            await this.processarArquivoIndividual(arquivo);
            this.mostrarNotificacao(`✅ PDF processado: ${arquivo.name}`, 'success');
        } catch (error) {
            this.mostrarNotificacao(`❌ Erro ao processar ${arquivo.name}: ${error.message}`, 'error');
        }

        // Processar próximo item
        setTimeout(() => this.processarFila(), 100);
    }

    // Processar arquivo individual
    async processarArquivoIndividual(arquivo) {
        // Obter metadados do formulário
        const metadados = this.obterMetadadosFormulario();
        
        // Sistema de upload manual via Google Drive
        this.mostrarNotificacao(`
            <div style="text-align: left;">
                <h4>📁 Upload Manual no Google Drive</h4>
                <ol>
                    <li>Faça upload do arquivo "<strong>${arquivo.name}</strong>" no Google Drive</li>
                    <li><strong>Pasta recomendada:</strong> ${metadados.tipo}s/${metadados.instituicao}/</li>
                    <li>Clique com botão direito → "Compartilhar"</li>
                    <li>Defina como "Qualquer pessoa com o link pode ver"</li>
                    <li>Cole o link abaixo</li>
                </ol>
            </div>
        `, 'info', 15000);
        
        const linkDrive = prompt(`📎 Cole o link do Google Drive para "${arquivo.name}":`);
        
        if (linkDrive && linkDrive.includes('drive.google.com')) {
            const urlFinal = this.converterLinkDriveParaDownload(linkDrive);
            
            // Criar material
            const material = {
                id: Date.now(),
                titulo: metadados.tituloPersonalizado || this.gerarTitulo(metadados, arquivo.name),
                instituicao: metadados.instituicao,
                tipo: metadados.tipo,
                disciplina: metadados.disciplina,
                ano: metadados.ano,
                descricao: metadados.descricao,
                url: urlFinal,
                dataPublicacao: new Date().toISOString().split('T')[0],
                visualizacoes: 0,
                downloads: 0,
                nomeArquivo: arquivo.name,
                tamanho: this.formatarTamanho(arquivo.size)
            };

            // Adicionar ao sistema
            mainSystem.materiais.push(material);
            mainSystem.salvarMateriais();
            mainSystem.atualizarConteudo();
            
            if (typeof estatisticasSystem !== 'undefined') {
                estatisticasSystem.atualizarEstatisticas();
            }
            
            // Limpar formulário
            this.limparFormulario();
            
            this.mostrarNotificacao('✅ Link do Google Drive processado com sucesso!', 'success');
        } else if (linkDrive) {
            throw new Error('Link inválido. Use um link do Google Drive.');
        } else {
            throw new Error('Upload cancelado pelo usuário.');
        }
    }

    // Obter metadados do formulário
    obterMetadadosFormulario() {
        return {
            tipo: document.getElementById('admin-tipo').value,
            instituicao: document.getElementById('admin-instituicao').value,
            ano: document.getElementById('admin-ano').value,
            disciplina: document.getElementById('admin-disciplina').value,
            tituloPersonalizado: document.getElementById('admin-titulo').value,
            descricao: document.getElementById('admin-descricao').value
        };
    }

    // Gerar título automático
    gerarTitulo(metadados, nomeArquivo) {
        const instituicao = INSTITUICOES.find(inst => inst.sigla === metadados.instituicao);
        const tipoInfo = TIPOS_CONTEUDO.find(t => t.valor === metadados.tipo);
        
        return `${tipoInfo.texto} - ${metadados.disciplina} - ${instituicao.nome} - ${metadados.ano}`;
    }

    // Converter link do Google Drive para download
    converterLinkDriveParaDownload(linkVisualizacao) {
        const match = linkVisualizacao.match(/\/d\/([^\/]+)\//);
        if (match && match[1]) {
            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
        return linkVisualizacao;
    }

    // Limpar formulário
    limparFormulario() {
        document.getElementById('admin-titulo').value = '';
        document.getElementById('admin-disciplina').value = '';
        document.getElementById('admin-descricao').value = '';
        document.getElementById('admin-arquivos').value = '';
        
        if (typeof adminInterface !== 'undefined') {
            adminInterface.limparSelecao();
        }
    }

    // Formatar tamanho do arquivo
    formatarTamanho(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'info') {
        authSystem.mostrarNotificacao(mensagem, tipo);
    }
}

// Instância global do sistema de upload
const uploadSystem = new UploadSystem();