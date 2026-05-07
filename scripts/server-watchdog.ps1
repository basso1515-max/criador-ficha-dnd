param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$HostName = "127.0.0.1",
  [int]$Port = 8000,
  [int]$RestartDelaySeconds = 5,
  [int]$HealthCheckSeconds = 30,
  [switch]$Once
)

$ErrorActionPreference = "Stop"

function Write-WatchdogLog {
  param([string]$Message)

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[$timestamp] $Message"
  Write-Host $line
  Add-Content -Path $script:LogFile -Value $line -Encoding UTF8
}

function Test-ServerReady {
  try {
    $response = Invoke-WebRequest `
      -Uri "http://$HostName`:$Port/api/account/current" `
      -UseBasicParsing `
      -TimeoutSec 3

    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$outDir = Join-Path $ProjectRoot "out"
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

$script:LogFile = Join-Path $outDir "server-watchdog.log"
$npm = Get-Command npm -ErrorAction Stop

Set-Location $ProjectRoot
Write-WatchdogLog "Watchdog iniciado para http://$HostName`:$Port em $ProjectRoot"

while ($true) {
  if (Test-ServerReady) {
    Write-WatchdogLog "Servidor ja esta ativo; monitorando."

    if ($Once) {
      break
    }

    do {
      Start-Sleep -Seconds $HealthCheckSeconds
    } while (Test-ServerReady)

    Write-WatchdogLog "Servidor deixou de responder; tentando reativar."
  }

  $env:HOST = $HostName
  $env:PORT = [string]$Port

  Write-WatchdogLog "Iniciando npm run serve."
  & $npm.Source run serve 2>&1 | ForEach-Object {
    Write-WatchdogLog "server: $_"
  }

  $exitCode = $LASTEXITCODE
  Write-WatchdogLog "npm run serve encerrou com codigo $exitCode."

  if ($Once) {
    break
  }

  Start-Sleep -Seconds $RestartDelaySeconds
}
