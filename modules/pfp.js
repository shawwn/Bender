exports[""] = pfp;

async function pfp(){
  const user = this.mentions.users.first();
  await this.channel.send(`*${this.member} ${user.displayAvatarURL}*`);
}