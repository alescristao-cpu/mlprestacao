/* ====================================================
   Modern Life Residence - Portal de Notícias & Matérias do Condomínio
   Visual de Site de Matérias Executivo (Estilo G1 / TechCrunch / Journal Digital)
   Leitor de Matérias em Modal, Filtros por Categoria, Busca e Publicação pelo Síndico
   ==================================================== */

window.RecadosComponent = {
  previewImageData: null,
  editingPostId: null,
  selectedCategory: 'Todas',
  searchQuery: '',

  render(container, data) {
    const user = window.CondoStore ? window.CondoStore.currentUser : null;
    const isApproved = user && user.status === 'Aprovado';
    const isSindico = user && (user.role === 'Administrador' || (user.email && user.email.toLowerCase().trim() === 'condominio.modern.life@gmail.com'));

    const allRecados = data.recados || [];

    // Filtro de Visibilidade por Permissão
    let recadosExibidos = isApproved || isSindico 
      ? allRecados 
      : allRecados.filter(r => r.visibilidade === 'Publico' || !r.visibilidade);

    // Filtro por Categoria Selecionada
    if (this.selectedCategory !== 'Todas') {
      recadosExibidos = recadosExibidos.filter(r => r.categoria === this.selectedCategory);
    }

    // Filtro por Termo de Busca
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      recadosExibidos = recadosExibidos.filter(r => 
        (r.titulo || '').toLowerCase().includes(q) || 
        (r.texto || '').toLowerCase().includes(q) || 
        (r.resumo || '').toLowerCase().includes(q)
      );
    }

    const leadArticle = recadosExibidos[0];
    const otherArticles = recadosExibidos.slice(1);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.75rem; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
        
        <!-- Header Principal Estilo Portal de Notícias / Jornal Digital -->
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 1.75rem; border-radius: 16px; border-left: 6px solid #2563EB; box-shadow: 0 10px 30px rgba(0,0,0,0.12);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;">
                <span class="badge" style="background: rgba(37, 99, 235, 0.25); color: #60A5FA; font-weight: 700; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; border: 1px solid rgba(96, 165, 250, 0.3);">
                  📰 JORNAL DIGITAL &amp; PORTAL DE INFORMES
                </span>
                <span class="badge" style="background: rgba(34, 197, 94, 0.2); color: #4ADE80; font-weight: 700; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem;">
                  ✓ GESTÃO DO SÍNDICO ALESSANDRO
                </span>
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 800; color: #F8FAFC; letter-spacing: -0.5px; margin: 0;">
                Mural de Notícias &amp; Matérias do Condomínio
              </h1>
              <p style="font-size: 0.9rem; color: #94A3B8; margin-top: 0.35rem; margin-bottom: 0;">
                Matérias jornalísticas completas, comunicados oficiais de obras, guia de convivência e informes da administração.
              </p>
            </div>

            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
              ${isSindico ? `
                <button class="btn-primary" style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: white; font-weight: 700; padding: 0.8rem 1.25rem; border: none; border-radius: 10px; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 15px rgba(37,99,235,0.3); cursor: pointer;" onclick="RecadosComponent.openNewPostModal()">
                  <span class="material-symbols-outlined" style="font-size: 1.2rem;">edit_note</span> ✍️ Publicar Nova Matéria
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Barra de Busca & Categorias de Matérias -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: white; padding: 1rem 1.25rem; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
          
          <!-- Filtro de Categorias -->
          <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 2px;">
            ${['Todas', 'Comunicados', 'Obras & Manutenção', 'Finanças & Gestão', 'Eventos & Regimento', 'Convivência'].map(cat => `
              <button class="btn-sm" style="font-weight: 700; font-size: 0.82rem; padding: 0.5rem 0.9rem; border-radius: 20px; cursor: pointer; white-space: nowrap; transition: all 0.2s; ${this.selectedCategory === cat ? 'background: #2563EB; color: white; border: none;' : 'background: #F8FAFC; color: #475569; border: 1px solid #CBD5E1;'}" onclick="RecadosComponent.filtrarCategoria('${cat}')">
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Input de Busca por Matéria -->
          <div style="position: relative; min-width: 240px; flex: 1; max-width: 320px;">
            <span class="material-symbols-outlined" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; font-size: 1.1rem;">search</span>
            <input type="text" class="form-control" style="padding-left: 2.2rem; font-size: 0.85rem; border-radius: 20px; background: #F8FAFC; border: 1px solid #CBD5E1;" placeholder="Buscar matéria ou notícia..." value="${this.searchQuery}" oninput="RecadosComponent.buscarMateria(this.value)">
          </div>
        </div>

        ${recadosExibidos.length === 0 ? `
          <!-- Estado Vazio / Sem Resultados -->
          <div style="text-align: center; padding: 4rem 1.5rem; background: white; border-radius: 16px; border: 1px dashed #CBD5E1; color: #64748B;">
            <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #94A3B8; margin-bottom: 0.5rem; display: block;">newspaper</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: #0F172A; margin-bottom: 0.4rem;">
              Nenhuma matéria encontrada
            </h3>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Não foram encontradas notícias para a categoria ou busca selecionada.
            </p>
            <button class="btn-secondary" onclick="RecadosComponent.limparFiltros()">Limpar Filtros</button>
          </div>
        ` : `
          <!-- 1. MATÉRIA DE CAPA (HERO FEATURED ARTICLE) -->
          ${leadArticle ? `
            <div style="background: white; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
              
              <!-- Imagem da Capa -->
              <div style="min-height: 280px; max-height: 420px; overflow: hidden; position: relative; background: #0F172A;">
                <img src="${leadArticle.imagem || './assets/images/IMG_2909.JPG'}" alt="${leadArticle.titulo}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                <span class="badge" style="position: absolute; top: 1rem; left: 1rem; background: #E11D48; color: white; font-weight: 800; font-size: 0.78rem; padding: 6px 14px; border-radius: 20px; box-shadow: 0 4px 12px rgba(225,29,72,0.4);">
                  📌 MATÉRIA EM DESTAQUE
                </span>
              </div>

              <!-- Conteúdo da Capa -->
              <div style="padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="badge" style="background: #EFF6FF; color: #2563EB; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px;">
                      ${leadArticle.categoria || 'Comunicados'}
                    </span>
                    <span style="font-size: 0.8rem; color: #64748B; font-weight: 600; display: flex; align-items: center; gap: 0.3rem;">
                      <span class="material-symbols-outlined" style="font-size: 0.95rem;">schedule</span> ${leadArticle.data || 'Recente'} &bull; ⏱️ 2 min de leitura
                    </span>
                  </div>

                  <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #0F172A; line-height: 1.3; margin-bottom: 0.85rem; cursor: pointer;" onclick="RecadosComponent.openReadArticleModal('${leadArticle.id}')">
                    ${leadArticle.titulo}
                  </h2>

                  <p style="font-size: 0.95rem; color: #475569; line-height: 1.6; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">
                    ${leadArticle.texto || leadArticle.resumo}
                  </p>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: #2563EB; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                      ${(leadArticle.autor || 'S')[0]}
                    </div>
                    <div>
                      <span style="font-size: 0.82rem; font-weight: 700; color: #0F172A; display: block;">${leadArticle.autor || 'Síndico Alessandro'}</span>
                      <span style="font-size: 0.72rem; color: #64748B;">Administração do Condomínio</span>
                    </div>
                  </div>

                  <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <button class="btn-primary" style="background: #2563EB; color: white; padding: 0.6rem 1.1rem; font-weight: 700; font-size: 0.85rem; border-radius: 8px; display: flex; align-items: center; gap: 0.4rem;" onclick="RecadosComponent.openReadArticleModal('${leadArticle.id}')">
                      <span class="material-symbols-outlined" style="font-size: 1.1rem;">article</span> Ler Matéria Completa
                    </button>

                    ${isSindico ? `
                      <button class="btn-secondary btn-sm" onclick="RecadosComponent.openEditPostModal('${leadArticle.id}')" title="Editar">
                        <span class="material-symbols-outlined" style="font-size: 1rem;">edit</span>
                      </button>
                      <button class="btn-secondary btn-sm btn-danger" style="background: #FFF1F2; color: #E11D48;" onclick="RecadosComponent.excluirPost('${leadArticle.id}')" title="Excluir">
                        <span class="material-symbols-outlined" style="font-size: 1rem;">delete</span>
                      </button>
                    ` : ''}
                  </div>
                </div>

              </div>
            </div>
          ` : ''}

          <!-- 2. GRADE DE OUTRAS MATÉRIAS & NOTÍCIAS (NEWS GRID) -->
          ${otherArticles.length > 0 ? `
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
                <span class="material-symbols-outlined" style="color: #2563EB;">grid_view</span> Outras Matérias &amp; Comunicados Recentes (${otherArticles.length})
              </h3>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${otherArticles.map(item => `
                  <div style="background: white; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)'">
                    
                    <div>
                      ${item.imagem ? `
                        <div style="height: 180px; overflow: hidden; position: relative; background: #0F172A;">
                          <img src="${item.imagem}" alt="${item.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
                          <span class="badge" style="position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(15, 23, 42, 0.85); color: white; font-size: 0.72rem; font-weight: 700; backdrop-filter: blur(4px); padding: 4px 8px; border-radius: 4px;">
                            ${item.categoria || 'Informe'}
                          </span>
                        </div>
                      ` : ''}

                      <div style="padding: 1.25rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: #64748B; margin-bottom: 0.5rem;">
                          <span>📅 ${item.data}</span>
                          <span>${item.visibilidade === 'Privado' ? '🔒 Exclusivo' : '🌐 Público'}</span>
                        </div>

                        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #0F172A; line-height: 1.35; margin-bottom: 0.6rem; cursor: pointer;" onclick="RecadosComponent.openReadArticleModal('${item.id}')">
                          ${item.titulo}
                        </h4>

                        <p style="font-size: 0.88rem; color: #475569; line-height: 1.55; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                          ${item.texto || item.resumo}
                        </p>
                      </div>
                    </div>

                    <div style="padding: 0 1.25rem 1.25rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 0.85rem;">
                      <span style="font-size: 0.78rem; font-weight: 700; color: #2563EB; cursor: pointer; display: flex; align-items: center; gap: 0.2rem;" onclick="RecadosComponent.openReadArticleModal('${item.id}')">
                        Ler Matéria <span class="material-symbols-outlined" style="font-size: 0.95rem;">arrow_forward</span>
                      </span>

                      ${isSindico ? `
                        <div style="display: flex; gap: 0.3rem;">
                          <button class="btn-secondary btn-sm" onclick="RecadosComponent.openEditPostModal('${item.id}')" title="Editar">
                            <span class="material-symbols-outlined" style="font-size: 0.9rem;">edit</span>
                          </button>
                          <button class="btn-secondary btn-sm btn-danger" style="background: #FFF1F2; color: #E11D48;" onclick="RecadosComponent.excluirPost('${item.id}')" title="Excluir">
                            <span class="material-symbols-outlined" style="font-size: 0.9rem;">delete</span>
                          </button>
                        </div>
                      ` : ''}
                    </div>

                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        `}

      </div>
    `;
  },

  filtrarCategoria(cat) {
    this.selectedCategory = cat;
    if (window.App && window.App.render) window.App.render();
  },

  buscarMateria(query) {
    this.searchQuery = query;
    if (window.App && window.App.render) window.App.render();
  },

  limparFiltros() {
    this.selectedCategory = 'Todas';
    this.searchQuery = '';
    if (window.App && window.App.render) window.App.render();
  },

  // Modal Leitor de Matéria Estilo Revista / Jornal Digital
  openReadArticleModal(postId) {
    const post = (window.CondoStore && window.CondoStore.data && window.CondoStore.data.recados)
      ? window.CondoStore.data.recados.find(r => r.id === postId)
      : null;

    if (!post) return;

    const existing = document.getElementById('modalArticleReader');
    if (existing) existing.remove();

    const paragraphs = (post.texto || post.resumo || '').split('\n').filter(p => p.trim());

    const modalHtml = `
      <div class="modal-overlay active" id="modalArticleReader" style="z-index: 999999; display: flex !important; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(6px); align-items: center; justify-content: center; padding: 1rem;">
        <div class="modal-card" style="max-width: 750px; width: 100%; max-height: 92vh; display: flex; flex-direction: column; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
          
          <!-- Header do Leitor -->
          <div style="background: #0F172A; color: white; padding: 1.1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge" style="background: #2563EB; color: white; font-weight: 700; font-size: 0.78rem;">
                ${post.categoria || 'Comunicado Oficial'}
              </span>
              <span style="font-size: 0.8rem; color: #94A3B8;">📅 ${post.data}</span>
            </div>
            <button class="modal-close" style="color: white; background: none; border: none; font-size: 1.4rem; cursor: pointer;" onclick="document.getElementById('modalArticleReader').remove()">✕</button>
          </div>

          <!-- Corpo da Matéria (Scrollable) -->
          <div style="padding: 2rem; overflow-y: auto; flex: 1; font-family: 'Inter', system-ui, sans-serif; line-height: 1.7; color: #334155;">
            
            <h1 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: #0F172A; line-height: 1.3; margin-bottom: 1rem;">
              ${post.titulo}
            </h1>

            <div style="display: flex; align-items: center; gap: 0.75rem; padding-bottom: 1.25rem; margin-bottom: 1.5rem; border-bottom: 1px solid #E2E8F0;">
              <div style="width: 42px; height: 42px; border-radius: 50%; background: #2563EB; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem;">
                ${(post.autor || 'S')[0]}
              </div>
              <div>
                <span style="font-size: 0.9rem; font-weight: 700; color: #0F172A; display: block;">${post.autor || 'Síndico Alessandro Cristiano da Silva'}</span>
                <span style="font-size: 0.78rem; color: #64748B;">Publicado em ${post.data} &bull; Condomínio Modern Life Residence</span>
              </div>
            </div>

            ${post.imagem ? `
              <div style="margin-bottom: 1.75rem; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; max-height: 380px; background: #0F172A;">
                <img src="${post.imagem}" alt="${post.titulo}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </div>
            ` : ''}

            <!-- Parágrafos da Matéria -->
            <div style="font-size: 1rem; color: #334155; display: flex; flex-direction: column; gap: 1.1rem;">
              ${paragraphs.map((p, idx) => `
                ${idx === 0 ? `
                  <p style="font-size: 1.08rem; font-weight: 500; color: #0F172A; line-height: 1.65; border-left: 4px solid #2563EB; padding-left: 1rem; margin: 0;">
                    ${p}
                  </p>
                ` : `
                  <p style="margin: 0; white-space: pre-line;">${p}</p>
                `}
              `).join('')}
            </div>

            <!-- Assinatura da Gestão -->
            <div style="margin-top: 2.5rem; padding: 1.25rem; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span style="font-size: 0.78rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Administração Responsável</span>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0F172A; margin-top: 2px;">Síndico Alessandro Cristiano da Silva</div>
                <div style="font-size: 0.8rem; color: #2563EB;">condominio.modern.life@gmail.com</div>
              </div>

              <button class="btn-secondary btn-sm" onclick="window.print()" style="font-weight: 600; display: flex; align-items: center; gap: 0.3rem;">
                <span class="material-symbols-outlined" style="font-size: 1rem;">print</span> Imprimir Matéria
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  openNewPostModal() {
    this.editingPostId = null;
    this.previewImageData = null;
    this.renderFormModal('✍️ Publicar Nova Matéria / Informe', null);
  },

  openEditPostModal(postId) {
    const post = window.CondoStore.data.recados.find(r => r.id === postId);
    if (!post) return;

    this.editingPostId = postId;
    this.previewImageData = post.imagem || null;
    this.renderFormModal('Editar Matéria / Informe', post);
  },

  renderFormModal(title, post) {
    const existing = document.getElementById('modalRecadoForm');
    if (existing) existing.remove();

    const isEdit = !!post;

    const modalHtml = `
      <div class="modal-overlay active" id="modalRecadoForm" style="z-index: 999999; display: flex !important; position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 1rem;">
        <div class="modal-card" style="max-width: 650px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; background: var(--bg-surface); border-radius: 14px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.3);">
          
          <div class="modal-header" style="background: var(--primary-dark); color: white; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.05rem;">${title}</div>
            <button class="modal-close" style="color: white; background: none; border: none; font-size: 1.4rem; cursor: pointer;" onclick="document.getElementById('modalRecadoForm').remove()">✕</button>
          </div>

          <div class="modal-body" style="padding: 1.35rem; overflow-y: auto; flex: 1;">
            <form onsubmit="RecadosComponent.submeterForm(event)">
              
              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Título da Matéria</label>
                <input type="text" id="postTitulo" class="form-control" value="${isEdit ? post.titulo : ''}" placeholder="Ex: Modernização da Iluminação das Áreas Comuns para LED" required>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700;">Categoria da Matéria</label>
                  <select id="postCategoria" class="form-control" required>
                    <option value="Comunicados" ${isEdit && post.categoria === 'Comunicados' ? 'selected' : ''}>📢 Comunicados Oficial</option>
                    <option value="Obras & Manutenção" ${isEdit && post.categoria === 'Obras & Manutenção' ? 'selected' : ''}>🛠️ Obras &amp; Manutenção</option>
                    <option value="Finanças & Gestão" ${isEdit && post.categoria === 'Finanças & Gestão' ? 'selected' : ''}>📊 Finanças &amp; Gestão</option>
                    <option value="Eventos & Regimento" ${isEdit && post.categoria === 'Eventos & Regimento' ? 'selected' : ''}>🎉 Eventos &amp; Regimento</option>
                    <option value="Convivência" ${isEdit && post.categoria === 'Convivência' ? 'selected' : ''}>💡 Dicas de Convivência</option>
                  </select>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-weight: 700;">Visibilidade</label>
                  <select id="postVisibilidade" class="form-control" required>
                    <option value="Publico" ${isEdit && post.visibilidade === 'Publico' ? 'selected' : ''}>🌐 Visível para Todos (Público)</option>
                    <option value="Privado" ${isEdit && post.visibilidade === 'Privado' ? 'selected' : ''}>🔒 Apenas Moradores Cadastrados</option>
                  </select>
                </div>
              </div>

              <!-- Seleção e Busca de Imagem -->
              <div class="form-group" style="background: var(--bg-app); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed var(--primary); margin-bottom: 1rem;">
                <label class="form-label" style="font-weight: 700; color: var(--primary-dark); display: flex; align-items: center; gap: 0.4rem;">
                  <span class="material-symbols-outlined">image_search</span> Imagem de Capa da Matéria
                </label>
                
                <div style="margin-bottom: 0.75rem;">
                  <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Escolher foto temática pré-definida:</span>
                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('./assets/images/IMG_2909.JPG')">💡 Iluminação LED</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('./assets/images/IMG_2956.JPG')">🏢 Fachada Modern Life</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800')">🏊 Piscina</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800')">🏋️ Academia</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800')">🧹 Obras/Limpeza</button>
                  </div>
                </div>

                <div style="margin-bottom: 0.75rem;">
                  <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 0.2rem;">ou subir foto do computador/celular (Compressão Automática em Canvas):</label>
                  <input type="file" id="postImagemArquivo" class="form-control" accept="image/*" onchange="RecadosComponent.handleFileSelect(event)">
                </div>

                <div>
                  <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 0.2rem;">ou cole o link da imagem:</label>
                  <input type="text" id="postImagemUrl" class="form-control" value="${isEdit ? (post.imagem || '') : ''}" placeholder="https://exemplo.com/imagem.jpg" oninput="RecadosComponent.handleUrlInput(event)">
                </div>
                
                <div id="imagePreviewContainer" style="margin-top: 0.75rem; text-align: center; ${isEdit && post.imagem ? 'display: block;' : 'display: none;'}">
                  <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Capa Selecionada:</span>
                  <img id="imagePreviewThumb" src="${isEdit ? (post.imagem || '') : ''}" alt="Preview" style="max-height: 160px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Conteúdo Completo da Matéria</label>
                <textarea id="postTexto" class="form-control" rows="8" placeholder="Escreva o texto completo da matéria ou comunicado..." required>${isEdit ? post.texto : ''}</textarea>
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalRecadoForm').remove()">Cancelar</button>
                <button type="submit" class="btn-primary" style="padding: 0.85rem 1.4rem; background: #2563EB;">
                  <span class="material-symbols-outlined">save</span> ${isEdit ? 'Salvar Alterações' : 'Publicar Matéria'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  selectPresetImage(url) {
    this.previewImageData = url;
    const urlInput = document.getElementById('postImagemUrl');
    if (urlInput) urlInput.value = url;
    this.updatePreview(url);
  },

  handleUrlInput(e) {
    const url = e.target.value.trim();
    if (url) {
      this.previewImageData = url;
      this.updatePreview(url);
    }
  },

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    App.showToast('⚙️ Otimizando e comprimindo imagem...', 'info');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1280;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        this.previewImageData = canvas.toDataURL('image/jpeg', 0.78);
        this.updatePreview(this.previewImageData);
        App.showToast('✓ Imagem otimizada!', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  },

  updatePreview(src) {
    const container = document.getElementById('imagePreviewContainer');
    const thumb = document.getElementById('imagePreviewThumb');
    if (container && thumb) {
      thumb.src = src;
      container.style.display = 'block';
    }
  },

  submeterForm(e) {
    e.preventDefault();
    const titulo = document.getElementById('postTitulo').value.trim();
    const categoria = document.getElementById('postCategoria').value;
    const visibilidade = document.getElementById('postVisibilidade').value;
    const imagemUrl = document.getElementById('postImagemUrl').value.trim();
    const texto = document.getElementById('postTexto').value.trim();

    const finalImage = this.previewImageData || imagemUrl || './assets/images/IMG_2909.JPG';

    const data = window.CondoStore.data;
    if (!data.recados) data.recados = [];

    if (this.editingPostId) {
      const post = data.recados.find(r => r.id === this.editingPostId);
      if (post) {
        post.titulo = titulo;
        post.categoria = categoria;
        post.visibilidade = visibilidade;
        post.imagem = finalImage;
        post.texto = texto;
        post.resumo = texto.substring(0, 140) + '...';
        App.showToast('Matéria atualizada com sucesso!', 'success');
      }
    } else {
      const newPost = {
        id: 'rec_' + Date.now(),
        titulo,
        categoria,
        data: new Date().toISOString().split('T')[0],
        autor: 'Síndico Alessandro Cristiano da Silva',
        visibilidade,
        imagem: finalImage,
        resumo: texto.substring(0, 140) + '...',
        texto
      };
      data.recados.unshift(newPost);
      App.showToast('Nova matéria publicada com sucesso!', 'success');
    }

    window.CondoStore.saveData(data);
    const modalForm = document.getElementById('modalRecadoForm');
    if (modalForm) modalForm.remove();
    App.render();
  },

  excluirPost(postId) {
    const post = window.CondoStore.data.recados.find(r => r.id === postId);
    const titulo = post ? post.titulo : 'esta matéria';

    if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente a matéria "${titulo}"?`)) {
      return;
    }

    const data = window.CondoStore.data;
    data.recados = data.recados.filter(r => r.id !== postId);
    window.CondoStore.saveData(data);

    App.showToast('Matéria excluída com sucesso.', 'info');
    App.render();
  }
};
