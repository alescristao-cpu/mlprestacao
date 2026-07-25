/* ----------------------------------------------------
   Modern Life Residence - Global Data Store & Mock Data
   ---------------------------------------------------- */

const STORAGE_KEY = 'MODERN_LIFE_CONDO_DATA_V2';
const CURRENT_USER_KEY = 'MODERN_LIFE_CURRENT_USER';

const INITIAL_DATA = {
  moradores: [
    {
      id: 'usr_admin',
      nome: 'Alessandro Cristiano da Silva',
      apartamento: '152',
      bloco: 'A',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      email: 'condominio.modern.life@gmail.com',
      status: 'Aprovado', // Aprovado, Pendente, Rejeitado
      role: 'Administrador', // Administrador, Conselheiro, Morador
      dataCadastro: '2025-01-10',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user'
    },
    {
      id: 'usr_02',
      nome: 'Mariana Castro',
      apartamento: '84',
      bloco: 'B',
      cpf: '234.567.890-11',
      telefone: '(11) 97654-3210',
      email: 'mariana.castro@gmail.com',
      status: 'Aprovado',
      role: 'Conselheiro',
      dataCadastro: '2025-02-15'
    },
    {
      id: 'usr_03',
      nome: 'Roberto Almeida',
      apartamento: '121',
      bloco: 'A',
      cpf: '345.678.901-22',
      telefone: '(11) 96543-2109',
      email: 'roberto.almeida@hotmail.com',
      status: 'Aprovado',
      role: 'Morador',
      dataCadastro: '2025-03-01'
    },
    {
      id: 'usr_04_pendente',
      nome: 'Fernanda Oliveira',
      apartamento: '43',
      bloco: 'A',
      cpf: '456.789.012-33',
      telefone: '(11) 95432-1098',
      email: 'fernanda.oliveira@gmail.com',
      status: 'Pendente',
      role: 'Morador',
      dataCadastro: '2026-07-20'
    }
  ],

  prestacaoContas: [
    {
      id: 'pc_2026_07',
      mesAno: 'Julho 2026',
      mes: 7,
      ano: 2026,
      receitas: 145800.00,
      despesas: 118450.00,
      saldo: 27350.00,
      status: 'Publicado',
      categoriasDespesa: [
        { nome: 'Folha de Pagamento & Encargos', valor: 54200.00 },
        { nome: 'Energia Elétrica & Água', valor: 22100.00 },
        { nome: 'Manutenção de Elevadores', valor: 14500.00 },
        { nome: 'Segurança & Portaria Remota', valor: 16800.00 },
        { nome: 'Jardinagem & Limpeza', valor: 6350.00 },
        { nome: 'Outros / Fundo de Reserva', valor: 4500.00 }
      ],
      pdfUrl: '#',
      excelUrl: '#'
    },
    {
      id: 'pc_2026_06',
      mesAno: 'Junho 2026',
      mes: 6,
      ano: 2026,
      receitas: 145200.00,
      despesas: 122100.00,
      saldo: 23100.00,
      status: 'Publicado',
      categoriasDespesa: [
        { nome: 'Folha de Pagamento & Encargos', valor: 54000.00 },
        { nome: 'Energia Elétrica & Água', valor: 24500.00 },
        { nome: 'Manutenção de Elevadores', valor: 14500.00 },
        { nome: 'Segurança & Portaria Remota', valor: 16800.00 },
        { nome: 'Jardinagem & Limpeza', valor: 7800.00 },
        { nome: 'Outros / Fundo de Reserva', valor: 4500.00 }
      ],
      pdfUrl: '#',
      excelUrl: '#'
    },
    {
      id: 'pc_2026_05',
      mesAno: 'Maio 2026',
      mes: 5,
      ano: 2026,
      receitas: 144500.00,
      despesas: 115200.00,
      saldo: 29300.00,
      status: 'Publicado',
      categoriasDespesa: [
        { nome: 'Folha de Pagamento & Encargos', valor: 53800.00 },
        { nome: 'Energia Elétrica & Água', valor: 19800.00 },
        { nome: 'Manutenção de Elevadores', valor: 14500.00 },
        { nome: 'Segurança & Portaria Remota', valor: 16800.00 },
        { nome: 'Jardinagem & Limpeza', valor: 5800.00 },
        { nome: 'Outros / Fundo de Reserva', valor: 4500.00 }
      ],
      pdfUrl: '#',
      excelUrl: '#'
    }
  ],

  balancetes: [
    {
      id: 'bal_2026_07',
      titulo: 'Balancete Consolidado - Julho 2026',
      ano: 2026,
      mes: 'Julho',
      dataPublicacao: '2026-07-22',
      receitaBruta: 145800.00,
      despesaBruta: 118450.00,
      saldoMes: 27350.00,
      arquivoPdf: 'Balancete_ModernLife_Julho2026.pdf'
    },
    {
      id: 'bal_2026_06',
      titulo: 'Balancete Consolidado - Junho 2026',
      ano: 2026,
      mes: 'Junho',
      dataPublicacao: '2026-06-25',
      receitaBruta: 145200.00,
      despesaBruta: 122100.00,
      saldoMes: 23100.00,
      arquivoPdf: 'Balancete_ModernLife_Junho2026.pdf'
    },
    {
      id: 'bal_2026_05',
      titulo: 'Balancete Consolidado - Maio 2026',
      ano: 2026,
      mes: 'Maio',
      dataPublicacao: '2026-05-24',
      receitaBruta: 144500.00,
      despesaBruta: 115200.00,
      saldoMes: 29300.00,
      arquivoPdf: 'Balancete_ModernLife_Maio2026.pdf'
    }
  ],

  contratos: [
    {
      id: 'ctr_01',
      empresa: 'Otis Elevadores S.A.',
      objeto: 'Manutenção Preventiva e Corretiva dos 4 Elevadores',
      valorMensal: 14500.00,
      vigenciaInicio: '2025-01-01',
      vigenciaFim: '2027-01-01',
      status: 'Ativo',
      arquivo: 'Contrato_Otis_Elevadores_2025_2027.pdf'
    },
    {
      id: 'ctr_02',
      empresa: 'SeguraPort Segurança e Monitoramento',
      objeto: 'Monitoramento 24h, Portaria Remota e Cftv',
      valorMensal: 16800.00,
      vigenciaInicio: '2024-06-01',
      vigenciaFim: '2026-06-01',
      status: 'Em Renovação',
      arquivo: 'Contrato_SeguraPort_2024_2026.pdf'
    },
    {
      id: 'ctr_03',
      empresa: 'Verde Vida Paisagismo',
      objeto: 'Manutenção dos Jardins e Áreas Verdes Externa',
      valorMensal: 3800.00,
      vigenciaInicio: '2025-03-01',
      vigenciaFim: '2026-03-01',
      status: 'Ativo',
      arquivo: 'Contrato_Verde_Vida_Jardinagem.pdf'
    },
    {
      id: 'ctr_04',
      empresa: 'Porto Seguro Cia de Seguros',
      objeto: 'Apólice de Seguro Condominial Compreensivo',
      valorMensal: 2950.00,
      vigenciaInicio: '2026-01-01',
      vigenciaFim: '2027-01-01',
      status: 'Ativo',
      arquivo: 'Apolice_Seguro_Predial_PortoSeguro.pdf'
    }
  ],

  documentos: [
    {
      id: 'doc_01',
      nome: 'Convenção do Condomínio Modern Life Residence',
      categoria: 'Convenção',
      dataUpload: '2024-01-15',
      tamanho: '4.2 MB',
      arquivo: 'Convencao_Modern_Life_Residence.pdf'
    },
    {
      id: 'doc_02',
      nome: 'Regimento Interno Atualizado 2025/2026',
      categoria: 'Regimento Interno',
      dataUpload: '2025-11-10',
      tamanho: '2.8 MB',
      arquivo: 'Regimento_Interno_2025_2026.pdf'
    },
    {
      id: 'doc_03',
      nome: 'Manual do Proprietário e Especificações Técnicas',
      categoria: 'Manual do Proprietário',
      dataUpload: '2024-02-01',
      tamanho: '8.5 MB',
      arquivo: 'Manual_Proprietario_ModernLife.pdf'
    },
    {
      id: 'doc_04',
      nome: 'Ata da Assembleia Geral Ordinária de Março 2026',
      categoria: 'Atas',
      dataUpload: '2026-03-28',
      tamanho: '1.4 MB',
      arquivo: 'Ata_AGO_Marco_2026.pdf'
    },
    {
      id: 'doc_05',
      nome: 'Normas de Uso do Salão de Festas e Churrasqueira',
      categoria: 'Normas',
      dataUpload: '2025-08-14',
      tamanho: '650 KB',
      arquivo: 'Normas_Salao_Festas_Churrasqueira.pdf'
    }
  ],

  recados: [
    {
      id: 'rec_01',
      titulo: 'Modernização da Iluminação das Áreas Comuns para LED',
      data: '2026-07-15',
      autor: 'Síndico Alessandro Cristiano da Silva',
      imagem: './assets/images/IMG_2909.JPG',
      resumo: 'Concluímos a substituição das lâmpadas da garagem e corredores por iluminação LED ecoeficiente, gerando redução estimada de 18% na conta de energia.',
      texto: 'Prezados moradores,\n\nÉ com satisfação que comunicamos a conclusão do projeto de eficiência energética do condomínio. Todas as lâmpadas fluorescentes dos subsolos, corredores e hall principal foram substituídas por painéis e refletores LED de alta durabilidade.\n\nEstimamos uma economia mensal de cerca de R$ 3.200,00 na fatura de energia elétrica, além de melhorar substancialmente a iluminação e segurança de nossas garagens.',
      anexo: 'Relatorio_Tecnico_Iluminacao_LED.pdf',
      comentarios: [
        { autor: 'Mariana Castro (Apt 84B)', data: '2026-07-15 14:30', texto: 'Excelente iniciativa! A iluminação da garagem ficou ótima!' },
        { autor: 'Roberto Almeida (Apt 121A)', data: '2026-07-16 09:15', texto: 'Parabéns pela gestão eficiente e transparente.' }
      ]
    },
    {
      id: 'rec_02',
      titulo: 'Manutenção Preventiva das Bombas d\'Água e Reservatório',
      data: '2026-07-02',
      autor: 'Síndico Alessandro Cristiano da Silva',
      imagem: './assets/images/IMG_2930.jpg',
      resumo: 'Realizada higienização anual das caixas d\'água e revisão no sistema de recalque preventivo.',
      texto: 'Informamos a todos os moradores que realizamos com sucesso a limpeza e desinfecção periódica de ambos os reservatórios (superior e inferior), bem como o teste de estanqueidade e troca dos selos mecânicos das bombas.',
      anexo: 'Laudo_Potabilidade_Agua_Julho2026.pdf',
      comentarios: []
    }
  ],

  ocorrencias: [
    {
      id: 'oco_01',
      moradorNome: 'Mariana Castro',
      apartamento: '84B',
      categoria: 'Sugestão',
      assunto: 'Instalação de tomadas para veículos elétricos na garagem',
      descricao: 'Gostaria de sugerir que o condomínio avalie um estudo de viabilidade técnica para pontos de recarga individualizados no subsolo.',
      fotos: ['./assets/images/IMG_2955.jpg'],
      data: '2026-07-18',
      status: 'Em análise',
      respostaAdmin: 'Prezada Mariana, a administração já contratou um engenheiro eletricista para apresentar parecer técnico na próxima assembleia.'
    },
    {
      id: 'oco_02',
      moradorNome: 'Roberto Almeida',
      apartamento: '121A',
      categoria: 'Reclamação',
      assunto: 'Ruído excessivo no apto 131A após às 22h',
      descricao: 'Houve barulho recorrente de salto e móveis sendo arrastados durante a madrugada da última sexta-feira.',
      fotos: [],
      data: '2026-07-10',
      status: 'Finalizado',
      respostaAdmin: 'Morador notificado formalmente pela portaria em conformidade com o Artigo 14 do Regimento Interno.'
    }
  ],

  agenda: [
    {
      id: 'evt_01',
      titulo: 'Assembleia Geral Extraordinária (AGE)',
      data: '2026-08-10',
      hora: '19:30',
      tipo: 'Assembleia',
      local: 'Salão de Festas Principal / Formato Híbrido',
      descricao: 'Deliberação sobre a aprovação das contas do 1º semestre e orçamento da reforma do playground.'
    },
    {
      id: 'evt_02',
      titulo: 'Manutenção Mensal dos Elevadores',
      data: '2026-07-28',
      hora: '08:00 - 12:00',
      tipo: 'Manutenção',
      local: 'Torre Principal',
      descricao: 'Interrupção alternada de 1 elevador social por vez para substituição preventiva de cabos.'
    },
    {
      id: 'evt_03',
      titulo: 'Festa Julina do Condomínio',
      data: '2026-07-31',
      hora: '17:00',
      tipo: 'Evento',
      local: 'Área do Playground e Churrasqueira',
      descricao: 'Confraternização entre vizinhos com comidas típicas e recreação para crianças.'
    }
  ],

  galeria: [
    { id: 'gal_01', titulo: 'Torre Modern Life Residence & Entorno', categoria: 'Fachada', imagem: './assets/images/IMG_2956.jpg' },
    { id: 'gal_02', titulo: 'Fachada Principal & Entrada', categoria: 'Fachada', imagem: './assets/images/IMG_2909.JPG' },
    { id: 'gal_03', titulo: 'Vista Panorâmica da Torre', categoria: 'Fachada', imagem: './assets/images/IMG_2930.jpg' },
    { id: 'gal_04', titulo: 'Praça de Acesso', categoria: 'Eventos', imagem: './assets/images/IMG_2955.jpg' }
  ],

  reservas: [
    {
      id: 'res_01',
      espaco: 'Salão de Festas',
      moradorNome: 'Mariana Castro',
      apartamento: '84B',
      data: '2026-08-15',
      status: 'Confirmada'
    },
    {
      id: 'res_02',
      espaco: 'Churrasqueira',
      moradorNome: 'Roberto Almeida',
      apartamento: '121A',
      data: '2026-08-02',
      status: 'Confirmada'
    }
  ]
};

class StoreEngine {
  constructor() {
    this.data = this.loadData();
    this.currentUser = this.loadUser();
    this.listeners = [];
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }

  saveData(data) {
    this.data = data || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
    this.notify();
  }

  loadUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_DATA.moradores[0];
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.data, this.currentUser));
  }

  addMorador(morador) {
    const newMorador = {
      id: 'usr_' + Date.now(),
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      role: 'Morador',
      ...morador
    };
    this.data.moradores.push(newMorador);
    this.saveData();
    return newMorador;
  }

  updateMoradorStatus(id, newStatus) {
    const item = this.data.moradores.find(m => m.id === id);
    if (item) {
      item.status = newStatus;
      this.saveData();
    }
  }

  addOcorrencia(oco) {
    const newOco = {
      id: 'oco_' + Date.now(),
      data: new Date().toISOString().split('T')[0],
      status: 'Recebido',
      respostaAdmin: '',
      ...oco
    };
    this.data.ocorrencias.unshift(newOco);
    this.saveData();
    return newOco;
  }

  addRecado(post) {
    const newRecado = {
      id: 'rec_' + Date.now(),
      data: new Date().toISOString().split('T')[0],
      comentarios: [],
      ...post
    };
    this.data.recados.unshift(newRecado);
    this.saveData();
  }
}

window.CondoStore = new StoreEngine();
