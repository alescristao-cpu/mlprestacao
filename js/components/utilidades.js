/* ----------------------------------------------------
   Modern Life Residence - Utilidades, Reservas & Integração Google Sheets
   ---------------------------------------------------- */

const GOOGLE_SHEETS_URL_KEY = 'MODERN_LIFE_SHEETS_SCRIPT_URL';

window.UtilidadesComponent = {
  getSavedSheetsUrl() {
    try {
      return localStorage.getItem(GOOGLE_SHEETS_URL_KEY) || '';
    } catch (e) {
      return '';
    }
  },

  setSavedSheetsUrl(url) {
    try {
      localStorage.setItem(GOOGLE_SHEETS_URL_KEY, url);
    } catch (e) {}
  },

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const reservasExistentes = data.agendaReservas || [];
    const savedSheetsUrl = this.getSavedSheetsUrl();

    const hourlySlots = [
      '06:00 às 07:00',
      '07:00 às 08:00',
      '08:00 às 09:00',
      '09:00 às 10:00',
      '10:00 às 11:00',
      '11:00 às 12:00',
      '12:00 às 13:00',
      '13:00 às 14:00',
      '14:00 às 15:00',
      '15:00 às 16:00',
      '16:00 às 17:00',
      '17:00 às 18:00',
      '18:00 às 19:00',
      '19:00 às 20:00',
      '20:00 às 21:00',
      '21:00 às 22:00'
    ];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Section 1: 2ª Via do Boleto -->
        <div class="card-widget" style="border-left: 5px solid #2E6B42;">
          <div class="card-header">
            <div>
              <div class="card-title" style="color: var(--primary-dark);">
                <span class="material-symbols-outlined" style="font-size: 1.6rem;">receipt_long</span> 2ª Via do Boleto Condominial
              </div>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">
                Emita seu boleto atualizado diretamente no portal oficial da administradora.
              </p>
            </div>
          </div>

          <div style="background: var(--bg-app); padding: 1.25rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h4 style="font-weight: 700; color: var(--primary-dark); margin-bottom: 0.25rem;">
                Acesse o Sistema da Real Administradora
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-main);">
                Entre ou faça seu cadastro para visualizar boletos, demonstrativos e saldo da sua unidade.
              </p>
            </div>

            <a href="https://realadministradoraapp.com21.com.br/frontend/public/#/login" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.8rem 1.25rem; font-weight: 700;">
              <span class="material-symbols-outlined">open_in_new</span> Emitir 2ª Via do Boleto
            </a>
          </div>
        </div>

        <!-- Section 2: Agendamento de Piscina & Academia (De Hora em Hora com Google Sheets) -->
        <div class="card-widget">
          <div class="card-header">
            <div>
              <div class="card-title">
                <span class="material-symbols-outlined">pool</span> Agendamento de Piscina &amp; Academia
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                Agendamento de horários de hora em hora.
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-outline-primary btn-sm" onclick="UtilidadesComponent.exportarPlanilhaGoogleSheets()">
                <span class="material-symbols-outlined">download</span> Baixar Planilha (.CSV / Google Sheets)
              </button>

              <button class="btn-primary btn-sm" style="background: #2E6B42;" onclick="UtilidadesComponent.openGoogleSheetsConfig()">
                <span class="material-symbols-outlined">table_chart</span> Conectar Google Sheets
              </button>
            </div>
          </div>

          ${!user || user.status !== 'Aprovado' ? `
            <div style="background: #FFF3E0; padding: 1rem; border-radius: var(--radius-sm); color: #E65100; font-size: 0.88rem; margin-bottom: 1rem;">
              🔒 <strong>Atenção:</strong> Faça login para realizar o agendamento da piscina ou academia.
            </div>
          ` : ''}

          <form onsubmit="UtilidadesComponent.submeterAgendamento(event)" style="margin-bottom: 1.5rem;">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Selecione a Área Comum</label>
                <select id="resArea" class="form-control" required>
                  <option value="Piscina">🏊 Piscina</option>
                  <option value="Academia">🏋️ Academia</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Data do Uso</label>
                <input type="date" id="resData" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Horário (Slots de Hora em Hora)</label>
                <select id="resHorario" class="form-control" required>
                  ${hourlySlots.map(h => `<option value="${h}">${h}</option>`).join('')}
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary" ${(!user || user.status !== 'Aprovado') ? 'disabled' : ''} style="width: 100%; justify-content: center; padding: 0.8rem;">
              <span class="material-symbols-outlined">event_available</span> Confirmar Agendamento
            </button>
          </form>

          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.75rem;">
            Agendamentos Confirmados (Sincronizados)
          </h4>
          <div class="table-responsive">
            <table class="custom-table" id="tableReservas">
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Morador</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${reservasExistentes.length === 0 ? `
                  <tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhum agendamento registrado ainda.</td></tr>
                ` : reservasExistentes.map(r => `
                  <tr>
                    <td><strong>${r.area}</strong></td>
                    <td>${r.data}</td>
                    <td><span class="badge badge-info">${r.horario}</span></td>
                    <td>${r.moradorNome}</td>
                    <td><span class="badge badge-success">${r.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Reserva de Salão de Festas & Churrasqueira (Aplicativo Real Administradora) -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white;">
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
            <div style="flex: 1; min-width: 280px;">
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.5rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">phone_iphone</span> APLICATIVO OFICIAL
              </span>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem;">
                Reserva de Salão de Festas &amp; Churrasqueira
              </h3>
              <p style="font-size: 0.9rem; opacity: 0.95; line-height: 1.6; margin-bottom: 1.25rem;">
                Para solicitar a reserva do Salão de Festas ou da Churrasqueira, baixe o aplicativo oficial no link abaixo e escaneie o QR CODE de acordo com o sistema do seu aparelho:
              </p>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <a href="https://realadministradoraapp.com21.com.br/frontend/public/#/login" target="_blank" class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700; text-decoration: none;">
                  <span class="material-symbols-outlined">download_for_offline</span> Abrir Link do App Real Administradora
                </a>
              </div>
            </div>

            <!-- QR Code Box -->
            <div style="background: white; padding: 1.25rem; border-radius: var(--radius-md); text-align: center; color: var(--text-main); min-width: 200px; box-shadow: var(--shadow-lg);">
              <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary-dark); margin-bottom: 0.5rem;">
                Escaneie o QR CODE
              </div>
              <div style="width: 140px; height: 140px; background: #000; margin: 0 auto 0.5rem auto; padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 4h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
                </svg>
              </div>
              <span style="font-size: 0.75rem; color: var(--text-muted);">iOS &amp; Android App</span>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  openGoogleSheetsConfig() {
    const existing = document.getElementById('modalSheetsConfig');
    if (existing) existing.remove();

    const currentUrl = this.getSavedSheetsUrl();

    const modalHtml = `
      <div class="modal-overlay active" id="modalSheetsConfig">
        <div class="modal-card" style="max-width: 620px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">
              📊 Passo a Passo Simplificado para Criar no Google Sheets
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalSheetsConfig').remove()">✕</button>
          </div>
          <div class="modal-body">
            <div style="background: var(--primary-light); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--primary-dark); margin-bottom: 1rem; border-left: 4px solid var(--primary);">
              💡 <strong>Não se preocupe!</strong> É muito fácil e leva menos de 1 minuto. Siga apenas estes 4 passos:
            </div>

            <ol style="font-size: 0.88rem; color: var(--text-main); margin-left: 1.25rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;">
              <li>Acesse <strong><a href="https://sheets.new" target="_blank" style="color: var(--primary); font-weight: 700;">sheets.new</a></strong> no seu navegador para abrir uma nova planilha em branco.</li>
              <li>No menu do topo da planilha, clique em <strong>Extensões > Apps Script</strong>.</li>
              <li>Apague qualquer texto que estiver lá e cole o código do arquivo <strong><code>google-sheets-script.js</code></strong>.</li>
              <li>Clique no botão azul <strong>Implantar > Nova Implantação</strong>. Em <i>"Quem tem acesso"</i> escolha <strong>Qualquer Pessoa</strong>. Copie o link gerado e cole no campo abaixo:</li>
            </ol>

            <div class="form-group">
              <label class="form-label" style="font-weight: 700;">Link do Web App do Google Apps Script</label>
              <input type="text" id="inputSheetsUrl" class="form-control" value="${currentUrl}" placeholder="https://script.google.com/macros/s/.../exec">
            </div>

            <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn-outline-primary btn-sm" onclick="UtilidadesComponent.exportarPlanilhaGoogleSheets()">
                <span class="material-symbols-outlined">file_download</span> Baixar Planilha em Excel (.CSV)
              </button>

              <div style="display: flex; gap: 0.5rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalSheetsConfig').remove()">Fechar</button>
                <button type="button" class="btn-primary" onclick="UtilidadesComponent.saveGoogleSheetsUrl()">Salvar Integração</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  saveGoogleSheetsUrl() {
    const url = document.getElementById('inputSheetsUrl').value.trim();
    this.setSavedSheetsUrl(url);
    App.showToast('URL do Google Sheets conectada com sucesso!', 'success');
    document.getElementById('modalSheetsConfig').remove();
  },

  exportarPlanilhaGoogleSheets() {
    const data = window.CondoStore.data.agendaReservas || [];
    let csv = '\uFEFF'; // UTF-8 BOM for Excel/Google Sheets
    csv += 'Área Comum;Data do Uso;Horário;Morador;Status\n';

    data.forEach(r => {
      csv += `"${r.area}";"${r.data}";"${r.horario}";"${r.moradorNome}";"${r.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Agendamentos_ModernLife_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    App.showToast('Planilha de agendamentos gerada! Você pode abri-la diretamente no Google Sheets ou Excel.', 'success');
  },

  async submeterAgendamento(e) {
    e.preventDefault();
    const user = window.CondoStore.currentUser;
    if (!user || user.status !== 'Aprovado') {
      App.showToast('Você precisa estar logado e aprovado para agendar.', 'error');
      return;
    }

    const area = document.getElementById('resArea').value;
    const data = document.getElementById('resData').value;
    const horario = document.getElementById('resHorario').value;

    const payload = {
      area,
      data,
      horario,
      moradorNome: user.nome,
      apartamento: `Apto ${user.apartamento}`,
      email: user.email,
      status: 'Confirmado'
    };

    // 1. Salva localmente
    window.CondoStore.addAgendamento(payload);

    // 2. Dispara envio automático para o Google Sheets se a URL estiver configurada
    const sheetsUrl = this.getSavedSheetsUrl();
    if (sheetsUrl) {
      try {
        fetch(sheetsUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.error('Erro ao enviar para Google Sheets:', err));
      } catch (err) {}
    }

    App.showToast(`Agendamento de ${area} confirmado (${horario})!`, 'success');
    App.render();
  }
};
