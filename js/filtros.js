// Configuração dos filtros
const opcoesFiltros = {
    areas: [
        { valor: 'todos', texto: 'Todas as Áreas' },
        { valor: 'ciencias', texto: 'Ciências' },
        { valor: 'letras', texto: 'Letras' },
        { valor: 'artes', texto: 'Artes' },
        { valor: 'tecnologia', texto: 'Tecnologia' }
    ],
    classes: [
        { valor: 'todos', texto: 'Todas as Classes' },
        { valor: '10', texto: '10ª Classe' },
        { valor: '11', texto: '11ª Classe' },
        { valor: '12', texto: '12ª Classe' },
        { valor: 'faculdade', texto: 'Faculdade/Universidade' }
    ],
    disciplinas: [
        { valor: 'todos', texto: 'Todas as Disciplinas' },
        { valor: 'matematica', texto: 'Matemática' },
        { valor: 'portugues', texto: 'Português' },
        { valor: 'fisica', texto: 'Física' },
        { valor: 'quimica', texto: 'Química' },
        { valor: 'biologia', texto: 'Biologia' },
        { valor: 'historia', texto: 'História' },
        { valor: 'geografia', texto: 'Geografia' },
        { valor: 'ingles', texto: 'Inglês' },
        { valor: 'filosofia', texto: 'Filosofia' },
        { valor: 'programacao', texto: 'Programação' }
    ],
    anos: [
        { valor: 'todos', texto: 'Todos os Anos' },
        { valor: '2024', texto: '2024' },
        { valor: '2023', texto: '2023' },
        { valor: '2022', texto: '2022' },
        { valor: '2021', texto: '2021' },
        { valor: '2020', texto: '2020' }
    ]
};

// Inicializar filtros
function inicializarFiltros() {
    popularSelect('area-filtro', opcoesFiltros.areas);
    popularSelect('classe-filtro', opcoesFiltros.classes);
    popularSelect('disciplina-filtro', opcoesFiltros.disciplinas);
    popularSelect('ano-filtro', opcoesFiltros.anos);
    
    // Event listeners
    document.getElementById('area-filtro').addEventListener('change', filtrarConteudo);
    document.getElementById('classe-filtro').addEventListener('change', filtrarConteudo);
    document.getElementById('disciplina-filtro').addEventListener('change', filtrarConteudo);
    document.getElementById('ano-filtro').addEventListener('change', filtrarConteudo);
    document.getElementById('btn-limpar').addEventListener('click', limparFiltros);
}

// Popular select com opções
function popularSelect(id, opcoes) {
    const select = document.getElementById(id);
    select.innerHTML = opcoes.map(opcao => 
        `<option value="${opcao.valor}">${opcao.texto}</option>`
    ).join('');
}

// Filtrar conteúdo
function filtrarConteudo() {
    mostrarLoading();
    
    setTimeout(() => {
        const filtros = {
            area: document.getElementById('area-filtro').value,
            classe: document.getElementById('classe-filtro').value,
            disciplina: document.getElementById('disciplina-filtro').value,
            ano: document.getElementById('ano-filtro').value
        };
        
        carregarItensSecao('exames', filtros);
        carregarItensSecao('materiais', filtros);
        
        esconderLoading();
    }, 300);
}

// Limpar filtros
function limparFiltros() {
    document.getElementById('area-filtro').value = 'todos';
    document.getElementById('classe-filtro').value = 'todos';
    document.getElementById('disciplina-filtro').value = 'todos';
    document.getElementById('ano-filtro').value = 'todos';
    
    filtrarConteudo();
}

// Controles de loading
function mostrarLoading() {
    document.getElementById('loading').style.display = 'block';
}

function esconderLoading() {
    document.getElementById('loading').style.display = 'none';
}