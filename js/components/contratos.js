/* ----------------------------------------------------
   Modern Life Residence - Contratos Component
   ---------------------------------------------------- */

window.ContratosComponent = {
  render(container, data) {
    const list = data.contratos || [];

    container.innerHTML = `
      <div class="card-widget">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">gavel</span> Contratos Firmados do Condomínio
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Consulta aos fornecedores, vigências, valores mensais e status de prestação de serviços.
            </p>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Empresa Prestadora</th>
                <th>Objeto / Serviço</th>
                <th style="text-align: right;">Valor Mensal (R$)</th>
                <th>Vigência</th>
                <th>Status</th>
                <th style="text-align: center;">Documento</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(ctr => {
                let badgeClass = 'badge-success';
                if (ctr.status === 'Em Renovação') badgeClass = 'badge-warning';
                if (ctr.status === 'Encerrado') badgeClass = 'badge-danger';

                return `
                  <tr>
                    <td>
                      <strong>${ctr.empresa}</strong>
                    </td>
                    <td>${ctr.objeto}</td>
                    <td style="text-align: right; font-weight: 700; color: var(--primary-dark);">
                      R$ ${ctr.valorMensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </td>
                    <td>
                      <div style="font-size: 0.82rem;">
                        ${ctr.vigenciaInicio} a ${ctr.vigenciaFim}
                      </div>
                    </td>
                    <td>
                      <span class="badge ${badgeClass}">${ctr.status}</span>
                    </td>
                    <td style="text-align: center;">
                      <button class="btn-outline-primary btn-sm" onclick="alert('Fazendo download de: ${ctr.arquivo}')">
                        <span class="material-symbols-outlined">picture_as_pdf</span> PDF
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
