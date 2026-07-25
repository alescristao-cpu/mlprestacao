/**
 * Google Apps Script - Condomínio Modern Life Residence
 * Preenchimento Automático em Tempo Real para Conferência na Tela
 * 
 * Colunas da Planilha:
 * [ Data ] | [ Horário ] | [ Nome ] | [ Unidade ] | [ Área ]
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Se a planilha estiver vazia, cria os cabeçalhos formatados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data",
        "Horário",
        "Nome",
        "Unidade",
        "Área"
      ]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#2E6B42").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    // Adiciona o agendamento em tempo real
    sheet.appendRow([
      data.data,
      data.horario,
      data.moradorNome,
      data.apartamento,
      data.area
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("API de Agendamentos Modern Life Residence Ativa!");
}
