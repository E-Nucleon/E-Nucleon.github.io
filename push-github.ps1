$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Step([string]$msg) {
  Write-Host $msg -ForegroundColor Cyan
}

function Write-OK([string]$msg) {
  Write-Host $msg -ForegroundColor Green
}

function Write-Err([string]$msg) {
  Write-Host $msg -ForegroundColor Red
}

# —— 检查 Git ——
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Err '未找到 Git，请先安装 Git for Windows。'
  exit 1
}

# —— 检查仓库 ——
& git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Step '初始化 Git 仓库...'
  git init
  git branch -M main
  $repo = Read-Host '请输入 GitHub 仓库地址（如 https://github.com/E-Nucleon/nucleon-site.git）'
  if (-not $repo) { Write-Err '未输入仓库地址，已取消。'; exit 1 }
  git remote add origin $repo
}

# —— 检查 origin ——
& git remote get-url origin *> $null
if ($LASTEXITCODE -ne 0) {
  $repo = Read-Host '仓库未配置 origin，请输入 GitHub 仓库地址'
  if (-not $repo) { Write-Err '未输入地址，已取消。'; exit 1 }
  git remote add origin $repo
}

# —— 确认 Git 身份 ——
$name = (& git config user.name).Trim()
$email = (& git config user.email).Trim()
if (-not $name) { git config --local user.name 'E-Nucleon' }
if (-not $email) { git config --local user.email 'E-Nucleon@users.noreply.github.com' }

# —— 显示状态 ——
Write-Host ''
Write-Host '====== 仓库状态 ======' -ForegroundColor Cyan
& git -c core.quotepath=false status -sb
Write-Host ('远程: ' + (& git remote get-url origin)) -ForegroundColor DarkGray
Write-Host ('分支: ' + (& git branch --show-current)) -ForegroundColor DarkGray

# —— 暂存 ——
Write-Host ''
Write-Step '[1/3] 暂存文件...'
& git add -A

# —— 检查有无改动 ——
& git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host '没有需要提交的改动，直接尝试推送...' -ForegroundColor DarkGray
} else {
  $defaultMsg = 'site update ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
  $msg = Read-Host ("提交说明（回车使用: $defaultMsg）")
  if (-not $msg) { $msg = $defaultMsg }

  Write-Step '[2/3] 提交...'
  & git commit -m $msg
  if ($LASTEXITCODE -ne 0) { Write-Err '提交失败'; exit 1 }
  Write-OK '已提交'
}

# —— 检测本地代理 ——
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

Write-Host ''
Write-Step "[3/3] 推送到 GitHub（分支: $branch）..."
if ($proxy) {
  Write-Host ('检测到本地代理: ' + $proxy) -ForegroundColor Yellow
  & git -c "http.proxy=$proxy" -c "https.proxy=$proxy" -c http.version=HTTP/1.1 push -u origin $branch
} else {
  Write-Host '直连模式（无代理）' -ForegroundColor DarkGray
  & git push -u origin $branch
}

if ($LASTEXITCODE -eq 0) {
  Write-Host ''
  Write-OK '推送成功！'
  Write-Host 'GitHub Pages: https://e-nucleon.github.io/' -ForegroundColor Green
} else {
  Write-Host ''
  Write-Err '推送失败，请查看上方 Git 错误信息。'
  Write-Host '提示：如果网络不通，尝试开启代理后重新运行。' -ForegroundColor Yellow
  exit 1
}

Write-Host ''
$again = Read-Host '回车退出 / r 重新推送'
if ($again -eq 'r') { & powershell -File $PSCommandPath }
