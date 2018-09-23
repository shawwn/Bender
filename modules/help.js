const request = require('request-promise-native');

async function help(s) {
  await this.channel.send(`
    commands:

    chess
    color
    g
    latex
    pfp
    role
    timer
    wiki
    yt
  `);
}

exports[""] = exports.help = help;
