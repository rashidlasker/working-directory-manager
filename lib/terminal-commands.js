const path = require('path');

/**
 * Escape a path for safe use in shell commands
 * @param {string} filePath - The path to escape
 * @returns {string} Escaped path
 */
function escapePath(filePath) {
  // Normalize the path and ensure it's properly quoted
  return `"${path.normalize(filePath)}"`;
}

/**
 * Generate the terminal command to open a directory
 * @param {string} terminal - The terminal name
 * @param {string} directoryPath - The directory path to open
 * @returns {string|null} The command to execute, or null if terminal is not supported
 */
function generateTerminalCommand(terminal, directoryPath) {
  const escapedPath = escapePath(directoryPath);

  switch (terminal) {
  case 'cmd':
    return `start cmd.exe /K cd ${escapedPath}`;

  case 'powershell':
    return `start powershell -NoExit -Command "Set-Location ${escapedPath}"`;

  case 'terminal':
    return `open -a Terminal ${escapedPath}`;

  case 'tilix':
    return `tilix -w ${escapedPath}`;

  default:
    return null;
  }
}

module.exports = {
  escapePath,
  generateTerminalCommand,
};
