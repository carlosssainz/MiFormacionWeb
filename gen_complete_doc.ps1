$rootLong = (Get-Location).Path
if ($rootLong.EndsWith('\')) { $rootLong = $rootLong.TrimEnd('\') }
$output = Join-Path $rootLong "ANTLAS_AV_COMPLETE.md"

function Build-Tree {
    param($Path, $Prefix, [System.Collections.Generic.List[string]]$Lines)
    $items = Get-ChildItem -LiteralPath $Path | Sort-Object { if ($_.PSIsContainer) { 0 } else { 1 } }, Name
    $count = $items.Count
    for ($i = 0; $i -lt $count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $count - 1)
        if ($isLast) { $connector = '\--- ' } else { $connector = '+--- ' }
        $Lines.Add($Prefix + $connector + $item.Name)
        if ($item.PSIsContainer) {
            if ($isLast) { $sp = '    ' } else { $sp = '|   ' }
            Build-Tree -Path $item.FullName -Prefix ($Prefix + $sp) -Lines $Lines
        }
    }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# AntlasAV - Arbol del proyecto y codigo completo")
$lines.Add("")
$lines.Add('```')
$lines.Add((Split-Path $rootLong -Leaf) + '\')
$rootItems = Get-ChildItem -LiteralPath $rootLong | Where-Object { $_.Name -ne 'build' } | Sort-Object { if ($_.PSIsContainer) { 0 } else { 1 } }, Name
$count = $rootItems.Count
for ($i = 0; $i -lt $count; $i++) {
    $item = $rootItems[$i]
    $isLast = ($i -eq $count - 1)
    if ($isLast) { $connector = '\--- ' } else { $connector = '+--- ' }
    $lines.Add($connector + $item.Name)
    if ($item.PSIsContainer) {
        if ($isLast) { $subPrefix = '    ' } else { $subPrefix = '|   ' }
        Build-Tree -Path $item.FullName -Prefix $subPrefix -Lines $lines
    }
}
$lines.Add('```')
$lines.Add('')

# --- Process source files ---
$extensions = @('.c', '.cpp', '.h', '.hpp', '.cmake', '.txt', '.bat', '.ps1', '.inf', '.json', '.md')
$files = Get-ChildItem -LiteralPath $rootLong -Recurse -File | Where-Object {
    $f = $_.FullName
    $f -notmatch '\\build\\' -and
    $f -notmatch '\\ANTLAS_AV_COMPLETE.md$' -and
    $f -notmatch '\\gen_complete_doc.ps1$' -and
    $extensions -contains $_.Extension.ToLower()
} | Sort-Object FullName

$rootLen = $rootLong.Length + 1
$done = @{}
$i = 0
$total = $files.Count

foreach ($f in $files) {
    $relPath = $f.FullName.Substring($rootLen)
    $key = $relPath.ToLower()
    if ($done.ContainsKey($key)) { continue }
    $done[$key] = $true
    $i++

    $lines.Add("---")
    $lines.Add('## ``' + $relPath + '``')

    $ext = $f.Extension.ToLower()
    $lang = switch ($ext) {
        '.c'     { 'c' }
        '.cpp'   { 'cpp' }
        '.h'     { 'c' }
        '.hpp'   { 'cpp' }
        '.cmake' { 'cmake' }
        '.txt'   { 'text' }
        '.bat'   { 'batch' }
        '.ps1'   { 'powershell' }
        '.inf'   { 'ini' }
        '.json'  { 'json' }
        '.md'    { 'markdown' }
        default  { 'text' }
    }

    $codeFence = '```' + $lang
    $lines.Add($codeFence)
    try {
        $content = Get-Content -LiteralPath $f.FullName -Raw -ErrorAction Stop
        $lines.Add($content.TrimEnd())
    } catch {
        $lines.Add("ERROR: Could not read file")
    }
    $lines.Add('```')
}

$result = $lines -join "`r`n"
[System.IO.File]::WriteAllText($output, $result, [System.Text.Encoding]::UTF8)
Write-Host "Done: $output ($($lines.Count) lines, $i files)"
