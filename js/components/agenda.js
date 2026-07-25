/* ----------------------------------------------------
   Modern Life Residence - Agenda & Calendário Component
   ---------------------------------------------------- */

window.AgendaComponent = {
  render(container, data) {
    const list = data.agenda || [];

    container.innerHTML = `
      <div class="card-widget">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">calendar_month</span> Agenda de Eventos, Manutenções e Assembleias
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Cronograma oficial de atividades programadas do Modern Life Residence.
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${list.map(evt => {
            let typeColor = '#2E6B42';
            if (evt.tipo === 'Manutenção') typeColor = '#F57F17';
            if (evt.tipo === 'Evento') typeColor = '#1976D2';

            return `
              <div style="display: flex; gap: 1.25rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; align-items: center;">
                <div style="width: 70px; height: 70px; border-radius: var(--radius-md); background: ${typeColor}15; color: ${typeColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 800;">
                  <span style="font-size: 1.3rem; line-height: 1;">${evt.data.split('-')[2]}</span>
                  <span style="font-size: 0.72rem; text-transform: uppercase;">${evt.data.split('-')[1]}/2026</span>
                </div>

                <div style="flex: 1;">
                  <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 4px;">
                    <span class="badge" style="background: ${typeColor}20; color: ${typeColor};">${evt.tipo}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">&bull; ${evt.hora} h</span>
                  </div>

                  <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary-dark); font-weight: 700;">
                    ${evt.titulo}
                  </h3>

                  <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
                    📍 Local: <strong>${evt.local}</strong> &bull; ${evt.descricao}
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};
