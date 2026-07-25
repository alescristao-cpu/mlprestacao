/* ----------------------------------------------------
   Modern Life Residence - Galeria de Fotos Component
   ---------------------------------------------------- */

window.GaleriaComponent = {
  render(container, data) {
    const list = data.galeria || [];
    const categories = ['Todas', 'Fachada', 'Piscina', 'Academia', 'Salão', 'Playground', 'Eventos'];

    container.innerHTML = `
      <div class="card-widget">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">collections</span> Galeria de Fotos do Condomínio
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Áreas comuns, infraestrutura e registro dos eventos do Modern Life Residence.
            </p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="tab-list" id="galleryTabs">
          ${categories.map((cat, i) => `
            <button class="tab-btn ${i === 0 ? 'active' : ''}" onclick="GaleriaComponent.switchCategory('${cat}', this)">
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Gallery Grid -->
        <div class="gallery-grid" id="galleryGrid">
          ${list.map(item => `
            <div class="gallery-card" data-cat="${item.categoria}" onclick="GaleriaComponent.zoomImage('${item.imagem}', '${item.titulo}')">
              <img src="${item.imagem}" alt="${item.titulo}">
              <div class="gallery-overlay">
                <span class="gallery-category">${item.categoria}</span>
                <h4 class="gallery-title">${item.titulo}</h4>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  switchCategory(cat, btn) {
    document.querySelectorAll('#galleryTabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('#galleryGrid .gallery-card');
    cards.forEach(card => {
      const c = card.getAttribute('data-cat');
      if (cat === 'Todas' || c === cat) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  },

  zoomImage(src, title) {
    const modalHtml = `
      <div class="modal-overlay active" id="modalZoom" onclick="this.remove()">
        <div style="max-width: 90vw; max-height: 90vh; text-align: center; color: white;">
          <img src="${src}" style="max-width: 100%; max-height: 80vh; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);" alt="${title}">
          <h3 style="margin-top: 1rem; font-family: var(--font-heading); font-size: 1.25rem;">${title}</h3>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
};
