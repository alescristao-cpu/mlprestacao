/* ====================================================
   Modern Life Residence - Centralized Modal Service Component
   Padronização Reutilizável de Modais e Overlays sem Duplicação de CSS/HTML
   ==================================================== */
window.ModalService = {
  openModal({ id, title, icon = 'info', content, maxWidth = '520px', headerBg = 'linear-gradient(135deg, var(--primary, #2E6B42) 0%, var(--primary-dark, #1F4D30) 100%)', headerColor = 'white' }) {
    this.closeModal(id);

    const modalHtml = `
      <div class="modal-overlay active" id="${id}" style="z-index: 999999; display: flex !important; position: fixed; inset: 0; background: rgba(0,0,0,0.75); align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px);">
        <div class="modal-card" style="max-width: ${maxWidth}; width: 100%; background: var(--bg-surface, #ffffff); border-radius: 12px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.35);">
          <div class="modal-header" style="background: ${headerBg}; color: ${headerColor}; padding: 1.1rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div class="modal-title" style="color: ${headerColor}; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon ? `<span class="material-symbols-outlined">${icon}</span>` : ''} ${title}
            </div>
            <button class="modal-close" onclick="ModalService.closeModal('${id}')" style="background: none; border: none; color: ${headerColor}; font-size: 1.25rem; font-weight: 800; cursor: pointer; opacity: 0.85;">✕</button>
          </div>
          <div class="modal-body" style="padding: 1.35rem; color: var(--text-color, #333333);">
            ${content}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.remove();
  }
};
