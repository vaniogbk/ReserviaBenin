@echo off
title Reservia Benin - Demarrage Soutenance
color 0A

echo ============================================
echo    RESERVIA BENIN - Demarrage pour demo
echo ============================================
echo.

echo [1/3] Verification du backend Laravel...
curl -s http://127.0.0.1:8765/api/v1/hebergements?per_page=1 >nul 2>&1
if %errorlevel% NEQ 0 (
    echo    Backend non detecte sur le port 8765.
    echo    Lance d'abord : php artisan serve --host=127.0.0.1 --port=8765 --docroot=public
    echo    dans le dossier reservia\backend
    echo.
    pause
    exit /b 1
) else (
    echo    Backend OK sur http://127.0.0.1:8765
)

echo.
echo [2/3] Demarrage du tunnel public (URL fixe)...
echo    URL : https://reservia-benin-api.loca.lt
echo    Ne ferme PAS cette fenetre pendant la soutenance !
echo.
echo [3/3] Vercel est deja configure avec cette URL.
echo    Frontend : https://reserviabenin.vercel.app
echo.
echo ============================================
echo    Tout est pret ! Lance ta soutenance.
echo    Ferme cette fenetre pour arreter le tunnel.
echo ============================================
echo.

node tunnel.js
