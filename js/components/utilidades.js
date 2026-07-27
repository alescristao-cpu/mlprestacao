/* ----------------------------------------------------
   Modern Life Residence - Utilidades & Agendamento Automático (Piscina & Academia)
   SIGILO E PRIVACIDADE RÍGIDA DE UNIDADE:
   Cada morador, uma vez logado com seu e-mail, visualiza EXCLUSIVAMENTE
   as informações e agendamentos referentes à sua própria unidade.
   ---------------------------------------------------- */

window.UtilidadesComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito às Reservas da Sua Unidade
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">
            O agendamento de áreas comuns é exclusivo para moradores autorizados. Faça login para visualizar as reservas da sua unidade.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar com Seu E-mail
          </button>
        </div>
      `;
      return;
    }

    const isMasterAdmin = user && user.role === 'Administrador';
    const isPortaria = user && user.role === 'Portaria';
    const hojeStr = new Date().toISOString().split('T')[0];

    // PRIVACIDADE ESTREITA DA UNIDADE:
    // Apenas o Síndico Master e a Portaria visualizam todas as reservas do condomínio.
    // O morador comum enxerga APENAS os agendamentos pertencentes à sua própria unidade/e-mail.
    const limite30Dias = new Date();
    limite30Dias.setDate(limite30Dias.getDate() - 30);
    const limiteStr = limite30Dias.toISOString().split('T')[0];

    const todasReservas = (data.agendaReservas || []).filter(r => r.data >= limiteStr);

    const userEmailNorm = (user.email || '').toLowerCase().trim();
    const userAptoNorm = (user.apartamento || '').toString().toLowerCase().trim();

    const reservasExistentes = (isMasterAdmin || isPortaria)
      ? todasReservas
      : todasReservas.filter(r => {
          const resEmail = (r.email || '').toLowerCase().trim();
          const resApto = (r.apartamento || '').toString().toLowerCase().trim();
          
          if (userEmailNorm && resEmail === userEmailNorm) return true;
          if (userAptoNorm && resApto === userAptoNorm && userAptoNorm !== 'morador' && userAptoNorm !== 'guarita' && userAptoNorm !== 'administração') return true;
          return false;
        });

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
        
        <!-- Section 1: 2ª Via do Boleto (OCULTO PARA A PORTARIA) -->
        ${!isPortaria ? `
          <div class="card-widget" style="border-left: 5px solid #2E6B42;">
            <div class="card-header">
              <div>
                <div class="card-title" style="color: var(--primary-dark);">
                  <span class="material-symbols-outlined" style="font-size: 1.6rem;">receipt_long</span> 2ª Via do Boleto da Sua Unidade (Apto ${user.apartamento})
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
        ` : ''}

        <!-- Section 2: Agendamento Automático de Piscina & Academia -->
        <div class="card-widget">
          <div class="card-header">
            <div>
              <div class="card-title">
                <span class="material-symbols-outlined">pool</span> Agendamento (Piscina &amp; Academia)
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                🔒 <strong>Privacidade da Sua Unidade (Apto ${user.apartamento}):</strong> ${isMasterAdmin ? 'Visão Master do Síndico (Acesso Completo).' : isPortaria ? 'Visão Operacional da Portaria.' : 'As informações de agendamento exibidas nesta tela pertencem estritamente à sua unidade. Outros moradores não visualizam seus agendamentos.'}
              </p>
            </div>
          </div>

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
                <input type="date" id="resData" class="form-control" value="${hojeStr}" min="${hojeStr}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Horário Desejado (Slot de 1 Hora)</label>
                <select id="resHorario" class="form-control" required>
                  ${hourlySlots.map(h => `<option value="${h}">${h}</option>`).join('')}
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem;">
              <span class="material-symbols-outlined">event_available</span> Confirmar Agendamento
            </button>
          </form>

          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.75rem;">
            ${isMasterAdmin ? 'Quadro Master de Agendamentos (Síndico Master)' : isPortaria ? 'Quadro Operacional de Agendamentos (Portaria)' : `Meus Agendamentos Confirmados (Unidade Apto ${user.apartamento})`}
          </h4>
          <div class="table-responsive">
            <table class="custom-table" id="tableReservas">
              <thead>
                <tr>
                  <th>Data do Uso</th>
                  <th>Horário</th>
                  <th>Nome do Morador</th>
                  <th>Unidade / Apto</th>
                  <th>Área Reservada</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${reservasExistentes.length === 0 ? `
                  <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum agendamento registrado para a sua unidade nos últimos 30 dias.</td></tr>
                ` : reservasExistentes.map(r => `
                  <tr>
                    <td><strong>${r.data}</strong></td>
                    <td><span class="badge badge-info">${r.horario}</span></td>
                    <td>${r.moradorNome}</td>
                    <td>Apto ${r.apartamento || 'Morador'}</td>
                    <td><span class="badge badge-success">${r.area}</span></td>
                    <td><span class="badge badge-success">✓ ${r.status || 'Confirmado'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Reserva de Salão de Festas & Churrasqueira (OCULTO PARA A PORTARIA) -->
        ${!isPortaria ? `
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
                  Para solicitar a reserva do Salão de Festas ou da Churrasqueira da sua unidade, baixe o aplicativo oficial no link abaixo:
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
        ` : ''}

      </div>
    `;
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

    window.CondoStore.addAgendamento({
      area,
      data,
      horario,
      moradorNome: user.nome,
      apartamento: user.apartamento,
      email: user.email,
      status: 'Confirmado'
    });

    App.showToast(`Agendamento de ${area} (${horario}) para a unidade Apto ${user.apartamento} realizado com sucesso!`, 'success');
    App.render();
  }
};
