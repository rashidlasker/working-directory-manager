#!/usr/bin/env node

const { Command } = require('commander');
const { exec } = require('child_process');
const readline = require('readline');
const { stringSimilarity } = require('./lib/string-similarity');
const {
  initializeDataStore,
  getShortcuts,
  getShortcut,
  saveShortcut,
  removeShortcut,
  clearShortcuts,
  getTerminal,
  setTerminal,
} = require('./lib/data-store');
const { generateTerminalCommand } = require('./lib/terminal-commands');
const {
  ACCEPTED_TERMINALS,
  validateShortcut,
  validatePath,
  validateTerminal,
} = require('./lib/validators');

// Initialize readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initialize the program
const program = new Command();

// Base program information
program
  .name('wdm')
  .version('1.0.0', '-v, --version')
  .description('Working directory manager for switching between multiple projects')
  .usage('[command] <shortcut>');

/**
 * Switch to a saved directory by opening it in a new terminal window
 */
program
  .argument('<shortcut>', 'The shortcut name of the saved directory')
  .description('Open the selected working directory in a new terminal window')
  .action((shortcut) => {
    try {
      initializeDataStore();
      const terminal = getTerminal();
      const shortcutPath = getShortcut(shortcut);

      if (!shortcutPath) {
        console.error('Shortcut not found.');

        // Suggest similar shortcuts
        const shortcuts = getShortcuts();
        for (const key in shortcuts) {
          if (Object.prototype.hasOwnProperty.call(shortcuts, key)) {
            if (stringSimilarity(shortcut, key) > 0.6) {
              console.log(`You may be looking for this shortcut: ${key}`);
            }
          }
        }
        process.exit(1);
      }

      console.log(`Going to ${shortcut}`);
      const switchCommand = generateTerminalCommand(terminal, shortcutPath);

      if (!switchCommand) {
        console.error('Command line not supported. Try another one.');
        process.exit(1);
      }

      exec(switchCommand, (error, _stdout, _stderr) => {
        if (error) {
          console.error(`Error opening terminal: ${error.message}`);
          process.exit(1);
        }
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * Save a directory with a shortcut name
 */
program
  .command('save')
  .alias('s')
  .argument('<shortcut>', 'The shortcut name to save')
  .argument('[loc]', 'The location to save (defaults to current directory)')
  .description('Save the current directory under the alias <shortcut>')
  .action((shortcut, loc) => {
    try {
      initializeDataStore();

      // Validate shortcut
      const shortcutValidation = validateShortcut(shortcut);
      if (!shortcutValidation.isValid) {
        console.error(shortcutValidation.error);
        process.exit(1);
      }

      // Determine path to save
      let shortcutPath;
      if (loc) {
        const pathValidation = validatePath(loc);
        if (!pathValidation.isValid) {
          console.error(pathValidation.error);
          process.exit(1);
        }
        shortcutPath = pathValidation.normalizedPath;
      } else {
        shortcutPath = process.cwd();
      }

      console.log(`Saving ${shortcutPath} as ${shortcut}`);
      saveShortcut(shortcut, shortcutPath);
      process.exit(0);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * List saved directories
 */
program
  .command('list')
  .alias('l')
  .argument('[shortcut]', 'Search for a particular shortcut')
  .description('List all saved directories or search for a specific one')
  .action((shortcut) => {
    try {
      initializeDataStore();
      const shortcuts = getShortcuts();

      if (shortcut) {
        const shortcutPath = getShortcut(shortcut);
        if (shortcutPath) {
          console.log(`${shortcut}\t- ${shortcutPath}`);
          process.exit(0);
        } else {
          console.error('Shortcut not found.');
          process.exit(1);
        }
      } else {
        console.log();
        console.log('Saved Workspaces');
        console.log();

        const entries = Object.entries(shortcuts);
        if (entries.length === 0) {
          console.log('No saved workspaces yet.');
        } else {
          for (const [key, value] of entries) {
            console.log(`${key}\t- ${value}`);
          }
        }
        process.exit(0);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * Remove a saved directory shortcut
 */
program
  .command('remove')
  .alias('r')
  .argument('<shortcut>', 'The shortcut to remove')
  .description('Remove a saved directory from the list')
  .action((shortcut) => {
    try {
      initializeDataStore();
      const removed = removeShortcut(shortcut);

      if (removed) {
        console.log(`Removed ${shortcut} from saved workspaces.`);
        process.exit(0);
      } else {
        console.error('Shortcut not found.');
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * Clear all saved shortcuts
 */
program
  .command('clear')
  .alias('c')
  .description('Clear all saved shortcuts')
  .action(() => {
    rl.question('Clear all? [yes]/no: ', (answer) => {
      try {
        if (answer === 'yes') {
          initializeDataStore();
          clearShortcuts();
          console.log('All shortcuts cleared');
          process.exit(0);
        } else {
          console.log('Clear aborted.');
          process.exit(0);
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    });
  });

/**
 * Configure or view terminal settings
 */
program
  .command('cli')
  .argument('[terminal]', 'The terminal to use')
  .description('View or set the terminal to use for opening directories')
  .action((terminal) => {
    try {
      initializeDataStore();

      if (terminal) {
        const terminalValidation = validateTerminal(terminal);
        if (!terminalValidation.isValid) {
          console.error(terminalValidation.error);
          process.exit(1);
        }

        setTerminal(terminal);
        console.log('Selected terminal updated');
        process.exit(0);
      } else {
        console.log();
        console.log('Accepted Terminals');
        console.log();
        for (const term of ACCEPTED_TERMINALS) {
          console.log(term);
        }
        process.exit(0);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Print help if user types no arguments
if (!program.args.length) {
  program.help();
}
