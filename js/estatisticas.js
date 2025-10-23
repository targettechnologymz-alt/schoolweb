// Estatísticas do site
const estatisticas = {
    totalDocumentos: 0,
    totalDisciplinas: 0,
    totalVideos: 0,
    totalAnos: 0
};

// Inicializar estatísticas
function inicializarEstatisticas() {
    calcularEstatisticas();
    animarEstatisticas();
}

// Calcular estatísticas
function calcularEstatisticas() {
    // Combinar todos os materiais
    const todosMateriais = [...materiais.exames, ...materiais.materiais];
    
    // Calcular totais
    estatisticas.totalDocumentos = todosMateriais.length;
    
    // Disciplinas únicas
    const disciplinas = new Set(todosMateriais.map(item => item.disciplina));
    estatisticas.totalDisciplinas = disciplinas.size;
    
    // Vídeos
    estatisticas.totalVideos = materiais.materiais.filter(item => item.tipo === 'video').length;
    
    // Anos únicos
    const anos = new Set(todosMateriais.map(item => item.ano));
    estatisticas.totalAnos = anos.size;
}

// Animar estatísticas
function animarEstatisticas() {
    const elementos = [
        { id: 'estatistica-documentos', valor: estatisticas.totalDocumentos },
        { id: 'estatistica-disciplinas', valor: estatisticas.totalDisciplinas },
        { id: 'estatistica-videos', valor: estatisticas.totalVideos },
        { id: 'estatistica-anos', valor: estatisticas.totalAnos }
    ];

    // Criar elementos de estatística
    const container = document.getElementById('estatisticas');
    container.innerHTML = elementos.map(item => `
        <div class="estatistica-item">
            <div class="estatistica-numero" id="${item.id}">0</div>
            <div class="estatistica-texto">${formatarTextoEstatistica(item.id)}</div>
        </div>
    `).join('');

    // Animar números
    elementos.forEach(item => {
        const elemento = document.getElementById(item.id);
        let contador = 0;
        const incremento = Math.ceil(item.valor / 50);
        const intervalo = setInterval(() => {
            contador += incremento;
            if (contador >= item.valor) {
                contador = item.valor;
                clearInterval(intervalo);
            }
            elemento.textContent = contador;
        }, 30);
    });
}

// Formatar texto da estatística
function formatarTextoEstatistica(id) {
    const textos = {
        'estatistica-documentos': 'Documentos Disponíveis',
        'estatistica-disciplinas': 'Disciplinas',
        'estatistica-videos': 'Vídeos Educativos',
        'estatistica-anos': 'Anos de Conteúdo'
    };
    return textos[id] || id;
}