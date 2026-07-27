/* ----------------------------------------------------
   Modern Life Residence - Documentos & Manuais Oficial
   Suporte Completo a Upload Real de Arquivos (PDF, DOC, Imagens e Textos)
   ---------------------------------------------------- */

window.DocumentosComponent = {
  activeCategory: 'Todos',
  uploadedFileDataUrl: '',
  uploadedFileName: '',
  uploadedFileSize: '',

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isApproved = user && user.status === 'Aprovado';
    const isSindico = user && (user.role === 'Administrador' || user.email.toLowerCase() === 'condominio.modern.life@gmail.com');
    const isConselheiro = user && user.role === 'Conselheiro';
    const isPortaria = user && user.role === 'Portaria';

    let rawDocs = (data.documentos || []).filter(d => d.id !== 'doc_sistema_md');

    // FILTRAGEM RIGOROSA DE VISIBILIDADE POR PERFIL DE USUÁRIO:
    let documentosVisiveis = rawDocs.filter(doc => {
      const vis = doc.visibilidade || 'Moradores';
      if (isSindico) return true; // O Síndico enxerga TODOS os documentos publicados
      if (vis === 'Sindico') return false; // Ninguém além do Síndico enxerga visibilidade 'Sindico'
      if (vis === 'Conselho') return isConselheiro;
      if (vis === 'Portaria') return isPortaria;
      return true; // Visibilidade 'Moradores' ou 'Publico'
    });

    const categorias = ['Todos', 'Convenção', 'Regimento', 'Atas', 'Laudos', 'Manuais'];

    const filtered = this.activeCategory === 'Todos'
      ? documentosVisiveis
      : documentosVisiveis.filter(d => d.categoria === this.activeCategory);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Header da Página -->
        <div class="card-widget" style="background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 0.5rem;">
                <span class="material-symbols-outlined" style="font-size: 0.9rem;">folder_open</span> REPOSITÓRIO OFICIAL
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; margin-top: 0.25rem;">
                Documentos, Convenção, Regimento &amp; Manuais
              </h2>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.25rem;">
                Acesso aos documentos regulamentares e instrucionais do Condomínio Modern Life Residence.
              </p>
            </div>

            ${isSindico ? `
              <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700; display: flex; align-items: center; gap: 0.4rem;" onclick="DocumentosComponent.openUploadModal()">
                <span class="material-symbols-outlined">upload_file</span> 📤 Publicar Novo Documento
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Filtros por Categoria -->
        <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem;">
          ${categorias.map(cat => `
            <button class="btn-sm ${this.activeCategory === cat ? 'btn-primary' : 'btn-secondary'}" onclick="DocumentosComponent.filterCategory('${cat}')" style="white-space: nowrap;">
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Alerta para Moradores Não Aprovados -->
        ${!isApproved ? `
          <div style="background: #FFF3E0; border: 1px solid #FFE0B2; padding: 1rem; border-radius: var(--radius-md); font-size: 0.88rem; color: #E65100; display: flex; align-items: center; gap: 0.75rem;">
            <span class="material-symbols-outlined" style="font-size: 2rem;">lock</span>
            <div>
              <strong>Acesso Restrito a Documentos Internos</strong><br>
              Seu cadastro está em análise pela administração. Após a aprovação do Síndico, o download de atas e convenção será liberado.
            </div>
          </div>
        ` : ''}

        <!-- Grid de Documentos -->
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
          ${filtered.map(doc => {
            const visLabel = doc.visibilidade === 'Sindico' ? '🔒 Apenas Síndico' : doc.visibilidade === 'Conselho' ? '👑 Conselho' : doc.visibilidade === 'Portaria' ? '🚪 Portaria' : '🏡 Todos os Moradores';
            const visBadgeClass = doc.visibilidade === 'Sindico' ? 'badge-danger' : doc.visibilidade === 'Conselho' ? 'badge-success' : doc.visibilidade === 'Portaria' ? 'badge-warning' : 'badge-info';

            const isDataUrl = doc.arquivo && (doc.arquivo.startsWith('data:') || doc.arquivo.startsWith('blob:'));

            return `
              <div class="card-widget" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid ${doc.visibilidade === 'Sindico' ? '#C62828' : 'var(--primary)'};">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 4px;">
                    <span class="material-symbols-outlined" style="font-size: 2.2rem; color: var(--primary);">
                      ${(doc.arquivo || '').includes('.pdf') ? 'picture_as_pdf' : (doc.arquivo || '').includes('.md') ? 'description' : 'article'}
                    </span>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                      <span class="badge ${visBadgeClass}" style="font-size: 0.72rem;">${visLabel}</span>
                      <span class="badge badge-info" style="font-size: 0.7rem; background: var(--bg-app); color: var(--text-main); border: 1px solid var(--border-light);">${doc.categoria}</span>
                    </div>
                  </div>

                  <h3 style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--primary-dark); font-weight: 700; margin-bottom: 0.5rem;">
                    ${doc.nome}
                  </h3>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">
                    Publicado em: ${doc.dataUpload} &bull; ${doc.tamanho || '1 MB'}
                  </div>
                </div>

                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                  ${isApproved ? `
                    ${isDataUrl ? `
                      <button class="btn-primary btn-sm" style="flex: 1; justify-content: center; font-weight: 700;" onclick="DocumentosComponent.abrirOuBaixarDataUrl('${doc.id}')">
                        <span class="material-symbols-outlined" style="font-size: 1.1rem;">download</span> Baixar / Abrir
                      </button>
                    ` : `
                      <a href="${doc.arquivo}" target="_blank" class="btn-primary btn-sm" style="flex: 1; justify-content: center; text-decoration: none; font-weight: 700;">
                        <span class="material-symbols-outlined" style="font-size: 1.1rem;">visibility</span> Visualizar
                      </a>
                    `}
                  ` : `
                    <button class="btn-secondary btn-sm" style="flex: 1; justify-content: center;" disabled>
                      <span class="material-symbols-outlined" style="font-size: 1.1rem;">lock</span> Requer Aprovação
                    </button>
                  `}

                  ${isSindico ? `
                    <button class="btn-secondary btn-sm btn-danger" style="background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2;" onclick="DocumentosComponent.excluirDocumento('${doc.id}', '${doc.nome}')" title="Excluir Documento">
                      <span class="material-symbols-outlined" style="font-size: 1rem;">delete</span>
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  },

  filterCategory(cat) {
    this.activeCategory = cat;
    App.render();
  },

  openUploadModal() {
    this.uploadedFileDataUrl = '';
    this.uploadedFileName = '';
    this.uploadedFileSize = '';

    const existing = document.getElementById('modalUploadDoc');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-overlay active" id="modalUploadDoc" style="z-index: 999999;">
        <div class="modal-card" style="max-width: 540px; border: 2px solid var(--primary);">
          <div class="modal-header" style="background: var(--primary-dark); color: white;">
            <div class="modal-title" style="color: white; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
              <span class="material-symbols-outlined">upload_file</span> 📤 Publicar Novo Documento Oficial
            </div>
            <button class="modal-close" style="color: white;" onclick="document.getElementById('modalUploadDoc').remove()">✕</button>
          </div>
          <div class="modal-body">
            <form onsubmit="DocumentosComponent.submeterUploadDocumento(event)">
              
              <!-- Seletor Real de Arquivo do Computador/Celular -->
              <div class="form-group" style="background: #F0FDF4; border: 2px dashed #3ECF8E; padding: 1.2rem; border-radius: 8px; text-align: center;">
                <label for="realFileInput" style="cursor: pointer; display: block;">
                  <span class="material-symbols-outlined" style="font-size: 2.8rem; color: #2E6B42; display: block; margin-bottom: 0.3rem;">cloud_upload</span>
                  <strong style="color: var(--primary-dark); font-size: 1rem;">Clique aqui para selecionar o arquivo no seu dispositivo</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                    Suporta PDF, Word (.doc, .docx), Imagens e Documentos de Texto (até 15MB)
                  </span>
                </label>

                <input type="file" id="realFileInput" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.md" style="display: none;" onchange="DocumentosComponent.manipularSelecaoArquivo(event)">

                <div id="fileInfoDisplay" style="margin-top: 0.85rem; font-weight: 700; font-size: 0.88rem; color: #166534; display: none; background: white; padding: 0.6rem; border-radius: 6px; border: 1px solid #BBF7D0;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Título / Nome do Documento</label>
                <input type="text" id="docNomeInput" class="form-control" placeholder="Ex: Regimento Interno 2026 / Edital de Convocação" required style="font-weight: 600;">
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 700;">Categoria</label>
                  <select id="docCategoriaInput" class="form-control" required style="font-weight: 600;">
                    <option value="Convenção">📜 Convenção</option>
                    <option value="Regimento" selected>📘 Regimento Interno</option>
                    <option value="Atas">📝 Atas de Assembleia</option>
                    <option value="Laudos">📑 Laudos &amp; Vistorias</option>
                    <option value="Manuais">🔧 Manuais &amp; Guias</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" style="font-weight: 700; color: #E65100;">🔒 Público Alvo / Visibilidade</label>
                  <select id="docVisibilidadeInput" class="form-control" required style="font-weight: 700; border: 2px solid #FFE0B2; background: #FFF8E1;">
                    <option value="Moradores">🏡 Todos os Moradores (Público)</option>
                    <option value="Conselho">👑 Membros do Conselho &amp; Síndico</option>
                    <option value="Portaria">🚪 Portaria &amp; Síndico</option>
                    <option value="Sindico">🔒 Apenas para o Síndico (Exclusivo)</option>
                  </select>
                </div>
              </div>

              <!-- Alternativa de Link/Caminho Manual -->
              <div class="form-group">
                <label class="form-label" style="font-weight: 600; font-size: 0.82rem; color: var(--text-muted);">Ou informe um Link/URL Web do Documento (Opcional caso não envie arquivo)</label>
                <input type="text" id="docArquivoInput" class="form-control" placeholder="https://exemplo.com/documento.pdf ou assets/docs/..." style="font-size: 0.85rem;">
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 700; margin-top: 0.5rem; background: var(--primary);">
                <span class="material-symbols-outlined">send</span> Publicar Documento no Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  manipularSelecaoArquivo(event) {
    const file = event.target.files[0];
    if (!file) return;

    let sizeStr = '';
    if (file.size < 1024 * 1024) {
      sizeStr = (file.size / 1024).toFixed(1) + ' KB';
    } else {
      sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    }

    this.uploadedFileName = file.name;
    this.uploadedFileSize = sizeStr;

    const inputNome = document.getElementById('docNomeInput');
    if (inputNome && !inputNome.value) {
      inputNome.value = file.name.replace(/\.[^/.]+$/, "");
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedFileDataUrl = e.target.result;

      const display = document.getElementById('fileInfoDisplay');
      if (display) {
        display.style.display = 'block';
        display.innerHTML = `
          ✅ Arquivo Selecionado: <strong>${file.name}</strong> (${sizeStr})
        `;
      }
    };
    reader.readAsDataURL(file);
  },

  submeterUploadDocumento(e) {
    e.preventDefault();
    const nome = document.getElementById('docNomeInput').value.trim();
    const categoria = document.getElementById('docCategoriaInput').value;
    const visibilidade = document.getElementById('docVisibilidadeInput').value;
    const urlManual = document.getElementById('docArquivoInput').value.trim();

    const arquivoFinal = this.uploadedFileDataUrl || urlManual || 'assets/docs/EDITAL_AGE_11.08.2026_-_MODERN_LIFE_assinado.pdf';
    const tamanhoFinal = this.uploadedFileSize || '1.8 MB';

    if (!nome) return;

    window.CondoStore.addDocumento({
      nome,
      categoria,
      visibilidade,
      arquivo: arquivoFinal,
      tamanho: tamanhoFinal
    });

    App.showToast(`Documento "${nome}" publicado com sucesso! Visibilidade: ${visibilidade}`, 'success');
    document.getElementById('modalUploadDoc').remove();
    App.render();
  },

  abrirOuBaixarDataUrl(docId) {
    const doc = (window.CondoStore.data.documentos || []).find(d => d.id === docId);
    if (!doc || !doc.arquivo) return;

    const win = window.open();
    if (win) {
      win.document.write(`
        <html>
          <head><title>${doc.nome}</title></head>
          <body style="margin:0; background: #1C1C1C; display:flex; justify-content:center; align-items:center; height:100vh;">
            <iframe src="${doc.arquivo}" style="width:100%; height:100%; border:none;"></iframe>
          </body>
        </html>
      `);
    } else {
      const a = document.createElement('a');
      a.href = doc.arquivo;
      a.download = doc.nome;
      a.click();
    }
  },

  excluirDocumento(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o documento "${nome}"?`)) return;

    const res = window.CondoStore.deleteDocumento(id);
    if (res) {
      App.showToast(`Documento "${nome}" excluído.`, 'info');
      App.render();
    } else {
      alert('Este documento não pode ser excluído.');
    }
  }
};
