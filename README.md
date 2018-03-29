# Working Directory Manager

[![npm](https://img.shields.io/npm/l/express.svg)]()

Working directory manager for switching between multiple projects

## Installation

Install `working-directory-manager` globally with `npm install working-directory-manager -g`, so you can use the command in any context.


## Syntax:

Note: arguments in <> are required, arguments in [] are optional

`wdm <shortcut>`

Searches through saved directories and opens the workspace in a new command line window.

`wdm save|s <shortcut> [loc]`

Saves the current directory under the alias \<shortcut>. If [loc] is given, it is saved instead. Sudo access may be needed to use this command.

`wdm list|l [shortcut]`

List all saved directories. If [shortcut] is given, the program will search for that particular alias.

`wdm remove|r <shortcut>`

Remove the selected directory from the list of saved aliases, if it exists.

`wdm --version|-v`

Print current version


## Todo

* Change command prompt directory without opening a new window/have an option to do so
* Style working directory list
* Update help function
* Test/optimize on mac/linux
* Close parent process after opening new window
* Give suggested shortcuts for misspellings
* Add better error messages when admin access is needed

## Contributing

Send a pull request! Check out the list of todos
