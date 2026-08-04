/* ----------------------------------------------------
   Modern Life Residence - Mural de Recados (Blog do Síndico)
   Suporte a Busca/Galeria de Imagens, Edição e Exclusão de Matérias
   ---------------------------------------------------- */

window.RecadosComponent = {
  previewImageData: null,
  editingPostId: null,

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isApproved = user && user.status === 'Aprovado';
    const isSindico = user && user.role === 'Administrador';

    const allRecados = data.recados || [];

    // FILTRO DE VISIBILIDADE:
    // Visitantes não aprovados veem APENAS avisos marcados como "Público".
    // Moradores aprovados ou Síndico veem TODOS os recados.
    const recadosExibidos = isApproved || isSindico 
      ? allRecados 
      : allRecados.filter(r => r.visibilidade === 'Publico' || !r.visibilidade);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header Banner -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700;">
                Mural de Recados &amp; Informes Oficiais do Síndico
              </h2>
              <p style="font-size: 0.9rem; opacity: 0.9;">
                Comunicados oficiais, atualizações de obras e avisos da administração.
              </p>
            </div>

            ${isSindico ? `
              <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="RecadosComponent.openNewPostModal()">
                <span class="material-symbols-outlined">add_circle</span> Publicar Novo Recado
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Feed de Recados -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${recadosExibidos.length === 0 ? `
            <div class="card-widget" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
              <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.5; display: block; margin-bottom: 0.5rem;">campaign</span>
              Nenhum recado disponível no momento.
            </div>
          ` : recadosExibidos.map(item => `
            <div class="card-widget" style="padding: 0; overflow: hidden; border: 1px solid var(--border-color);">
              ${item.imagem ? `
                <div style="max-height: 420px; overflow: hidden; background: #000; text-align: center;">
                  <img src="${item.imagem}" alt="${item.titulo}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                </div>
              ` : ''}

              <div style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="badge ${item.visibilidade === 'Privado' ? 'badge-warning' : 'badge-info'}">
                      <span class="material-symbols-outlined" style="font-size: 0.85rem;">${item.visibilidade === 'Privado' ? 'lock' : 'public'}</span>
                      ${item.visibilidade === 'Privado' ? 'Exclusivo para Moradores' : 'Visível para Todos'}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${item.data}</span>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.82rem; font-weight: 600; color: var(--primary-dark);">✍️ ${item.autor}</span>
                    
                    ${isSindico ? `
                      <div style="display: flex; gap: 0.3rem; margin-left: 0.5rem;">
                        <button class="btn-outline-primary btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.78rem;" onclick="RecadosComponent.openEditPostModal('${item.id}')" title="Editar Matéria">
                          <span class="material-symbols-outlined" style="font-size: 0.9rem; vertical-align: middle;">edit</span> Editar
                        </button>
                        <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828; padding: 0.25rem 0.6rem; font-size: 0.78rem;" onclick="RecadosComponent.excluirPost('${item.id}')" title="Excluir Matéria">
                          <span class="material-symbols-outlined" style="font-size: 0.9rem; vertical-align: middle;">delete</span> Excluir
                        </button>
                      </div>
                    ` : ''}
                  </div>
                </div>

                <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.5rem;">
                  ${item.titulo}
                </h3>

                <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6; white-space: pre-line;">
                  ${item.texto || item.resumo}
                </p>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  },

  openNewPostModal() {
    this.editingPostId = null;
    this.previewImageData = null;
    this.renderFormModal('Publicar Novo Informe no Mural', null);
  },

  openEditPostModal(postId) {
    const post = window.CondoStore.data.recados.find(r => r.id === postId);
    if (!post) return;

    this.editingPostId = postId;
    this.previewImageData = post.imagem || null;
    this.renderFormModal('Editar Matéria / Recado', post);
  },

  renderFormModal(title, post) {
    const existing = document.getElementById('modalRecadoForm');
    if (existing) existing.remove();

    const isEdit = !!post;

    const modalHtml = `
      <div class="modal-overlay active" id="modalRecadoForm">
        <div class="modal-card" style="max-width: 650px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">${title}</div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalRecadoForm').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="RecadosComponent.submeterForm(event)">
              
              <div class="form-group">
                <label class="form-label">Título da Matéria / Recado</label>
                <input type="text" id="postTitulo" class="form-control" value="${isEdit ? post.titulo : ''}" placeholder="Ex: Manutenção Preventiva da Fachada" required>
              </div>

              <div class="form-group">
                <label class="form-label">Visibilidade do Recado</label>
                <select id="postVisibilidade" class="form-control" required>
                  <option value="Publico" ${isEdit && post.visibilidade === 'Publico' ? 'selected' : ''}>🌐 Visível para Todos (Público e Visitantes)</option>
                  <option value="Privado" ${isEdit && post.visibilidade === 'Privado' ? 'selected' : ''}>🔒 Visível Apenas para Moradores Cadastrados (Privado)</option>
                </select>
              </div>

              <!-- Seleção e Busca de Imagem -->
              <div class="form-group" style="background: var(--bg-app); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed var(--primary);">
                <label class="form-label" style="font-weight: 700; color: var(--primary-dark); display: flex; align-items: center; gap: 0.4rem;">
                  <span class="material-symbols-outlined">image_search</span> Opções de Imagem da Matéria
                </label>
                
                <!-- Galeria de Imagens Rápidas -->
                <div style="margin-bottom: 0.75rem;">
                  <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Clique para escolher uma imagem temática pré-definida:</span>
                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('./assets/images/IMG_2909.JPG')">💡 Iluminação/LED</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('./assets/images/IMG_2956.JPG')">🏢 Fachada Torre</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800')">🏊 Piscina</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800')">🏋️ Academia</button>
                    <button type="button" class="btn-outline-primary btn-sm" onclick="RecadosComponent.selectPresetImage('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800')">🧹 Limpeza/Obras</button>
                  </div>
                </div>

                <!-- Input para Upload Local -->
                <div style="margin-bottom: 0.75rem;">
                  <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 0.2rem;">ou subir foto do seu computador/celular:</label>
                  <input type="file" id="postImagemArquivo" class="form-control" accept="image/*" onchange="RecadosComponent.handleFileSelect(event)">
                </div>

                <!-- Input para URL Externa -->
                <div>
                  <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 0.2rem;">ou cole o link (URL) de uma nova imagem:</label>
                  <input type="text" id="postImagemUrl" class="form-control" value="${isEdit ? post.imagem : ''}" placeholder="https://exemplo.com/imagem.jpg" oninput="RecadosComponent.handleUrlInput(event)">
                </div>
                
                <!-- Pré-visualização -->
                <div id="imagePreviewContainer" style="margin-top: 0.75rem; text-align: center; ${isEdit && post.imagem ? 'display: block;' : 'display: none;'}">
                  <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Imagem Selecionada:</span>
                  <img id="imagePreviewThumb" src="${isEdit ? post.imagem : ''}" alt="Preview" style="max-height: 160px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Conteúdo Detalhado da Matéria</label>
                <textarea id="postTexto" class="form-control" rows="7" placeholder="Escreva o conteúdo completo do comunicado..." required>${isEdit ? post.texto : ''}</textarea>
              </div>

              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button type="button" class="btn-secondary" onclick="document.getElementById('modalRecadoForm').remove()">Cancelar</button>
                <button type="submit" class="btn-primary" style="padding: 0.85rem 1.4rem;">
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

    App.showToast('⚙️ Otimizando e redimensionando imagem...', 'info');

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
    const visibilidade = document.getElementById('postVisibilidade').value;
    const imagemUrl = document.getElementById('postImagemUrl').value.trim();
    const texto = document.getElementById('postTexto').value.trim();

    const finalImage = this.previewImageData || imagemUrl || './assets/images/IMG_2909.JPG';

    const data = window.CondoStore.data;
    if (!data.recados) data.recados = [];

    if (this.editingPostId) {
      // Edição de Matéria Existente
      const post = data.recados.find(r => r.id === this.editingPostId);
      if (post) {
        post.titulo = titulo;
        post.visibilidade = visibilidade;
        post.imagem = finalImage;
        post.texto = texto;
        post.resumo = texto.substring(0, 120) + '...';
        App.showToast('Matéria atualizada com sucesso!', 'success');
      }
    } else {
      // Criação de Nova Matéria
      const newPost = {
        id: 'rec_' + Date.now(),
        titulo,
        data: new Date().toISOString().split('T')[0],
        autor: 'Síndico Alessandro Cristiano da Silva',
        visibilidade,
        imagem: finalImage,
        resumo: texto.substring(0, 120) + '...',
        texto
      };
      data.recados.unshift(newPost);
      App.showToast('Nova matéria publicada com sucesso!', 'success');
    }

    window.CondoStore.saveData(data);
    document.getElementById('modalRecadoForm').remove();
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

    App.showToast('Matéria excluída do mural com sucesso.', 'info');
    App.render();
  }
};
