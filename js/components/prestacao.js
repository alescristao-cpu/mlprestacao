/* ----------------------------------------------------
   Modern Life Residence - Prestação de Contas & Dashboard
   Cores de Credibilidade & Confiança Institucional (Deep Navy, Emerald & Sapphire)
   Gráficos Financeiros com Alta Visibilidade & Nomes Genéricos Protegidos
   ---------------------------------------------------- */

window.PrestacaoComponent = {
  selectedPeriodIndex: 0,

  render(container, data) {
    const user = window.CondoStore.currentUser;

    // Access Gate para visitantes não aprovados
    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: #F0FDF4; color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito: Prestação de Contas Condominial
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">
            Por determinação da administração e regimento interno, os demonstrativos detalhados de receitas e despesas são exclusivos para moradores cadastrados e autorizados.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar para Liberar Acesso
          </button>
        </div>
      `;
      return;
    }

    const prestacoes = data.prestacaoContas || [];
    const atual = prestacoes[this.selectedPeriodIndex] || prestacoes[0] || {};

    const receitaTotal = atual.receitas || 90351.01;
    const despesaTotal = atual.despesas || 69866.77;
    const saldoInicial = atual.saldoInicial || 498438.09;
    const superavitMes = receitaTotal - despesaTotal;
    const saldoFinal = atual.saldoAtual || (saldoInicial + superavitMes);

    const percentExecucao = receitaTotal > 0 ? Math.min(100, Math.round((despesaTotal / receitaTotal) * 100)) : 0;
    const percentSuperavit = 100 - percentExecucao;

    const receitasDetalhadas = atual.receitasDetalhadas || [
      { categoria: 'Taxa de Condomínio Ordinária', valor: 53017.98 },
      { categoria: 'Fundo de Reserva Regulamentar', valor: 2612.57 },
      { categoria: 'Água & Esgoto (Leitura Individual)', valor: 7787.45 },
      { categoria: 'Gás Encanado (Consumo Individual)', valor: 2164.37 },
      { categoria: 'Taxa Extra / Obras Aprovadas', valor: 19055.25 },
      { categoria: 'Rendimentos de Aplicações Financeiras', valor: 3797.93 },
      { categoria: 'Uso de Salão de Festas & Churrasqueiras', valor: 502.78 },
      { categoria: 'Energia Áreas Comuns', valor: 419.58 }
    ];

    const despesasDetalhadas = atual.categoriasDespesa || [
      { nome: 'Mão de Obra Terceirizada (Portaria & Limpeza Geral)', valor: 28933.49, cor: '#2563EB' },
      { nome: 'Consumo de Água & Esgoto Concessionária', valor: 9404.63, cor: '#0D9488' },
      { nome: 'Consumo de Gás Encanado', valor: 2592.73, cor: '#D97706' },
      { nome: 'Manutenção Preventiva de Elevadores', valor: 1050.00, cor: '#7C3AED' },
      { nome: 'Manutenção de Piscina & Produtos', valor: 435.00, cor: '#0284C7' },
      { nome: 'Jardinagem & Conservação Verde', valor: 365.00, cor: '#059669' },
      { nome: 'Manutenção de CFTV, Portão & Interfonia', valor: 485.00, cor: '#4F46E5' },
      { nome: 'Limpeza, Desinsetização & Reservatórios', valor: 200.00, cor: '#14B8A6' },
      { nome: 'Reposição de Peças de Elevadores & Equipamentos', valor: 1425.57, cor: '#8B5CF6' },
      { nome: 'Compras de Materiais de Limpeza & Insumos', valor: 1125.30, cor: '#F59E0B' },
      { nome: 'Honorários de Gestão Administrativa & Contábil', valor: 2450.03, cor: '#6366F1' },
      { nome: 'Seguro Predial e Placas Solares', valor: 1512.95, cor: '#0284C7' },
      { nome: 'Impostos & Retenções (ISS, Imposto Unificado)', valor: 4305.34, cor: '#EC4899' }
    ];

    const totalDespesasSoma = despesasDetalhadas.reduce((s, d) => s + (d.valor || 0), 0);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.35rem;">
        
        <!-- Header de Alta Credibilidade (Navy Gradient) -->
        <div class="card-widget" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span class="badge" style="background: rgba(255,255,255,0.12); color: #94A3B8; font-weight: 600;">
                  GESTOR: SÍNDICO ALESSANDRO
                </span>
              </div>

              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: #F8FAFC;">
                Prestação de Contas &amp; Transparência Condominial
              </h2>
              <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.2rem;">
                Demonstrativo oficial de receitas, gastos executados e fundo de reserva do condomínio.
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <!-- Seletor do Período -->
              <select id="selectPrestacaoPeriodo" class="form-control" style="width: auto; font-weight: 700; background: #0F172A; color: #F8FAFC; border: 1px solid #334155; padding: 0.6rem 0.8rem;" onchange="PrestacaoComponent.trocarPeriodo(this.value)">
                ${prestacoes.map((p, idx) => `
                  <option value="${idx}" ${idx === this.selectedPeriodIndex ? 'selected' : ''}>
                    📅 ${p.mesAno || 'Maio 2026'}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- 4 KPI Cards Institucionais de Credibilidade -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          
          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-top: 4px solid #10B981; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">ARRECADAÇÃO TOTAL</span>
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #ECFDF5; color: #10B981; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">trending_up</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              R$ ${receitaTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #059669; margin-top: 4px; font-weight: 600;">
              🟢 Receita Ordinária + Extra
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-top: 4px solid #E11D48; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">GASTOS EXECUTADOS</span>
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #FFF1F2; color: #E11D48; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">trending_down</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              R$ ${despesaTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #E11D48; margin-top: 4px; font-weight: 600;">
              🔴 ${percentExecucao}% da Arrecadação Utilizada
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-top: 4px solid #2563EB; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">SUPERÁVIT LÍQUIDO DO MÊS</span>
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">savings</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              R$ ${superavitMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #2563EB; margin-top: 4px; font-weight: 600;">
              🔷 Saldo Positivo Gerado no Mês
            </div>
          </div>

          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-top: 4px solid #7C3AED; padding: 1.1rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">SALDO CONSOLIDADO EM CONTA</span>
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #F5F3FF; color: #7C3AED; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 1.3rem;">account_balance</span>
              </div>
            </div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #0F172A; margin-top: 0.4rem;">
              R$ ${saldoFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <div style="font-size: 0.75rem; color: #7C3AED; margin-top: 4px; font-weight: 600;">
              🛡️ Fundo de Reserva Guardado
            </div>
          </div>

        </div>

        <!-- GRÁFICOS FINANCEIROS DE ALTA CREDIBILIDADE (2 COLUNAS) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
          
          <!-- Gráfico 1: Indicador de Saúde Orçamentária com Anel SVG & Barras de Confiança -->
          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.35rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: #0F172A;">
                  Gráfico de Execução &amp; Margem de Segurança
                </h3>
                <span class="badge" style="background: #ECFDF5; color: #047857; font-weight: 700; font-size: 0.75rem;">Saúde Financeira</span>
              </div>
              <p style="font-size: 0.82rem; color: #64748B; margin-bottom: 1.3rem;">
                Demonstração percentual entre compromissos honrados e o superávit retido no período.
              </p>

              <!-- Barra Dupla com Degradê de Confiança -->
              <div style="margin-bottom: 1.4rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px;">
                  <span style="color: #E11D48;">Gastos Realizados (${percentExecucao}%)</span>
                  <span style="color: #10B981;">Reserva Livre (${percentSuperavit}%)</span>
                </div>
                
                <div style="height: 20px; background: #F1F5F9; border-radius: 10px; overflow: hidden; display: flex; box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);">
                  <div style="width: ${percentExecucao}%; background: linear-gradient(90deg, #F43F5E 0%, #E11D48 100%); transition: width 0.8s ease;" title="Gastos: R$ ${despesaTotal.toLocaleString('pt-BR')}"></div>
                  <div style="width: ${percentSuperavit}%; background: linear-gradient(90deg, #10B981 0%, #059669 100%); transition: width 0.8s ease;" title="Superávit: R$ ${superavitMes.toLocaleString('pt-BR')}"></div>
                </div>
              </div>

              <!-- Cartão Central com Anel Donut SVG -->
              <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; background: #F8FAFC; padding: 1.1rem; border-radius: 12px; border: 1px solid #E2E8F0;">
                
                <div style="position: relative; width: 95px; height: 95px; display: flex; align-items: center; justify-content: center;">
                  <svg width="95" height="95" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                    <defs>
                      <linearGradient id="gradTrustSup" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#10B981" />
                        <stop offset="100%" stop-color="#059669" />
                      </linearGradient>
                      <linearGradient id="gradTrustDesp" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#F43F5E" />
                        <stop offset="100%" stop-color="#E11D48" />
                      </linearGradient>
                    </defs>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" stroke-width="3.5"/>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#gradTrustSup)" stroke-width="3.5" stroke-dasharray="100 100" stroke-dashoffset="0"/>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#gradTrustDesp)" stroke-width="3.5" stroke-dasharray="${percentExecucao} 100" stroke-dashoffset="0"/>
                  </svg>
                  
                  <div style="position: absolute; text-align: center;">
                    <span style="font-size: 1.05rem; font-weight: 800; color: #0F172A; display: block; line-height: 1;">${percentSuperavit}%</span>
                    <span style="font-size: 0.65rem; color: #64748B; font-weight: 600;">Retido</span>
                  </div>
                </div>

                <div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: #059669;">R$ ${superavitMes.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                  <div style="font-size: 0.8rem; font-weight: 700; color: #1E293B; margin-top: 2px;">Saldo Positivo Incorporado</div>
                  <div style="font-size: 0.75rem; color: #64748B; margin-top: 4px;">
                    Contas rigorosamente em dia.
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- Gráfico 2: Composição Visual Auditada das Despesas (Cores de Credibilidade) -->
          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.35rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <h3 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: #0F172A;">
                Composição de Despesas por Categoria
              </h3>
              <span class="badge" style="background: #EFF6FF; color: #1D4ED8; font-weight: 700; font-size: 0.75rem;">Detalhamento</span>
            </div>
            <p style="font-size: 0.82rem; color: #64748B; margin-bottom: 1.2rem;">
              Destino exato dos investimentos em manutenção e operação predial.
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.85rem; max-height: 270px; overflow-y: auto; padding-right: 6px;">
              ${despesasDetalhadas.map((d, idx) => {
                const perc = totalDespesasSoma > 0 ? Math.round((d.valor / totalDespesasSoma) * 100) : 0;
                
                const gradientesConfianca = [
                  'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                  'linear-gradient(90deg, #0D9488 0%, #14B8A6 100%)',
                  'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
                  'linear-gradient(90deg, #7C3AED 0%, #8B5CF6 100%)',
                  'linear-gradient(90deg, #0284C7 0%, #38BDF8 100%)',
                  'linear-gradient(90deg, #059669 0%, #10B981 100%)',
                  'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)',
                  'linear-gradient(90deg, #EC4899 0%, #F472B6 100%)'
                ];

                const gradUsado = gradientesConfianca[idx % gradientesConfianca.length];
                const corDot = d.cor || '#2563EB';

                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 4px;">
                      <span style="display: flex; align-items: center; gap: 6px; color: #334155;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: ${corDot}; display: inline-block;"></span>
                        ${d.nome}
                      </span>
                      <strong style="color: #0F172A;">R$ ${d.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})} <span style="color: #64748B; font-weight: 500;">(${perc}%)</span></strong>
                    </div>

                    <div style="height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
                      <div style="width: ${perc}%; height: 100%; background: ${gradUsado}; border-radius: 4px; transition: width 0.8s ease;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

        <!-- Tabelas de Detalhamento das Receitas e Despesas (Nomes Genericos Protegidos) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.35rem;">
          
          <!-- Tabela de Receitas -->
          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem;">
            <div class="card-header" style="margin-bottom: 0.85rem;">
              <div class="card-title" style="color: #059669; font-weight: 700; font-size: 1.05rem;">
                <span class="material-symbols-outlined">trending_up</span> Receitas Arrecadadas (${atual.mesAno || 'Maio 2026'})
              </div>
            </div>

            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr style="background: #F8FAFC;">
                    <th style="color: #475569; font-weight: 700;">Categoria da Receita</th>
                    <th style="text-align: right; color: #059669; font-weight: 700;">Valor Arrecadado (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  ${receitasDetalhadas.map(r => `
                    <tr>
                      <td><strong style="color: #0F172A;">${r.categoria}</strong></td>
                      <td style="text-align: right; color: #059669; font-weight: 700;">
                        R$ ${r.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tabela de Despesas Genericas -->
          <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem;">
            <div class="card-header" style="margin-bottom: 0.85rem;">
              <div class="card-title" style="color: #E11D48; font-weight: 700; font-size: 1.05rem;">
                <span class="material-symbols-outlined">trending_down</span> Despesas Pagas (${atual.mesAno || 'Maio 2026'})
              </div>
            </div>

            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr style="background: #F8FAFC;">
                    <th style="color: #475569; font-weight: 700;">Item de Despesa (Nome Genérico Protegido)</th>
                    <th style="text-align: right; color: #E11D48; font-weight: 700;">Valor Pago (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  ${despesasDetalhadas.map(d => `
                    <tr>
                      <td><strong style="color: #0F172A;">${d.nome}</strong></td>
                      <td style="text-align: right; color: #E11D48; font-weight: 700;">
                        R$ ${d.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Tabela Consolidada de Histórico -->
        <div class="card-widget" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.35rem;">
          <div class="card-header" style="margin-bottom: 1rem;">
            <div class="card-title" style="color: #0F172A; font-weight: 700;">
              <span class="material-symbols-outlined" style="color: var(--primary);">history</span> Histórico Consolidado de Períodos Anteriores
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr style="background: #F8FAFC;">
                  <th style="color: #475569; font-weight: 700;">Mês / Ano</th>
                  <th style="color: #475569; font-weight: 700;">Saldo Inicial</th>
                  <th style="color: #059669; font-weight: 700;">Receitas Total</th>
                  <th style="color: #E11D48; font-weight: 700;">Despesas Total</th>
                  <th style="color: #2563EB; font-weight: 700;">Saldo Acumulado Final</th>
                  <th style="color: #475569; font-weight: 700;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${prestacoes.map((p, idx) => `
                  <tr style="background: ${idx === this.selectedPeriodIndex ? '#F0FDF4' : 'transparent'}; cursor: pointer;" onclick="PrestacaoComponent.trocarPeriodo(${idx})">
                    <td><strong style="color: #0F172A;">📅 ${p.mesAno}</strong></td>
                    <td style="color: #475569;">R$ ${p.saldoInicial ? p.saldoInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2}) : '---'}</td>
                    <td style="color: #059669; font-weight: 700;">R$ ${p.receitas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                    <td style="color: #E11D48; font-weight: 700;">R$ ${p.despesas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                    <td><strong style="color: #2563EB;">R$ ${p.saldoAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></td>
                    <td><span class="badge badge-success" style="background: #DCFCE7; color: #166534; font-weight: 700;">${p.status || 'Concluído'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  trocarPeriodo(idx) {
    this.selectedPeriodIndex = parseInt(idx, 10);
    App.render();
  }
};
