// Sistema de Filtros
class FiltrosSystem {
    constructor() {
        this.init();
    }

    init() {
        this.inicializarFiltros();
    }

    // Inicializar filtros
    inicializarFiltros() {
        this.popularInstituicoes();
        this.popularTipos();
        this.popularAnos();
    }

    // Popular select de instituições
    popularInstituicoes() {
        const select = document.getElementById('instituicao-filtro');
        if (!select) return;

        INSTITUICOES.forEach(inst => {
            const option = document.createElement('option');
            option.value = inst.sigla;
            option.textContent = inst.nome;
            select.appendChild(option);
        });
    }

    // Popular select de tipos
    popularTipos() {
        const select = document.getElementById('tipo-filtro');
        if (!select) return;

        TIPOS_CONTEUDO.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.valor;
            option.textContent = tipo.texto;
            select.appendChild(option);
        });
    }

    // Popular select de anos
    popularAnos() {
        const select = document.getElementById('ano-filtro');
        if (!select) return;

        const anoAtual = new Date().getFullYear();
        for (let ano = anoAtual; ano >= 2010; ano--) {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            select.appendChild(option);
        }
    }
}

// Inicializar sistema de filtros
document.addEventListener('DOMContentLoaded', function() {
    new FiltrosSystem();
});