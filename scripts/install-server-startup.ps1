param(
  [string]$TaskName = "CriadorFichaDndServer",
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$HostName = "127.0.0.1",
  [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path $ProjectRoot).Path
$watchdog = Join-Path $ProjectRoot "scripts\server-watchdog.ps1"
if (!(Test-Path $watchdog)) {
  throw "Watchdog nao encontrado em $watchdog"
}

$powershell = (Get-Command powershell.exe -ErrorAction Stop).Source
$arguments = @(
  "-NoProfile",
  "-ExecutionPolicy Bypass",
  "-File `"$watchdog`"",
  "-ProjectRoot `"$ProjectRoot`"",
  "-HostName `"$HostName`"",
  "-Port $Port"
) -join " "

$currentUser = "$env:USERDOMAIN\$env:USERNAME"
$action = New-ScheduledTaskAction -Execute $powershell -Argument $arguments -WorkingDirectory $ProjectRoot
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $currentUser
$principal = New-ScheduledTaskPrincipal -UserId $currentUser -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -RestartCount 3 `
  -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Principal $principal `
  -Settings $settings `
  -Description "Mantem o servidor local do Criador de Ficha D&D ativo." `
  -Force | Out-Null

Start-ScheduledTask -TaskName $TaskName

Write-Host "Tarefa agendada '$TaskName' instalada e iniciada."
Write-Host "Servidor esperado em http://$HostName`:$Port"
Write-Host "Logs em $(Join-Path $ProjectRoot 'out\server-watchdog.log')"
