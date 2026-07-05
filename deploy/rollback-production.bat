@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set CONFIG_FILE=%~dp0production.config.bat

if not exist "%CONFIG_FILE%" (
  echo [ERROR] Missing %CONFIG_FILE%
  exit /b 1
)

call "%CONFIG_FILE%"

where ssh >nul 2>nul
if errorlevel 1 (
  echo [ERROR] ssh was not found in PATH.
  exit /b 1
)

where scp >nul 2>nul
if errorlevel 1 (
  echo [ERROR] scp was not found in PATH.
  exit /b 1
)

for %%V in (DEPLOY_HOST DEPLOY_PORT DEPLOY_USER APP_DIR APP_DOMAIN APP_PORT APP_BRANCH) do (
  if "!%%V!"=="" (
    echo [ERROR] Missing required config value %%V.
    exit /b 1
  )
)

set REMOTE_SCRIPT=/tmp/aera-nail-rollback.sh

echo [INFO] Uploading rollback script...
scp -P "%DEPLOY_PORT%" "%~dp0..\scripts\deploy\aapanel\rollback.sh" "%DEPLOY_USER%@%DEPLOY_HOST%:%REMOTE_SCRIPT%"
if errorlevel 1 (
  echo [ERROR] Failed to upload rollback script.
  exit /b 1
)

echo [INFO] Running code rollback on %DEPLOY_HOST%...
ssh -p "%DEPLOY_PORT%" "%DEPLOY_USER%@%DEPLOY_HOST%" "chmod +x %REMOTE_SCRIPT% && %REMOTE_SCRIPT% --app-dir '%APP_DIR%' --branch '%APP_BRANCH%' --domain '%APP_DOMAIN%' --port '%APP_PORT%'"
if errorlevel 1 (
  echo [ERROR] Rollback failed.
  exit /b 1
)

echo [OK] Rollback finished.
exit /b 0
