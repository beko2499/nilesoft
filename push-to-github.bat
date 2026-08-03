@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo   NILESOFT - Push project to GitHub
echo ==========================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [X] Git is not installed.
  echo     Download it from: https://git-scm.com/download/win
  echo     Then run this file again.
  pause
  exit /b 1
)

if not exist ".git" (
  echo [1/5] Initializing repository...
  git init -b main >nul
) else (
  echo [1/5] Repository already initialized.
)

echo [2/5] Staging files...
git add -A

echo [3/5] Creating commit...
git commit -m "NILESOFT landing page - site, demos and assets" >nul 2>&1
if errorlevel 1 echo      (nothing new to commit - continuing)

echo [4/5] Connecting to GitHub...
where gh >nul 2>&1
if errorlevel 1 goto MANUAL

gh auth status >nul 2>&1
if errorlevel 1 goto MANUAL

echo      GitHub CLI detected - creating the repository automatically.
set /p REPONAME="      Repository name [nilesoft-landing]: "
if "%REPONAME%"=="" set REPONAME=nilesoft-landing
gh repo create %REPONAME% --public --source=. --remote=origin --push
if errorlevel 1 goto MANUAL
goto DONE

:MANUAL
echo.
echo      Create an EMPTY repository here (no README, no .gitignore):
echo      https://github.com/new
echo.
set /p REPOURL="      Paste the repository URL (https://github.com/user/repo.git): "
if "%REPOURL%"=="" (
  echo [X] No URL entered. Exiting.
  pause
  exit /b 1
)
git remote remove origin >nul 2>&1
git remote add origin %REPOURL%
echo [5/5] Pushing...
git push -u origin main
if errorlevel 1 (
  echo.
  echo [X] Push failed. Check the URL and your GitHub sign-in, then try again.
  pause
  exit /b 1
)

:DONE
echo.
echo ==========================================
echo   Done. Project is on GitHub.
echo.
echo   To publish the live site:
echo   Settings ^> Pages ^> Branch: main / root ^> Save
echo ==========================================
echo.
pause
