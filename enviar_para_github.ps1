# Script de Integração Automática com GitHub
# Repositório Destino: https://github.com/alescristao-cpu/mlprestacao.git

Write-Host "=======================================================" -ForegroundColor Green
Write-Host " Integracao com GitHub: Modern Life Residence " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green

$repoUrl = "https://github.com/alescristao-cpu/mlprestacao.git"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Git nao foi detectado no PATH do Windows." -ForegroundColor Yellow
    Write-Host "[i] Voce pode instalar o Git em: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "[i] Ou publicar diretamente pelo GitHub Desktop ou VS Code." -ForegroundColor Cyan
    Exit
}

Write-Host "[+] Inicializando repositorio Git local..." -ForegroundColor Cyan
git init
git remote remove origin 2>$null
git remote add origin $repoUrl
git branch -M main

Write-Host "[+] Adicionando arquivos..." -ForegroundColor Cyan
git add .

Write-Host "[+] Criando Commit..." -ForegroundColor Cyan
git commit -m "Sistema Web Responsivo para Prestação de Contas e Transparência do Condomínio Modern Life Residence"

Write-Host "[+] Enviando arquivos para https://github.com/alescristao-cpu/mlprestacao.git..." -ForegroundColor Cyan
git push -u origin main

Write-Host "=======================================================" -ForegroundColor Green
Write-Host " Finalizado com Sucesso! " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
