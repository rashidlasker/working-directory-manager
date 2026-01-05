const path = require('path');

/**
 * List of reserved shortcuts that cannot be used
 */
const FORBIDDEN_SHORTCUTS = ['r', 'remove', 's', 'save', 'l', 'list', 'c', 'clear', 'cli'];

/**
 * List of accepted terminal emulators
 */
const ACCEPTED_TERMINALS = ['cmd', 'powershell', 'terminal', 'tilix'];

/**
 * Validate a shortcut name
 * @param {string} shortcut - The shortcut to validate
 * @returns {Object} Validation result with isValid and error properties
 */
function validateShortcut(shortcut) {
  if (!shortcut || typeof shortcut !== 'string') {
    return { isValid: false, error: 'Shortcut must be a non-empty string' };
  }

  if (FORBIDDEN_SHORTCUTS.includes(shortcut)) {
    return {
      isValid: false,
      error: `${shortcut} is already a pre-defined command. Try again with another word!`,
    };
  }

  const letterNumber = /^[0-9a-zA-Z]+$/;
  if (!shortcut.match(letterNumber)) {
    return {
      isValid: false,
      error: 'Shortcut can only have letters and numbers. Try again!',
    };
  }

  return { isValid: true };
}

/**
 * Validate and normalize a file path
 * @param {string} filePath - The file path to validate
 * @returns {Object} Validation result with isValid, normalizedPath, and error properties
 */
function validatePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return { isValid: false, error: 'Path must be a non-empty string' };
  }

  try {
    const normalizedPath = path.resolve(filePath);
    return { isValid: true, normalizedPath };
  } catch (error) {
    return { isValid: false, error: `Invalid path: ${error.message}` };
  }
}

/**
 * Validate a terminal name
 * @param {string} terminal - The terminal name to validate
 * @returns {Object} Validation result with isValid and error properties
 */
function validateTerminal(terminal) {
  if (!terminal || typeof terminal !== 'string') {
    return { isValid: false, error: 'Terminal must be a non-empty string' };
  }

  if (!ACCEPTED_TERMINALS.includes(terminal)) {
    return {
      isValid: false,
      error: `${terminal} is not a supported terminal.`,
    };
  }

  return { isValid: true };
}

module.exports = {
  FORBIDDEN_SHORTCUTS,
  ACCEPTED_TERMINALS,
  validateShortcut,
  validatePath,
  validateTerminal,
};
