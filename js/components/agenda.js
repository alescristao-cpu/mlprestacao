/* ----------------------------------------------------
   Modern Life Residence - Agenda & Calendário de Eventos
   Sigilo & Privacidade: Acesso exclusivo para moradores autorizados
   ---------------------------------------------------- */

window.AgendaComponent = {
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
            Acesso Restrito: Agenda &amp; Calendário de Eventos
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.6;">
            Por segurança e privacidade, as datas de assembleias gerais, reuniões de conselho e cronogramas de manutenção são de acesso exclusivo aos moradores autorizados.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar para Liberar Acesso
          </button>
        </div>
      `;
      return;
    }

    const eventos = data.agenda || [];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Agenda &amp; Calendário de Eventos do Condomínio
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Acompanhe as datas das assembleias gerais, reuniões e manutenções programadas.
              </p>
            </div>
            <span class="badge" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 0.85rem;">
              <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified_user</span> Acesso Autorizado
            </span>
          </div>
        </div>

        <!-- Lista de Eventos -->
        <div class="card-widget">
          <div class="card-header">
            <div class="card-title">
              <span class="material-symbols-outlined">event</span> Próximos Compromissos Agendados
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${eventos.length === 0 ? `
              <p style="color: var(--text-muted); text-align: center; padding: 2rem;">Nenhum evento agendado no momento.</p>
            ` : eventos.map(e => `
              <div style="background: var(--bg-app); border: 1px solid var(--border-light); border-left: 5px solid var(--primary); padding: 1.25rem; border-radius: var(--radius-md); display: flex; gap: 1.25rem; align-items: flex-start; flex-wrap: wrap;">
                <div style="background: var(--primary-dark); color: white; padding: 0.6rem 0.9rem; border-radius: var(--radius-sm); text-align: center; min-width: 70px;">
                  <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">${e.data.split('-')[1]}</div>
                  <div style="font-size: 1.5rem; font-weight: 700; line-height: 1;">${e.data.split('-')[2]}</div>
                  <div style="font-size: 0.7rem; opacity: 0.8; margin-top: 2px;">${e.data.split('-')[0]}</div>
                </div>

                <div style="flex: 1; min-width: 240px;">
                  <div style="display: flex; gap: 0.5rem; margin-bottom: 4px;">
                    <span class="badge badge-info">${e.tipo}</span>
                  </div>
                  <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--primary-dark);">
                    ${e.titulo}
                  </h3>
                  <div style="font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 8px 0;">
                    ⏰ <strong>Horário:</strong> ${e.hora} &bull; 📍 <strong>Local:</strong> ${e.local}
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5;">
                    ${e.descricao}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }
};
