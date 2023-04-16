import axios from "axios";
import { readFileSync, writeFileSync, existsSync } from "fs";
import config from "./config.js";
import { colors, wait } from "./helper.js";

const main = async () => {

    let missingFiles = []; // Check if needed files are missing
    if(["./config.js", "./cookies.txt"].some(file => {
        const notExisting = !existsSync(file)
        if(notExisting) missingFiles.push(file);
        return notExisting;
    })) return console.log(`${colors.fg.red}[-] Missing files: ${missingFiles.join(", ")}, please check your files or re-download the project.${colors.reset}`);

    // Cookies stuff
    let cookiesNoDuplics,
        cookies = readFileSync("./cookies.txt").toString().replace(/\r\n/g, "\n").trim().split("\n"); // cookies (raw)
    if(config.removeDuplicates) cookiesNoDuplics = [...new Set(cookies)]; // cookies (no duplicates if true)

    if(cookies.length == 0) return console.log(`${colors.fg.red}[-] No cookies found!${colors.reset}`); // Signaling user didn't provide any cookies

    // Removing duplicates if enabled
    if(cookies.length - cookiesNoDuplics.length > 0) {
        console.log(`${colors.fg.yellow}[!] Removed ${cookies.length - cookiesNoDuplics.length} duplicate cookies${colors.reset}`); // Signaling user about removed duplicates (if enabled and there are any)
        cookies = cookiesNoDuplics;

        await wait(1000); // Wait 1 second before continuing
    }

    let validCookies = [],
        loginURL = "https://www.roblox.com/login", // roblox login url
        threads = 0, // threads script now using
        max_thread = (config.multithreading.enabled ? config.multithreading.threads : 1), //  max threads script can use
        checked = 0; // cookies checked

    const checkCookie = async (cookie) => {
        threads++;

        let error = false,
            headers = {
                "Cookie": `.ROBLOSECURITY=${cookie};`
            },
            resp = await axios.get(loginURL, { headers }).catch(() => error = true);
        if(!error && loginURL !== resp.request._redirectable._currentUrl) validCookies.push(cookie);

        threads--;
        checked++;
    }

    const updateConsole = () => {
        console.clear();
        console.log([
            `${colors.bg.blue}[🍪] Roblox Simple Cookies Checker${colors.reset}`,
            `${colors.fg.green}[✅] Valid: ${validCookies.length}${colors.reset}`,
            `${colors.fg.red}[❌] Invalid: ${cookies.length - validCookies.length}${colors.reset}`,
            `${colors.fg.yellow}[⚠] Checked: ${checked}/${cookies.length}${colors.reset}`,
        ].join("\n"))
    }

    for(let cookie of cookies) {
        while(threads >= max_thread) await wait(100);
        checkCookie(cookie);
        updateConsole();
    }

    while(threads > 0) await wait(100);

    updateConsole();

    if(validCookies.length > 0) {
        writeFileSync("./validCookies.txt", validCookies.join("\n"));
        console.log(`${colors.bg.green}[✅] Saved valid cookies to validCookies.txt${colors.reset}`);
    }else console.log(`${colors.bg.red}[❌] No valid cookies were found!${colors.reset}`);
    
    console.log(colors.fg.green + `\n\n@kob.kuba\n\n` + colors.reset)

}

main();