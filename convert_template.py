import subprocess
import os

ps_script = """
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
$pres = $ppt.Presentations.Open('C:\\Users\\deepa\\Downloads\\ppt_template (2).ppt', [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
$pres.SaveAs('C:\\Users\\deepa\\OneDrive\\Desktop\\AxisArchitecture\\ppt_template.pptx', 24)
$pres.Close()
$ppt.Quit()
Write-Host 'CONVERTED_OK'
"""

res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_script], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
