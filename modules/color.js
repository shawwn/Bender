const color = require('color');

const COLOR_ROLE_NAME = "🎨";

exports[""] = async function(colorStr){

  const mentionedRole = this.mentions.roles.first();

  var col;

  if (mentionedRole){
    col = mentionedRole.color;
  }else if (!/[^0-9]/.test(colorStr)){
    col = +colorStr;
  }else{
    try {
      col = color(colorStr.toLowerCase().replace(/\s/g, "")).rgbNumber();
    } catch (e) {
      await this.channel.send(`*${this.member} Couldn't parse color value ${colorStr}!*`);
      return;
    }
  }

  const curColorRole = this.member.roles.find(
    e => !e.deleted && e.name == COLOR_ROLE_NAME
  );

  if (curColorRole && curColorRole.color == col){
    await this.channel.send(`*${this.member} Your color is already set to ${colorStr}!*`);
    return;
  }

  const targetColorRole = this.guild.roles.find(
    e => !e.deleted && e.name == COLOR_ROLE_NAME && e.color == col
  ) || await this.guild.createRole({
    name: COLOR_ROLE_NAME,
    color: col,
    mentionable: true
  });

  targetColorRole.setPosition(this.guild.roles.size - 2);
  await this.member.addRole(targetColorRole);
  if (curColorRole){
    if (curColorRole.members.size <= 1){
      await curColorRole.delete();
    }else{
     await this.member.removeRole(curColorRole);
    }
  }

  await this.channel.send(`*${this.member} Your color is now set to ${targetColorRole}*`);
};