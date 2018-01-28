#!/usr/bin/env node --harmony

var shell = require("shelljs");
var program = require('commander');
var fs = require('fs');
const { getInstalledPathSync } = require('get-installed-path')

var localDataStore = getInstalledPathSync('working-directory-manager') + "\\data.json";

program
    .version('0.1.0')
    .arguments('<shortcut>')
    .action(function (shortcut) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            //console.log(contents);
            try {
                result = JSON.parse(JSONstring);
                // if(result[shortcut]){
                //     console.log("Going to " + shortcut);

                // }else{
                //     console.error("Shortcut not found.")
                //     process.exit(1);
                // }
                try {
                    let shortcutPath = result[shortcut];
                    console.log("Going to " + shortcut);
                    shell.cd(shortcutPath);
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
        if(loc){
            console.log("Saving " + loc + " as shortcut: " + name);
        }else{
            console.log("Saving " + process.cwd() + " as shortcut: " + name);
        }
    });

program
    .command('list [name]').alias('l')
    .action(function (name) {
        fs.readFile(localDataStore, 'utf8', function(err, contents) {
            try {
                result = JSON.parse(JSONstring);
                if(name){
                    try {
                        let shortcutPath = result[name];
                        console.log("listing " + name);
                        console.log(name + " - " + shortcutPath);
                    }
                    catch(e) {
                        console.error("Shortcut not found.")
                        process.exit(1);
                    }
                } else {
                    console.log("listing all");
                    for (var key in result) {
                        if (result.hasOwnProperty(key)) {
                            console.log(key + " - " + result[key]);
                        }
                    }
                }
                process.exit(0);
            }
            catch(e) {
                console.error("No shortcuts saved.")
                process.exit(1);
            }
        });
        if(name){
            console.log("listing " + name);
        }else{
            console.log("listing all");
        }
    });

program
    .command('remove <name>').alias('r')
    .action(function (name) {
        console.log("removing " + name);
    });

program.parse(process.argv);

if (!program.args.length) program.help();

// console.log(packageLocation);
// console.log(`Current directory: ${process.cwd()}`);
// shell.exec('echo Current directory: ${process.cwd()}');

//functions to make:
//is Valid file path
//