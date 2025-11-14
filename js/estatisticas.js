// Sistema de Estatísticas
class EstatisticasSystem {
    constructor() {
        this.init();
    }

    init() {
        this.inicializarEstatisticas();
    }

    // Inicializar estatísticas
    inicializarEstatisticas() {
        const container = document.getElementById('estatisticas');
        if (!container) return;

        const stats = this.calcularEstatisticas();
        
        container.innerHTML = this.criarHTMLEstatisticas();
        this.animarEstatisticas(stats);
    }

    // Calcular estatísticas
    calcularEstatisticas() {
        const materiais = mainSystem.materiais;
        const totalDocumentos = materiais.length;
        const instituicoesUnicas = new Set(materiais.map(m => m.instituicao)).size;
        const totalVisualizacoes = materiais.reduce((acc, m) => acc + (m.visualizacoes || 0), 0);
        const anosUnicos = new Set(materiais.map(m => m.ano)).size;
        
        return {
            totalDocumentos,
            totalInstituicoes: instituicoesUnicas,
            totalVisualizacoes,
            totalAnos: anosUnicos
        };
    }

    // Criar HTML das estatísticas
    criarHTMLEstatisticas() {
        return `
            <div class="estatistica-item">
                <div class="estatistica-numero" id="estatistica-documentos">0</div>
                <div class="estatistica-texto">Documentos Disponíveis</div>
            </div>
            <div class="estatistica-item">
                <div class="estatistica-numero" id="estatistica-instituicoes">0</div>
                <div class="estatistica-texto">Instituições</div>
            </div>
            <div class="estatistica-item">
                <div class="estatistica-numero" id="estatistica-visualizacoes">0</div>
                <div class="estatistica-texto">Visualizações</div>
            </div>
            <div class="estatistica-item">
                <div class="estatistica-numero" id="estatistica-anos">0</div>
                <div class="estatistica-texto">Anos de Conteúdo</div>
            </div>
        `;
    }

    // Animar números das estatísticas
    animarEstatisticas(stats) {
        this.animarNumero('estatistica-documentos', stats.totalDocumentos);
        this.animarNumero('estatistica-instituicoes', stats.totalInstituicoes);
        this.animarNumero('estatistica-visualizacoes', stats.totalVisualizacoes);
        this.animarNumero('estatistica-anos', stats.totalAnos);
    }

    // Animar número individual
    animarNumero(id, valorFinal) {
        const elemento = document.getElementById(id);
        if (!elemento) return;

        let contador = 0;
        const incremento = Math.ceil(valorFinal / 50);
        const intervalo = setInterval(() => {
            contador += incremento;
            if (contador >= valorFinal) {
                contador = valorFinal;
                clearInterval(intervalo);
            }
            elemento.textContent = contador.toLocaleString('pt-PT');
        }, 30);
    }

    // Atualizar estatísticas (chamado pelo admin)
    atualizarEstatisticas() {
        this.inicializarEstatisticas();
    }
}

// Inicializar sistema de estatísticas
document.addEventListener('DOMContentLoaded', function() {
    window.estatisticasSystem = new EstatisticasSystem();
});