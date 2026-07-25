/* ----------------------------------------------------
   Modern Life Residence - Biblioteca de Documentos Component
   ---------------------------------------------------- */

window.DocumentosComponent = {
  render(container, data) {
    const docs = data.documentos || [];
    const categories = ['Todos', 'Convenção', 'Regimento Interno', 'Manual do Proprietário', 'Manual do Morador', 'Normas', 'Atas', 'Assembleias', 'Comunicados'];

    container.innerHTML = `
      <div class="card-widget">
        <div class="card-header">
          <div>
            <div class="card-title">
              <span class="material-symbols-outlined">folder</span> Biblioteca de Documentos Oficiais
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Baixe convenção, regimentos, atas de assembleias e formulários normativos.
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
                <th style="text-align: center;">Download</th>
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
                    <button class="btn-primary btn-sm" onclick="alert('Download iniciado para: ${doc.nome}')">
                      <span class="material-symbols-outlined">download</span> Baixar
                    </button>
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
