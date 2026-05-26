param(
  [string]$TaskName = "SheetifyServer"
)

$ErrorActionPreference = "Stop"

$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if (!$task) {
  Write-Host "Tarefa agendada '$TaskName' nao encontrada."
  exit 0
}

Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host "Tarefa agendada '$TaskName' removida."
