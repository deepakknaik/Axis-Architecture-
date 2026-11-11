import subprocess
import os

ps = """
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
$src = 'C:\\Users\\deepa\\OneDrive\\Desktop\\AxisArchitecture\\AXIS_ARCHITECTURE_Final_Presentation.pptx'
$pres = $ppt.Presentations.Open($src, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)

# Save as .pptx on Desktop
$pres.SaveAs('C:\\Users\\deepa\\OneDrive\\Desktop\\AXIS_ARCHITECTURE_Presentation.pptx', 24)

# Save as .ppt (97-2003) on Desktop
$pres.SaveAs('C:\\Users\\deepa\\OneDrive\\Desktop\\AXIS_ARCHITECTURE_Presentation.ppt', 1)

$pres.Close()
$ppt.Quit()
Write-Host 'DUAL_FORMAT_SAVED_OK'
"""

res = subprocess.run(["powershell", "-NoProfile", "-Command", ps], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
