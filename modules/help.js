const request = require('request-promise-native');

async function help(s) {
  await this.channel.send(`
  commands:

    !g.img <foo> -- google image search for foo
    !yt <foo> -- youtube results for foo
    !wiki <foo> -- wikipedia results for foo

  more commands:
    chess
    color
    latex
    pfp
    role
    timer
  `);
}

exports[""] = exports.help = help;
