// Dados dos materiais (em produção, isso viria de uma API ou JSON)
const materiais = {
    "exames": [
        {
            "id": 1,
            "titulo": "Matemática - Exame Final",
            "area": "ciencias",
            "classe": "10",
            "disciplina": "matematica",
            "ano": "2024",
            "tipo": "exame",
            "arquivo": "documentos/exames/10-classe/matematica/exame_2024.pdf",
            "paginas": 15,
            "categoria": "categoria-ciencias"
        },
        {
            "id": 2,
            "titulo": "Português - Exame de Recurso",
            "area": "letras",
            "classe": "12",
            "disciplina": "portugues",
            "ano": "2023",
            "tipo": "exame",
            "arquivo": "documentos/exames/12-classe/portugues/exame_recurso_2023.pdf",
            "paginas": 12,
            "categoria": "categoria-letras"
        },
        {
            "id": 3,
            "titulo": "Física I - Prova 1",
            "area": "ciencias",
            "classe": "faculdade",
            "disciplina": "fisica",
            "ano": "2022",
            "tipo": "exame",
            "arquivo": "documentos/exames/faculdade/fisica/prova_1_2022.pdf",
            "paginas": 8,
            "categoria": "categoria-ciencias"
        }
    ],
    "materiais": [
        {
            "id": 101,
            "titulo": "Resumo Completo de Química Orgânica",
            "area": "ciencias",
            "classe": "12",
            "disciplina": "quimica",
            "ano": "2024",
            "tipo": "material",
            "arquivo": "documentos/resumos/ciencias/quimica_organica.pdf",
            "paginas": 20,
            "categoria": "categoria-ciencias"
        },
        {
            "id": 102,
            "titulo": "Análise do Livro Memorial do Convento",
            "area": "letras",
            "classe": "12",
            "disciplina": "portugues",
            "ano": "2024",
            "tipo": "video",
            "url": "https://www.youtube.com/watch?v=EXEMPLO1",
            "categoria": "categoria-letras"
        },
        {
            "id": 103,
            "titulo": "Introdução à Programação Python",
            "area": "tecnologia",
            "classe": "faculdade",
            "disciplina": "programacao",
            "ano": "2024",
            "tipo": "material",
            "arquivo": "documentos/manuais/programacao/python_intro.pdf",
            "paginas": 35,
            "categoria": "categoria-tecnologia"
        }
    ]
};

// Inicialização do site
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Arquivo Acadêmico - Inicializando...');
    
    // Inicializar componentes
    inicializarFiltros();
    carregarConteudo();
    inicializarEstatisticas();
    
    // Efeito de digitação no título
    const titulo = document.querySelector('header h1');
    const textoOriginal = titulo.innerHTML;
    titulo.innerHTML = '';
    
    let i = 0;
    const typingEffect = setInterval(() => {
        if (i < textoOriginal.length) {
            titulo.innerHTML += textoOriginal.charAt(i);
            i++;
        } else {
            clearInterval(typingEffect);
        }
    }, 50);
});

// Carregar conteúdo na página
function carregarConteudo() {
    const conteudoPrincipal = document.getElementById('conteudo-principal');
    
    // Seção de Exames
    const secaoExames = criarSecao('Exames para Download (PDF)', 'exames', 'fa-file-pdf');
    conteudoPrincipal.appendChild(secaoExames);
    
    // Seção de Materiais
    const secaoMateriais = criarSecao('Materiais de Estudo & Vídeos', 'materiais', 'fa-video');
    conteudoPrincipal.appendChild(secaoMateriais);
    
    // Aplicar filtros iniciais
    filtrarConteudo();
}

// Criar seção de conteúdo
function criarSecao(titulo, tipo, icone) {
    const secao = document.createElement('section');
    secao.className = 'secao-conteudo';
    
    const tituloSecao = document.createElement('h2');
    tituloSecao.innerHTML = `<i class="fas ${icone}"></i> ${titulo}`;
    secao.appendChild(tituloSecao);
    
    const listaContainer = document.createElement('div');
    listaContainer.id = `lista-${tipo}`;
    listaContainer.className = 'lista-conteudo';
    secao.appendChild(listaContainer);
    
    return secao;
}

// Carregar itens em uma seção
function carregarItensSecao(tipo, filtros = {}) {
    const container = document.getElementById(`lista-${tipo}`);
    const itensFiltrados = filtrarItens(materiais[tipo], filtros);
    
    if (itensFiltrados.length === 0) {
        container.innerHTML = `
            <div class="sem-resultados">
                <i class="fas fa-search"></i>
                <h3>Nenhum material encontrado</h3>
                <p>Tente ajustar os filtros para ver mais resultados.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = itensFiltrados.map(item => criarItemHTML(item)).join('');
}

// Filtrar itens baseado nos filtros
function filtrarItens(itens, filtros) {
    return itens.filter(item => {
        if (filtros.area && filtros.area !== 'todos' && item.area !== filtros.area) return false;
        if (filtros.classe && filtros.classe !== 'todos' && item.classe !== filtros.classe) return false;
        if (filtros.disciplina && filtros.disciplina !== 'todos' && item.disciplina !== filtros.disciplina) return false;
        if (filtros.ano && filtros.ano !== 'todos' && item.ano !== filtros.ano) return false;
        return true;
    });
}

// Criar HTML para um item
function criarItemHTML(item) {
    const isVideo = item.tipo === 'video';
    const botao = isVideo ? 
        `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-download btn-video">
            <i class="fas fa-play-circle"></i> Ver Vídeo
        </a>` :
        `<a href="${item.arquivo}" target="_blank" rel="noopener noreferrer" class="btn-download">
            <i class="fas fa-download"></i> Baixar ${item.tipo === 'exame' ? 'PDF' : 'Material'}
        </a>`;
    
    const metaPaginas = item.paginas ? 
        `<span><i class="fas fa-file-alt"></i> ${item.paginas} páginas</span>` : '';
    
    return `
        <div class="exame-item ${item.categoria}" 
             data-area="${item.area}" 
             data-classe="${item.classe}" 
             data-disciplina="${item.disciplina}" 
             data-ano="${item.ano}">
            <div class="exame-info">
                <div class="exame-titulo">${item.titulo}</div>
                <div class="exame-meta">
                    <span><i class="fas fa-layer-group"></i> ${formatarTexto(item.area)}</span>
                    <span><i class="fas fa-user-graduate"></i> ${formatarClasse(item.classe)}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${item.ano}</span>
                    ${metaPaginas}
                </div>
            </div>
            <div class="exame-acoes">
                ${botao}
            </div>
        </div>
    `;
}

// Funções auxiliares
function formatarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarClasse(classe) {
    const classes = {
        '10': '10ª Classe',
        '11': '11ª Classe',
        '12': '12ª Classe',
        'faculdade': 'Faculdade/Universidade'
    };
    return classes[classe] || classe;
}