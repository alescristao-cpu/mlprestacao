/* ----------------------------------------------------
   Modern Life Residence - Documentos & Manuais Oficial
   Incluindo a Documentação Atualizada do Sistema
   ---------------------------------------------------- */

window.DocumentosComponent = {
  activeCategory: 'Todos',

  render(container, data) {
    const user = window.CondoStore.currentUser;
    const isApproved = user && user.status === 'Aprovado';
    const isSindico = user && user.role === 'Administrador';

    let documentos = data.documentos || [];

    // Garantir que a Documentação do Sistema está presente na lista
    const docTecnicoExiste = documentos.some(d => d.id === 'doc_sistema_md');
    if (!docTecnicoExiste) {
      documentos.unshift({
        id: 'doc_sistema_md',
        nome: 'Manual de Operação & Documentação Técnica do Portal',
        categoria: 'Regimento',
        dataUpload: '2026-07-27',
        tamanho: '15 KB',
        arquivo: 'DOCUMENTACAO_SISTEMA.md'
      });
    }

    const categorias = ['Todos', 'Convenção', 'Regimento', 'Atas', 'Laudos', 'Manuais'];

    const filtered = this.activeCategory === 'Todos'
      ? documentos
      : documentos.filter(d => d.categoria === this.activeCategory);

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
              <button class="btn-primary" style="background: white; color: var(--primary-dark); font-weight: 700;" onclick="DocumentosComponent.openUploadModal()">
                <span class="material-symbols-outlined">upload_file</span> Publicar Novo Documento
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
          ${filtered.map(doc => `
            <div class="card-widget" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <span class="material-symbols-outlined" style="font-size: 2.2rem; color: var(--primary);">
                    ${doc.arquivo.endsWith('.pdf') ? 'picture_as_pdf' : doc.arquivo.endsWith('.md') ? 'description' : 'article'}
                  </span>
                  <span class="badge badge-info">${doc.categoria}</span>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--primary-dark); font-weight: 700; margin-bottom: 0.5rem;">
                  ${doc.nome}
                </h3>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">
                  Publicado em: ${doc.dataUpload} &bull; ${doc.tamanho}
                </div>
              </div>

              <div>
                ${isApproved ? `
                  <a href="${doc.arquivo}" target="_blank" class="btn-primary btn-sm" style="width: 100%; justify-content: center; text-decoration: none;">
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">visibility</span> Visualizar Documento
                  </a>
                ` : `
                  <button class="btn-secondary btn-sm" style="width: 100%; justify-content: center;" disabled>
                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">lock</span> Requer Aprovação
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  },

  filterCategory(cat) {
    this.activeCategory = cat;
    App.render();
  },

  openUploadModal() {
    alert('Para publicar um novo documento oficial (PDF ou Texto), selecione o arquivo e informe a categoria.');
  }
};
