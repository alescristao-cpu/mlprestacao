/* ----------------------------------------------------
   Modern Life Residence - Galeria de Fotos Interativa Oficial
   Suporte a Upload Real de Fotos pelo Síndico, Carrossel/Lightbox HD com Navegação
   Filtros por Categoria, Edição e Exclusão Permanente
   ---------------------------------------------------- */

window.GaleriaComponent = {
  activeCategory: 'Todas',
  currentIndex: 0,
  filteredPhotos: [],
  uploadedImageDataUrl: '',

  render(container, data) {
    const user = window.CondoStore ? window.CondoStore.currentUser : null;
    const isSindico = user && (
      user.role === 'Administrador' ||
      (user.email && user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com') ||
      (user.email && user.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com')
    );

    let rawList = data.galeria || [];
    
    // Se a galeria estiver vazia, carrega fotos modelo
    if (rawList.length === 0) {
      rawList = [
        { id: 'gal_01', titulo: 'Torre Modern Life Residence', categoria: 'Fachada', imagem: './assets/images/IMG_2956.jpg', dataUpload: '2026-01-10' },
        { id: 'gal_02', titulo: 'Nova Iluminação LED da Garagem', categoria: 'Obras', imagem: './assets/images/IMG_2909.JPG', dataUpload: '2026-07-15' },
        { id: 'gal_03', titulo: 'Área da Piscina & Deck Molhado', categoria: 'Piscina', imagem: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80', dataUpload: '2026-02-01' },
        { id: 'gal_04', titulo: 'Salão de Festas Gourmet', categoria: 'Salão', imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', dataUpload: '2026-03-12' },
        { id: 'gal_05', titulo: 'Espaço Fitness & Academia', categoria: 'Academia', imagem: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', dataUpload: '2026-04-05' },
        { id: 'gal_06', titulo: 'Jardins & Paisagismo Interno', categoria: 'Verde', imagem: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', dataUpload: '2026-05-18' }
      ];
    }

    const categorias = ['Todas', 'Fachada', 'Piscina', 'Salão', 'Academia', 'Verde', 'Obras', 'Eventos'];

    this.filteredPhotos = this.activeCategory === 'Todas'
      ? rawList
      : rawList.filter(item => item.categoria === this.activeCategory);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Header da Galeria -->
        <div class="card-widget" style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); color: white; border-radius: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.15); color: #38BDF8; margin-bottom: 0.5rem;">
                <span class="material-symbols-outlined" style="font-size: 0.9rem;">photo_library</span> ÁREAS COMUNS & REGISTROS
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; margin-top: 0.25rem; color: white;">
                Galeria Oficial de Fotos & Infraestrutura
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.85; margin-top: 0.25rem;">
                Explore as instalações, áreas de lazer e benfeitorias do Condomínio Modern Life Residence.
              </p>
            </div>

            ${isSindico ? `
              <button class="btn-primary" style="background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); color: white; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(37,99,235,0.3);" onclick="GaleriaComponent.openUploadModal()">
                <span class="material-symbols-outlined">add_a_photo</span> 📸 Adicionar Foto à Galeria
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Filtros por Categoria com Contadores -->
        <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.3rem;">
          ${categorias.map(cat => {
            const count = cat === 'Todas' ? rawList.length : rawList.filter(x => x.categoria === cat).length;
            const isActive = this.activeCategory === cat;
            return `
              <button class="btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}" 
                      onclick="GaleriaComponent.switchCategory('${cat}')" 
                      style="white-space: nowrap; font-weight: 600; padding: 0.45rem 0.85rem; display: flex; align-items: center; gap: 0.35rem;">
                ${cat} <span style="background: ${isActive ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.08)'}; padding: 1px 6px; border-radius: 10px; font-size: 0.75rem;">${count}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Grid de Fotos Responsivo -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${this.filteredPhotos.length === 0 ? `
            <div class="card-widget" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
              <span class="material-symbols-outlined" style="font-size: 3.5rem; color: var(--border-color); display: block; margin-bottom: 0.5rem;">no_photography</span>
              <strong>Nenhuma foto cadastrada na categoria "${this.activeCategory}".</strong>
              ${isSindico ? `<br><span style="font-size: 0.85rem; margin-top: 0.5rem; display: inline-block;">Clique no botão <strong>📸 Adicionar Foto à Galeria</strong> acima para enviar novas fotos!</span>` : ''}
            </div>
          ` : this.filteredPhotos.map((item, idx) => `
            <div class="card-widget" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.25 ease, box-shadow 0.25s ease; border: 1px solid #E2E8F0; border-radius: 12px; background: white;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)'">
              
              <div style="position: relative; width: 100%; height: 210px; background: #0F172A; cursor: pointer; overflow: hidden;" onclick="GaleriaComponent.openLightbox(${idx})">
                <img src="${item.imagem}" alt="${item.titulo}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                
                <span class="badge" style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.75); color: white; backdrop-filter: blur(4px); font-size: 0.72rem; border: 1px solid rgba(255,255,255,0.2);">
                  ${item.categoria || 'Geral'}
                </span>

                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 0.85rem; opacity: 0; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
                  <span style="color: white; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.3rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.2rem;">zoom_in</span> Clique para ampliar em HD
                  </span>
                </div>
              </div>

              <div style="padding: 0.85rem 1rem; display: flex; justify-content: space-between; align-items: center; background: white;">
                <div>
                  <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: #0F172A; margin: 0;">
                    ${item.titulo}
                  </h4>
                  ${item.dataUpload ? `<span style="font-size: 0.75rem; color: #64748B;">Publicada em ${item.dataUpload}</span>` : ''}
                </div>

                ${isSindico ? `
                  <button class="btn-secondary btn-sm btn-danger" style="background: #FFF1F2; color: #E11D48; border: 1px solid #FECACA; padding: 0.3rem 0.5rem;" onclick="event.stopPropagation(); GaleriaComponent.excluirFoto('${item.id}', '${item.titulo}')" title="Excluir Foto">
                    <span class="material-symbols-outlined" style="font-size: 1rem;">delete</span>
                  </button>
                ` : ''}
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    `;
  },

  switchCategory(cat) {
    this.activeCategory = cat;
    App.render();
  },

  openUploadModal() {
    const user = window.CondoStore ? window.CondoStore.currentUser : null;
    const isSindico = user && (
      user.role === 'Administrador' ||
      (user.email && user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com') ||
      (user.email && user.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com')
    );

    if (!isSindico) {
      alert('🔒 Acesso Restrito ao Síndico.');
      return;
    }

    this.uploadedImageDataUrl = '';

    const existing = document.getElementById('modalUploadGaleria');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalUploadGaleria" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 520px; border: 2px solid #2563EB;">
          <div class="modal-header" style="background: #0F172A; color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
              <span class="material-symbols-outlined" style="color: #60A5FA;">add_a_photo</span> 📸 Publicar Nova Foto na Galeria
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalUploadGaleria').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="GaleriaComponent.submeterNovaFoto(event)">
              
              <div class="form-group" style="background: #F0F9FF; border: 2px dashed #0284C7; padding: 1.2rem; border-radius: 8px; text-align: center;">
                <label for="galeriaFileInput" style="cursor: pointer; display: block;">
                  <span class="material-symbols-outlined" style="font-size: 2.5rem; color: #0284C7; display: block; margin-bottom: 0.2rem;">cloud_upload</span>
                  <strong style="color: #0369A1; font-size: 0.95rem;">Clique para selecionar a imagem no dispositivo</strong>
                  <span style="display: block; font-size: 0.78rem; color: #64748B; margin-top: 4px;">Suporta arquivos JPG, PNG e WEBP</span>
                </label>
                <input type="file" id="galeriaFileInput" accept="image/*" style="display: none;" onchange="GaleriaComponent.previewImagem(event)">
                <div id="galeriaPreviewBox" style="display: none; margin-top: 0.8rem;">
                  <img id="galeriaImgPreview" style="max-height: 180px; border-radius: 8px; border: 2px solid #0284C7; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Título / Legenda da Foto</label>
                <input type="text" id="galTituloInput" class="form-control" placeholder="Ex: Reforma do Deck da Piscina" required style="font-weight: 600;">
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Categoria da Área</label>
                <select id="galCategoriaInput" class="form-control" required style="font-weight: 600;">
                  <option value="Fachada">🏛️ Fachada & Portaria</option>
                  <option value="Piscina">🏊 Piscina & Deck</option>
                  <option value="Salão">🎉 Salão de Festas & Churrasqueiras</option>
                  <option value="Academia">🏋️ Academia & Fitness</option>
                  <option value="Verde">🌿 Jardins & Área Verde</option>
                  <option value="Obras">🛠️ Obras & Benfeitorias</option>
                  <option value="Eventos">🎈 Eventos & Reuniões</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 600; font-size: 0.82rem; color: #64748B;">Ou informe um Link / URL da Imagem (Opcional caso não envie arquivo)</label>
                <input type="text" id="galUrlInput" class="form-control" placeholder="https://exemplo.com/foto.jpg" style="font-size: 0.85rem;">
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.25rem;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalUploadGaleria').remove()">Cancelar</button>
                <button type="submit" class="btn-primary" style="background: #2563EB; font-weight: 700;">Publicar na Galeria</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  previewImagem(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.uploadedImageDataUrl = event.target.result;
      const box = document.getElementById('galeriaPreviewBox');
      const img = document.getElementById('galeriaImgPreview');
      if (box && img) {
        img.src = this.uploadedImageDataUrl;
        box.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  },

  submeterNovaFoto(e) {
    e.preventDefault();
    const titulo = document.getElementById('galTituloInput').value.trim();
    const categoria = document.getElementById('galCategoriaInput').value;
    const urlManual = document.getElementById('galUrlInput').value.trim();

    const imgFinal = this.uploadedImageDataUrl || urlManual || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

    if (!titulo) return;

    if (!window.CondoStore.data.galeria) window.CondoStore.data.galeria = [];

    const newPhoto = {
      id: 'gal_' + Date.now(),
      titulo,
      categoria,
      imagem: imgFinal,
      dataUpload: new Date().toISOString().split('T')[0]
    };

    window.CondoStore.data.galeria.unshift(newPhoto);
    window.CondoStore.saveData();

    App.showToast(`Foto "${titulo}" publicada com sucesso na Galeria!`, 'success');

    const modal = document.getElementById('modalUploadGaleria');
    if (modal) modal.remove();

    this.activeCategory = 'Todas';
    App.render();
  },

  excluirFoto(id, titulo) {
    if (!confirm(`Tem certeza que deseja excluir a foto "${titulo}" da galeria?`)) return;

    if (window.CondoStore.data.galeria) {
      window.CondoStore.data.galeria = window.CondoStore.data.galeria.filter(g => g.id !== id);
      window.CondoStore.saveData();
      App.showToast(`Foto "${titulo}" excluída com sucesso.`, 'info');
      App.render();
    }
  },

  openLightbox(index) {
    this.currentIndex = index;
    const photo = this.filteredPhotos[this.currentIndex];
    if (!photo) return;

    const existing = document.getElementById('lightboxModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="lightboxModal" style="z-index: 9999999; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1rem;" onclick="GaleriaComponent.closeLightbox(event)">
        
        <button onclick="GaleriaComponent.closeLightbox(event)" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; justify-content: center;">✕</button>

        <button onclick="event.stopPropagation(); GaleriaComponent.navigateLightbox(-1)" style="position: absolute; left: 20px; background: rgba(255,255,255,0.2); border: none; color: white; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; font-size: 1.8rem; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <button onclick="event.stopPropagation(); GaleriaComponent.navigateLightbox(1)" style="position: absolute; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; font-size: 1.8rem; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>

        <div style="max-width: 90vw; max-height: 85vh; text-align: center; color: white; display: flex; flex-direction: column; align-items: center;" onclick="event.stopPropagation()">
          <img id="lightboxImg" src="${photo.imagem}" style="max-width: 100%; max-height: 72vh; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); object-fit: contain;">
          <h3 id="lightboxTitle" style="margin-top: 1rem; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: white;">
            ${photo.titulo}
          </h3>
          <span id="lightboxCategory" class="badge" style="background: #2563EB; color: white; margin-top: 0.3rem;">
            ${photo.categoria || 'Geral'} &bull; Foto ${this.currentIndex + 1} de ${this.filteredPhotos.length}
          </span>
        </div>

      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  navigateLightbox(direction) {
    if (this.filteredPhotos.length === 0) return;
    this.currentIndex = (this.currentIndex + direction + this.filteredPhotos.length) % this.filteredPhotos.length;
    const photo = this.filteredPhotos[this.currentIndex];

    const img = document.getElementById('lightboxImg');
    const title = document.getElementById('lightboxTitle');
    const category = document.getElementById('lightboxCategory');

    if (img && photo) {
      img.src = photo.imagem;
      title.textContent = photo.titulo;
      category.innerHTML = `${photo.categoria || 'Geral'} &bull; Foto ${this.currentIndex + 1} de ${this.filteredPhotos.length}`;
    }
  },

  closeLightbox(e) {
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.remove();
  }
};
