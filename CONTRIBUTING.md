# Contributing to Working Directory Manager

Thank you for considering contributing to the Working Directory Manager! This document provides guidelines and standards for contributing to this project.

## Code Quality Standards

This project maintains high code quality standards using automated tooling:

### Linting and Formatting

- **ESLint**: We use ESLint to enforce code quality and consistency
- **Prettier**: Code formatting is handled by Prettier
- **EditorConfig**: Helps maintain consistent coding styles across different editors

### Before Submitting Code

1. **Run the linter** to check for code quality issues:

   ```bash
   npm run lint
   ```

2. **Run the formatter** to ensure consistent code style:

   ```bash
   npm run format
   ```

3. **Fix linting errors automatically** when possible:
   ```bash
   npm run lint:fix
   ```

## Code Style Guidelines

### JavaScript

- Use **const** and **let** instead of **var**
- Use **single quotes** for strings
- Add **semicolons** at the end of statements
- Use **2 spaces** for indentation
- Use **arrow functions** where appropriate
- Add **JSDoc comments** for functions and modules
- Prefer **destructuring** when working with objects and arrays

### Error Handling

- Always wrap file operations in try-catch blocks
- Provide meaningful error messages to users
- Validate user input before processing

### Security

- Sanitize all user input
- Validate file paths before use
- Escape shell commands properly to prevent injection attacks

## Project Structure

```
working-directory-manager/
├── index.js              # Main CLI application
├── lib/                  # Helper modules
│   ├── data-store.js     # Data persistence operations
│   ├── string-similarity.js  # String comparison utilities
│   ├── terminal-commands.js  # Terminal command generation
│   └── validators.js     # Input validation functions
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
└── .editorconfig         # EditorConfig settings
```

## Making Changes

1. **Fork the repository** and create a new branch for your changes
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Run linting and formatting** checks
5. **Commit your changes** with clear, descriptive commit messages
6. **Submit a pull request** with a description of your changes

## Commit Message Guidelines

- Use clear, descriptive commit messages
- Start with a verb in the imperative mood (e.g., "Add", "Fix", "Update")
- Keep the first line under 72 characters
- Add a detailed description if necessary

Examples:

```
Add support for new terminal emulator
Fix path validation bug on Windows
Update dependencies to latest versions
```

## Testing

Currently, this project does not have automated tests. When adding new features:

1. Manually test all affected functionality
2. Test on multiple platforms if possible (Windows, macOS, Linux)
3. Verify that existing features still work correctly

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

Thank you for contributing to Working Directory Manager!
