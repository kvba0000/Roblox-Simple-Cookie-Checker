@echo off
cd src
cls
goto start

:start (
    call npm i
    if errorlevel 0 goto end else goto end
)

:error (
    rem Bruh why did you not follow the instructions?
    rem and now trying to fix script like you know what you're doing.
    rem
    rem Bro, Script is fine, you just broke it by not installing dependencies.
    rem Install node and try again.
    cls
    echo.
    echo You need Node.js and npm to run this program.
    echo Please install Node.js and npm and try again.
    echo Download Link: https://nodejs.org/en/download/
    echo.
    pause
    exit /b 1
)

:end (
    cls
    echo.
    echo Installation Complete.
    echo To run the program, run start.bat.
    echo.
    pause
    exit /b 0
)