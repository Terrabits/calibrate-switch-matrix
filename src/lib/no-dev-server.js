const electron = require('electron');

const mainProcess = electron.remote? electron.remote.process : process;
const noDevServer =  mainProcess.argv.includes('--noDevServer');

module.exports = noDevServer;
