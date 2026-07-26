/* ----------------------------------------------------
   Modern Life Residence - Mural de Recados (Blog do Síndico)
   Suporte a Upload de Imagens Locais (Leitor Base64) + Visibilidade Pública/Privada
   ---------------------------------------------------- */

window.RecadosComponent = {
  previewImageData: null,

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
                <span class="material-symbols-outlined">add_circle</span> Publicar Novo Recado (Com Imagem)
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Feed de Recados -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${recadosExibidos.length === 0 ? `
            <div class="card-widget" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
              <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.5; display: block; margin-bottom: 0.5rem;">campaign</span>
              Nenhum recado disponível para o seu nível de acesso no momento.
            </div>
          ` : recadosExibidos.map(item => `
            <div class="card-widget" style="padding: 0; overflow: hidden;">
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
                  <span style="font-size: 0.82rem; font-weight: 600; color: var(--primary-dark);">✍️ ${item.autor}</span>
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
    this.previewImageData = null;
    const existing = document.getElementById('modalNewPost');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalNewPost">
        <div class="modal-card" style="max-width: 620px;">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700;">Publicar Informe no Mural de Recados</div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalNewPost').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="RecadosComponent.submeterPost(event)">
              <div class="form-group">
                <label class="form-label">Título do Recado</label>
                <input type="text" id="postTitulo" class="form-control" placeholder="Ex: Reforma da Calçada / Aviso de Manutenção" required>
              </div>

              <div class="form-group">
                <label class="form-label">Visibilidade do Recado</label>
                <select id="postVisibilidade" class="form-control" required>
                  <option value="Publico">🌐 Visível para Todos (Público e Visitantes)</option>
                  <option value="Privado">🔒 Visível Apenas para Moradores Cadastrados (Privado)</option>
                </select>
              </div>

              <!-- Upload de Imagem Local -->
              <div class="form-group" style="background: var(--bg-app); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed var(--primary);">
                <label class="form-label" style="font-weight: 700; color: var(--primary-dark); display: flex; align-items: center; gap: 0.4rem;">
                  <span class="material-symbols-outlined">add_a_photo</span> Enviar Imagem do Seu Computador ou Celular
                </label>
                <input type="file" id="postImagemArquivo" class="form-control" accept="image/*" onchange="RecadosComponent.handleFileSelect(event)">
                
                <div id="imagePreviewContainer" style="margin-top: 0.75rem; text-align: center; display: none;">
                  <span style="font-size: 0.78rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Pré-visualização da imagem selecionada:</span>
                  <img id="imagePreviewThumb" src="" alt="Preview" style="max-height: 160px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">ou URL de Imagem da Web (Opcional)</label>
                <input type="text" id="postImagemUrl" class="form-control" placeholder="./assets/images/IMG_2909.JPG ou https://...">
              </div>

              <div class="form-group">
                <label class="form-label">Conteúdo do Recado</label>
                <textarea id="postTexto" class="form-control" rows="6" placeholder="Escreva o comunicado oficial aqui..." required></textarea>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem;">
                <span class="material-symbols-outlined">publish</span> Publicar Informe no Mural
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.previewImageData = event.target.result;
        const previewContainer = document.getElementById('imagePreviewContainer');
        const previewThumb = document.getElementById('imagePreviewThumb');
        if (previewContainer && previewThumb) {
          previewThumb.src = this.previewImageData;
          previewContainer.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    }
  },

  submeterPost(e) {
    e.preventDefault();
    const titulo = document.getElementById('postTitulo').value.trim();
    const visibilidade = document.getElementById('postVisibilidade').value;
    const imagemUrl = document.getElementById('postImagemUrl').value.trim();
    const texto = document.getElementById('postTexto').value.trim();

    // Prioriza a imagem enviada do computador/celular se houver
    const finalImage = this.previewImageData || imagemUrl || './assets/images/IMG_2909.JPG';

    const data = window.CondoStore.data;
    if (!data.recados) data.recados = [];

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
    window.CondoStore.saveData(data);

    App.showToast('Novo recado com imagem publicado com sucesso!', 'success');
    document.getElementById('modalNewPost').remove();
    App.render();
  }
};
