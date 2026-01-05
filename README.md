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

`wdm cli [terminal]`

View available terminals. If [terminal] is given, it will be saved as the terminal to use when opening new windows.

`wdm --version|-v`

Print current version

## Development

### Code Quality

This project uses automated tooling to maintain code quality:

- **ESLint** for code quality and consistency
- **Prettier** for code formatting
- **EditorConfig** for editor consistency

### Scripts

```bash
npm run lint         # Check code for issues
npm run lint:fix     # Automatically fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Todo

- Change command prompt directory without opening a new window/have an option to do so
- Style working directory list
- Test/optimize on mac/linux
- Add more terminal compatibility
- Add backup/loading feature
- Add colors
- Add automated tests

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on code quality, style, and the contribution process.
