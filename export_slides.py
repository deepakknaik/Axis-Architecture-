import subprocess
import os

ps = """
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
$pres = $ppt.Presentations.Open('C:\\Users\\deepa\\OneDrive\\Desktop\\AxisArchitecture\\AXIS_ARCHITECTURE_Final_Presentation.pptx', [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
$outDir = 'C:\\Users\\deepa\\OneDrive\\Desktop\\AxisArchitecture\\slide_previews'
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir }
$pres.SaveAs($outDir, 17)
$pres.Close()
$ppt.Quit()
Write-Host 'PNG_EXPORT_COMPLETE'
"""

res = subprocess.run(["powershell", "-NoProfile", "-Command", ps], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
