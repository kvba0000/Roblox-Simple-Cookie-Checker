import axios from "axios";
import {readFileSync,writeFileSync} from "fs";

/*
 Little note from the author:
 I know it looks really messy, and it is.
 Best that it works as it should and there are no problems unless someone tries to break it intentionally.
 Forks are welcome. <3
*/

(async()=>{
    console.clear(); // Clearing console from previous logs
    process.title = "why am i even putting title to this" // Setting title of process
    
    /**
     * Just some functions for things look way nicer
     * @param {Object} data - Info about progress (Array like: [done count, total count, working count]) 
     * @returns {String} Printable string
     */
    function show(data){
        var [curr,max,working] = data;
        return `
        \x1b[34m
        Roblox Simple Cookies Checker
        Created by: dgl\x1b[0m
        
        \x1b[36mProgress: ${curr}/${max}
        (${working} working...)\x1b[0m`;
    }

    // Variables
    var cookies = readFileSync("../cookies.txt").toString().replace(/\r\n/g, "\n").split("\n"), // cookies (raw)
        config = JSON.parse(readFileSync("../config.json").toString()), // config file (json)
        cookiesNoDuplicates = (config.removeDuplicates ? [...new Set(cookies)] : cookies).filter(x=>x.trim()!=""), // cookies (no duplicates if true)
        loginURL = "https://www.roblox.com/login", // roboxes login url
        threads = 0, // threads script now using
        cthreads = config.multithreading.enabled ? config.multithreading.threads : 1, // max threads script can use
        checked = 0, // cookies checked
        valid = []; // valid cookies

    // signalizing user didn't provide any cookies
    if(cookiesNoDuplicates.length == 0){
        console.log("\x1b[31mNo cookies found!\x1b[0m");
        process.exit(1);
    }

    /**
     * Just simple function for checking if cookie is valid
     * There's no returning value because it's meant to be used in multi-threaded way
     * @param {String} cookie Cookie string
     * @returns {undefined} 
     */
    async function check(cookie){
        threads++;
        var error = false,
            cookie = cookiesNoDuplicates[c];
        var resp = await axios.get(loginURL, {
            headers: {
                "Cookie": `.ROBLOSECURITY=${cookie};`
            },
        }).catch(()=>error=true)
        if(!error && loginURL !== resp.request._redirectable._currentUrl) valid.push(cookie);
        checked++;
        threads--;
    }

    // Signaling user about removed duplicates (if enabled and there are any)
    cookies.length-cookiesNoDuplicates.length > 0 ? await (async()=>{
        console.log(`Removed ${cookies.length - cookiesNoDuplicates.length} duplicate cookies`);
        await new Promise(resolve=>setTimeout(resolve,1000));
    })() : {};

    //Interval for showing progress
    var interv = setInterval(() => {
        console.clear(); console.log(show([checked,cookiesNoDuplicates.length,valid.length]));
    }, 100);

    //Actual checking
    for(var c in cookiesNoDuplicates){
        check(cookiesNoDuplicates[c]);
        while(threads>=cthreads) { // waiting for threads to be available
            await new Promise(resolve=>setTimeout(resolve,100))
        }
    }

    while(threads>0 || checked<cookiesNoDuplicates.length) { // waiting for every thread to finish
        await new Promise(resolve=>setTimeout(resolve,1000))
    }
    clearInterval(interv)
    console.log("\n\n\x1b[32mValid cookies saved to valid.txt.\x1b[0m");
    writeFileSync("../valid.txt", valid.join("\n"));


})()
