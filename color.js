const color = require('color');

const commands = {};


commands[""] = async function(colorStr){

  const col = color(colorStr).rgbNumber();

  const colorRoles = this.message.guild.roles.filter(
    e => !e.deleted && /^\$Color_/i.test(e.name)
  );

  const curColorRole = this.message.member.roles.find(
    e => !e.deleted && /^\$Color_/i.test(e.name)
  ) || {};

  const targetColorRole = colorRoles.find(
    e => e.color == col
  ) || await this.message.guild.createRole({
    name: `$Color_${col}`,
    color: col,
    mentionable: true
  });

  targetColorRole.setPosition(this.message.guild.roles.size - 1);

  if (targetColorRole.id != curColorRole.id){
    await this.message.member.addRole(targetColorRole);
    if (curColorRole && curColorRole.members && curColorRole.members.size <= 1){
      await curColorRole.delete();
    }
  }

  await this.message.channel.send(`Success! Set your color to ${targetColorRole}`);
};

module.exports = commands;