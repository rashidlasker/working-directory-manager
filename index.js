#!/usr/bin/env node --harmony

var program = require('commander');
var fs = require('fs');
const { exec } = require('child_process');
const { getInstalledPathSync } = require('get-installed-path')

var localDataStore = getInstalledPathSync('working-directory-manager') + "\\data.json";

program
    .version('0.1.0')
    .arguments('<shortcut>')
    .action(function (shortcut) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            //console.log(contents);
            try {
                result = JSON.parse(contents);
                try {
                    let shortcutPath = result[shortcut];
                    console.log("Going to " + shortcut);
                    exec("start cmd.exe /K cd " + shortcutPath);
                }
                catch(e) {
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

program
    .command('save <name> [loc]').alias('s')
    .action(function (name, loc) {
        var shortcutPath;
        if(loc){
            shortcutPath = loc;
        }else{
            shortcutPath = process.cwd();
        }
        console.log("Saving " + shortcutPath + " as " + name);
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(contents);
                result[name] = shortcutPath;
                fs.writeFile(localDataStore, JSON.stringify(result), 'utf8');
            }
            catch(e) {
                fs.writeFile(localDataStore, JSON.stringify({[name]: shortcutPath}), 'utf8');
            }
        });
        
    });

program
    .command('list [name]').alias('l')
    .action(function (name) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(contents);
                if(name){
                    if(result[name]){
                        let shortcutPath = result[name];
                        console.log(name + "\t- " + shortcutPath);
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
            }
        });
    });

program
    .command('remove <name>').alias('r')
    .action(function (name) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(contents);
                if(result[name]) {
                    delete result[name];
                    var returnJSON = JSON.stringify(result);
                    fs.writeFile(localDataStore, returnJSON, 'utf8');
                    console.log("Removed " + name + " from saved workspaces.");
                } else {
                    console.error("Shortcut not found.");
                }
            }
            catch(e) {
                console.error("No shortcuts saved.");
            }
        });
    });

program
    .command('root')
    .action(function (name, loc) {
        console.log(localDataStore);        
    });

program.parse(process.argv);

if (!program.args.length) program.help();

// console.log(packageLocation);
// console.log(`Current directory: ${process.cwd()}`);
// shell.exec('echo Current directory: ${process.cwd()}');

//functions to make:
//is Valid file path
//