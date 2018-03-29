#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
const { exec } = require('child_process');
const { getInstalledPathSync } = require('get-installed-path')

//Location of saved directory list
var localDataStore = getInstalledPathSync('working-directory-manager') + "\\data.json";

//Base program information
program
    .version('0.7.0', '-v, --version')
    .usage('[command] <shortcut>')

//Switch directory function
program
    .arguments('<shortcut>')
    .description('If no subcommand is given, the program opens the selected working directory, if it exists.')
    .action(function (shortcut) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(contents);
                if(result[shortcut]) {
                    let shortcutPath = result[shortcut];
                    console.log("Going to " + shortcut);
                    if(process.platform === 'win32'){
                        exec("start cmd.exe /K cd \"" + shortcutPath + "\"", (error, stdout, stderr) => {
                          if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                          }
                        });
                        
                    } else if(process.platform === 'darwin'){
                        exec("open -a Terminal \"" + shortcutPath + "\"", (error, stdout, stderr) => {
                          if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                          }
                        });
                    } else if(process.platform === 'linux'){
                        exec("xterm -e \"cd " + shortcutPath + "\"", (error, stdout, stderr) => {
                          if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                          }
                        });
                    } else {
                        console.log(`OS not supported. Look for future updates`);
                    }
                    
                } else {
                    console.error("Shortcut not found.");
                    //print most similar
                    try{
                        fs.readFile(localDataStore, 'utf8', function(err, contents) {
                            result = JSON.parse(contents);
                            for (var key in result) {
                                if (stringSimilarity(shortcut, key) > 0.6) {
                                    console.log("You may be looking for this shortcut: " + key);
                                }
                            }
                        });
                    }
                    catch(e){
                        process.exit(1);
                    }                    
                }
            }
            catch(e) {
                console.error("No shortcuts saved.");
                process.exit(1);
            }
        });
    });

//Save directory function
program
    .command('save <shortcut> [loc]').alias('s')
    .description('\nSaves the current directory under the alias <shortcut>. If [loc] is given, it is saved instead.\n')
    .action(function (shortcut, loc) {
        //check if shortcut works
        forbiddenShortcuts = ["r", "remove", "s", "save", "l", "list"];
        if(forbiddenShortcuts.indexOf(shortcut) > -1){
            console.error(shortcut + " is already a pre-defined command. Try again with another word!");
            process.exit(1);
        }
        var letterNumber = /^[0-9a-zA-Z]+$/;
        if(!shortcut.match(letterNumber)) {
            console.error("Shortcut can only have letters and numbers. Try again!");
            process.exit(1);
        }
        //save shortcut
        var shortcutPath;
        if(loc){
            shortcutPath = loc;
        }else{
            shortcutPath = process.cwd();
        }
        console.log("Saving " + shortcutPath + " as " + shortcut);
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(contents);
                result[shortcut] = shortcutPath;
                fs.writeFile(localDataStore, JSON.stringify(result), 'utf8');
            }
            catch(e) {
                fs.writeFile(localDataStore, JSON.stringify({[shortcut]: shortcutPath}), 'utf8');
            }
        });
        
    });

//List saved directories function
program
    .command('list [shortcut]').alias('l')
    .description('\nList all saved directories. If [shortcut] is given, the program will search for that particular alias.\n')
    .action(function (shortcut) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(contents);
                if(shortcut){
                    if(result[shortcut]){
                        let shortcutPath = result[shortcut];
                        console.log(shortcut + "\t- " + shortcutPath);
                    } else {
                        console.error("Shortcut not found.")
                    }
                } else {
                    console.log();
                    console.log("Saved Workspaces");
                    console.log();
                    for (var key in result) {
                        if (result.hasOwnProperty(key)) {
                            console.log(key + "\t- " + result[key]);
                        }
                    }
                }
            }
            catch(e) {
                console.error("No shortcuts saved.");
                process.exit(1);
            }
        });
    });

//Remove directory function
program
    .command('remove <shortcut>').alias('r')
    .description('\nRemove the selected directory from the list of saved aliases, if it exists.\n')
    .action(function (shortcut) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(contents);
                if(result[shortcut]) {
                    delete result[shortcut];
                    var returnJSON = JSON.stringify(result);
                    fs.writeFile(localDataStore, returnJSON, 'utf8');
                    console.log("Removed " + shortcut + " from saved workspaces.");
                } else {
                    console.error("Shortcut not found.");
                    process.exit(1);
                }
            }
            catch(e) {
                console.error("No shortcuts saved.");
                process.exit(1);
            }
        });
    });

program.parse(process.argv);

//Print help if user types no arguments
if (!program.args.length) program.help();


/*===================================================================================================================================================*/
/*                                                                                                                                                   */
/*                                                                    Helper Functions                                                               */
/*                                                                                                                                                   */
/*===================================================================================================================================================*/

function stringSimilarity(sa1, sa2){
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();
    
    function intersect(arr1, arr2) {
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }
    
    var pairs = function(s){
        // Get an array of all pairs of adjacent letters in a string
        var pairs = [];
        for(var i = 0; i < s.length - 1; i++){
            pairs[i] = s.slice(i, i+2);
        }
        return pairs;
    }    
    
    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;
    return similarity;
};