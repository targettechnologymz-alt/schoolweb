// Sistema de carregamento automático de PDFs
class PDFLoader {
    constructor() {
        this.materiais = {
            exames: [],
            manuais: [],
            resumos: []
        };
        this.basePath = 'documentos/';
    }

    // Carregar estrutura de PDFs
    async carregarEstrutura() {
        try {
            await this.carregarEstruturaFixa();
            this.salvarNoLocalStorage();
            return this.materiais;
        } catch (error) {
            console.error('Erro ao carregar estrutura:', error);
            return this.carregarDoLocalStorage();
        }
    }

    // Estrutura fixa dos materiais
    carregarEstruturaFixa() {
        this.materiais = {
            exames: [
                {
                    id: 'exame-matematica-10-2024',
                    titulo: 'Matemática - Exame Final 2024',
                    area: 'ciencias',
                    classe: '10',
                    disciplina: 'matematica',
                    ano: '2024',
                    tipo: 'exame',
                    arquivo: 'documentos/exames/10-classe/matematica/exame-final-2024.pdf',
                    paginas: 15,
                    tamanho: '2.4 MB',
                    categoria: 'categoria-ciencias',
                    dataUpload: '2024-01-15'
                },
                {
                    id: 'exame-portugues-12-2023',
                    titulo: 'Português - Exame de Recurso 2023',
                    area: 'letras',
                    classe: '12',
                    disciplina: 'portugues',
                    ano: '2023',
                    tipo: 'exame',
                    arquivo: 'documentos/exames/12-classe/portugues/exame-recurso-2023.pdf',
                    paginas: 12,
                    tamanho: '1.8 MB',
                    categoria: 'categoria-letras',
                    dataUpload: '2024-01-10'
                },
                {
                    id: 'prova-fisica-facul-2022',
                    titulo: 'Física I - Prova 1 - 2022',
                    area: 'ciencias',
                    classe: 'faculdade',
                    disciplina: 'fisica',
                    ano: '2022',
                    tipo: 'exame',
                    arquivo: 'documentos/exames/faculdade/fisica/prova-1-2022.pdf',
                    paginas: 8,
                    tamanho: '1.2 MB',
                    categoria: 'categoria-ciencias',
                    dataUpload: '2024-01-08'
                }
            ],
            manuais: [
                {
                    id: 'manual-matematica-2024',
                    titulo: 'Manual Completo de Matemática - 2024',
                    area: 'ciencias',
                    classe: 'todos',
                    disciplina: 'matematica',
                    ano: '2024',
                    tipo: 'manual',
                    arquivo: 'documentos/manuais/matematica/manual-completo-2024.pdf',
                    paginas: 45,
                    tamanho: '5.2 MB',
                    categoria: 'categoria-ciencias',
                    dataUpload: '2024-01-20'
                },
                {
                    id: 'guia-redacao-enem',
                    titulo: 'Guia Completo de Redação ENEM',
                    area: 'letras',
                    classe: '12',
                    disciplina: 'portugues',
                    ano: '2024',
                    tipo: 'manual',
                    arquivo: 'documentos/manuais/portugues/guia-redacao-enem.pdf',
                    paginas: 32,
                    tamanho: '3.8 MB',
                    categoria: 'categoria-letras',
                    dataUpload: '2024-01-18'
                }
            ],
            resumos: [
                {
                    id: 'resumo-quimica-organica',
                    titulo: 'Resumo Completo - Química Orgânica',
                    area: 'ciencias',
                    classe: '12',
                    disciplina: 'quimica',
                    ano: '2024',
                    tipo: 'resumo',
                    arquivo: 'documentos/resumos/ciencias/resumo-quimica-organica.pdf',
                    paginas: 25,
                    tamanho: '2.1 MB',
                    categoria: 'categoria-ciencias',
                    dataUpload: '2024-01-22'
                }
            ]
        };
        
        return Promise.resolve();
    }

    // Salvar no localStorage
    salvarNoLocalStorage() {
        localStorage.setItem('arquivoAcademico_materiais', JSON.stringify(this.materiais));
        localStorage.setItem('arquivoAcademico_ultimaAtualizacao', new Date().toISOString());
    }

    // Carregar do localStorage
    carregarDoLocalStorage() {
        const salvos = localStorage.getItem('arquivoAcademico_materiais');
        if (salvos) {
            this.materiais = JSON.parse(salvos);
            console.log('📚 Materiais carregados do cache');
        }
        return this.materiais;
    }

    // Adicionar novo material
    adicionarMaterial(tipo, material) {
        material.id = this.gerarID(tipo, material);
        material.dataUpload = new Date().toISOString().split('T')[0];
        
        this.materiais[tipo].push(material);
        this.salvarNoLocalStorage();
        
        console.log(`✅ Material adicionado: ${material.titulo}`);
        return material.id;
    }

    // Remover material
    removerMaterial(id) {
        const tipos = ['exames', 'manuais', 'resumos'];
        let removido = false;

        for (const tipo of tipos) {
            const antes = this.materiais[tipo].length;
            this.materiais[tipo] = this.materiais[tipo].filter(m => m.id !== id);
            if (this.materiais[tipo].length < antes) removido = true;
        }

        if (removido) {
            this.salvarNoLocalStorage();
            console.log(`🗑️ Material removido: ${id}`);
        } else {
            console.warn(`⚠️ Material com ID ${id} não encontrado.`);
        }
    }

    // Gerar ID único
    gerarID(tipo, material) {
        return `${tipo}-${material.disciplina}-${material.classe}-${Date.now()}`;
    }

    // Buscar materiais
    buscarMateriais(filtros = {}) {
        const todos = [
            ...this.materiais.exames,
            ...this.materiais.manuais,
            ...this.materiais.resumos
        ];

        return todos.filter(material => {
            return Object.keys(filtros).every(chave => material[chave] === filtros[chave]);
        });
    }

    // Estatísticas
    obterEstatisticas() {
        const todos = this.buscarMateriais();
        return {
            totalDocumentos: todos.length,
            totalExames: this.materiais.exames.length,
            totalManuais: this.materiais.manuais.length,
            totalResumos: this.materiais.resumos.length,
            disciplinas: new Set(todos.map(m => m.disciplina)).size,
            anos: new Set(todos.map(m => m.ano)).size
        };
    }
}

// Instância global
const pdfLoader = new PDFLoader();
export default pdfLoader;
