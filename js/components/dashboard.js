/* ----------------------------------------------------
   Modern Life Residence - Página Inicial (Dashboard)
   Destaque dos Balancetes visível APENAS após cadastro e aprovação
   ---------------------------------------------------- */

window.DashboardComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isApproved = user && user.status === 'Aprovado';

    const balancetes = data.balancetes || [];
    const prestacoes = data.prestacaoContas || [];
    const ultimoBalancete = balancetes[0] || {};
    const ultimaPrestacao = prestacoes[0] || {};
    const recados = data.recados || [];
    const proximosEventos = data.agenda || [];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- Hero Banner Principal com Logo e Foto do Condomínio -->
        <div class="card-widget" style="padding: 0; overflow: hidden; background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white; position: relative;">
          <div style="display: flex; flex-wrap: wrap; align-items: center;">
            <div style="flex: 1; min-width: 280px; padding: 2.25rem 2rem;">
              <span class="badge" style="background: rgba(255,255,255,0.18); color: white; margin-bottom: 0.75rem; border: 1px solid rgba(255,255,255,0.3);">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">domain</span> MODERN LIFE RESIDENCE
              </span>
              <h1 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; line-height: 1.25; margin-bottom: 0.75rem;">
                Portal Oficial de Transparência &amp; Gestão Condominial
              </h1>
              <p style="font-size: 0.95rem; opacity: 0.92; max-width: 580px; line-height: 1.6; margin-bottom: 1.5rem;">
                Acompanhe comunicados, agenda de eventos, normas do regimento interno e a prestação de contas do condomínio com praticidade e segurança.
              </p>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                ${!isApproved ? `
                  <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="AuthComponent.renderAuthModal()">
                    <span class="material-symbols-outlined">login</span> Entrar / Cadastrar para Liberar Acesso
                  </button>
                ` : `
                  <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="App.navigateTo('prestacao')">
                    <span class="material-symbols-outlined">analytics</span> Ver Prestação de Contas
                  </button>
                `}
                <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.4);" onclick="App.navigateTo('recados')">
                  <span class="material-symbols-outlined">campaign</span> Mural de Recados
                </button>
              </div>
            </div>

            <!-- Imagem Principal do Condomínio (IMG_2956.jpg) -->
            <div style="flex: 1; min-width: 280px; max-height: 320px; overflow: hidden; position: relative;">
              <img src="./assets/images/IMG_2956.jpg" alt="Fachada Modern Life Residence" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
              <div style="position: absolute; inset: 0; background: linear-gradient(90deg, var(--primary-dark) 0%, transparent 60%);"></div>
            </div>
          </div>
        </div>

        <!-- Destaques dos Balancetes (VISÍVEL APENAS APÓS CADASTRO E APROVAÇÃO) -->
        ${isApproved ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
            
            <div class="card-widget" style="border-left: 4px solid var(--primary);">
              <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.3rem;">
                Último Balancete Publicado
              </div>
              <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--primary-dark);">
                ${ultimoBalancete.mes || 'Maio'} / ${ultimoBalancete.ano || '2026'}
              </div>
              <div style="margin-top: 0.75rem; font-size: 0.88rem; color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
                <span>Saldo Atual Consolidado:</span>
                <strong style="color: #2E6B42; font-size: 1rem;">R$ ${(ultimoBalancete.saldoAtual || 498438.09).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
              </div>
            </div>

            <div class="card-widget" style="border-left: 4px solid #0288D1;">
              <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.3rem;">
                Receita Bruta (${ultimaPrestacao.mesAno || 'Maio 2026'})
              </div>
              <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: #0288D1;">
                R$ ${(ultimaPrestacao.receitas || 100992.34).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              </div>
              <div style="margin-top: 0.75rem; font-size: 0.82rem; color: var(--text-muted);">
                Taxas condominiais e receitas arrecadadas no mês.
              </div>
            </div>

            <div class="card-widget" style="border-left: 4px solid #D32F2F;">
              <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.3rem;">
                Despesas Operacionais (${ultimaPrestacao.mesAno || 'Maio 2026'})
              </div>
              <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: #D32F2F;">
                R$ ${(ultimaPrestacao.despesas || 74706.09).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              </div>
              <div style="margin-top: 0.75rem; font-size: 0.82rem; color: var(--text-muted);">
                Consumo, manutenção, folha e fornecedores.
              </div>
            </div>

          </div>
        ` : `
          <!-- Banner de Bloqueio dos Balancetes na Pagina Inicial -->
          <div class="card-widget" style="background: var(--bg-app); border: 1px solid var(--border-color); padding: 1.5rem; text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; background: var(--primary-light); color: var(--primary); margin-bottom: 0.75rem;">
              <span class="material-symbols-outlined" style="font-size: 1.8rem;">lock</span>
            </div>
            <h3 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.4rem;">
              Destaques Financeiros &amp; Balancetes Reservados aos Moradores
            </h3>
            <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 550px; margin: 0 auto 1.25rem auto;">
              Por determinação do Regimento Interno, os valores consolidados dos balancetes e prestação de contas são restritos. Cadastre-se no portal para liberar o acesso.
            </p>
            <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="margin: 0 auto; padding: 0.75rem 1.4rem;">
              <span class="material-symbols-outlined">person_add</span> Cadastrar / Entrar para Visualizar
            </button>
          </div>
        `}

        <!-- Seção Dupla: Mural de Recados + Próximos Eventos -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <!-- Mural de Recados Recentes -->
          <div class="card-widget">
            <div class="card-header">
              <div class="card-title">
                <span class="material-symbols-outlined">campaign</span> Últimos Informes do Síndico
              </div>
              <button class="btn-outline-primary btn-sm" onclick="App.navigateTo('recados')">
                Ver Todos
              </button>
            </div>

            ${recados.length === 0 ? `
              <p style="color: var(--text-muted); font-size: 0.88rem;">Nenhum recado publicado no momento.</p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${recados.slice(0, 2).map(r => `
                  <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 0.85rem;">
                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 2px;">${r.data} &bull; ${r.autor}</div>
                    <h4 style="font-family: var(--font-heading); font-weight: 700; color: var(--primary-dark); font-size: 1rem; margin-bottom: 4px;">
                      ${r.titulo}
                    </h4>
                    <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5;">
                      ${r.resumo}
                    </p>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Próximos Eventos da Agenda -->
          <div class="card-widget">
            <div class="card-header">
              <div class="card-title">
                <span class="material-symbols-outlined">event</span> Próximos Eventos &amp; Assembleias
              </div>
              <button class="btn-outline-primary btn-sm" onclick="App.navigateTo('agenda')">
                Ver Agenda
              </button>
            </div>

            ${proximosEventos.length === 0 ? `
              <p style="color: var(--text-muted); font-size: 0.88rem;">Nenhum evento agendado no momento.</p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${proximosEventos.map(e => `
                  <div style="display: flex; gap: 0.85rem; align-items: flex-start; background: var(--bg-app); padding: 0.85rem; border-radius: var(--radius-sm); border-left: 4px solid var(--primary);">
                    <div style="background: var(--primary); color: white; padding: 0.4rem 0.6rem; border-radius: 4px; text-align: center; min-width: 55px;">
                      <div style="font-size: 0.7rem; text-transform: uppercase;">${e.data.split('-')[1]}</div>
                      <div style="font-size: 1.1rem; font-weight: 700;">${e.data.split('-')[2]}</div>
                    </div>
                    <div>
                      <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--primary-dark);">${e.titulo}</h4>
                      <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                        ⏰ ${e.hora} &bull; 📍 ${e.local}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>

      </div>
    `;
  }
};
