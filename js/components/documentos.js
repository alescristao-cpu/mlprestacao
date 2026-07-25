/* ----------------------------------------------------
   Modern Life Residence - Biblioteca de Documentos Component
   ---------------------------------------------------- */

window.DocumentosComponent = {
  render(container, data) {
    const user = window.CondoStore.currentUser;

    // Access Gate for non-logged-in users
    if (!user || user.status !== 'Aprovado') {
      container.innerHTML = `
        <div class="card-widget" style="text-align: center; padding: 3.5rem 1.5rem; max-width: 600px; margin: 2rem auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">lock</span>
          </div>
          <h2 style="font-family: var(--font-heading); color: var(--primary-dark); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">
            Acesso Restrito a Moradores Cadastrados
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem;">
            O download de documentos oficiais (Convenção, Regimento Interno, Manuais e Atas) exige autenticação dos moradores do Modern Life Residence.
          </p>
          <button class="btn-primary" onclick="AuthComponent.renderAuthModal()" style="padding: 0.8rem 1.5rem; font-size: 0.95rem;">
            <span class="material-symbols-outlined">login</span> Entrar / Cadastrar com Google
          </button>
        </div>
      `;
      return;
    }

    const docs = data.documentos || [];
    const categories = ['Todos', 'Convenção', 'Regimento Interno', 'Manual do Proprietário', 'Normas', 'Assembleias'];

    container.innerHTML = `
      <div class="card-widget">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">folder</span> Biblioteca de Documentos Oficiais
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Baixe convenção, regimentos, manuais e editais de assembleias.
            </p>
          </div>

          <!-- Live Search Bar -->
          <div style="position: relative; width: 260px;">
            <input type="text" id="searchDocInput" class="form-control" placeholder="Buscar documento..." onkeyup="DocumentosComponent.filterDocs()">
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="tab-list" id="docCategoryTabs">
          ${categories.map((cat, i) => `
            <button class="tab-btn ${i === 0 ? 'active' : ''}" onclick="DocumentosComponent.switchCategory('${cat}', this)">
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Document List -->
        <div class="table-responsive">
          <table class="custom-table" id="tableDocs">
            <thead>
              <tr>
                <th>Nome do Documento</th>
                <th>Categoria</th>
                <th>Data de Upload</th>
                <th>Tamanho</th>
                <th style="text-align: center;">Ação</th>
              </tr>
            </thead>
            <tbody>
              ${docs.map(doc => `
                <tr data-cat="${doc.categoria}">
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <span class="material-symbols-outlined" style="color: var(--primary); font-size: 1.4rem;">picture_as_pdf</span>
                      <strong>${doc.nome}</strong>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-info">${doc.categoria}</span>
                  </td>
                  <td>${doc.dataUpload}</td>
                  <td>${doc.tamanho}</td>
                  <td style="text-align: center;">
                    <a href="${doc.arquivo}" target="_blank" class="btn-primary btn-sm" style="text-decoration: none; display: inline-flex;">
                      <span class="material-symbols-outlined">download</span> Baixar PDF
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  switchCategory(cat, btn) {
    document.querySelectorAll('#docCategoryTabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const rows = document.querySelectorAll('#tableDocs tbody tr');
    rows.forEach(row => {
      const rowCat = row.getAttribute('data-cat');
      if (cat === 'Todos' || rowCat === cat) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  },

  filterDocs() {
    const q = document.getElementById('searchDocInput').value.toLowerCase();
    const rows = document.querySelectorAll('#tableDocs tbody tr');
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  }
};
