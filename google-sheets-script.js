/**
 * Google Apps Script - Condomínio Modern Life Residence
 * Conta oficial: condominio.modern.life@gmail.com
 * 
 * 📌 GERAÇÃO DE PLANILHAS DIÁRIAS (piscina_YYYY-MM-DD.xls e academia_YYYY-MM-DD.xls)
 * 📌 RETENÇÃO AUTOMÁTICA DE 30 DIAS: Planilhas com mais de 30 dias são excluídas automaticamente do Google Drive.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var area = (data.area || "").toString().toLowerCase();
    var dataUso = data.data || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Define o prefixo e nome da planilha diária
    var prefixo = area.indexOf("piscina") !== -1 ? "piscina" : "academia";
    var fileName = prefixo + "_" + dataUso + ".xls";

    // Cria ou recupera a planilha do dia no Google Drive
    var spreadsheet = getOrCreateDailySpreadsheet(fileName, dataUso, area);
    var sheet = spreadsheet.getActiveSheet();

    // Se a planilha estiver vazia, adiciona os cabeçalhos formatados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data do Uso",
        "Horário",
        "Nome do Morador",
        "Unidade / Apto",
        "Área Comum",
        "E-mail",
        "Data do Registro no Sistema"
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#2E6B42").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Registra a linha do agendamento
    sheet.appendRow([
      dataUso,
      data.horario,
      data.moradorNome,
      data.apartamento,
      data.area,
      data.email || "",
      new Date().toLocaleString("pt-BR")
    ]);

    // Executa a limpeza automática de planilhas com mais de 30 dias
    cleanupOldSpreadsheets(30);

    return ContentService.createTextOutput(JSON.stringify({ 
      "result": "success", 
      "file": fileName,
      "message": "Agendamento registrado na planilha diária " + fileName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      "result": "error", 
      "message": error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Cria ou busca a planilha diária específica da data
 */
function getOrCreateDailySpreadsheet(fileName, dateStr, area) {
  var files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  } else {
    var cleanName = fileName.replace(".xls", "");
    var cleanFiles = DriveApp.getFilesByName(cleanName);
    if (cleanFiles.hasNext()) {
      return SpreadsheetApp.open(cleanFiles.next());
    }
    // Cria a nova planilha diária no Google Drive
    var newSs = SpreadsheetApp.create(fileName);
    return newSs;
  }
}

/**
 * Limpa e apaga do Google Drive planilhas diárias (piscina_* e academia_*) com mais de 30 dias
 */
function cleanupOldSpreadsheets(diasRetencao) {
  try {
    var hoje = new Date();
    var limiteMs = (diasRetencao || 30) * 24 * 60 * 60 * 1000;
    
    // Procura planilhas de piscina e academia no Drive
    var padroes = ["piscina_", "academia_"];
    
    for (var p = 0; p < padroes.length; p++) {
      var files = DriveApp.searchFiles("name contains '" + padroes[p] + "' and trashed = false");
      
      while (files.hasNext()) {
        var file = files.next();
        var dataCriacao = file.getDateCreated();
        var idadeMs = hoje.getTime() - dataCriacao.getTime();
        
        // Se a planilha tiver mais de 30 dias de criada, move para a lixeira (apaga)
        if (idadeMs > limiteMs) {
          file.setTrashed(true);
        }
      }
    }
  } catch (e) {
    Logger.log("Erro na limpeza de 30 dias: " + e.toString());
  }
}

function doGet(e) {
  return ContentService.createTextOutput("API de Planilhas Diárias (Retenção 30 Dias) Ativa no Google Drive de condominio.modern.life@gmail.com!");
}
