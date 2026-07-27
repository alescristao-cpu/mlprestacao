/* ----------------------------------------------------
   Modern Life Residence - Painel de Controle da Portaria & Guarita
   Gestão de Agendamentos (Piscina, Academia e Salão de Festas)
   Status de Liberação: "Autorizado"
   ---------------------------------------------------- */

window.PortariaComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isAllowed = user && (user.role === 'Portaria' || user.role === 'Administrador');

    if (!isAllowed) {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 550px; margin: 2rem auto;">
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #C62828; display: block; margin-bottom: 0.5rem;">door_front</span>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.3rem; margin-top: 0.5rem;">
            Acesso Restrito à Portaria &amp; Guarita
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.75rem 0 1.25rem 0; line-height: 1.5;">
            Este painel é exclusivo para a equipe de <strong>Portaria</strong> e para o <strong>Síndico Master</strong> realizarem a conferência e autorização de uso das áreas comuns.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="width: 100%; justify-content: center; padding: 0.85rem;">
            <span class="material-symbols-outlined">login</span> Entrar como Portaria ou Síndico
          </button>
        </div>
      `;
      return;
    }

    const hojeStr = new Date().toISOString().split('T')[0];

    // Filtra reservas ativas dos últimos 30 dias (Salão de Festas, Academia, Piscina)
    const limite30Dias = new Date();
    limite30Dias.setDate(limite30Dias.getDate() - 30);
    const limiteStr = limite30Dias.toISOString().split('T')[0];

    const todasReservas = (data.agendaReservas || []).filter(r => r.data >= limiteStr);

    const hojeReservas = todasReservas.filter(r => r.data === hojeStr);
    const futurasReservas = todasReservas.filter(r => r.data > hojeStr);
    const passadasReservas = todasReservas.filter(r => r.data < hojeStr);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner da Portaria -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1F4D30 0%, #2E6B42 100%); color: white; padding: 1.35rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.4rem;">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified_user</span> PAINEL DA PORTARIA &amp; GUARITA
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700;">
                Controle de Acesso: Piscina, Academia &amp; Salão de Festas
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 2px;">
                As observações registradas são enviadas automaticamente para <code>condominio.modern.life@gmail.com</code>.
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="PortariaComponent.openNovaReservaModal()">
                <span class="material-symbols-outlined" style="color: var(--primary);">add_circle</span> ➕ Nova Reserva Presencial
              </button>
            </div>
          </div>
        </div>

        <!-- Seção 1: Agendamentos de HOJE (Destaque Principal para a Portaria) -->
        <div class="card-widget" style="border: 2px solid #2E6B42;">
          <div style="background: var(--primary-light); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 700; color: var(--primary-dark); font-size: 1.05rem; display: flex; align-items: center; gap: 0.4rem;">
              <span class="material-symbols-outlined" style="font-size: 1.5rem; color: var(--primary);">today</span>
              Agendamentos para HOJE (${hojeStr.split('-').reverse().join('/')})
            </div>
            <span class="badge badge-success" style="font-size: 0.85rem;">${hojeReservas.length} Reservas Hoje</span>
          </div>

          ${hojeReservas.length === 0 ? `
            <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
              <span class="material-symbols-outlined" style="font-size: 2.5rem; opacity: 0.4; display: block; margin-bottom: 0.3rem;">event_available</span>
              Nenhum agendamento registrado para o dia de hoje.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${hojeReservas.map(r => this.renderReservaCard(r)).join('')}
            </div>
          `}
        </div>

        <!-- Seção 2: Agendamentos Futuros -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">event</span> Próximos Agendamentos (${futurasReservas.length})
            </div>
          </div>

          ${futurasReservas.length === 0 ? `
            <p style="color: var(--text-muted); font-size: 0.88rem; text-align: center; padding: 1rem;">Nenhum agendamento futuro registrado.</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${futurasReservas.map(r => this.renderReservaCard(r)).join('')}
            </div>
          `}
        </div>

        <!-- Seção 3: Histórico de Agendamentos Anteriores (Últimos 30 Dias) -->
        ${passadasReservas.length > 0 ? `
          <div class="card-widget" style="opacity: 0.9;">
            <div class="card-header">
              <div class="card-title" style="color: var(--text-muted);">
                <span class="material-symbols-outlined">history</span> Histórico de Uso Recente (Últimos 30 Dias)
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${passadasReservas.slice(0, 10).map(r => this.renderReservaCard(r, true)).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  renderReservaCard(r, isHistory = false) {
    const isAutorizado = r.status === 'Autorizado' || r.status === 'Entrada Autorizada' || r.status === 'Uso Concluído';
    const isBloqueado = r.status === 'Acesso Bloqueado' || r.status === 'Cancelado';

    let badgeStyle = 'badge-warning';
    let labelStatus = r.status || 'Confirmado';

    if (isAutorizado) {
      badgeStyle = 'badge-success';
      labelStatus = '✓ Autorizado';
    } else if (isBloqueado) {
      badgeStyle = 'badge-danger';
      labelStatus = '🚫 Acesso Bloqueado';
    }

    let iconArea = 'pool';
    if (r.area.toLowerCase().includes('academia')) iconArea = 'fitness_center';
    if (r.area.toLowerCase().includes('festas') || r.area.toLowerCase().includes('churrasqueira')) iconArea = 'celebration';

    return `
      <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: 8px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined">${iconArea}</span>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 1.05rem; color: var(--primary-dark);">
                ${r.moradorNome} (Apto ${r.apartamento})
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                📅 <strong>${r.data}</strong> &bull; ⏰ <strong>${r.horario}</strong> &bull; 📍 <strong style="color: var(--primary);">${r.area}</strong>
              </div>
            </div>
          </div>

          <span class="badge ${badgeStyle}" style="font-size: 0.82rem; padding: 0.4rem 0.75rem; font-weight: 700;">
            ${labelStatus}
          </span>
        </div>

        ${r.observacao ? `
          <div style="background: #FFF8E1; border: 1px solid #FFE0B2; padding: 0.6rem 0.85rem; border-radius: 6px; font-size: 0.82rem; color: #E65100;">
            📝 <strong>Anotação da Portaria (Enviada ao Gmail):</strong> ${r.observacao}
          </div>
        ` : ''}

        <!-- Botões de Ação Exclusivos para a Portaria -->
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; border-top: 1px solid var(--border-light); padding-top: 0.6rem;">
          <button class="btn-primary btn-sm" style="background: #2E6B42; flex: 1; justify-content: center; min-width: 140px;" onclick="PortariaComponent.autorizarUso('${r.id}')">
            <span class="material-symbols-outlined" style="font-size: 0.95rem;">check_circle</span> Autorizar Uso
          </button>

          <button class="btn-secondary btn-sm" style="background: #FFF3E0; color: #E65100; border: 1px solid #FFE0B2;" onclick="PortariaComponent.bloquearUso('${r.id}')">
            <span class="material-symbols-outlined" style="font-size: 0.95rem;">block</span> Bloquear
          </button>

          <button class="btn-outline-primary btn-sm" onclick="PortariaComponent.openObservacaoModal('${r.id}', '${r.observacao || ''}')">
            <span class="material-symbols-outlined" style="font-size: 0.95rem;">edit_note</span> Observação
          </button>

          <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828;" onclick="PortariaComponent.excluirReserva('${r.id}')">
            <span class="material-symbols-outlined" style="font-size: 0.95rem;">delete</span> Excluir
          </button>
        </div>

      </div>
    `;
  },

  enviarObservacaoParaGmail(reserva, observacaoTexto, tipoAcao = 'Anotação da Portaria') {
    try {
      fetch('https://formsubmit.co/ajax/condominio.modern.life@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[AUTORIZAÇÃO / OBSERVAÇÃO DE AGENDAMENTO] ${reserva.area} - Apto ${reserva.apartamento} (${reserva.moradorNome})`,
          "Status Atual": tipoAcao,
          "Área Reservada": reserva.area,
          "Data do Uso": reserva.data,
          "Horário": reserva.horario,
          "Nome do Morador": reserva.moradorNome,
          "Unidade / Apto": reserva.apartamento,
          "Observação Registrada": observacaoTexto,
          "Data do Registro": new Date().toLocaleString("pt-BR")
        })
      }).catch(() => {});
    } catch (e) {}
  },

  autorizarUso(id) {
    const reserva = (window.CondoStore.data.agendaReservas || []).find(r => r.id === id);
    window.CondoStore.updateReservaStatus(id, 'Autorizado', 'Uso liberado na portaria.');
    
    if (reserva) {
      this.enviarObservacaoParaGmail(reserva, 'Uso liberado e autorizado na portaria.', 'Autorizado');
    }

    App.showToast('Status alterado para AUTORIZADO!', 'success');
    App.render();
  },

  bloquearUso(id) {
    const motivo = prompt('Digite o motivo do bloqueio de acesso (ex: Inadimplente, Fora do horário):', 'Acesso negado pela portaria');
    if (motivo === null) return;

    const observacaoTexto = motivo.trim() || 'Bloqueado na portaria';
    const reserva = (window.CondoStore.data.agendaReservas || []).find(r => r.id === id);
    
    window.CondoStore.updateReservaStatus(id, 'Acesso Bloqueado', observacaoTexto);
    
    if (reserva) {
      this.enviarObservacaoParaGmail(reserva, observacaoTexto, 'Acesso Bloqueado');
    }

    App.showToast('Uso BLOQUEADO e notificação enviada ao Gmail!', 'info');
    App.render();
  },

  openObservacaoModal(id, observacaoAtual) {
    const obs = prompt('Adicionar / Editar Anotação da Portaria (enviada ao Gmail):', observacaoAtual);
    if (obs === null) return;

    const observacaoTexto = obs.trim();
    const reserva = (window.CondoStore.data.agendaReservas || []).find(r => r.id === id);

    window.CondoStore.updateReservaStatus(id, undefined, observacaoTexto);
    
    if (reserva && observacaoTexto) {
      this.enviarObservacaoParaGmail(reserva, observacaoTexto, 'Anotação Registrada pela Portaria');
    }

    App.showToast('Anotação salva e enviada ao Gmail!', 'success');
    App.render();
  },

  excluirReserva(id) {
    if (!confirm('Tem certeza que deseja EXCLUIR este agendamento?')) return;

    const reserva = (window.CondoStore.data.agendaReservas || []).find(r => r.id === id);
    if (reserva) {
      this.enviarObservacaoParaGmail(reserva, 'Agendamento Excluído da Lista', 'Exclusão de Agendamento');
    }

    window.CondoStore.deleteReserva(id);
    App.showToast('Agendamento excluído da lista e notificado ao Gmail.', 'success');
    App.render();
  },

  openNovaReservaModal() {
    const existing = document.getElementById('modalNovaReservaPortaria');
    if (existing) existing.remove();

    const hojeStr = new Date().toISOString().split('T')[0];

    const modalHtml = `
      <div class="modal-overlay active" id="modalNovaReservaPortaria">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">
              ➕ Lançar Reserva Presencial pela Portaria
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalNovaReservaPortaria').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="PortariaComponent.submeterNovaReservaPortaria(event)">
              <div class="form-group">
                <label class="form-label">Nome do Morador</label>
                <input type="text" id="pNome" class="form-control" placeholder="Ex: Maria Souza" required>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Unidade / Apto</label>
                  <input type="text" id="pApto" class="form-control" placeholder="Ex: Apt 502" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Área Comum</label>
                  <select id="pArea" class="form-control" required>
                    <option value="Piscina">🏊 Piscina</option>
                    <option value="Academia">🏋️ Academia</option>
                    <option value="Salão de Festas">🎉 Salão de Festas</option>
                  </select>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Data</label>
                  <input type="date" id="pData" class="form-control" value="${hojeStr}" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Horário</label>
                  <input type="text" id="pHorario" class="form-control" placeholder="Ex: 14:00 às 15:00" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Observação da Portaria (Enviada ao Gmail)</label>
                <input type="text" id="pObs" class="form-control" placeholder="Ex: Apresentou atestado / liberado">
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700;">
                <span class="material-symbols-outlined">check_circle</span> Registrar como Autorizado
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  submeterNovaReservaPortaria(e) {
    e.preventDefault();
    const moradorNome = document.getElementById('pNome').value.trim();
    const apartamento = document.getElementById('pApto').value.trim();
    const area = document.getElementById('pArea').value;
    const data = document.getElementById('pData').value;
    const horario = document.getElementById('pHorario').value.trim();
    const observacao = document.getElementById('pObs').value.trim();

    const novaReserva = window.CondoStore.addAgendamento({
      moradorNome,
      apartamento,
      area,
      data,
      horario,
      observacao,
      status: 'Autorizado'
    });

    if (observacao) {
      this.enviarObservacaoParaGmail(novaReserva, observacao, 'Nova Reserva Autorizada na Portaria');
    }

    App.showToast(`Reserva de ${moradorNome} (${area}) registrada como AUTORIZADO!`, 'success');
    document.getElementById('modalNovaReservaPortaria').remove();
    App.render();
  }
};
