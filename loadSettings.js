const process = require('process');
const fs = require('fs');

function loadSettings(){
    try{
        return JSON.parse(fs.readFileSync('settings.json'));
    }
    catch(e){
        return {
            'TOKEN': process.env.TOKEN,
            'PIPES': JSON.parse(process.env.PIPES),
            'ADD_DEFAULT_HEADER': process.env.ADD_DEFAULT_HEADER !== "false",
            'CUSTOM_HEADER': process.env.CUSTOM_HEADER
        };
    }
}

module.exports = loadSettings;
