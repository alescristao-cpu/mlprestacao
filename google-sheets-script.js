/**
 * Google Apps Script - Condomínio Modern Life Residence
 * Conta oficial: condominio.modern.life@gmail.com
 * 
 * Envio automático de agendamentos para as planilhas:
 * 🏊 piscina.xls (para reservas de Piscina)
 * 🏋️ academia.xls (para reservas de Academia)
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var area = (data.area || "").toString().toLowerCase();
    
    // Define o nome da planilha de destino no Google Drive
    var fileName = area.indexOf("piscina") !== -1 ? "piscina.xls" : "academia.xls";
    var sheetName = area.indexOf("piscina") !== -1 ? "Piscina" : "Academia";

    var spreadsheet = getOrCreateSpreadsheet(fileName);
    var sheet = spreadsheet.getActiveSheet();

    // Se a planilha estiver vazia, adiciona os cabeçalhos formatados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data",
        "Horário",
        "Nome do Morador",
        "Unidade / Apto",
        "Área Comum",
        "E-mail",
        "Data do Registro"
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#2E6B42").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Registra a reserva
    sheet.appendRow([
      data.data,
      data.horario,
      data.moradorNome,
      data.apartamento,
      data.area,
      data.email || "",
      new Date().toLocaleString("pt-BR")
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "file": fileName }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Localiza a planilha no Google Drive ou cria uma nova se não existir
 */
function getOrCreateSpreadsheet(fileName) {
  var files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    var file = files.next();
    return SpreadsheetApp.open(file);
  } else {
    // Procura também sem a extensão .xls se não achar
    var cleanName = fileName.replace(".xls", "");
    var cleanFiles = DriveApp.getFilesByName(cleanName);
    if (cleanFiles.hasNext()) {
      return SpreadsheetApp.open(cleanFiles.next());
    }
    // Se não existir nenhuma das duas no Google Drive, cria a nova planilha automaticamente
    var newSs = SpreadsheetApp.create(fileName);
    return newSs;
  }
}

function doGet(e) {
  return ContentService.createTextOutput("API de Agendamentos (piscina.xls / academia.xls) Ativa no Google Drive de condominio.modern.life@gmail.com!");
}
