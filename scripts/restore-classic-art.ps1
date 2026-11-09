param(
    [string]$Source = 'D:\agricolaoldnice',
    [string]$AssetsRoot = (Join-Path (Split-Path -Parent $PSScriptRoot) '..\open-agricola-assets')
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cards = Get-Content -LiteralPath (Join-Path $projectRoot 'reference\classic\source-cards.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$assetDirectory = Join-Path $AssetsRoot 'assets'
if (-not (Test-Path -LiteralPath $assetDirectory -PathType Container)) {
    throw 'Clone titanxxh/open-agricola-assets first, or supply its checkout using -AssetsRoot.'
}
$destination = Join-Path $assetDirectory 'classic'
$copies = @()
$missing = @()
foreach ($card in $cards) {
    $prefix = ($card.id -split '_')[0]
    $deck = [string]$card.meta.deck
    $padded = $deck + ([int]$card.meta.number).ToString('000')
    $sourceDecks = @($deck)
    if ($deck -eq 'BI') { $sourceDecks += 'Bi' }
    $candidatePaths = foreach ($sourceDeck in $sourceDecks) {
        Join-Path $Source "img\deck$sourceDeck\$prefix.png"
        Join-Path $Source "img\deck$sourceDeck\$padded.png"
    }
    $found = $candidatePaths | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
    if ($found) { $copies += @{ From = $found; To = (Join-Path $destination "$deck\$prefix.png") } }
    else { $missing += $card.id }
}
if ($missing.Count) { throw "Missing $($missing.Count) source pictures: $($missing -join ', '). Supply the directory containing the original img folder." }
foreach ($item in $copies) {
    New-Item -ItemType Directory -Path (Split-Path -Parent $item.To) -Force | Out-Null
    Copy-Item -LiteralPath $item.From -Destination $item.To -Force
}
Write-Host "Restored $($copies.Count) classic card pictures to $destination"
