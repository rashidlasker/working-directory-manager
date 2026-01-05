const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Location of saved directory list
 */
const LOCAL_DATA_STORE = path.join(os.homedir(), 'working-directory-manager.json');

/**
 * Get the default terminal based on the current platform
 * @returns {string} Default terminal name
 */
function getDefaultTerminal() {
  if (process.platform === 'linux') {
    return 'tilix';
  } else if (process.platform === 'darwin') {
    return 'terminal';
  }
  return 'cmd';
}

/**
 * Initialize the data store if it doesn't exist
 */
function initializeDataStore() {
  if (!fs.existsSync(LOCAL_DATA_STORE)) {
    const commandline = getDefaultTerminal();
    const initialData = {
      'command-line': commandline,
      shortcuts: {},
    };
    fs.writeFileSync(LOCAL_DATA_STORE, JSON.stringify(initialData, null, 2));
  }
}

/**
 * Read data from the data store
 * @returns {Object} The data store object
 * @throws {Error} If the data store cannot be read or parsed
 */
function readDataStore() {
  try {
    initializeDataStore();
    const data = fs.readFileSync(LOCAL_DATA_STORE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read data store: ${error.message}`);
  }
}

/**
 * Write data to the data store
 * @param {Object} data - The data to write
 * @throws {Error} If the data cannot be written
 */
function writeDataStore(data) {
  try {
    fs.writeFileSync(LOCAL_DATA_STORE, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Failed to write data store: ${error.message}`);
  }
}

/**
 * Get all shortcuts from the data store
 * @returns {Object} Object containing all shortcuts
 */
function getShortcuts() {
  const data = readDataStore();
  return data.shortcuts || {};
}

/**
 * Get a specific shortcut from the data store
 * @param {string} shortcut - The shortcut name
 * @returns {string|null} The path associated with the shortcut, or null if not found
 */
function getShortcut(shortcut) {
  const shortcuts = getShortcuts();
  return shortcuts[shortcut] || null;
}

/**
 * Save a shortcut to the data store
 * @param {string} shortcut - The shortcut name
 * @param {string} path - The path to save
 */
function saveShortcut(shortcut, path) {
  const data = readDataStore();
  data.shortcuts[shortcut] = path;
  writeDataStore(data);
}

/**
 * Remove a shortcut from the data store
 * @param {string} shortcut - The shortcut name to remove
 * @returns {boolean} True if the shortcut was removed, false if it didn't exist
 */
function removeShortcut(shortcut) {
  const data = readDataStore();
  if (data.shortcuts[shortcut]) {
    delete data.shortcuts[shortcut];
    writeDataStore(data);
    return true;
  }
  return false;
}

/**
 * Clear all shortcuts from the data store
 */
function clearShortcuts() {
  const data = readDataStore();
  data.shortcuts = {};
  writeDataStore(data);
}

/**
 * Get the configured terminal
 * @returns {string} The configured terminal name
 */
function getTerminal() {
  const data = readDataStore();
  return data['command-line'] || getDefaultTerminal();
}

/**
 * Set the terminal to use
 * @param {string} terminal - The terminal name
 */
function setTerminal(terminal) {
  const data = readDataStore();
  data['command-line'] = terminal;
  writeDataStore(data);
}

module.exports = {
  LOCAL_DATA_STORE,
  initializeDataStore,
  readDataStore,
  writeDataStore,
  getShortcuts,
  getShortcut,
  saveShortcut,
  removeShortcut,
  clearShortcuts,
  getTerminal,
  setTerminal,
};
