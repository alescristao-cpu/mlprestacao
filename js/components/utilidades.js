/* ----------------------------------------------------
   Modern Life Residence - Utilidades, Reservas & 2ª Via de Boletos
   Interface Organizada por Abas Dedicadas (Agendamento de Piscina & Academia em Destaque Principal):
   - Aba 1 (PRINCIPAL): 🏊 Agendamento Automático de Piscina & Academia
   - Aba 2: 💳 2ª Via do Boleto & App Salão de Festas / Churrasqueira
   ---------------------------------------------------- */

window.UtilidadesComponent = {
  activeTab: 'piscina_academia', // 'piscina_academia' é a aba principal padrão selecionada

  render(container, data) {
    const user = window.CondoStore.currentUser;

    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito às Suas Reservas Pessoais
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">
            O agendamento de áreas comuns e a emissão de boletos é exclusivo para moradores autorizados. Faça login para continuar.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar com Seu E-mail
          </button>
        </div>
      `;
      return;
    }

    const userEmailNorm = (user.email || '').toLowerCase().trim();
    const userNomeNorm = (user.nome || '').toLowerCase().trim();

    const isMasterAdmin = userEmailNorm === 'condominio.modern.life@gmail.com';
    const isPortaria = userEmailNorm === 'portaria.modern.life@gmail.com';

    const hojeStr = new Date().toISOString().split('T')[0];

    const limite30Dias = new Date();
    limite30Dias.setDate(limite30Dias.getDate() - 30);
    const limiteStr = limite30Dias.toISOString().split('T')[0];

    const todasReservas = (data.agendaReservas || []).filter(r => r.data >= limiteStr);

    const reservasExistentes = (isMasterAdmin || isPortaria)
      ? todasReservas
      : todasReservas.filter(r => {
          const resEmail = (r.email || '').toLowerCase().trim();
          const resNome = (r.moradorNome || '').toLowerCase().trim();

          if (userEmailNorm && resEmail && resEmail === userEmailNorm) return true;
          if (userNomeNorm && resNome && resNome === userNomeNorm) return true;
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
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Header Principal da Seção -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; padding: 1.35rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">build</span> UTILIDADES &amp; RESERVAS
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700;">
                Serviços, Agendamentos e Boletos
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 2px;">
                Agendamento de Piscina &amp; Academia, 2ª via de boletos e reserva de Salão de Festas e Churrasqueira.
              </p>
            </div>
          </div>
        </div>

        <!-- SELETOR DE ABAS DEDICADAS (AGENDAMENTO DE PISCINA & ACADEMIA EM 1º LUGAR COMO PRINCIPAL) -->
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; border-bottom: 2px solid var(--border-color); padding-bottom: 0.25rem;">
          
          <!-- Aba Principal 1: Agendamento de Piscina & Academia -->
          <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.2rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; ${this.activeTab === 'piscina_academia' ? 'background: #2E6B42; color: white; border: none; box-shadow: 0 4px 12px rgba(46,107,66,0.25);' : 'background: white; color: var(--primary-dark); border: 1px solid var(--border-color);'}" onclick="UtilidadesComponent.setTab('piscina_academia')">
            <span class="material-symbols-outlined" style="font-size: 1.15rem;">pool</span> 
            🏊 Agendamento (Piscina &amp; Academia)
          </button>

          <!-- Aba 2: 2ª Via do Boleto & App Salão de Festas / Churrasqueira -->
          <button class="btn-sm" style="font-weight: 700; padding: 0.75rem 1.2rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; ${this.activeTab === 'boleto_espacos' ? 'background: #2E6B42; color: white; border: none; box-shadow: 0 4px 12px rgba(46,107,66,0.25);' : 'background: white; color: var(--primary-dark); border: 1px solid var(--border-color);'}" onclick="UtilidadesComponent.setTab('boleto_espacos')">
            <span class="material-symbols-outlined" style="font-size: 1.15rem;">receipt_long</span> 
            💳 2ª Via do Boleto &amp; App Salão de Festas / Churrasqueira
          </button>

        </div>

        <!-- CONTEÚDO DAS ABAS -->

        <!-- ABA PRINCIPAL 1: AGENDAMENTO AUTOMÁTICO DE PISCINA & ACADEMIA -->
        ${this.activeTab === 'piscina_academia' ? `
          <div class="card-widget" style="padding: 1.35rem;">
            <div class="card-header" style="margin-bottom: 1rem;">
              <div>
                <div class="card-title" style="font-size: 1.15rem; color: var(--primary-dark);">
                  <span class="material-symbols-outlined" style="color: var(--primary);">pool</span> Agendamento Principal (Piscina &amp; Academia)
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                  🔒 <strong>Privacidade Individual Pessoal:</strong> ${isMasterAdmin ? 'Visão Master do Síndico (Acesso Completo).' : isPortaria ? 'Visão Operacional da Portaria.' : `Sua conta (${user.nome}) enxerga exclusivamente os seus próprios agendamentos. Os agendamentos de outros moradores estão ocultos.`}
                </p>
              </div>
            </div>

            <form onsubmit="UtilidadesComponent.submeterAgendamento(event)" style="margin-bottom: 1.5rem;">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Selecione a Área Comum</label>
                  <select id="resArea" class="form-control" required style="font-weight: 600;">
                    <option value="Piscina">🏊 Piscina</option>
                    <option value="Academia">🏋️ Academia</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Data do Uso</label>
                  <input type="date" id="resData" class="form-control" value="${hojeStr}" min="${hojeStr}" required style="font-weight: 600;">
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Horário Desejado (Slot de 1 Hora)</label>
                  <select id="resHorario" class="form-control" required style="font-weight: 600;">
                    ${hourlySlots.map(h => `<option value="${h}">${h}</option>`).join('')}
                  </select>
                </div>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem; font-weight: 700; background: #2E6B42;">
                <span class="material-symbols-outlined">event_available</span> Confirmar Agendamento
              </button>
            </form>

            <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.75rem;">
              ${isMasterAdmin ? 'Quadro Master de Agendamentos (Síndico Master)' : isPortaria ? 'Quadro Operacional de Agendamentos (Portaria)' : `Meus Agendamentos Pessoais (${user.nome})`}
            </h4>
            <div class="table-responsive">
              <table class="custom-table" id="tableReservas">
                <thead>
                  <tr style="background: #F8FAFC;">
                    <th style="color: #475569; font-weight: 700;">Data do Uso</th>
                    <th style="color: #475569; font-weight: 700;">Horário</th>
                    <th style="color: #475569; font-weight: 700;">Nome do Morador</th>
                    <th style="color: #475569; font-weight: 700;">Unidade / Apto</th>
                    <th style="color: #475569; font-weight: 700;">Área Reservada</th>
                    <th style="color: #475569; font-weight: 700;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${reservasExistentes.length === 0 ? `
                    <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum agendamento pessoal registrado para ${user.nome} nos últimos 30 dias.</td></tr>
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
        ` : ''}

        <!-- ABA 2: 2ª VIA DO BOLETO & APP SALÃO DE FESTAS E CHURRASQUEIRA -->
        ${this.activeTab === 'boleto_espacos' ? `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- Cartão 1: 2ª Via do Boleto Condominial -->
            <div class="card-widget" style="border-left: 5px solid #2E6B42; padding: 1.35rem;">
              <div class="card-header" style="margin-bottom: 0.85rem;">
                <div>
                  <div class="card-title" style="color: var(--primary-dark); font-size: 1.15rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.6rem; color: #2E6B42;">receipt_long</span> Emissão de 2ª Via do Boleto Condominial
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                    Acesse o portal oficial da Real Administradora para baixar seu boleto bancário atualizado, consultar comprovantes e histórico financeiro da sua unidade.
                  </p>
                </div>
              </div>

              <div style="background: #F0FDF4; padding: 1.25rem; border-radius: 8px; border: 1px solid #BBF7D0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <h4 style="font-weight: 700; color: #166534; margin-bottom: 0.25rem; font-size: 1rem;">
                    Sistema da Real Administradora
                  </h4>
                  <p style="font-size: 0.85rem; color: #15803D;">
                    Entre com seu e-mail e senha cadastrados na administradora para consultar boletos e parcelas.
                  </p>
                </div>

                <a href="https://realadministradoraapp.com21.com.br/frontend/public/#/login" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.35rem; font-weight: 800; background: #2E6B42; color: white;">
                  <span class="material-symbols-outlined">open_in_new</span> Emitir 2ª Via do Boleto Agora
                </a>
              </div>
            </div>

            <!-- Cartão 2: App Salão de Festas & Churrasqueira -->
            <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; padding: 1.5rem; border-radius: 12px;">
              <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
                <div style="flex: 1; min-width: 280px;">
                  <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.5rem;">
                    <span class="material-symbols-outlined" style="font-size: 0.85rem;">phone_iphone</span> APLICATIVO OFICIAL DA ADMINISTRADORA
                  </span>
                  <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem;">
                    Reserva do Salão de Festas &amp; Churrasqueira
                  </h3>
                  <p style="font-size: 0.9rem; opacity: 0.95; line-height: 1.6; margin-bottom: 1.25rem;">
                    As solicitações e agendamentos do <strong>Salão de Festas</strong> e da <strong>Churrasqueira</strong> são gerenciadas exclusivamente pelo aplicativo oficial da Real Administradora para controle de caução e termo de uso.
                  </p>

                  <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    <a href="https://realadministradoraapp.com21.com.br/frontend/public/#/login" target="_blank" class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 800; text-decoration: none; padding: 0.85rem 1.25rem;">
                      <span class="material-symbols-outlined">download_for_offline</span> Abrir App da Administradora (Salão &amp; Churrasqueira)
                    </a>
                  </div>
                </div>

                <!-- QR Code Box -->
                <div style="background: white; padding: 1.25rem; border-radius: 10px; text-align: center; color: var(--text-main); min-width: 200px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary-dark); margin-bottom: 0.5rem;">
                    Escaneie o QR CODE
                  </div>
                  <div style="width: 140px; height: 140px; background: #000; margin: 0 auto 0.5rem auto; padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 4h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
                    </svg>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">iOS &amp; Android App</span>
                </div>
              </div>
            </div>

          </div>
        ` : ''}

      </div>
    `;
  },

  setTab(tabName) {
    this.activeTab = tabName;
    App.render();
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

    App.showToast(`Agendamento de ${area} (${horario}) realizado com sucesso!`, 'success');
    App.render();
  }
};
