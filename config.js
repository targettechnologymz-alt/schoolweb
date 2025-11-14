// Configurações Ultra-Seguras
const CONFIG = {
    // Sistema de Autenticação Oculto
    ACCESS_CODE: "qwerqwer2025", // CÓDIGO MESTRE - ALTERE ESTA SENHA!
    ADMIN_HASH: "d1775f67d3354030198fc2311f3dec8c1fc8326d9200fa58eee653776bf4d555", // hash SHA256 de "admin"
    SESSION_TIMEOUT: 15 * 60 * 1000, // 15 minutos de sessão
    
    // Google AdSense
    ADSENSE_CLIENT: "ca-pub-1816282885500573",
    
    // Configurações do site
    SITE_NAME: "Arquivo Acadêmico Central",
    SITE_DESCRIPTION: "Portal educacional com exames, editais e materiais para universidades de Moçambique",
    VERSION: "4.0.0",
    
    // Sistema de acesso secreto
    SECRET_PATTERN: "ACADEMICO_MOZ", // Padrão secreto para acesso
    HIDDEN_KEY_SEQUENCE: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"], // Código Konami
    SECRET_CLICK_ZONE: "secret-admin-trigger" // ID da área de clique secreto
};

// Dados das Instituições
const INSTITUICOES = [
    { sigla: 'UEM', nome: 'Universidade Eduardo Mondlane' },
    { sigla: 'UJC', nome: 'Universidade Joaquim Chissano' },
    { sigla: 'UniLicungo', nome: 'Universidade Licungo' },
    { sigla: 'UniLúrio', nome: 'Universidade Lúrio' },
    { sigla: 'UniMaputo', nome: 'Universidade Maputo' },
    { sigla: 'UniPúnguè', nome: 'Universidade Púnguè' },
    { sigla: 'UniRovuma', nome: 'Universidade Rovuma' },
    { sigla: 'UniSave', nome: 'Universidade Save' },
    { sigla: 'UniZambeze', nome: 'Universidade Zambeze' },
    { sigla: 'ESCN', nome: 'Escola Superior de Ciências Naúticas' },
    { sigla: 'ESJ', nome: 'Escola Superior de Jornalismo' },
    { sigla: 'ISArC', nome: 'Instituto Superior de Artes e Cultura' },
    { sigla: 'ISCISA', nome: 'Instituto Superior de Ciências de Saúde' },
    { sigla: 'ISCAM', nome: 'Instituto Superior de Contabilidade e Auditoria' },
    { sigla: 'ISPG', nome: 'Instituto Superior Politécnico de Gaza' },
    { sigla: 'ISPM', nome: 'Instituto Superior Politécnico de Manica' },
    { sigla: 'ISPS', nome: 'Instituto Superior Politécnico de Songo' },
    { sigla: 'ISPT', nome: 'Instituto Superior Politécnico de Tete' },
    { sigla: 'ACIPOL', nome: 'Academia de Ciências Policiais' },
    { sigla: 'AMMSM', nome: 'Academia Militar Marechal Samora Machel' },
    { sigla: 'ISEDF', nome: 'Instituto Superior de Estudos de Defesa' }
];

// Tipos de conteúdo
const TIPOS_CONTEUDO = [
    { valor: 'exame', texto: 'Exame', icone: 'fa-file-pdf' },
    { valor: 'edital', texto: 'Edital', icone: 'fa-bullhorn' },
    { valor: 'noticia', texto: 'Notícia', icone: 'fa-newspaper' },
    { valor: 'manual', texto: 'Manual', icone: 'fa-book' },
    { valor: 'resumo', texto: 'Resumo', icone: 'fa-file-alt' }
];

// Dados iniciais dos materiais
const MATERIAIS_INICIAIS = [
    {
        id: 1,
        titulo: "Exame de Matemática - Final 2024",
        instituicao: "UEM",
        tipo: "exame",
        disciplina: "Matemática",
        ano: "2024",
        descricao: "Exame final de matemática da Universidade Eduardo Mondlane",
        url: "https://drive.google.com/uc?export=download&id=SEU_ID_AQUI",
        dataPublicacao: "2024-01-15",
        visualizacoes: 125,
        downloads: 89
    },
    {
        id: 2,
        titulo: "Edital de Inscrição - 2º Semestre 2024",
        instituicao: "UJC",
        tipo: "edital",
        disciplina: "Geral",
        ano: "2024",
        descricao: "Edital de inscrições para o segundo semestre de 2024",
        url: "https://www.ujc.ac.mz/editais/2024/semestre2",
        dataPublicacao: "2024-01-10",
        visualizacoes: 210,
        downloads: 0
    }
];