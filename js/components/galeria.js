/* ----------------------------------------------------
   Modern Life Residence - Galeria Oficial com Catálogo Completo (50+ Fotos Reais)
   Suporte a Busca por Menções e Tags (@modernlife, @fachada, @garagem, @piscina, etc.)
   Visualizador Lightbox HD, Upload Real pelo Síndico e Exclusão no Banco
   ---------------------------------------------------- */

window.GaleriaComponent = {
  activeCategory: 'Todas',
  searchQuery: '',
  currentIndex: 0,
  filteredPhotos: [],
  uploadedImageDataUrl: '',

  // Catálogo completo de 50 fotos reais do condomínio salvas na pasta assets/images
  allCondoPhotos: [
    { id: 'gal_50', titulo: 'Torre & Fachada Principal Modern Life', categoria: 'Fachada', imagem: './assets/images/IMG_2956.jpg', tag: '@modernlife @fachada @torre', dataUpload: '2026-01-10' },
    { id: 'gal_01', titulo: 'Iluminação LED da Garagem Principal', categoria: 'Garagem', imagem: './assets/images/IMG_2909.JPG', tag: '@modernlife @garagem @led', dataUpload: '2026-07-15' },
    { id: 'gal_02', titulo: 'Acesso e Entrada Social', categoria: 'Fachada', imagem: './assets/images/IMG_2910.JPG', tag: '@modernlife @portaria @entrada', dataUpload: '2026-01-12' },
    { id: 'gal_03', titulo: 'Guarita & Controle de Acesso', categoria: 'Fachada', imagem: './assets/images/IMG_2911.JPG', tag: '@modernlife @portaria @segurança', dataUpload: '2026-01-15' },
    { id: 'gal_04', titulo: 'Vista Panorâmica da Torre', categoria: 'Fachada', imagem: './assets/images/IMG_2912.JPG', tag: '@modernlife @fachada @vista', dataUpload: '2026-01-18' },
    { id: 'gal_05', titulo: 'Recuo Frontal e Iluminação Externa', categoria: 'Fachada', imagem: './assets/images/IMG_2913.JPG', tag: '@modernlife @fachada @iluminação', dataUpload: '2026-01-20' },
    { id: 'gal_06', titulo: 'Entrada de Veículos e Portão Automático', categoria: 'Garagem', imagem: './assets/images/IMG_2914.JPG', tag: '@modernlife @garagem @portão', dataUpload: '2026-01-22' },
    { id: 'gal_07', titulo: 'Subsolo 1 - Vagas de Garagem', categoria: 'Garagem', imagem: './assets/images/IMG_2915.JPG', tag: '@modernlife @garagem @vagas', dataUpload: '2026-02-01' },
    { id: 'gal_08', titulo: 'Sinalização e Pintura das Garagens', categoria: 'Garagem', imagem: './assets/images/IMG_2916.JPG', tag: '@modernlife @garagem @pintura', dataUpload: '2026-02-05' },
    { id: 'gal_09', titulo: 'Circulação dos Veículos', categoria: 'Garagem', imagem: './assets/images/IMG_2917.JPG', tag: '@modernlife @garagem @tráfego', dataUpload: '2026-02-10' },
    { id: 'gal_10', titulo: 'Vagas de Visitantes e Idosos', categoria: 'Garagem', imagem: './assets/images/IMG_2918.JPG', tag: '@modernlife @garagem @vagas', dataUpload: '2026-02-15' },
    { id: 'gal_11', titulo: 'Bicicletário Organizado', categoria: 'Áreas Comuns', imagem: './assets/images/IMG_2919.JPG', tag: '@modernlife @bicicletário @lazer', dataUpload: '2026-02-20' },
    { id: 'gal_12', titulo: 'Rampa de Acesso e Acessibilidade', categoria: 'Áreas Comuns', imagem: './assets/images/IMG_2920.JPG', tag: '@modernlife @acessibilidade @rampa', dataUpload: '2026-02-25' },
    { id: 'gal_13', titulo: 'Hall Social de Entrada', categoria: 'Áreas Comuns', imagem: './assets/images/IMG_2921.JPG', tag: '@modernlife @hall @social', dataUpload: '2026-03-01' },
    { id: 'gal_14', titulo: 'Decoração e Sofás do Hall', categoria: 'Áreas Comuns', imagem: './assets/images/IMG_2922.JPG', tag: '@modernlife @hall @decoração', dataUpload: '2026-03-05' },
    { id: 'gal_15', titulo: 'Elevadores Sociais de Alta Velocidade', categoria: 'Elevadores', imagem: './assets/images/IMG_2923.JPG', tag: '@modernlife @elevadores @social', dataUpload: '2026-03-10' },
    { id: 'gal_16', titulo: 'Indicador Digital dos Elevadores', categoria: 'Elevadores', imagem: './assets/images/IMG_2924.JPG', tag: '@modernlife @elevadores @painel', dataUpload: '2026-03-12' },
    { id: 'gal_17', titulo: 'Corredores dos Andares Residencias', categoria: 'Áreas Comuns', imagem: './assets/images/IMG_2925.JPG', tag: '@modernlife @corredores @andares', dataUpload: '2026-03-15' },
    { id: 'gal_18', titulo: 'Portas Corta-Fogo e Escada de Emergência', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2926.JPG', tag: '@modernlife @segurança @escadas', dataUpload: '2026-03-18' },
    { id: 'gal_19', titulo: 'Salão de Festas Climatizado', categoria: 'Salão', imagem: './assets/images/IMG_2927.JPG', tag: '@modernlife @salão @festas', dataUpload: '2026-03-20' },
    { id: 'gal_20', titulo: 'Cozinha Gourmet do Salão de Festas', categoria: 'Salão', imagem: './assets/images/IMG_2928.JPG', tag: '@modernlife @salão @gourmet', dataUpload: '2026-03-22' },
    { id: 'gal_21', titulo: 'Churrasqueira 01 com Balcão de Granito', categoria: 'Lazer', imagem: './assets/images/IMG_2929.JPG', tag: '@modernlife @churrasqueira @lazer', dataUpload: '2026-04-01' },
    { id: 'gal_22', titulo: 'Churrasqueira 02 e Área Externa', categoria: 'Lazer', imagem: './assets/images/IMG_2930.JPG', tag: '@modernlife @churrasqueira @lazer', dataUpload: '2026-04-05' },
    { id: 'gal_23', titulo: 'Área Molhada e Ducha da Piscina', categoria: 'Piscina', imagem: './assets/images/IMG_2931.JPG', tag: '@modernlife @piscina @ducha', dataUpload: '2026-04-10' },
    { id: 'gal_24', titulo: 'Piscina Adulto e Espreguiçadeiras', categoria: 'Piscina', imagem: './assets/images/IMG_2932.JPG', tag: '@modernlife @piscina @lazer', dataUpload: '2026-04-12' },
    { id: 'gal_25', titulo: 'Piscina Infantil com Proteção de Segurança', categoria: 'Piscina', imagem: './assets/images/IMG_2933.JPG', tag: '@modernlife @piscina @infantil', dataUpload: '2026-04-15' },
    { id: 'gal_26', titulo: 'Deck de Madeira Tratada', categoria: 'Piscina', imagem: './assets/images/IMG_2934.JPG', tag: '@modernlife @piscina @deck', dataUpload: '2026-04-18' },
    { id: 'gal_27', titulo: 'Playground Infantil com Piso Emborrachado', categoria: 'Playground', imagem: './assets/images/IMG_2935.JPG', tag: '@modernlife @playground @crianças', dataUpload: '2026-04-20' },
    { id: 'gal_28', titulo: 'Brinquedos & Balanços do Playground', categoria: 'Playground', imagem: './assets/images/IMG_2936.JPG', tag: '@modernlife @playground @jogos', dataUpload: '2026-04-22' },
    { id: 'gal_29', titulo: 'Espaço Fitness & Aparelhos de Musculação', categoria: 'Academia', imagem: './assets/images/IMG_2937.JPG', tag: '@modernlife @academia @fitness', dataUpload: '2026-05-01' },
    { id: 'gal_30', titulo: 'Esteiras Digitais e Ergométricas', categoria: 'Academia', imagem: './assets/images/IMG_2938.JPG', tag: '@modernlife @academia @esteira', dataUpload: '2026-05-05' },
    { id: 'gal_31', titulo: 'Espelhos e Climatização da Academia', categoria: 'Academia', imagem: './assets/images/IMG_2939.JPG', tag: '@modernlife @academia @treino', dataUpload: '2026-05-10' },
    { id: 'gal_32', titulo: 'Jardins Tropicais e Palmeiras', categoria: 'Verde', imagem: './assets/images/IMG_2940.JPG', tag: '@modernlife @jardins @verde', dataUpload: '2026-05-12' },
    { id: 'gal_33', titulo: 'Paisagismo das Floreiras Laterais', categoria: 'Verde', imagem: './assets/images/IMG_2941.JPG', tag: '@modernlife @jardins @plantas', dataUpload: '2026-05-15' },
    { id: 'gal_34', titulo: 'Área de Convivência Verde', categoria: 'Verde', imagem: './assets/images/IMG_2942.JPG', tag: '@modernlife @jardins @praça', dataUpload: '2026-05-18' },
    { id: 'gal_35', titulo: 'Sistema de Energia Solar Fotovoltaica', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2943.JPG', tag: '@modernlife @solar @energia', dataUpload: '2026-05-20' },
    { id: 'gal_36', titulo: 'Inversores de Energia Solar na Cobertura', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2944.JPG', tag: '@modernlife @solar @infraestrutura', dataUpload: '2026-05-22' },
    { id: 'gal_37', titulo: 'Gerador de Emergência Autônomo', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2945.JPG', tag: '@modernlife @gerador @segurança', dataUpload: '2026-06-01' },
    { id: 'gal_38', titulo: 'Central de Bombas e Filtros de Água', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2946.JPG', tag: '@modernlife @bombas @água', dataUpload: '2026-06-05' },
    { id: 'gal_39', titulo: 'Reservatórios de Água Potável', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2947.JPG', tag: '@modernlife @reservatório @água', dataUpload: '2026-06-10' },
    { id: 'gal_40', titulo: 'Central de Gás Encanado (GLP)', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2948.JPG', tag: '@modernlife @gás @infraestrutura', dataUpload: '2026-06-12' },
    { id: 'gal_41', titulo: 'Central de Alarme de Incêndio', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2949.JPG', tag: '@modernlife @alarme @incêndio', dataUpload: '2026-06-15' },
    { id: 'gal_42', titulo: 'Servidores de CFTV e Monitoramento 24h', categoria: 'Infraestrutura', imagem: './assets/images/IMG_2950.JPG', tag: '@modernlife @cftv @câmeras', dataUpload: '2026-06-18' },
    { id: 'gal_43', titulo: 'Casa de Máquinas dos Elevadores', categoria: 'Elevadores', imagem: './assets/images/IMG_2951.JPG', tag: '@modernlife @elevadores @máquinas', dataUpload: '2026-06-20' },
    { id: 'gal_44', titulo: 'Vistoria Preventiva Anual', categoria: 'Obras', imagem: './assets/images/IMG_2952.JPG', tag: '@modernlife @obras @laudo', dataUpload: '2026-06-22' },
    { id: 'gal_45', titulo: 'Lavagem Técnica da Fachada', categoria: 'Obras', imagem: './assets/images/IMG_2953.JPG', tag: '@modernlife @obras @fachada', dataUpload: '2026-07-01' },
    { id: 'gal_46', titulo: 'Pintura dos Portões de Acesso', categoria: 'Obras', imagem: './assets/images/IMG_2954.JPG', tag: '@modernlife @obras @pintura', dataUpload: '2026-07-05' },
    { id: 'gal_47', titulo: 'Revisão das Lâmpadas LED do Teto', categoria: 'Obras', imagem: './assets/images/IMG_2955.JPG', tag: '@modernlife @led @manutenção', dataUpload: '2026-07-10' },
    { id: 'gal_48', titulo: 'Iluminação Noturna do Condomínio', categoria: 'Fachada', imagem: './assets/images/IMG_2957.jpg', tag: '@modernlife @noite @fachada', dataUpload: '2026-07-20' },
    { id: 'gal_49', titulo: 'Vista Superior da Torre e Entorno', categoria: 'Fachada', imagem: './assets/images/IMG_2958.jpg', tag: '@modernlife @vista @torre', dataUpload: '2026-07-25' }
  ],

  render(container, data) {
    const user = window.CondoStore ? window.CondoStore.currentUser : null;
    const isSindico = user && (
      user.role === 'Administrador' ||
      (user.email && user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com') ||
      (user.email && user.email.toLowerCase().trim() === 'contatoalecristiano@gmail.com')
    );

    // Mescla fotos enviadas pelo usuário com o repositório oficial
    let customUserPhotos = data.galeria || [];
    let combinedList = [...customUserPhotos];

    this.allCondoPhotos.forEach(p => {
      if (!combinedList.some(c => c.id === p.id || c.imagem === p.imagem)) {
        combinedList.push(p);
      }
    });

    const categorias = ['Todas', 'Fachada', 'Garagem', 'Piscina', 'Salão', 'Academia', 'Verde', 'Elevadores', 'Infraestrutura', 'Obras', 'Lazer', 'Playground'];

    // Filtragem por categoria e por busca de menção (@modernlife, @fachada, etc)
    let tempFiltered = combinedList;

    if (this.activeCategory !== 'Todas') {
      tempFiltered = tempFiltered.filter(item => item.categoria === this.activeCategory);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      tempFiltered = tempFiltered.filter(item => 
        (item.titulo || '').toLowerCase().includes(q) ||
        (item.categoria || '').toLowerCase().includes(q) ||
        (item.tag || '').toLowerCase().includes(q)
      );
    }

    this.filteredPhotos = tempFiltered;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Header da Galeria -->
        <div class="card-widget" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; border-radius: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(56, 189, 248, 0.2); color: #38BDF8; margin-bottom: 0.5rem; border: 1px solid rgba(56, 189, 248, 0.3);">
                <span class="material-symbols-outlined" style="font-size: 0.9rem;">photo_library</span> REPOSITÓRIO FOTOGRÁFICO OFICIAL
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; margin-top: 0.25rem; color: white;">
                Galeria de Fotos do Condomínio Modern Life
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.85; margin-top: 0.25rem;">
                Explore ${combinedList.length} fotos em alta resolução das instalações, áreas de lazer, garagem e benfeitorias.
              </p>
            </div>

            ${isSindico ? `
              <button class="btn-primary" style="background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); color: white; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 14px rgba(37,99,235,0.4);" onclick="GaleriaComponent.openUploadModal()">
                <span class="material-symbols-outlined">add_a_photo</span> 📸 Publicar Nova Foto
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Campo de Busca por Menções e Tags (@modernlife, @piscina, etc) -->
        <div class="card-widget" style="padding: 0.85rem 1.1rem; background: white; border: 1px solid #E2E8F0; border-radius: 10px;">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <div style="position: relative; flex: 1; min-width: 260px;">
              <span class="material-symbols-outlined" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748B;">search</span>
              <input type="text" class="form-control" placeholder="🔍 Buscar por menção ou termo (ex: @modernlife, @piscina, @led, fachada)..." 
                     value="${this.searchQuery}" 
                     oninput="GaleriaComponent.filtrarBusca(this.value)" 
                     style="padding-left: 2.3rem; font-weight: 600; font-size: 0.88rem;">
            </div>

            <!-- Botões Rápidos de Menções Populares -->
            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B;">Menções:</span>
              <button class="btn-sm btn-secondary" onclick="GaleriaComponent.filtrarBusca('@modernlife')" style="font-size: 0.75rem; background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;">
                @modernlife
              </button>
              <button class="btn-sm btn-secondary" onclick="GaleriaComponent.filtrarBusca('@fachada')" style="font-size: 0.75rem; background: #F0FDF4; color: #166534; border: 1px solid #BBF7D0;">
                @fachada
              </button>
              <button class="btn-sm btn-secondary" onclick="GaleriaComponent.filtrarBusca('@garagem')" style="font-size: 0.75rem; background: #FFF7ED; color: #C2410C; border: 1px solid #FFEDD5;">
                @garagem
              </button>
              <button class="btn-sm btn-secondary" onclick="GaleriaComponent.filtrarBusca('@piscina')" style="font-size: 0.75rem; background: #F0F9FF; color: #0369A1; border: 1px solid #BAE6FD;">
                @piscina
              </button>
              ${this.searchQuery ? `
                <button class="btn-sm btn-danger" onclick="GaleriaComponent.filtrarBusca('')" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">
                  ✕ Limpar Filtro
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Filtros por Categoria com Contadores -->
        <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.3rem;">
          ${categorias.map(cat => {
            const count = cat === 'Todas' ? combinedList.length : combinedList.filter(x => x.categoria === cat).length;
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

        <!-- Contador de Resultados -->
        <div style="font-size: 0.82rem; color: #64748B; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
          <span>Exibindo <strong>${this.filteredPhotos.length}</strong> de <strong>${combinedList.length}</strong> fotos disponíveis na Galeria</span>
          ${this.searchQuery ? `<span style="color: #2563EB;">Filtro de busca ativo: "${this.searchQuery}"</span>` : ''}
        </div>

        <!-- Grid de Fotos Responsivo -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${this.filteredPhotos.length === 0 ? `
            <div class="card-widget" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3.5rem 1rem;">
              <span class="material-symbols-outlined" style="font-size: 3.5rem; color: var(--border-color); display: block; margin-bottom: 0.5rem;">no_photography</span>
              <strong>Nenhuma foto encontrada para a menção ou busca "${this.searchQuery || this.activeCategory}".</strong><br>
              <button class="btn-secondary btn-sm" style="margin-top: 0.75rem;" onclick="GaleriaComponent.limparFiltros()">Limpar Filtros de Busca</button>
            </div>
          ` : this.filteredPhotos.map((item, idx) => `
            <div class="card-widget" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.25s ease, box-shadow 0.25s ease; border: 1px solid #E2E8F0; border-radius: 12px; background: white;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)'">
              
              <div style="position: relative; width: 100%; height: 210px; background: #0F172A; cursor: pointer; overflow: hidden;" onclick="GaleriaComponent.openLightbox(${idx})">
                <img src="${item.imagem}" alt="${item.titulo}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'">
                
                <span class="badge" style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.75); color: white; backdrop-filter: blur(4px); font-size: 0.72rem; border: 1px solid rgba(255,255,255,0.2);">
                  ${item.categoria || 'Geral'}
                </span>

                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 0.85rem; opacity: 0; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'">
                  <span style="color: white; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.3rem;">
                    <span class="material-symbols-outlined" style="font-size: 1.2rem;">zoom_in</span> Ampliar em HD
                  </span>
                </div>
              </div>

              <div style="padding: 0.85rem 1rem; display: flex; justify-content: space-between; align-items: center; background: white;">
                <div>
                  <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: #0F172A; margin: 0;">
                    ${item.titulo}
                  </h4>
                  <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                    <span style="font-size: 0.73rem; color: #2563EB; font-weight: 600;">${item.tag || '@modernlife'}</span>
                    ${item.dataUpload ? `<span style="font-size: 0.72rem; color: #94A3B8;">&bull; ${item.dataUpload}</span>` : ''}
                  </div>
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

  filtrarBusca(query) {
    this.searchQuery = query;
    App.render();
  },

  switchCategory(cat) {
    this.activeCategory = cat;
    App.render();
  },

  limparFiltros() {
    this.searchQuery = '';
    this.activeCategory = 'Todas';
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
                  <option value="Garagem">🚗 Garagem & Subsolo</option>
                  <option value="Piscina">🏊 Piscina & Deck</option>
                  <option value="Salão">🎉 Salão de Festas & Churrasqueiras</option>
                  <option value="Academia">🏋️ Academia & Fitness</option>
                  <option value="Verde">🌿 Jardins & Área Verde</option>
                  <option value="Elevadores">🛗 Elevadores Social / Serviço</option>
                  <option value="Infraestrutura">⚡ Infraestrutura & Geradores</option>
                  <option value="Obras">🛠️ Obras & Manutenção</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Menção / Tag de Busca</label>
                <input type="text" id="galTagInput" class="form-control" value="@modernlife" placeholder="@modernlife @fachada @piscina" style="font-weight: 600;">
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
    const tag = document.getElementById('galTagInput').value.trim() || '@modernlife';
    const urlManual = document.getElementById('galUrlInput').value.trim();

    const imgFinal = this.uploadedImageDataUrl || urlManual || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

    if (!titulo) return;

    if (!window.CondoStore.data.galeria) window.CondoStore.data.galeria = [];

    const newPhoto = {
      id: 'gal_' + Date.now(),
      titulo,
      categoria,
      tag,
      imagem: imgFinal,
      dataUpload: new Date().toISOString().split('T')[0]
    };

    window.CondoStore.data.galeria.unshift(newPhoto);
    window.CondoStore.saveData();

    App.showToast(`Foto "${titulo}" publicada com sucesso na Galeria!`, 'success');

    const modal = document.getElementById('modalUploadGaleria');
    if (modal) modal.remove();

    this.activeCategory = 'Todas';
    this.searchQuery = '';
    App.render();
  },

  excluirFoto(id, titulo) {
    if (!confirm(`Tem certeza que deseja excluir a foto "${titulo}" da galeria?`)) return;

    if (window.CondoStore.data.galeria) {
      window.CondoStore.data.galeria = window.CondoStore.data.galeria.filter(g => g.id !== id);
    }
    // Remove também das fotos padrão se aplicável
    this.allCondoPhotos = this.allCondoPhotos.filter(g => g.id !== id);

    window.CondoStore.saveData();
    App.showToast(`Foto "${titulo}" excluída com sucesso.`, 'info');
    App.render();
  },

  openLightbox(index) {
    this.currentIndex = index;
    const photo = this.filteredPhotos[this.currentIndex];
    if (!photo) return;

    const existing = document.getElementById('lightboxModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="lightboxModal" style="z-index: 9999999; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1rem;" onclick="GaleriaComponent.closeLightbox(event)">
        
        <button onclick="GaleriaComponent.closeLightbox(event)" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; z-index: 10;">✕</button>

        <button onclick="event.stopPropagation(); GaleriaComponent.navigateLightbox(-1)" style="position: absolute; left: 20px; background: rgba(255,255,255,0.2); border: none; color: white; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; font-size: 1.8rem; display: flex; align-items: center; justify-content: center; z-index: 10;">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <button onclick="event.stopPropagation(); GaleriaComponent.navigateLightbox(1)" style="position: absolute; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; font-size: 1.8rem; display: flex; align-items: center; justify-content: center; z-index: 10;">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>

        <div style="max-width: 90vw; max-height: 85vh; text-align: center; color: white; display: flex; flex-direction: column; align-items: center;" onclick="event.stopPropagation()">
          <img id="lightboxImg" src="${photo.imagem}" style="max-width: 100%; max-height: 72vh; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); object-fit: contain;" onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'">
          <h3 id="lightboxTitle" style="margin-top: 1rem; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: white;">
            ${photo.titulo}
          </h3>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.3rem;">
            <span id="lightboxCategory" class="badge" style="background: #2563EB; color: white;">
              ${photo.categoria || 'Geral'} &bull; Foto ${this.currentIndex + 1} de ${this.filteredPhotos.length}
            </span>
            <span id="lightboxTag" style="font-size: 0.8rem; color: #38BDF8; font-weight: 600;">${photo.tag || '@modernlife'}</span>
          </div>
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
    const tag = document.getElementById('lightboxTag');

    if (img && photo) {
      img.src = photo.imagem;
      title.textContent = photo.titulo;
      category.innerHTML = `${photo.categoria || 'Geral'} &bull; Foto ${this.currentIndex + 1} de ${this.filteredPhotos.length}`;
      if (tag) tag.textContent = photo.tag || '@modernlife';
    }
  },

  closeLightbox(e) {
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.remove();
  }
};
