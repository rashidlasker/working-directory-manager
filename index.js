#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
const { exec } = require('child_process');
const { getInstalledPathSync } = require('get-installed-path')

//Location of saved directory list
var localDataStore = getInstalledPathSync('working-directory-manager') + "\\data.json";

//Base program information
program
    .version('0.5.0', '-v, --version')
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
                        exec("start cmd.exe /K cd " + shortcutPath, (error, stdout, stderr) => {
                          if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                          }
                        });
                    } else if(process.platform === 'darwin'){
                        exec("open -a Terminal " + shortcutPath, (error, stdout, stderr) => {
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
                    console.error("Shortcut not found.")
                    process.exit(1);
                }
            }
            catch(e) {
                console.error("No shortcuts saved.")
                process.exit(1);
            }
        });
    });

//Save directory function
program
    .command('save <shortcut> [loc]').alias('s')
    .description('\nSaves the current directory under the alias <shortcut>. If [loc] is given, it is saved instead.\n')
    .action(function (shortcut, loc) {
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