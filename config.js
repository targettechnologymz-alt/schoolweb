// Configurações Ofuscadas - SEGURANÇA MÁXIMA
const _0x1a2b3c = {
    'x1y2z3': function(_0xabc, _0xdef) {
        return _0xabc + _0xdef;
    },
    'p4q5r6': 'd1775f67d3354030198fc2311f3dec8c1fc8326d9200fa58eee653776bf4d555',
    's7t8u9': 'ARQUIVO_ACADEMICO_CENTRAL_2024_SECRETO',
    'v0w1x2': 15 * 60 * 1000,
    'y3z4a5': 'ca-pub-1816282885500573',
    'b6c7d8': 'Arquivo Acadêmico Central',
    'e9f0g1': 'Portal educacional com exames, editais e materiais',
    'h2i3j4': '4.1.0',
    'k5l6m7': 'ACADEMICO_MOZ_2024_SECRETO',
    'n8o9p0': ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"],
    'q1r2s3': 'secret-admin-trigger'
};

// CONFIG Ofuscada
const CONFIG = {
    PASSWORD_HASH: _0x1a2b3c['p4q5r6'],
    SALT: _0x1a2b3c['s7t8u9'],
    SESSION_TIMEOUT: _0x1a2b3c['v0w1x2'],
    ADSENSE_CLIENT: _0x1a2b3c['y3z4a5'],
    SITE_NAME: _0x1a2b3c['b6c7d8'],
    SITE_DESCRIPTION: _0x1a2b3c['e9f0g1'],
    VERSION: _0x1a2b3c['h2i3j4'],
    SECRET_PATTERN: _0x1a2b3c['k5l6m7'],
    HIDDEN_KEY_SEQUENCE: _0x1a2b3c['n8o9p0'],
    SECRET_CLICK_ZONE: _0x1a2b3c['q1r2s3']
};

// Dados das Instituições (não ofuscar - dados públicos)
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