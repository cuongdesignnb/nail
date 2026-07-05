@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set CONFIG_FILE=%~dp0production.config.bat

if not exist "%CONFIG_FILE%" (
  echo [ERROR] Missing %CONFIG_FILE%
  echo Copy production.config.bat.example to production.config.bat and edit it.
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

for %%V in (DEPLOY_HOST DEPLOY_PORT DEPLOY_USER APP_DIR APP_DOMAIN APP_PORT APP_BRANCH GIT_REPO BOOTSTRAP_OWNER_EMAIL) do (
  if "!%%V!"=="" (
    echo [ERROR] Missing required config value %%V.
    exit /b 1
  )
)

set REMOTE_SCRIPT=/tmp/aera-nail-deploy.sh

echo [INFO] Uploading deployment script...
scp -P "%DEPLOY_PORT%" "%~dp0..\scripts\deploy\aapanel\deploy.sh" "%DEPLOY_USER%@%DEPLOY_HOST%:%REMOTE_SCRIPT%"
if errorlevel 1 (
  echo [ERROR] Failed to upload deployment script.
  exit /b 1
)

echo [INFO] Running production deployment on %DEPLOY_HOST%...
ssh -p "%DEPLOY_PORT%" "%DEPLOY_USER%@%DEPLOY_HOST%" "chmod +x %REMOTE_SCRIPT% && %REMOTE_SCRIPT% --app-dir '%APP_DIR%' --repo '%GIT_REPO%' --branch '%APP_BRANCH%' --domain '%APP_DOMAIN%' --port '%APP_PORT%' --owner-email '%BOOTSTRAP_OWNER_EMAIL%'"
if errorlevel 1 (
  echo [ERROR] Production deployment failed.
  exit /b 1
)

echo [OK] Production deployment finished.
exit /b 0
