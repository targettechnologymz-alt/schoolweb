// Sistema Principal do Site
class MainSystem {
    constructor() {
        this.materiais = this.carregarMateriais();
        this.init();
    }

    init() {
        this.inicializarComponentes();
        this.adicionarEventListeners();
    }

    // Inicializar componentes
    inicializarComponentes() {
        console.log('🚀 Arquivo Acadêmico - Inicializando...');
        
        // Efeito de digitação no título
        this.iniciarEfeitoDigitacao();
        
        // Carregar conteúdo
        this.carregarConteudo();
    }

    // Efeito de digitação no título
    iniciarEfeitoDigitacao() {
        const titulo = document.querySelector('header h1');
        if (!titulo) return;

        const textoOriginal = titulo.textContent;
        titulo.textContent = '';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < textoOriginal.length) {
                titulo.textContent += textoOriginal.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 50);
    }

    // Carregar conteúdo na página
    carregarConteudo() {
        const conteudoPrincipal = document.getElementById('conteudo-principal');
        if (!conteudoPrincipal) return;
        
        // Agrupar materiais por tipo
        const materiaisPorTipo = this.agruparMateriaisPorTipo();
        
        // Criar seções para cada tipo
        Object.keys(materiaisPorTipo).forEach(tipo => {
            if (materiaisPorTipo[tipo].length > 0) {
                const secao = this.criarSecao(tipo, materiaisPorTipo[tipo]);
                conteudoPrincipal.appendChild(secao);
            }
        });
        
        // Se não há conteúdo
        if (conteudoPrincipal.innerHTML === '') {
            conteudoPrincipal.innerHTML = this.criarMensagemSemResultados();
        }
    }

    // Agrupar materiais por tipo
    agruparMateriaisPorTipo() {
        const materiaisPorTipo = {};
        
        TIPOS_CONTEUDO.forEach(tipo => {
            materiaisPorTipo[tipo.valor] = this.materiais.filter(m => m.tipo === tipo.valor);
        });
        
        return materiaisPorTipo;
    }

    // Criar seção de conteúdo
    criarSecao(tipo, itens) {
        const secao = document.createElement('section');
        secao.className = 'secao-conteudo';
        
        const tipoInfo = TIPOS_CONTEUDO.find(t => t.valor === tipo);
        const tituloSecao = document.createElement('h2');
        tituloSecao.innerHTML = `<i class="fas ${tipoInfo.icone}"></i> ${tipoInfo.texto}`;
        secao.appendChild(tituloSecao);
        
        const listaContainer = document.createElement('div');
        listaContainer.className = 'lista-conteudo';
        
        // Filtrar itens baseado nos filtros ativos
        const itensFiltrados = this.filtrarMateriais(itens);
        
        if (itensFiltrados.length === 0) {
            listaContainer.innerHTML = this.criarMensagemSemResultados(tipoInfo.texto.toLowerCase());
        } else {
            listaContainer.innerHTML = itensFiltrados.map(item => this.criarItemHTML(item)).join('');
        }
        
        secao.appendChild(listaContainer);
        return secao;
    }

    // Criar HTML para um item
    criarItemHTML(item) {
        const instituicao = INSTITUICOES.find(inst => inst.sigla === item.instituicao);
        const tipoInfo = TIPOS_CONTEUDO.find(t => t.valor === item.tipo);
        
        const botao = item.url ? 
            `<a href="${item.url}" target="_blank" class="btn-download" onclick="mainSystem.registrarDownload(${item.id})">
                <i class="fas fa-download"></i> Baixar PDF
            </a>` :
            `<a href="${item.url}" target="_blank" class="btn-download btn-video" onclick="mainSystem.registrarVisualizacao(${item.id})">
                <i class="fas fa-external-link-alt"></i> Ver Online
            </a>`;
        
        const stats = `
            <div class="exame-meta">
                <span><i class="fas fa-eye"></i> ${item.visualizacoes || 0} visualizações</span>
                ${item.downloads ? `<span><i class="fas fa-download"></i> ${item.downloads} downloads</span>` : ''}
                <span><i class="fas fa-calendar"></i> ${this.formatarData(item.dataPublicacao)}</span>
            </div>
        `;
        
        return `
            <div class="exame-item">
                <div class="exame-info">
                    <div class="exame-titulo">
                        <i class="fas ${tipoInfo.icone}"></i>
                        ${item.titulo}
                    </div>
                    <div class="exame-meta">
                        <span><i class="fas fa-university"></i> ${instituicao.nome}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${item.ano}</span>
                        <span><i class="fas fa-tag"></i> ${tipoInfo.texto}</span>
                        ${item.disciplina ? `<span><i class="fas fa-book"></i> ${item.disciplina}</span>` : ''}
                    </div>
                    ${item.descricao ? `<p style="margin-top: 10px; color: #666; font-size: 0.9rem;">${item.descricao}</p>` : ''}
                    ${stats}
                </div>
                <div class="exame-acoes">
                    ${botao}
                </div>
            </div>
        `;
    }

    // Criar mensagem sem resultados
    criarMensagemSemResultados(tipo = 'conteúdo') {
        return `
            <div class="sem-resultados">
                <i class="fas fa-search"></i>
                <h3>Nenhum ${tipo} encontrado</h3>
                <p>Tente ajustar os filtros para ver mais resultados.</p>
            </div>
        `;
    }

    // Filtrar materiais
    filtrarMateriais(lista = this.materiais) {
        const instituicao = document.getElementById('instituicao-filtro')?.value || 'todos';
        const tipo = document.getElementById('tipo-filtro')?.value || 'todos';
        const ano = document.getElementById('ano-filtro')?.value || 'todos';
        
        return lista.filter(item => {
            if (instituicao !== 'todos' && item.instituicao !== instituicao) return false;
            if (tipo !== 'todos' && item.tipo !== tipo) return false;
            if (ano !== 'todos' && item.ano !== ano) return false;
            return true;
        });
    }

    // Registrar visualização
    registrarVisualizacao(id) {
        const material = this.materiais.find(m => m.id === id);
        if (material) {
            material.visualizacoes = (material.visualizacoes || 0) + 1;
            this.salvarMateriais();
        }
    }

    // Registrar download
    registrarDownload(id) {
        const material = this.materiais.find(m => m.id === id);
        if (material) {
            material.downloads = (material.downloads || 0) + 1;
            material.visualizacoes = (material.visualizacoes || 0) + 1;
            this.salvarMateriais();
        }
    }

    // Carregar materiais do localStorage
    carregarMateriais() {
        const salvos = localStorage.getItem('arquivoAcademico_materiais');
        return salvos ? JSON.parse(salvos) : MATERIAIS_INICIAIS;
    }

    // Salvar materiais no localStorage
    salvarMateriais() {
        localStorage.setItem('arquivoAcademico_materiais', JSON.stringify(this.materiais));
    }

    // Formatar data
    formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-PT');
    }

    // Adicionar event listeners
    adicionarEventListeners() {
        // Recarregar conteúdo quando os filtros mudarem
        const filtros = ['instituicao-filtro', 'tipo-filtro', 'ano-filtro'];
        filtros.forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                this.mostrarLoading();
                setTimeout(() => {
                    this.carregarConteudo();
                    this.esconderLoading();
                }, 300);
            });
        });

        // Botão limpar filtros
        document.getElementById('btn-limpar')?.addEventListener('click', () => {
            this.limparFiltros();
        });
    }

    // Mostrar loading
    mostrarLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'block';
    }

    // Esconder loading
    esconderLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    // Limpar filtros
    limparFiltros() {
        document.getElementById('instituicao-filtro').value = 'todos';
        document.getElementById('tipo-filtro').value = 'todos';
        document.getElementById('ano-filtro').value = 'todos';
        this.carregarConteudo();
    }

    // Atualizar conteúdo (chamado pelo admin)
    atualizarConteudo() {
        this.materiais = this.carregarMateriais();
        this.carregarConteudo();
    }
}

// Instância global do sistema principal
const mainSystem = new MainSystem();