const request = require('request-promise-native');

async function help(s) {
  await this.channel.send(`
  commands:
    !color <color> - change your user color
    !role.add <roleName> <color> - add a role to yourself
    !g.img <foo> -- google image search for foo
    !yt <foo> -- youtube results for foo
    !wiki <foo> -- wikipedia results for foo
    !all -- all

  more commands:
    color
    latex
    pfp
    timer
  `);
}

exports[""] = exports.help = help;
