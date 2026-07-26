/* ----------------------------------------------------
   Modern Life Residence - Contratos com Prestadores de Serviços
   Sigilo Absoluto: Liberado APENAS após cadastro e aprovação
   ---------------------------------------------------- */

window.ContratosComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    // Access Gate for non-approved visitors
    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito: Contratos de Prestação de Serviços
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">
            Por determinação da convenção condominial, o acesso à relação detalhada de contratos firmados com empresas terceirizadas (elevadores, portaria, limpeza e manutenção) é sigiloso e exclusivo a moradores cadastrados e autorizados.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar para Solicitar Acesso
          </button>
        </div>
      `;
      return;
    }

    const contratos = data.contratos || [];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Contratos Vigentes de Prestação de Serviços
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Relação transparente dos contratos corporativos e terceirizações ativas do condomínio.
              </p>
            </div>
            <span class="badge" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 0.85rem;">
              <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified_user</span> Acesso Autorizado ao Morador
            </span>
          </div>
        </div>

        <!-- Tabela de Contratos -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">description</span> Relação de Contratos Ativos
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Empresa Contratada</th>
                  <th>Objeto do Contrato</th>
                  <th>Valor Mensal</th>
                  <th>Vigência</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${contratos.length === 0 ? `
                  <tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhum contrato cadastrado no momento.</td></tr>
                ` : contratos.map(c => `
                  <tr>
                    <td><strong>${c.empresa}</strong></td>
                    <td>${c.objeto}</td>
                    <td><strong style="color: var(--primary-dark);">R$ ${c.valorMensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong> / mês</td>
                    <td>${c.vigenciaInicio} até ${c.vigenciaFim}</td>
                    <td><span class="badge ${c.status === 'Ativo' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
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
