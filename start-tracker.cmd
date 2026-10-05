@echo off
setlocal
set "TRACKER_NODE=C:\Users\Welcome\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

curl.exe -fs http://localhost:3000/ 2>nul | findstr /C:"Lead Status | CRMS" >nul
if %errorlevel% equ 0 (
  echo The CRMS Lead Status Tracker is already running.
  echo Open http://localhost:3000 in your browser.
  exit /b 0
)

where node.exe >nul 2>nul
if %errorlevel% equ 0 (
  node.exe "%~dp0server.mjs"
  exit /b %errorlevel%
)

if exist "%TRACKER_NODE%" (
  "%TRACKER_NODE%" "%~dp0server.mjs"
  exit /b %errorlevel%
)

echo Node.js was not found.
echo Install the Node.js LTS release from https://nodejs.org/ and reopen PowerShell.
exit /b 1
