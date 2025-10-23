// Sistema de upload e organização de PDFs
class UploadManager {
    constructor() {
        this.uploadQueue = [];
        this.isProcessing = false;
    }

    // Interface para adicionar PDFs
    async adicionarPDFs(arquivos, metadados) {
        for (const arquivo of arquivos) {
            if (arquivo.type !== 'application/pdf') {
                console.warn('⚠️ Arquivo ignorado (não é PDF):', arquivo.name);
                continue;
            }

            this.uploadQueue.push({
                arquivo,
                metadados: {
                    ...metadados,
                    nomeOriginal: arquivo.name,
                    tamanho: this.formatarTamanho(arquivo.size),
                    dataUpload: new Date().toISOString()
                }
            });
        }

        if (!this.isProcessing) {
            this.processarFila();
        }
    }

    // Processar fila de uploads
    async processarFila() {
        if (this.uploadQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const item = this.uploadQueue.shift();

        try {
            await this.processarArquivo(item);
            console.log(`✅ PDF processado: ${item.metadados.nomeOriginal}`);
        } catch (error) {
            console.error(`❌ Erro ao processar ${item.metadados.nomeOriginal}:`, error);
        }

        // Processar próximo item
        setTimeout(() => this.processarFila(), 100);
    }

    // Processar arquivo individual
    async processarArquivo(item) {
        // Em ambiente real, aqui você faria upload para servidor
        // Por enquanto, vamos simular o processamento
        
        const caminho = this.gerarCaminho(item.metadados);
        const material = {
            titulo: this.gerarTitulo(item.metadados, item.arquivo.name),
            area: item.metadados.area,
            classe: item.metadados.classe,
            disciplina: item.metadados.disciplina,
            ano: item.metadados.ano,
            tipo: item.metadados.tipo,
            arquivo: caminho,
            paginas: await this.estimarPaginas(item.arquivo),
            tamanho: item.metadados.tamanho,
            categoria: `categoria-${item.metadados.area}`
        };

        // Adicionar ao sistema
        pdfLoader.adicionarMaterial(item.metadados.tipo, material);
        
        // Em ambiente real: fazer upload do arquivo
        // await this.fazerUploadArquivo(item.arquivo, caminho);
    }

    // Gerar caminho do arquivo
    gerarCaminho(metadados) {
        const { tipo, classe, disciplina, ano } = metadados;
        
        let pastaClasse = 'faculdade';
        if (classe !== 'faculdade') {
            pastaClasse = `${classe}-classe`;
        }

        const nomeArquivo = this.gerarNomeArquivo(metadados);
        
        return `documentos/${tipo}s/${pastaClasse}/${disciplina}/${nomeArquivo}.pdf`;
    }

    // Gerar nome do arquivo
    gerarNomeArquivo(metadados) {
        const { tipo, disciplina, classe, ano } = metadados;
        const timestamp = Date.now();
        return `${tipo}-${disciplina}-${classe}-${ano}-${timestamp}`;
    }

    // Gerar título amigável
    gerarTitulo(metadados, nomeOriginal) {
        const { tipo, disciplina, classe, ano } = metadados;
        const nome = nomeOriginal.replace('.pdf', '').replace(/_/g, ' ');
        
        const tipos = {
            'exame': 'Exame',
            'manual': 'Manual',
            'resumo': 'Resumo'
        };

        const classes = {
            '10': '10ª Classe',
            '11': '11ª Classe', 
            '12': '12ª Classe',
            'faculdade': 'Faculdade'
        };

        return `${tipos[tipo]} - ${disciplina.charAt(0).toUpperCase() + disciplina.slice(1)} - ${classes[classe]} - ${ano}`;
    }

    // Estimar número de páginas (simulação)
    async estimarPaginas(arquivo) {
        // Em ambiente real, você usaria uma biblioteca PDF.js
        // Por enquanto, vamos estimar baseado no tamanho
        const tamanhoMB = arquivo.size / (1024 * 1024);
        return Math.max(1, Math.round(tamanhoMB * 5));
    }

    // Formatar tamanho do arquivo
    formatarTamanho(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}

// Instância global do upload manager
const uploadManager = new UploadManager();