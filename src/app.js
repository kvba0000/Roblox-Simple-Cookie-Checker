import axios from "axios";
import {readFileSync,writeFileSync} from "fs";

(async()=>{
    console.clear();
    process.title = "why am i even putting title to this"
    
    function show(data){
        var [curr,max,working] = data;
        return `
        \x1b[34m.########..##.....##.########...#######......##.....##.##....##.########
        .##.....##.##.....##.##.....##.##.....##......##...##...##..##.......##.
        .##.....##.##.....##.##.....##.##.....##.......##.##.....####.......##..
        .########..##.....##.########..##.....##........###.......##.......##...
        .##...##...##.....##.##...##...##..##.##.......##.##......##......##....
        .##....##..##.....##.##....##..##....##..###..##...##.....##.....##.....
        .##.....##..#######..##.....##..#####.##.###.##.....##....##....########
        Roblox Simple Cookies Checker
        Created by: rurq\x1b[0m
        
        \x1b[36mProgress: ${curr}/${max}
        (${working} working...)\x1b[0m`;
    }

    var cookies = readFileSync("../cookies.txt").toString().replace(/\r\n/g, "\n").split("\n"),
        cookiesNoDuplicates = [...new Set(cookies)].filter(x=>x.trim()!=""),
        loginURL = "https://www.roblox.com/login",
        valid = [];

    if(cookiesNoDuplicates.length == 0){
        console.log("\x1b[31mNo cookies found!\x1b[0m");
        process.exit(1);
    }

    cookies.length-cookiesNoDuplicates.length > 0 ? await (async()=>{
        console.log(`Removed ${cookies.length - cookiesNoDuplicates.length} duplicate cookies`);
        setTimeout(() => {
            return;
        }, 1000);
    })() : {};

    for(var c in cookiesNoDuplicates){
        var error = false,
            cookie = cookiesNoDuplicates[c];
        var resp = await axios.get(loginURL, {
            headers: {
                "Cookie": `.ROBLOSECURITY=${cookie};`
            },
        }).catch(()=>error=true)
        if(!error && loginURL !== resp.request._redirectable._currentUrl) valid.push(cookie);
        console.clear(); console.log(show([Number(c)+1,cookiesNoDuplicates.length,valid.length]));
    }

    console.log("\n\n\x1b[32mValid cookies saved to valid.txt.\x1b[0m");
    writeFileSync("../valid.txt", valid.join("\n"));


})()