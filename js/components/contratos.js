/* ----------------------------------------------------
   Modern Life Residence - Módulo & Dashboard de Gestão de Contratos
   Acesso Exclusivo de LEITURA para Moradores & Permissão ÚNICA do SÍNDICO para Postar, Editar e Excluir
   ---------------------------------------------------- */

window.ContratosComponent = {
  filtroStatus: 'Todos',
  termoBusca: '',
  editingContractId: null,

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isSindico = user && (
      user.role === 'Administrador' ||
      user.role === 'Síndico' ||
      (user.email && (
        user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com' ||
        user.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com'
      ))
    );

    // Access Gate para visitantes não aprovados
    if (!user || !isApproved) {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: #F0FDF4; color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito: Contratos de Prestação de Serviços
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">
            Por determinação da convenção condominial, a leitura dos contratos firmados com serviços terceirizados (elevadores, portaria, limpeza e manutenção) é de uso exclusivo dos moradores cadastrados.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar para Solicitar Acesso
          </button>
        </div>
      `;
      return;
    }

    const contratos = data.contratos || [];

    // Sanitização rigorosa para remover qualquer nome de empresa, pessoa ou arquivo bruto
    contratos.forEach(c => {
      const empLow = (c.empresa || '').toLowerCase();
      if (empLow.includes('fregonassi') || empLow.includes('engenharia') || c.categoria === 'Engenharia & Perícia') {
        c.empresa = 'Assessoria de Engenharia & Perícia';
      } else if (empLow.includes('elevador') || c.categoria === 'Elevadores & Plataforma' || c.categoria === 'Elevadores') {
        c.empresa = 'Manutenção de Elevadores & Plataforma';
      } else if (empLow.includes('solar') || empLow.includes('connex') || c.categoria === 'Energia Solar') {
        c.empresa = 'Manutenção de Sistema de Energia Solar';
      } else if (empLow.includes('segurança') || empLow.includes('warions') || c.categoria === 'Segurança & CFTV') {
        c.empresa = 'Manutenção de Segurança Eletrônica & CFTV';
      } else if (empLow.includes('internet') || empLow.includes('ebr') || c.categoria === 'Telecomunicações') {
        c.empresa = 'Provedor de Internet para Áreas Comuns';
      } else if (empLow.includes('concrevit') || empLow.includes('acordo') || c.categoria === 'Acordo & Ressarcimento') {
        c.empresa = 'Acordo de Recuperação Estrutural';
      } else if (c.categoria) {
        c.empresa = c.categoria;
      }

      if (c.arquivoNome) {
        const catKey = (c.categoria || c.empresa || 'SERVICO').toUpperCase().replace(/[^A-Z0-9]/g, '_');
        c.arquivoNome = `CONTRATO_OFICIAL_${catKey}.pdf`;
      }
    });

    // Cálculo das métricas do Dashboard
    const totalContratos = contratos.length;
    const custoMensalTotal = contratos.reduce((acc, c) => acc + (c.valorMensal || 0), 0);
    const custoAnualTotal = custoMensalTotal * 12;

    // Contratos a vencer nos próximos 90 dias ou já no status 'A Vencer'
    const aVencerCount = contratos.filter(c => {
      if (c.status === 'A Vencer') return true;
      if (!c.vigenciaFim) return false;
      const dataFim = new Date(c.vigenciaFim);
      const hoje = new Date();
      const diffDias = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
      return diffDias <= 90 && diffDias >= 0;
    }).length;

    // Filtragem para exibição
    const contratosFiltrados = contratos.filter(c => {
      const matchStatus = this.filtroStatus === 'Todos' || c.status === this.filtroStatus;
      const matchBusca = !this.termoBusca || 
        c.empresa.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        c.objeto.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (c.categoria && c.categoria.toLowerCase().includes(this.termoBusca.toLowerCase()));
      return matchStatus && matchBusca;
    });

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.35rem;">
        
        <!-- Header da Página em Estética Clean Dark -->
        <div class="card-widget" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.12); color: #38BDF8; font-weight: 600; margin-bottom: 0.4rem; padding: 4px 10px; border-radius: 20px;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">description</span> GESTÃO DE CONTRATOS &amp; SERVIÇOS
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: #F8FAFC; margin-top: 0.2rem;">
                Dashboard de Contratos &amp; Serviços Terceirizados
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.8; color: #94A3B8; margin-top: 0.2rem;">
                ${isSindico ? 'Painel de Gestão do Síndico: Importe, edite e gerencie os contratos de serviços.' : 'Modo Leitura para Moradores: Acompanhe as vigências, valores e obrigações contratadas.'}
              </p>
            </div>

            <!-- Botão de Upload VISÍVEL SOMENTE PARA O SÍNDICO -->
            ${isSindico ? `
              <button class="btn-primary" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; font-weight: 700; border: none; padding: 0.85rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(16,185,129,0.3);" onclick="ContratosComponent.openImportModal()">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">cloud_upload</span> 📄 Importar Contratos (PDF / DOC)
              </button>
            ` : `
              <span class="badge" style="background: rgba(255,255,255,0.1); color: #94A3B8; font-size: 0.8rem; padding: 6px 12px;">
                👁️ Acesso de Leitura para Moradores
              </span>
            `}
          </div>
        </div>

        <!-- 4 KPI Cards do Dashboard de Contratos -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          
          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-left: 5px solid #2563EB; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">CONTRATOS VIGENTES</span>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.4rem;">folder_managed</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              ${totalContratos} Serviços
            </div>
            <div style="font-size: 0.75rem; color: #2563EB; margin-top: 4px; font-weight: 600;">
              🔷 Contratos Ativos no Condomínio
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-left: 5px solid #10B981; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">CUSTO MENSAL CONSOLIDADO</span>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #ECFDF5; color: #10B981; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.4rem;">payments</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              R$ ${custoMensalTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #059669; margin-top: 4px; font-weight: 600;">
              🟢 Compromisso Mensal Recorrente
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-left: 5px solid #8B5CF6; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">VALOR ANUALIZADO</span>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #F5F3FF; color: #8B5CF6; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.4rem;">account_balance</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              R$ ${custoAnualTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #7C3AED; margin-top: 4px; font-weight: 600;">
              🟣 Custo Total Anual das Terceirizações
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-left: 5px solid ${aVencerCount > 0 ? '#F59E0B' : '#10B981'}; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">ALERTAS DE RENOVAÇÃO</span>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: ${aVencerCount > 0 ? '#FEF3C7' : '#ECFDF5'}; color: ${aVencerCount > 0 ? '#D97706' : '#10B981'}; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.4rem;">notification_important</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              ${aVencerCount} ${aVencerCount === 1 ? 'Contrato' : 'Contratos'}
            </div>
            <div style="font-size: 0.75rem; color: ${aVencerCount > 0 ? '#B45309' : '#059669'}; margin-top: 4px; font-weight: 600;">
              ${aVencerCount > 0 ? '⚠️ Vencimento próximo (até 90 dias)' : '✅ Todas as vigências em dia'}
            </div>
          </div>

        </div>

        <!-- Linha do Tempo Visual de Vigência dos Contratos -->
        <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.35rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: #0F172A;">
                Vigência &amp; Progresso dos Contratos
              </h3>
              <p style="font-size: 0.82rem; color: #64748B; margin-top: 2px;">
                Linha de tempo visual do período contratual decorrido de cada serviço.
              </p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${contratos.map(c => {
              const dInicio = new Date(c.vigenciaInicio || '2025-01-01');
              const dFim = new Date(c.vigenciaFim || '2027-01-01');
              const hoje = new Date();

              const totalDias = Math.max(1, Math.ceil((dFim - dInicio) / (1000 * 60 * 60 * 24)));
              const diasDecorridos = Math.max(0, Math.ceil((hoje - dInicio) / (1000 * 60 * 60 * 24)));
              const percVigencia = Math.min(100, Math.max(0, Math.round((diasDecorridos / totalDias) * 100)));

              const diasRestantes = Math.max(0, Math.ceil((dFim - hoje) / (1000 * 60 * 60 * 24)));

              let statusBadge = `<span class="badge" style="background: #DCFCE7; color: #166534; font-weight: 700;">🟢 Ativo</span>`;
              if (c.status === 'A Vencer' || diasRestantes <= 90) {
                statusBadge = `<span class="badge" style="background: #FEF3C7; color: #92400E; font-weight: 700;">⚠️ A Vencer (${diasRestantes} dias)</span>`;
              } else if (c.status === 'Encerrado' || diasRestantes === 0) {
                statusBadge = `<span class="badge" style="background: #FEE2E2; color: #991B1B; font-weight: 700;">🔴 Encerrado</span>`;
              }

              return `
                <div style="background: #F8FAFC; border: 1px solid #F1F5F9; padding: 1rem; border-radius: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div>
                      <strong style="color: #0F172A; font-size: 0.95rem;">${c.empresa}</strong>
                      <span style="font-size: 0.8rem; color: #64748B; margin-left: 8px;">(${c.objeto})</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <strong style="color: #059669; font-size: 0.95rem;">R$ ${(c.valorMensal || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</strong>
                      ${statusBadge}
                      ${isSindico ? `
                        <button class="btn-secondary btn-sm" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="ContratosComponent.openEditModal('${c.id}')" title="Editar Contrato">
                          <span class="material-symbols-outlined" style="font-size: 0.85rem;">edit</span> Editar
                        </button>
                        <button class="btn-secondary btn-sm btn-danger" style="background: #FFF1F2; color: #E11D48; border: 1px solid #FECACA; padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="ContratosComponent.excluirContrato('${c.id}', '${c.empresa}')" title="Excluir Contrato">
                          <span class="material-symbols-outlined" style="font-size: 0.85rem;">delete</span> Excluir
                        </button>
                      ` : ''}
                    </div>
                  </div>

                  <div style="height: 10px; background: #E2E8F0; border-radius: 5px; overflow: hidden; margin-bottom: 6px;">
                    <div style="width: ${percVigencia}%; height: 100%; background: linear-gradient(90deg, #2563EB 0%, #3B82F6 100%); border-radius: 5px; transition: width 0.8s ease;"></div>
                  </div>

                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #64748B;">
                    <span>📅 Início: ${c.vigenciaInicio}</span>
                    <span>Progresso: <strong>${percVigencia}%</strong></span>
                    <span>🏁 Término: ${c.vigenciaFim}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Tabela Completa de Contratos com Leitura para Moradores e Edição/Exclusão para o Síndico -->
        <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.35rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          
          <div class="card-header" style="margin-bottom: 1.25rem;">
            <div class="card-title" style="font-size: 1.15rem; color: #0F172A; font-weight: 700;">
              <span class="material-symbols-outlined" style="color: var(--primary);">description</span> Relação Detalhada de Contratos de Serviços
            </div>

            <!-- Filtros e Busca -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
              <div style="position: relative; min-width: 220px;">
                <input type="text" class="form-control" placeholder="🔍 Buscar por serviço..." value="${this.termoBusca}" oninput="ContratosComponent.buscarContratos(this.value)" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
              </div>

              <select class="form-control" style="width: auto; font-size: 0.85rem; font-weight: 600;" onchange="ContratosComponent.filtrarStatus(this.value)">
                <option value="Todos" ${this.filtroStatus === 'Todos' ? 'selected' : ''}>Todos os Status</option>
                <option value="Ativo" ${this.filtroStatus === 'Ativo' ? 'selected' : ''}>🟢 Somente Ativos</option>
                <option value="A Vencer" ${this.filtroStatus === 'A Vencer' ? 'selected' : ''}>⚠️ A Vencer</option>
                <option value="Encerrado" ${this.filtroStatus === 'Encerrado' ? 'selected' : ''}>🔴 Encerrados</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table" style="border-collapse: separate; border-spacing: 0;">
              <thead>
                <tr style="background: #F8FAFC;">
                  <th style="color: #475569; font-weight: 700;">Título do Serviço / Contrato</th>
                  <th style="color: #475569; font-weight: 700;">Objeto / Descrição</th>
                  <th style="text-align: right; color: #059669; font-weight: 700;">Valor Mensal (R$)</th>
                  <th style="color: #475569; font-weight: 700;">Vigência Contratual</th>
                  <th style="text-align: center; color: #475569; font-weight: 700;">Status</th>
                  <th style="text-align: center; color: #475569; font-weight: 700;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${contratosFiltrados.length === 0 ? `
                  <tr>
                    <td colspan="6" style="text-align: center; color: #64748B; padding: 2rem;">
                      Nenhum contrato encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ` : contratosFiltrados.map(c => `
                  <tr>
                    <td>
                      <strong style="color: #0F172A; font-size: 0.92rem;">${c.empresa}</strong>
                      ${c.arquivoNome ? `
                        <div style="font-size: 0.75rem; color: #3B82F6; display: flex; align-items: center; gap: 3px; margin-top: 2px;">
                          <span class="material-symbols-outlined" style="font-size: 0.85rem;">picture_as_pdf</span> ${c.arquivoNome}
                        </div>
                      ` : ''}
                    </td>
                    <td>
                      <div style="color: #334155; max-width: 320px; line-height: 1.4;">${c.objeto}</div>
                    </td>
                    <td style="text-align: right;">
                      <strong style="color: #059669; font-size: 0.95rem;">R$ ${(c.valorMensal || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                    </td>
                    <td style="color: #475569; font-weight: 500;">
                      📅 ${c.vigenciaInicio} até ${c.vigenciaFim}
                    </td>
                    <td style="text-align: center;">
                      <span class="badge ${c.status === 'Ativo' ? 'badge-success' : c.status === 'A Vencer' ? 'badge-warning' : 'badge-danger'}">
                        ${c.status}
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <div style="display: flex; gap: 0.35rem; justify-content: center;">
                        <button class="btn-secondary btn-sm" onclick="ContratosComponent.verObrigacoes('${c.id}')" title="Ver Obrigações Contratuais">
                          <span class="material-symbols-outlined" style="font-size: 0.95rem;">visibility</span> Obrigações
                        </button>
                        ${isSindico ? `
                          <button class="btn-secondary btn-sm" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; padding: 0.35rem 0.6rem; font-weight: 700;" onclick="ContratosComponent.openEditModal('${c.id}')" title="Editar Contrato">
                            <span class="material-symbols-outlined" style="font-size: 0.95rem;">edit</span> Editar
                          </button>
                          <button class="btn-secondary btn-sm btn-danger" style="background: #FFF1F2; color: #E11D48; border: 1px solid #FECACA; padding: 0.35rem 0.6rem; font-weight: 700;" onclick="ContratosComponent.excluirContrato('${c.id}', '${c.empresa}')" title="Excluir Contrato">
                            <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span> Excluir
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    `;
  },

  buscarContratos(termo) {
    this.termoBusca = termo;
    App.render();
  },

  filtrarStatus(status) {
    this.filtroStatus = status;
    App.render();
  },

  openImportModal() {
    const user = window.CondoStore.currentUser;
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com');
    if (!isSindico) {
      alert('🔒 Acesso Restrito: Apenas o Síndico tem permissão para postar ou importar novos contratos.');
      return;
    }

    const existing = document.getElementById('modalImportContrato');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalImportContrato" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 580px; border: 2px solid #10B981; border-radius: 12px;">
          <div class="modal-header" style="background: #0F172A; color: #34D399;">
            <div class="modal-title" style="color: #34D399; font-weight: 700; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined">cloud_upload</span> 📄 Importar Contratos (PDF / DOC)
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalImportContrato').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding: 1.75rem 1.5rem; text-align: center;">
            
            <div style="background: #F0FDF4; border: 2px dashed #34D399; padding: 2.2rem 1.25rem; border-radius: 12px;">
              <label for="ctrFileSelector" style="cursor: pointer; display: block;">
                <span class="material-symbols-outlined" style="font-size: 3.8rem; color: #059669; display: block; margin-bottom: 0.5rem;">folder_open</span>
                <strong style="color: #0F172A; font-size: 1.15rem; display: block; margin-bottom: 0.3rem;">
                  Clique para selecionar 1 ou VÁRIOS contratos em PDF / DOC
                </strong>
                <span style="display: block; font-size: 0.85rem; color: #64748B;">
                  Você pode selecionar múltiplos arquivos simultaneamente. O leitor lê e cadastra todos com nomes de serviços genéricos sem expor nomes de pessoas ou marcas.
                </span>
              </label>

              <input type="file" id="ctrFileSelector" accept=".pdf,.doc,.docx,.txt,.csv" multiple style="display: none;" onchange="ContratosComponent.manipularArquivosContratosMulti(event)">

              <div id="ctrFileInfo" style="margin-top: 1rem; font-weight: 700; font-size: 0.9rem; color: #065F46; display: none; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #A7F3D0;">
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  manipularArquivosContratosMulti(event) {
    const user = window.CondoStore.currentUser;
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com');
    if (!isSindico) {
      alert('🔒 Acesso Restrito: Apenas o Síndico pode cadastrar contratos.');
      return;
    }

    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    const info = document.getElementById('ctrFileInfo');
    if (info) {
      info.style.display = 'block';
      info.innerHTML = `⚙️ Lendo <strong>${files.length} contrato(s)</strong> e extraindo dados em lote...`;
    }

    let processados = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        this.parseEProcessarContratoAuto(text, file.name);
        processados++;

        if (processados === files.length) {
          App.showToast(`🚀 ${files.length} contrato(s) lidos e cadastrados com sucesso pelo Síndico!`, 'success');
          const modal = document.getElementById('modalImportContrato');
          if (modal) modal.remove();
          App.render();
        }
      };
      reader.readAsText(file);
    });
  },

  parseEProcessarContratoAuto(text, fileName = '') {
    const lines = (text || '').split(/\r?\n/);
    let valorDetectado = 0;
    let objetoDetectado = '';
    let obrigacoesDetectadas = [];

    lines.forEach(line => {
      const clean = line.toLowerCase().trim();
      if (!clean) return;

      if (clean.includes('valor') || clean.includes('mensalidade') || clean.includes('r$') || clean.includes('preço')) {
        const matches = line.match(/\d+[\.,]?\d*/g);
        if (matches && matches.length > 0) {
          const rawVal = matches[matches.length - 1].replace('.', '').replace(',', '.');
          const val = parseFloat(rawVal);
          if (!isNaN(val) && val > 100 && val !== 2024 && val !== 2025 && val !== 2026 && val !== 2027) {
            if (val > valorDetectado) valorDetectado = val;
          }
        }
      }

      if (clean.includes('objeto') || clean.includes('serviço') || clean.includes('prestação de')) {
        if (!objetoDetectado) objetoDetectado = line.replace(/objeto/i, '').replace(/[:;\-]/, '').trim();
      }

      if (clean.includes('obrigação') || clean.includes('cláusula') || clean.includes('manutenção') || clean.includes('atendimento') || clean.includes('garantia')) {
        obrigacoesDetectadas.push(line.trim());
      }
    });

    // Sanitização de nomes de empresas ou pessoas para títulos descritivos de serviços
    let empresaFinal = 'Serviço Terceirizado Especializado';
    const nameLow = fileName.toLowerCase();

    // Sanitização de nomes de empresas ou pessoas para títulos descritivos de serviços
    let empresaFinal = 'Serviço Terceirizado Especializado';
    let catKey = 'SERVICO';
    const nameLow = (fileName || '').toLowerCase();
    const textLow = (text || '').toLowerCase();

    if (nameLow.includes('fregonassi') || nameLow.includes('engenharia') || textLow.includes('engenharia') || textLow.includes('perícia')) {
      empresaFinal = 'Assessoria de Engenharia & Perícia';
      catKey = 'ENGENHARIA_E_PERICIA';
    } else if (nameLow.includes('elevador') || textLow.includes('elevador')) {
      empresaFinal = 'Manutenção de Elevadores & Plataforma';
      catKey = 'ELEVADORES_E_PLATAFORMA';
    } else if (nameLow.includes('solar') || textLow.includes('solar') || textLow.includes('fotovoltaico')) {
      empresaFinal = 'Manutenção de Sistema de Energia Solar';
      catKey = 'ENERGIA_SOLAR';
    } else if (nameLow.includes('segurança') || nameLow.includes('cftv') || textLow.includes('câmera')) {
      empresaFinal = 'Manutenção de Segurança Eletrônica & CFTV';
      catKey = 'SEGURANCA_ELETRONICA';
    } else if (nameLow.includes('internet') || nameLow.includes('telecom') || textLow.includes('fibra')) {
      empresaFinal = 'Provedor de Internet para Áreas Comuns';
      catKey = 'TELECOMUNICACOES';
    } else if (nameLow.includes('concrevit') || nameLow.includes('acordo') || textLow.includes('ressarcimento')) {
      empresaFinal = 'Acordo de Recuperação Estrutural';
      catKey = 'ACORDO_ESTRUTURAL';
    } else if (nameLow.includes('portaria') || nameLow.includes('limpeza')) {
      empresaFinal = 'Portaria & Limpeza Terceirizada';
      catKey = 'PORTARIA_E_LIMPEZA';
    }

    const valorFinal = valorDetectado > 0 ? valorDetectado : 1250.00;
    const objetoFinal = objetoDetectado || `Prestação de Serviços Terceirizados Prediais`;
    const obrigacoesFinal = obrigacoesDetectadas.length > 0
      ? obrigacoesDetectadas.slice(0, 4).join('\n• ')
      : 'Atendimento emergencial 24h, manutenção preventiva mensal com laudo técnico e reposição de componentes homologados.';

    window.CondoStore.addContrato({
      empresa: empresaFinal,
      objeto: objetoFinal,
      valorMensal: valorFinal,
      status: 'Ativo',
      vigenciaInicio: new Date().toISOString().split('T')[0],
      vigenciaFim: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
      obrigacoes: obrigacoesFinal,
      arquivoNome: `CONTRATO_OFICIAL_${catKey}.pdf`
    });
  },

  openEditModal(id) {
    const user = window.CondoStore.currentUser;
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com');
    if (!isSindico) {
      alert('🔒 Acesso Restrito: Apenas o Síndico tem permissão para editar contratos.');
      return;
    }

    const contratos = window.CondoStore.data.contratos || [];
    const target = contratos.find(c => c.id === id);
    if (!target) return;

    this.editingContractId = id;
    const existing = document.getElementById('modalEditContrato');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalEditContrato" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 580px; border: 2px solid #2563EB; border-radius: 12px;">
          <div class="modal-header" style="background: #0F172A; color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined" style="color: #60A5FA;">edit</span> Editar Contrato de Serviço (Painel do Síndico)
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalEditContrato').remove()">✕</button>
          </div>
          <div class="modal-body" style="padding: 1.5rem;">
            <form onsubmit="ContratosComponent.salvarEdicaoContrato(event)">
              
              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">✏️ Renomear Serviço / Título do Contrato</label>
                <input type="text" id="editCtrEmpresa" class="form-control" value="${target.empresa}" required style="font-weight: 700;">
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">📄 Renomear Nome do Arquivo PDF / Documento</label>
                <input type="text" id="editCtrArquivo" class="form-control" value="${target.arquivoNome || 'CONTRATO_OFICIAL.pdf'}" required style="font-weight: 600;">
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Objeto / Descrição dos Serviços</label>
                <input type="text" id="editCtrObjeto" class="form-control" value="${target.objeto}" required style="font-weight: 600;">
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 700; color: #059669;">Valor Mensal (R$)</label>
                  <input type="number" step="0.01" id="editCtrValor" class="form-control" value="${target.valorMensal}" required style="font-weight: 700; color: #059669;">
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Status do Contrato</label>
                  <select id="editCtrStatus" class="form-control" style="font-weight: 600;">
                    <option value="Ativo" ${target.status === 'Ativo' ? 'selected' : ''}>🟢 Ativo</option>
                    <option value="A Vencer" ${target.status === 'A Vencer' ? 'selected' : ''}>⚠️ A Vencer</option>
                    <option value="Encerrado" ${target.status === 'Encerrado' ? 'selected' : ''}>🔴 Encerrado</option>
                  </select>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Data Início Vigência</label>
                  <input type="date" id="editCtrInicio" class="form-control" value="${target.vigenciaInicio}" required style="font-weight: 600;">
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Data Término Vigência</label>
                  <input type="date" id="editCtrFim" class="form-control" value="${target.vigenciaFim}" required style="font-weight: 600;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Obrigações &amp; Termos do Serviço</label>
                <textarea id="editCtrObrigacoes" class="form-control" rows="3" style="font-size: 0.88rem;">${target.obrigacoes || ''}</textarea>
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalEditContrato').remove()">Cancelar</button>
                <button type="submit" class="btn-primary" style="background: #2563EB; color: white; padding: 0.75rem 1.4rem; font-weight: 700;">
                  <span class="material-symbols-outlined">save</span> Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  salvarEdicaoContrato(e) {
    e.preventDefault();
    const user = window.CondoStore.currentUser;
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com');
    if (!isSindico) {
      alert('🔒 Acesso Restrito: Apenas o Síndico pode salvar alterações de contratos.');
      return;
    }

    const updates = {
      empresa: document.getElementById('editCtrEmpresa').value.trim(),
      arquivoNome: document.getElementById('editCtrArquivo').value.trim(),
      objeto: document.getElementById('editCtrObjeto').value.trim(),
      valorMensal: parseFloat(document.getElementById('editCtrValor').value),
      status: document.getElementById('editCtrStatus').value,
      vigenciaInicio: document.getElementById('editCtrInicio').value,
      vigenciaFim: document.getElementById('editCtrFim').value,
      obrigacoes: document.getElementById('editCtrObrigacoes').value.trim(),
      valorTotalAnual: parseFloat(document.getElementById('editCtrValor').value) * 12
    };

    window.CondoStore.updateContrato(this.editingContractId, updates);
    App.showToast(`✏️ Contrato "${updates.empresa}" atualizado e renomeado com sucesso!`, 'success');

    const modal = document.getElementById('modalEditContrato');
    if (modal) modal.remove();

    App.render();
  },

  verObrigacoes(id) {
    const contratos = window.CondoStore.data.contratos || [];
    const target = contratos.find(c => c.id === id);
    if (!target) return;

    const user = window.CondoStore.currentUser;
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase() === 'condominio.modern.life@gmail.com');

    const existing = document.getElementById('modalVerObrigacoes');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalVerObrigacoes" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 580px; border-radius: 12px;">
          <div class="modal-header" style="background: #0F172A; color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined" style="color: #38BDF8;">verified</span> ${target.empresa}
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalVerObrigacoes').remove()">✕</button>
          </div>
          <div class="modal-body">
            
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase;">OBJETO DO CONTRATO</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #0F172A; margin-top: 2px;">${target.objeto}</div>
              
              <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; font-size: 0.85rem;">
                <span>Valor Mensal: <strong style="color: #059669;">R$ ${(target.valorMensal || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></span>
                <span>Vigência: <strong>${target.vigenciaInicio} até ${target.vigenciaFim}</strong></span>
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: #0F172A; margin-bottom: 0.4rem;">
                📋 Obrigações Principais &amp; Termos de Serviço:
              </h4>
              <div style="font-size: 0.88rem; color: #334155; line-height: 1.6; white-space: pre-line; background: #FFF; padding: 0.85rem; border: 1px solid #E2E8F0; border-radius: 8px;">
                ${target.obrigacoes || 'Manutenção preventiva e corretiva garantida em contrato com atendimento emergencial.'}
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-secondary" style="flex: 1; justify-content: center;" onclick="document.getElementById('modalVerObrigacoes').remove()">
                Fechar Visualizador
              </button>
              ${isSindico ? `
                <button class="btn-secondary" style="background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; font-weight: 700;" onclick="document.getElementById('modalVerObrigacoes').remove(); ContratosComponent.openEditModal('${target.id}');">
                  <span class="material-symbols-outlined" style="font-size: 1rem;">edit</span> Editar
                </button>
                <button class="btn-secondary btn-danger" style="background: #FFF1F2; color: #E11D48; border: 1px solid #FECACA; font-weight: 700;" onclick="document.getElementById('modalVerObrigacoes').remove(); ContratosComponent.excluirContrato('${target.id}', '${target.empresa}');">
                  <span class="material-symbols-outlined" style="font-size: 1rem;">delete</span> Excluir
                </button>
              ` : ''}
            </div>

          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  excluirContrato(id, empresa) {
    const user = window.CondoStore.currentUser;
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com');
    if (!isSindico) {
      alert('🔒 Acesso Restrito: Apenas o Síndico tem permissão para excluir contratos.');
      return;
    }

    if (!confirm(`⚠️ CONFIRMAÇÃO DE EXCLUSÃO\n\nTem certeza que deseja EXCLUIR permanentemente o contrato "${empresa}"?`)) return;

    const res = window.CondoStore.deleteContrato(id);
    if (res) {
      App.showToast(`🗑️ Contrato "${empresa}" excluído com sucesso!`, 'info');
      App.render();
    }
  }
};
