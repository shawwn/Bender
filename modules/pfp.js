exports[""] = pfp;

async function pfp(name){
  const user = this.mentions.users.first() || this.guild.members.find(
    e => !e.deleted && e.user.username.toLowerCase() == name.toLowerCase() || e.displayName.toLowerCase() == name.toLowerCase()
  ).user;
  await this.channel.send(`*${this.member} ${user.displayAvatarURL}*`);
}

pfp.RAW = true;