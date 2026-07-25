/**
 * Google Apps Script - Condomínio Modern Life Residence
 * Integração Automática de Agendamentos (Piscina e Academia) no Google Sheets
 * 
 * Instruções:
 * 1. Abra o Google Sheets (planilha.google.com) e crie uma nova planilha "Agendamentos Modern Life".
 * 2. Clique no menu superior "Extensões" > "Apps Script".
 * 3. Substitua todo o código que aparecer pelo código abaixo.
 * 4. Clique no botão "Implantar" (Deploy) > "Nova implantação" (New Deployment).
 * 5. Selecione o tipo "Web app" (App da Web).
 * 6. Em "Quem tem acesso" (Who has access), escolha "Qualquer pessoa" (Anyone).
 * 7. Clique em "Implantar" e copie o link (URL do app da Web).
 * 8. Cole o link no painel do sistema no portal.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Se a planilha estiver vazia, cria os cabeçalhos formatados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data do Registro",
        "Área Comum",
        "Data do Uso",
        "Horário (de hora em hora)",
        "Nome do Morador",
        "Apartamento / Bloco",
        "E-mail",
        "Status"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#2E6B42").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    // Adiciona o novo agendamento na planilha automaticamente
    sheet.appendRow([
      new Date().toLocaleString("pt-BR"),
      data.area,
      data.data,
      data.horario,
      data.moradorNome,
      data.apartamento || "Apto Morador",
      data.email || "condominio.modern.life@gmail.com",
      data.status || "Confirmado"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("API de Agendamentos Modern Life Residence ativa com sucesso!");
}
