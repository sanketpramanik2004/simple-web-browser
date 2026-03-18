Set WshShell = CreateObject("WScript.Shell")

' Change directory to the app folder and start the Node.js server
WshShell.Run "cmd /c cd C:\Users\Asus\.gemini\antigravity\scratch\simple-browser-app && node server.js", 0, False

' Wait for the server to spin up (2 seconds)
WScript.Sleep 2000

' Open the application in the default browser
WshShell.Run "http://localhost:3000"
