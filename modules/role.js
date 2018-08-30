const color = require('color');
const config = module.parent.exports.config;


const MAX_CUSTOM_ROLES = 5;

exports.add = 
exports.create = 
exports["new"] = 
exports.change =
exports.update = 
async function(roleName, colorStr){

  const positionThreshold = this.guild.roles.get(config.lowestUnmodifyableRole).position;

  

  var targetRole = this.mentions.roles.first() || this.guild.roles.find(
    e => !e.deleted && e.name == roleName
  );

  var col;
  if (colorStr){
    if (!/[^0-9]/.test(colorStr)){
      col = +colorStr;
    }else{
      try {
        col = color(colorStr.toLowerCase().replace(/\s/g, "")).rgbNumber();
      } catch (e) {
        await this.channel.send(`*${this.member} Couldn't parse color value ${colorStr}!*`);
        return;
      }
    }
  }
  

  if (targetRole){
    if (targetRole.position >= positionThreshold){
      await this.channel.send(`*${this.member} Error! ${targetRole} is a protected role!*`);
      return;
    }
    if (this.member.roles.has(targetRole.id)){
      if (!col){
        await this.channel.send(`*${this.member} Error! ${targetRole} is already assigned to you!*`);
        return;
      }
      targetRole.setColor(col);
      await this.channel.send(`*${this.member} ${targetRole}'s color changed to ${colorStr}!*`);
      return;
    }else if (col){
      await this.channel.send(`*${this.member} Error! ${targetRole} cannot be color changed unless you are the only member!*`);
      return;
    }
  }else if (this.member.roles.filter(e => !e.deleted && e.position < positionThreshold).size > MAX_CUSTOM_ROLES){
    await this.channel.send(`*${this.member} You already have 5 custom roles. \nPlease delete one and try again!*`);
    return;
  }else{
    targetRole = await this.guild.createRole({
      name: roleName,
      color: col,
      mentionable: true
    }); 
  }

  await this.member.addRole(targetRole);

  await this.channel.send(`*${this.member} Your role is now set to ${targetRole}*`);
};

exports.rm = 
exports.rem = 
exports.remove = 
exports.del = 
exports.delete =
async function(roleName){

  const positionThreshold = this.guild.roles.get(config.lowestUnmodifyableRole).position;


  var targetRole = this.mentions.roles.first() || this.guild.roles.find(
    e => !e.deleted && e.name == roleName
  );

  if (!targetRole){
    await this.channel.send(`*${this.member} Error! No role named "${roleName}" found on you!*`);
    return;
  }

  if (targetRole.position >= positionThreshold){
    await this.channel.send(`*${this.member} Error! ${targetRole} is a protected role!*`);
    return;
  }

  if (targetRole.members.size <= 1){
    await targetRole.delete();
    await this.channel.send(`*${this.member} ${targetRole.name} has been deleted and removed from you*`);
  }else{
    await this.member.removeRole(targetRole);
    await this.channel.send(`*${this.member} ${targetRole} has been removed from you*`);
  }

  
};