param(
  [string]$TaskName = "CriadorFichaDndServer",
  [string]$HostName = "127.0.0.1",
  [int]$Port = 8000
)

$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($task) {
  $taskInfo = Get-ScheduledTaskInfo -TaskName $TaskName -ErrorAction SilentlyContinue
  Write-Host "Tarefa: $($task.TaskName) ($($task.State))"
  if ($taskInfo) {
    Write-Host "Ultima execucao: $($taskInfo.LastRunTime)"
    Write-Host "Ultimo resultado: $($taskInfo.LastTaskResult)"
  }
} else {
  Write-Host "Tarefa: nao instalada"
}

try {
  $response = Invoke-WebRequest `
    -Uri "http://$HostName`:$Port/api/account/current" `
    -UseBasicParsing `
    -TimeoutSec 3

  Write-Host "API: ativa ($($response.StatusCode)) em http://$HostName`:$Port"
} catch {
  Write-Host "API: indisponivel em http://$HostName`:$Port"
  Write-Host "Motivo: $($_.Exception.Message)"
}

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($connections) {
  $connections | Select-Object LocalAddress, LocalPort, State, OwningProcess | Format-Table
}
