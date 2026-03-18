Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

appDir = FSO.GetParentFolderName(WScript.ScriptFullName)

' Start the Node.js server from this repo's app directory.
WshShell.Run "cmd /c cd /d """ & appDir & """ && node server.js", 0, False

' Wait for the server to spin up.
WScript.Sleep 2000

' Open the application in the default browser.
WshShell.Run "http://127.0.0.1:3000"
