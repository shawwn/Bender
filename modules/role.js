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
    e => !e.deleted && e.name.toLowerCase() == roleName.toLowerCase()
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
exports.delete = rm;

async function rm (roleName){

  const positionThreshold = this.guild.roles.get(config.lowestUnmodifyableRole).position;


  var targetRole = this.mentions.roles.first() || this.guild.roles.find(
    e => !e.deleted && e.name.toLowerCase() == roleName.toLowerCase()
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

rm.RAW = true;


exports.prune =
exports.clean = 
exports.tidy = 
async function(){
  const roles = this.guild.roles.filter(
    e => !e.deleted && !e.members.size
  );

  if (!roles.size){
    await this.channel.send(`*Nothing to do! No unused roles found.*`);
    return;
  }

  const rolesStr = roles.map(
    e => e.name
  ).join(", ");

  await this.channel.send(`*${roles.size} unused roles found: ${rolesStr}*`);

  const msg = await this.channel.send(`*Deleting unused roles, please wait...*`);
  await Promise.all(roles.map(
     e => e.delete()
  ));

  await msg.edit(`*Success! ${roles.size} unused roles have been deleted.*`);

};


exports[""] = exports.list = list;

async function list(name){
  const role = this.mentions.roles.first() || this.guild.roles.find(
    e => !e.deleted && e.name.toLowerCase() == name.toLowerCase()
  );

  if (role){
    const members = role.members.map(e => e.displayName).join(", ");
    await this.channel.send(`*${role.name} has ${role.members.size} members: ${members}*`);
    return;
  }
  const member = this.mentions.members.first() || this.guild.members.find(
    e => !e.deleted && e.user.username.toLowerCase() == name.toLowerCase() || e.displayName.toLowerCase() == name.toLowerCase()
  );
  if (!member){
    await this.channel.send(`*${this.member} Error! Please supply a valid member or role.*`);
    return;
  }
  const roles = member.roles.filter(
    e => e.position
  ).map(e => e.name).join(", ");
  await this.channel.send(`*${member.displayName} has ${member.roles.size - 1} roles: ${roles}*`);
};

list.RAW = true;