param([string]$Source = 'D:\agricolaoldnice')
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cards = Get-Content -LiteralPath (Join-Path $projectRoot 'reference\classic\source-cards.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$destination = Join-Path $projectRoot 'public\card-art\classic'
$copies = @()
$missing = @()
foreach ($card in $cards) {
    $prefix = ($card.id -split '_')[0]
    $deck = [string]$card.meta.deck
    $padded = $deck + ([int]$card.meta.number).ToString('000')
    $candidatePaths = @(
        (Join-Path $Source "img\deck$deck\$prefix.png"),
        (Join-Path $Source "img\deck$deck\$padded.png")
    )
    $found = $candidatePaths | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
    if ($found) { $copies += @{ From = $found; To = (Join-Path $destination "$prefix.png") } }
    else { $missing += $card.id }
}
if ($missing.Count) { throw "Missing $($missing.Count) source pictures: $($missing -join ', '). Supply the directory containing the original img folder." }
New-Item -ItemType Directory -Path $destination -Force | Out-Null
foreach ($item in $copies) { Copy-Item -LiteralPath $item.From -Destination $item.To -Force }
Write-Host "Restored $($copies.Count) classic card pictures to $destination"
