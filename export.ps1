$root = (Get-Location).Path
$out  = Join-Path $root "all_code.txt"

$skipDirNames = @('node_modules', '.git', 'dist', 'build', '.next', '.turbo', 'coverage')

$enc = New-Object System.Text.UTF8Encoding($false)  # UTF-8 без BOM
$sw  = New-Object System.IO.StreamWriter($out, $false, $enc)

try {
  Get-ChildItem -Path $root -Recurse -File -Force |
    Where-Object { $_.DirectoryName -notmatch '\\(' + ($skipDirNames -join '|') + ')\\' } |
    Sort-Object FullName |
    ForEach-Object {
      $sw.WriteLine("===== FILE: $($_.FullName) =====")
      $sw.WriteLine()

      try {
        $text = Get-Content -LiteralPath $_.FullName -Raw -ErrorAction Stop
        $sw.WriteLine($text)
      } catch {
        $sw.WriteLine("<<SKIPPED: cannot read as text>>")
      }

      $sw.WriteLine()
      $sw.WriteLine()
    }
}
finally {
  $sw.Close()
}
