#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
const { exec } = require('child_process');
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

//Location of saved directory list
const localDataStore = require('os').homedir() + "/working-directory-manager.json";

//Other Info
const forbiddenShortcuts = ["r", "remove", "s", "save", "l", "list", "c", "clear", "cli"];
const acceptedTerminals = ["cmd", "powershell", "terminal", "tilix"];

//Base program information
program
    .version('0.8.0', '-v, --version')
    .usage('[command] <shortcut>')

//Switch directory function
program
    .arguments('<shortcut>')
    .description('If no subcommand is given, the program opens the selected working directory, if it exists.')
    .action(function (shortcut) {
        checkDataStore();
        var result = JSON.parse(fs.readFileSync(localDataStore));
        var terminal = result['command-line'];
        if(result['shortcuts'][shortcut]) {
            let shortcutPath = result['shortcuts'][shortcut];
            console.log("Going to " + shortcut);
            let switchCommand = "";
            if(terminal === "cmd"){
                switchCommand = "start cmd.exe /K cd \"" + shortcutPath + "\"";
            } else if(terminal === "powershell"){
                switchCommand = "start powershell -NoExit -Command \"Set-Location " + shortcutPath + "\"";
            } else if(terminal === "terminal"){
                switchCommand = "open -a Terminal \"" + shortcutPath + "\"";
            } else if(terminal === "tilix"){
                switchCommand = "tilix " + shortcutPath;
            } else {
                console.log(`Command line not supported. Try another one.`);
                process.exit(1);
            }
            exec(switchCommand, (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
            });
        } else {
            console.error("Shortcut not found.");
            //print most similar
            var result = JSON.parse(fs.readFileSync(localDataStore));
            for (var key in result['shortcuts']) {
                if (stringSimilarity(shortcut, key) > 0.6) {
                    console.log("You may be looking for this shortcut: " + key);
                }
            }
            process.exit(0);
        }
    });

//Save directory function
program
    .command('save <shortcut> [loc]').alias('s')
    .description('\nSaves the current directory under the alias <shortcut>. If [loc] is given, it is saved instead.\n')
    .action(function (shortcut, loc) {
        checkDataStore();
        //check if shortcut works
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
        var result = JSON.parse(fs.readFileSync(localDataStore));
        result['shortcuts'][shortcut] = shortcutPath;
        fs.writeFileSync(localDataStore, JSON.stringify(result));
        process.exit(0);
    });

//List saved directories function
program
    .command('list [shortcut]').alias('l')
    .description('\nList all saved directories. If [shortcut] is given, the program will search for that particular alias.\n')
    .action(function (shortcut) {
        checkDataStore();
        var result = JSON.parse(fs.readFileSync(localDataStore));
        if(shortcut){
            if(result['shortcuts'][shortcut]){
                let shortcutPath = result['shortcuts'][shortcut];
                console.log(shortcut + "\t- " + shortcutPath);
                process.exit(0);
            } else {
                console.error("Shortcut not found.")
                process.exit(1);
            }
        } else {
            console.log();
            console.log("Saved Workspaces");
            console.log();
            for (var key in result['shortcuts']) {
                if (result['shortcuts'].hasOwnProperty(key)) {
                    console.log(key + "\t- " + result['shortcuts'][key]);
                }
            }
            process.exit(0);
        }
    });

//Remove directory function
program
    .command('remove <shortcut>').alias('r')
    .description('\nRemove the selected directory from the list of saved aliases, if it exists.\n')
    .action(function (shortcut) {
        checkDataStore();
        var result = JSON.parse(fs.readFileSync(localDataStore));
        if(result['shortcuts'][shortcut]) {
            delete result['shortcuts'][shortcut];
            var returnJSON = JSON.stringify(result);
            fs.writeFileSync(localDataStore, returnJSON);
            console.log("Removed " + shortcut + " from saved workspaces.");
            process.exit(0);
        } else {
            console.error("Shortcut not found.");
            process.exit(1);
        }
    });

//Clear all saved shortcuts
program
    .command('clear').alias('c')
    .description('\nClear all saved shortcuts.\n')
    .action(function () {
        rl.question("Clear all? [yes]/no: ", function(answer) {
            if(answer === "yes") {
                checkDataStore();
                var result = JSON.parse(fs.readFileSync(localDataStore));
                result["shortcuts"] = {};
                fs.writeFileSync(localDataStore, JSON.stringify(result));
                console.log("All shortcuts cleared");
                process.exit(0);
            } else {
                console.log ("Clear aborted.");
                process.exit(0);
            }
        });
    });

//Change command line 
program
    .command('cli [terminal]')
    .description('\nChange command line to be used.\n')
    .action(function (terminal) {
        checkDataStore();
        var result = JSON.parse(fs.readFileSync(localDataStore));
        if(terminal){
            if(acceptedTerminals.indexOf(terminal) == -1){
                console.error(terminal + " is not a supported terminal.");
                process.exit(1);
            }
            result["command-line"] = terminal;
            fs.writeFileSync(localDataStore, JSON.stringify(result));
            console.log("Selected terminal updated");
            process.exit(0);
        } else {
            console.log();
            console.log("Accepted Terminals");
            console.log();
            for (var i = 0; i < acceptedTerminals.length; i++) {
                console.log(acceptedTerminals[i]);
            }
            process.exit(0);
        }
    });

program.parse(process.argv);

//Print help if user types no arguments
if (!program.args.length) program.help();


/*===================================================================================================================================================*/
/*                                                                                                                                                   */
/*                                                                    Helper Functions                                                               */
/*                                                                                                                                                   */
/*===================================================================================================================================================*/

function stringSimilarity(sa1, sa2) {
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

function checkDataStore() {
    if(!fs.existsSync(localDataStore)) {
        var commandline = "cmd";
        if(process.platform === 'linux'){
            commandline = "tilix";
        } else if(process.platform === 'darwin'){
            commandline = "terminal";
        }
        fs.writeFileSync(localDataStore, JSON.stringify({"command-line": commandline, "shortcuts":{}}));
    }
}