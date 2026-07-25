/* ----------------------------------------------------
   Modern Life Residence - Utilidades & Reservas Component
   ---------------------------------------------------- */

window.UtilidadesComponent = {
  render(container, data) {
    const reservas = data.reservas || [];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Links Rápidos Card -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">link</span> Links Rápidos &amp; Serviços do Condomínio
            </div>
          </div>

          <div class="grid-cards">
            <div class="card-widget" style="background: var(--bg-app); cursor: pointer;" onclick="UtilidadesComponent.emite2ViaBoleto()">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="material-symbols-outlined" style="font-size: 2.2rem; color: var(--primary);">receipt_long</span>
                <div>
                  <h4 style="font-weight: 700; color: var(--primary-dark);">Segunda Via do Boleto</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Gerar código PIX / código de barras</p>
                </div>
              </div>
            </div>

            <div class="card-widget" style="background: var(--bg-app); cursor: pointer;" onclick="UtilidadesComponent.openReservaModal('Salão de Festas')">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="material-symbols-outlined" style="font-size: 2.2rem; color: var(--primary);">celebration</span>
                <div>
                  <h4 style="font-weight: 700; color: var(--primary-dark);">Reserva do Salão de Festas</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Verificar datas e reservar</p>
                </div>
              </div>
            </div>

            <div class="card-widget" style="background: var(--bg-app); cursor: pointer;" onclick="UtilidadesComponent.openReservaModal('Churrasqueira')">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="material-symbols-outlined" style="font-size: 2.2rem; color: var(--primary);">outdoor_grill</span>
                <div>
                  <h4 style="font-weight: 700; color: var(--primary-dark);">Reserva da Churrasqueira</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Espaço gourmet e quiosque</p>
                </div>
              </div>
            </div>

            <div class="card-widget" style="background: var(--bg-app); cursor: pointer;" onclick="UtilidadesComponent.openReservaModal('Piscina')">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="material-symbols-outlined" style="font-size: 2.2rem; color: var(--primary);">pool</span>
                <div>
                  <h4 style="font-weight: 700; color: var(--primary-dark);">Reserva da Piscina / Espaço</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Consultar normas e horários</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Minhas Reservas Efetuadas -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">event_available</span> Reservas Confirmadas
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Espaço Reservado</th>
                  <th>Morador</th>
                  <th>Data da Reserva</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${reservas.map(res => `
                  <tr>
                    <td><strong>${res.espaco}</strong></td>
                    <td>${res.moradorNome} (Apt ${res.apartamento})</td>
                    <td>${res.data}</td>
                    <td><span class="badge badge-success">${res.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  emite2ViaBoleto() {
    const user = window.CondoStore.currentUser || { apartamento: '101', bloco: 'A' };
    alert(`2ª VIA DE BOLETO CONDOMINIAL\nCompetência: Julho/2026\nApartamento: ${user.apartamento || '152'}\nValor: R$ 850,00\nVencimento: 10/08/2026\n\nCódigo de Barras PIX: 00020126580014BR.GOV.BCB.PIX0136modernlife-pix-key`);
  },

  openReservaModal(espaco) {
    const modalHtml = `
      <div class="modal-overlay active" id="modalReserva">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-title">Reserva de Espaço - ${espaco}</div>
            <button class="modal-close" onclick="document.getElementById('modalReserva').remove()">✕</button>
          </div>
          <form onsubmit="UtilidadesComponent.submitReserva(event, '${espaco}')">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Data Desejada para a Reserva</label>
                <input type="date" id="resData" class="form-control" required min="${new Date().toISOString().split('T')[0]}">
              </div>
              <div class="form-group">
                <label class="form-label">Declaração de Aceite das Normas</label>
                <label style="font-size: 0.82rem; display: flex; align-items: center; gap: 6px;">
                  <input type="checkbox" required> Declaro estar ciente das regras de limpeza e silêncio após às 22h.
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" onclick="document.getElementById('modalReserva').remove()">Cancelar</button>
              <button type="submit" class="btn-primary">Confirmar Reserva</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submitReserva(e, espaco) {
    e.preventDefault();
    const data = document.getElementById('resData').value;
    const user = window.CondoStore.currentUser || { nome: 'Morador', apartamento: '101' };

    window.CondoStore.data.reservas.unshift({
      id: 'res_' + Date.now(),
      espaco,
      moradorNome: user.nome,
      apartamento: `${user.apartamento || '101'}${user.bloco || 'A'}`,
      data,
      status: 'Confirmada'
    });

    window.CondoStore.saveData();
    document.getElementById('modalReserva').remove();
    App.showToast(`Reserva do ${espaco} confirmada para ${data}!`, 'success');
    App.render();
  }
};
