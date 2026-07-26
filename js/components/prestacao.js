/* ----------------------------------------------------
   Modern Life Residence - Prestação de Contas & Dashboard Financeiro
   Dados Oficiais Extraídos do Demonstrativo PDF 05/2026
   - NENHUM nome de empresa (Apenas nomes genéricos)
   - NENHUM número de unidade
   ---------------------------------------------------- */

window.PrestacaoComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    // Access Gate para visitantes não aprovados
    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
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
    const atual = prestacoes[0] || {};

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span> DEMONSTRATIVO OFICIAL AUDITADO
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Dashboard de Prestação de Contas Anual
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Demonstrativo consolidado de Receitas e Despesas &bull; Base do mês: <strong>${atual.mesAno || 'Maio 2026'}</strong>
              </p>
            </div>

            <div style="text-align: right;">
              <span style="font-size: 0.78rem; opacity: 0.8; display: block;">Saldo Atual Consolidado</span>
              <strong style="font-size: 1.4rem; font-family: var(--font-heading);">
                R$ ${(atual.saldoAtual || 518922.33).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              </strong>
            </div>
          </div>
        </div>

        <!-- 4 Cards Resumo do Mês Vigente -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          
          <div class="card-widget" style="border-left: 4px solid var(--primary-dark);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Saldo Anterior em Conta</div>
            <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--primary-dark); margin-top: 0.25rem;">
              R$ ${(atual.saldoInicial || 498438.09).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Saldo inicial do período</span>
          </div>

          <div class="card-widget" style="border-left: 4px solid #0288D1;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total de Receitas no Mês</div>
            <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: #0288D1; margin-top: 0.25rem;">
              R$ ${(atual.receitas || 90351.01).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Arrecadação e rendimentos</span>
          </div>

          <div class="card-widget" style="border-left: 4px solid #D32F2F;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total de Despesas no Mês</div>
            <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: #D32F2F; margin-top: 0.25rem;">
              R$ ${(atual.despesas || 69866.77).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Manutenção, contratos e insumos</span>
          </div>

          <div class="card-widget" style="border-left: 4px solid #2E6B42;">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Superávit Operacional no Mês</div>
            <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: #2E6B42; margin-top: 0.25rem;">
              R$ ${((atual.receitas || 90351.01) - (atual.despesas || 69866.77)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Saldo positivo gerado</span>
          </div>

        </div>

        <!-- Seção Dupla: Detalhamento de Receitas vs Detalhamento de Despesas (Nomes Genericos) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;">
          
          <!-- Tabela de Receitas -->
          <div class="card-widget">
            <div class="card-header">
              <div class="card-title" style="color: #0288D1;">
                <span class="material-symbols-outlined">trending_up</span> Detalhamento de Receitas (${atual.mesAno || 'Maio 2026'})
              </div>
            </div>

            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Categoria da Receita</th>
                    <th style="text-align: right;">Valor Arrecadado</th>
                  </tr>
                </thead>
                <tbody>
                  ${(atual.receitasDetalhadas || [
                    { categoria: 'Taxa de Condomínio', valor: 53017.98 },
                    { categoria: 'Fundo de Reserva', valor: 2612.57 },
                    { categoria: 'Água (Consumo Individual)', valor: 7787.45 },
                    { categoria: 'Gás (Consumo Individual)', valor: 2164.37 },
                    { categoria: 'Taxa Extra / Obras', valor: 19055.25 },
                    { categoria: 'Rendimentos de Aplicações', valor: 3797.93 },
                    { categoria: 'Salão de Festas / Churrasqueiras', valor: 502.78 },
                    { categoria: 'Energia Áreas Comuns', valor: 419.58 }
                  ]).map(r => `
                    <tr>
                      <td><strong>${r.categoria}</strong></td>
                      <td style="text-align: right; color: #0288D1; font-weight: 700;">
                        R$ ${r.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tabela de Despesas Genericas (SEM NOMES DE EMPRESAS) -->
          <div class="card-widget">
            <div class="card-header">
              <div class="card-title" style="color: #D32F2F;">
                <span class="material-symbols-outlined">trending_down</span> Detalhamento de Despesas (${atual.mesAno || 'Maio 2026'})
              </div>
            </div>

            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Item de Despesa (Nome Genérico)</th>
                    <th style="text-align: right;">Valor Pago</th>
                  </tr>
                </thead>
                <tbody>
                  ${(atual.categoriasDespesa || [
                    { nome: 'Mão de Obra Terceirizada (Portaria & Limpeza Geral)', valor: 28933.49 },
                    { nome: 'Consumo de Água & Esgoto', valor: 9404.63 },
                    { nome: 'Consumo de Gás Encanado', valor: 2592.73 },
                    { nome: 'Manutenção de Elevadores', valor: 1050.00 },
                    { nome: 'Manutenção de Piscina', valor: 435.00 },
                    { nome: 'Jardinagem & Conservação Verde', valor: 365.00 },
                    { nome: 'Manutenção de CFTV, Portão & Interfonia', valor: 485.00 },
                    { nome: 'Limpeza, Desinsetização & Reservatórios', valor: 200.00 },
                    { nome: 'Reposição de Peças de Elevadores & Equipamentos', valor: 1425.57 },
                    { nome: 'Compras de Materiais de Limpeza', valor: 1125.30 },
                    { nome: 'Honorários de Gestão Administrativa & Contábil', valor: 2450.03 },
                    { nome: 'Seguro Predial e Placas Solares', valor: 1512.95 },
                    { nome: 'Impostos & Retenções (ISS, Imposto Unificado)', valor: 4305.34 }
                  ]).map(d => `
                    <tr>
                      <td><strong>${d.nome}</strong></td>
                      <td style="text-align: right; color: #D32F2F; font-weight: 700;">
                        R$ ${d.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Tabela Consolidada dos Meses Anteriores -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">history</span> Histórico de Períodos Anteriores
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Mês / Ano</th>
                  <th>Saldo Inicial</th>
                  <th>Receitas Total</th>
                  <th>Despesas Total</th>
                  <th>Saldo Acumulado Final</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${prestacoes.map(p => `
                  <tr>
                    <td><strong>${p.mesAno}</strong></td>
                    <td>R$ ${p.saldoInicial ? p.saldoInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2}) : '---'}</td>
                    <td style="color: #0288D1; font-weight: 600;">R$ ${p.receitas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                    <td style="color: #D32F2F; font-weight: 600;">R$ ${p.despesas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                    <td><strong style="color: #2E6B42;">R$ ${p.saldoAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></td>
                    <td><span class="badge badge-success">${p.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }
};
