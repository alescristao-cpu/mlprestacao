/* ----------------------------------------------------
   Modern Life Residence - PDF & Excel Generator Module
   ---------------------------------------------------- */

window.PDFExporter = {
  // Generates and triggers printable/downloadable PDF report for accountability
  exportPrestacaoContasPDF(item) {
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prestação de Contas - ${item.mesAno} - Modern Life Residence</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #222; margin: 40px; }
          .header { text-align: center; border-bottom: 3px solid #2E6B42; padding-bottom: 20px; margin-bottom: 30px; }
          .logo-title { font-size: 26px; font-weight: bold; color: #2E6B42; margin-bottom: 4px; }
          .sub-title { font-size: 16px; color: #1F4D30; text-transform: uppercase; letter-spacing: 2px; }
          .report-info { margin-top: 15px; font-size: 14px; color: #666; }
          
          .summary-box { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 15px; }
          .box { flex: 1; padding: 15px; border-radius: 8px; background: #F4F4F4; border: 1px solid #D9D9D9; text-align: center; }
          .box-title { font-size: 12px; text-transform: uppercase; color: #666; font-weight: bold; }
          .box-value { font-size: 20px; font-weight: bold; margin-top: 5px; color: #222; }
          .box-value.green { color: #2E6B42; }
          .box-value.blue { color: #1976D2; }
          
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #2E6B42; color: white; text-align: left; padding: 10px 14px; font-size: 13px; text-transform: uppercase; }
          td { padding: 12px 14px; border-bottom: 1px solid #EBEBEB; font-size: 14px; }
          tr:nth-child(even) { background: #FAFDFB; }
          
          .footer { margin-top: 50px; border-top: 1px solid #D9D9D9; padding-top: 15px; text-align: center; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-title">MODERN LIFE RESIDENCE</div>
          <div class="sub-title">RELATÓRIO OFICIAL DE PRESTAÇÃO DE CONTAS</div>
          <div class="report-info">Competência: <strong>${item.mesAno}</strong> | Emitido em: ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>

        <div class="summary-box">
          <div class="box">
            <div class="box-title">Receita Total Bruta</div>
            <div class="box-value green">R$ ${item.receitas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          </div>
          <div class="box">
            <div class="box-title">Despesas Operacionais</div>
            <div class="box-value">R$ ${item.despesas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          </div>
          <div class="box">
            <div class="box-title">Saldo Líquido no Período</div>
            <div class="box-value blue">R$ ${item.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          </div>
        </div>

        <h3>Detalhamento das Despesas por Categoria</h3>
        <table>
          <thead>
            <tr>
              <th>Categoria de Despesa</th>
              <th>Percentual do Total</th>
              <th style="text-align: right;">Valor Realizado (R$)</th>
            </tr>
          </thead>
          <tbody>
            ${(item.categoriasDespesa || []).map(cat => {
              const pct = item.despesas > 0 ? ((cat.valor / item.despesas) * 100).toFixed(1) : 0;
              return `
                <tr>
                  <td><strong>${cat.nome}</strong></td>
                  <td>${pct}%</td>
                  <td style="text-align: right;">R$ ${cat.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          Condomínio Modern Life Residence &bull; Sistema Integrado de Transparência &bull; Gestão Síndico Carlos Eduardo
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  },

  // Generates CSV / Excel spreadsheet
  exportToExcel(filename, headers, rows) {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += headers.join(';') + '\n';
    
    rows.forEach(row => {
      csvContent += row.map(val => `"${val}"`).join(';') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
