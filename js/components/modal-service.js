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
  },

  openImageViewer(src, title = 'Visualização da Imagem') {
    this.closeModal('globalImageViewer');
    const modalHtml = `
      <div class="modal-overlay active" id="globalImageViewer" style="z-index: 9999999; display: flex !important; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1.5rem;" onclick="if(event.target === this) ModalService.closeModal('globalImageViewer')">
        <div style="position: relative; max-width: 92vw; max-height: 92vh; text-align: center; display: flex; flex-direction: column; align-items: center;">
          <button style="position: absolute; top: -50px; right: 0; background: rgba(255,255,255,0.2); color: white; border: none; font-size: 1.5rem; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); font-weight: 800; box-shadow: 0 4px 15px rgba(0,0,0,0.4);" onclick="ModalService.closeModal('globalImageViewer')">✕</button>
          
          <img src="${src}" alt="${title}" style="max-width: 90vw; max-height: 82vh; object-fit: contain; border-radius: 12px; box-shadow: 0 25px 60px rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.2); cursor: zoom-out;" onclick="ModalService.closeModal('globalImageViewer')">
          
          ${title ? `<div style="color: white; margin-top: 1rem; font-size: 1rem; font-weight: 700; font-family: var(--font-heading); background: rgba(0,0,0,0.5); padding: 6px 16px; border-radius: 20px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2);">${title}</div>` : ''}
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
};
