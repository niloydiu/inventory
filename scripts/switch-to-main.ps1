<#
PowerShell helper: switch-to-main.ps1
Run from repository root in PowerShell (Windows).
#>
Set-StrictMode -Version Latest
Write-Host "Fetching remote refs..."
git fetch origin --prune

$hasMain = git show-ref --verify --quiet refs/heads/main; if ($LASTEXITCODE -eq 0) { $true } else { $false }
if ($hasMain) {
  Write-Host "Local branch 'main' already exists. Setting upstream to origin/main..."
  git branch --set-upstream-to=origin/main main
} else {
  $remoteHasMain = (git ls-remote --exit-code --heads origin main) -eq $null; if ($LASTEXITCODE -eq 0) { $true } else { $false }
  if ($remoteHasMain) {
    Write-Host "Creating local 'main' to track origin/main..."
    git checkout -b main origin/main
  } else {
    Write-Host "Remote branch 'origin/main' not found. If you have a local 'master', rename it:"
    Write-Host "  git branch -m master main"
    exit 1
  }
}

Write-Host "Updating remote HEAD to point at main (local)"
git remote set-head origin main 2>$null || Write-Host "remote set-head failed (non-fatal)"

Write-Host "Done. You can now run: git pull"
