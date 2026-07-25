/* ----------------------------------------------------
   Modern Life Residence - Mural de Recados Component
   ---------------------------------------------------- */

window.RecadosComponent = {
  render(container, data) {
    const recados = data.recados || [];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Banner Header -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span class="material-symbols-outlined" style="font-size: 2.5rem;">campaign</span>
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Mural de Recados da Administração
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Comunicados oficiais, avisos urgentes e informes do Síndico Alessandro Cristiano da Silva.
              </p>
            </div>
          </div>
        </div>

        ${recados.map(item => `
          <div class="card-widget">
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
              <img src="${item.imagem}" style="width: 280px; max-width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md);" alt="${item.titulo}">
              
              <div style="flex: 1; min-width: 280px;">
                <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                  <span class="material-symbols-outlined" style="font-size: 1rem; color: var(--primary);">calendar_today</span> ${item.data}
                  &bull; <span class="material-symbols-outlined" style="font-size: 1rem; color: var(--primary);">person</span> ${item.autor}
                </div>

                <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--primary-dark); font-weight: 700; margin-bottom: 0.6rem;">
                  ${item.titulo}
                </h3>

                <p style="font-size: 0.92rem; color: var(--text-main); white-space: pre-line; margin-bottom: 1rem;">
                  ${item.texto}
                </p>

                ${item.anexo ? `
                  <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-app); padding: 0.6rem 1rem; border-radius: var(--radius-sm); width: fit-content; margin-bottom: 1rem;">
                    <span class="material-symbols-outlined" style="color: var(--primary);">attachment</span>
                    <span style="font-size: 0.85rem; font-weight: 600;">Anexo: ${item.anexo}</span>
                    <button class="btn-outline-primary btn-sm" style="margin-left: 0.5rem;" onclick="alert('Download do anexo: ${item.anexo}')">Baixar Anexo</button>
                  </div>
                ` : ''}

                <!-- Comments Section -->
                <div style="border-top: 1px solid var(--border-light); padding-top: 1rem; margin-top: 1rem;">
                  <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 4px;">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">chat</span> Comentários dos Moradores (${item.comentarios ? item.comentarios.length : 0})
                  </h4>

                  <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem;">
                    ${(item.comentarios || []).map(c => `
                      <div style="background: var(--bg-app); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.84rem;">
                        <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--primary-dark);">
                          <span>${c.autor}</span>
                          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">${c.data}</span>
                        </div>
                        <p style="margin-top: 2px; color: var(--text-main);">${c.texto}</p>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Add Comment Form -->
                  <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="inputRecado_${item.id}" class="form-control" placeholder="Escreva um comentário sobre o recado..." style="font-size: 0.85rem;">
                    <button class="btn-primary btn-sm" onclick="RecadosComponent.addComment('${item.id}')">Enviar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  addComment(recadoId) {
    const input = document.getElementById('inputRecado_' + recadoId);
    const text = input ? input.value.trim() : '';
    if (!text) return;

    const user = window.CondoStore.currentUser || { nome: 'Morador Visitante', apartamento: '00' };
    const recado = window.CondoStore.data.recados.find(r => r.id === recadoId);

    if (recado) {
      if (!recado.comentarios) recado.comentarios = [];
      recado.comentarios.push({
        autor: `${user.nome} (Apt ${user.apartamento})`,
        data: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        texto: text
      });
      window.CondoStore.saveData();
      App.showToast('Comentário enviado!', 'success');
      App.render();
    }
  }
};
