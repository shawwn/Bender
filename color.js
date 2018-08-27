const color = require('color');

const commands = {};


commands[""] = async function(colorStr){

  const col = color(colorStr).rgbNumber();

  const colorRoles = this.message.guild.roles.filter(
    e => !e.deleted && /^\$Color_/i.test(e.name)
  );

  const curColorRole = this.message.member.roles.find(
    e => !e.deleted && /^\$Color_/i.test(e.name)
  );

  if (curColorRole && curColorRole.color == col){
    return;
  }

  const targetColorRole = colorRoles.find(
    e => e.color == col
  ) || await this.message.guild.createRole({
    name: `$Color_${col}`,
    color: col,
    mentionable: true
  });

  targetColorRole.setPosition(this.message.guild.roles.size - 1);
  await this.message.member.addRole(targetColorRole);
  if (curColorRole){
    if (curColorRole.members.size <= 1){
      await curColorRole.delete();
    }else{
     await this.message.member.removeRole(curColorRole);
    }
  }

  await this.message.channel.send(`Success! Set your color to ${targetColorRole}`);
};

module.exports = commands;