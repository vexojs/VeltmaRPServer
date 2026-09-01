param(
    [string]$VeltmaRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
)

$resourceNames = @('veltma-core', 'veltma-world', 'veltma-loading')
$serverRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$targetRoot = Join-Path $serverRoot 'resources\[veltma]'

if (-not (Test-Path -LiteralPath $VeltmaRoot -PathType Container)) {
    throw "Veltma root does not exist: $VeltmaRoot"
}

New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null

foreach ($resourceName in $resourceNames) {
    $sourcePath = Join-Path $VeltmaRoot $resourceName
    $targetPath = Join-Path $targetRoot $resourceName

    if (-not (Test-Path -LiteralPath $sourcePath -PathType Container)) {
        throw "Resource repository does not exist: $sourcePath"
    }

    if (-not (Test-Path -LiteralPath (Join-Path $sourcePath 'fxmanifest.lua') -PathType Leaf)) {
        throw "Resource manifest is missing: $sourcePath\fxmanifest.lua"
    }

    if (-not (Test-Path -LiteralPath (Join-Path $sourcePath 'dist') -PathType Container)) {
        throw "Production build is missing: $sourcePath\dist. Run the resource build first."
    }

    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $sourcePath 'fxmanifest.lua') -Destination $targetPath -Force
    Copy-Item -LiteralPath (Join-Path $sourcePath 'dist') -Destination $targetPath -Recurse -Force
}

Write-Output "Synchronized $($resourceNames.Count) Veltma resources into $targetRoot"
