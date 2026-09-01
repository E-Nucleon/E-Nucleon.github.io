$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

# ---- Check Git ----
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host 'Git not found. Please install Git for Windows.' -ForegroundColor Red
  exit 1
}

# ---- Init repo if needed ----
& git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Initializing Git repo...' -ForegroundColor Cyan
  git init
  git branch -M main
  $repo = Read-Host 'Enter GitHub repo URL (e.g. https://github.com/user/repo.git)'
  if (-not $repo) { Write-Host 'Cancelled.' -ForegroundColor Red; exit 1 }
  git remote add origin $repo
}

# ---- Check origin ----
& git remote get-url origin *> $null
if ($LASTEXITCODE -ne 0) {
  $repo = Read-Host 'No origin configured. Enter GitHub repo URL'
  if (-not $repo) { exit 1 }
  git remote add origin $repo
}

# ---- Git identity ----
$name = (& git config user.name).Trim()
$email = (& git config user.email).Trim()
if (-not $name) { git config --local user.name 'E-Nucleon' }
if (-not $email) { git config --local user.email 'E-Nucleon@users.noreply.github.com' }

# ---- Status ----
Write-Host ''
Write-Host '====== Status ======' -ForegroundColor Cyan
& git -c core.quotepath=false status -sb
Write-Host ('Remote: ' + (& git remote get-url origin)) -ForegroundColor DarkGray

# ---- Stage ----
Write-Host ''
Write-Host '[1/3] Staging...' -ForegroundColor Cyan
& git add -A

# ---- Commit ----
& git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host 'No changes to commit. Trying push directly...' -ForegroundColor DarkGray
} else {
  $defaultMsg = 'site update ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
  $msg = Read-Host "Commit message (Enter for: $defaultMsg)"
  if (-not $msg) { $msg = $defaultMsg }
  Write-Host '[2/3] Committing...' -ForegroundColor Cyan
  & git commit -m $msg
  if ($LASTEXITCODE -ne 0) { Write-Host 'Commit failed.' -ForegroundColor Red; exit 1 }
  Write-Host 'Committed.' -ForegroundColor Green
}

# ---- Detect proxy ----
function Find-Proxy {
  foreach ($p in 6789, 7890, 7897, 10809, 10808, 1080) {
    $c = New-Object System.Net.Sockets.TcpClient
    try {
      $r = $c.BeginConnect('127.0.0.1', $p, $null, $null)
      if ($r.AsyncWaitHandle.WaitOne(200) -and $c.Connected) {
        $c.EndConnect($r)
        return ('http://127.0.0.1:' + $p)
      }
    } catch {} finally { $c.Dispose() }
  }
  return $null
}

$proxy = Find-Proxy
$branch = (& git branch --show-current).Trim()
if (-not $branch) { $branch = 'main' }

# ---- Push ----
Write-Host ''
Write-Host "[3/3] Pushing to GitHub (branch: $branch)..." -ForegroundColor Cyan
if ($proxy) {
  Write-Host ('Using proxy: ' + $proxy) -ForegroundColor Yellow
  & git -c "http.proxy=$proxy" -c "https.proxy=$proxy" -c http.version=HTTP/1.1 push -u origin $branch
} else {
  Write-Host 'Direct connection (no proxy)' -ForegroundColor DarkGray
  & git push -u origin $branch
}

if ($LASTEXITCODE -eq 0) {
  Write-Host ''
  Write-Host 'Push OK!' -ForegroundColor Green
  Write-Host 'GitHub Pages: https://e-nucleon.github.io/' -ForegroundColor Green
} else {
  Write-Host ''
  Write-Host 'Push failed. Check errors above.' -ForegroundColor Red
  Write-Host 'Tip: enable proxy/VPN and retry.' -ForegroundColor Yellow
  exit 1
}

Write-Host ''
$again = Read-Host 'Enter to exit / r to retry'
if ($again -eq 'r') { & powershell -File $PSCommandPath }
