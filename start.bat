@echo off
cd src
goto start

:start (
    call npm start
    if errorlevel 0 goto end else goto start2 (
)

rem Putting both ways here just in case if someone gonna try to modify it.
rem But why would they...

:start2 (
    call node .
    if errorlevel 0 goto end else goto error
)

:error (
    echo.
    echo Something went wrong.
    echo If problem persists, please contact the author.
    echo.
    echo For now maybe try running this program manually.
    echo.
    pause
    exit /b 1
)

:end (
    echo.
    pause
    exit /b 0
)