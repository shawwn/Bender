const request = require('request-promise-native');

const client = module.parent.exports.client;
const config = module.parent.exports.config;

exports.steal = async function(inviteStr, emojiNames){
  if (emojiNames)
  	emojiNames = emojiNames.toLowerCase().split(",");

  const inviteCode = inviteStr.match(/([^\/]+)(?:\/+)?$/i)[1];

  const invite = await acceptInvite(inviteCode);

  if (!client.guilds.exists('id', invite.guild.id)){
    await client.syncGuilds([invite.guild, this.guild]);
  }

  const guild = client.guilds.get(invite.guild.id);

  await this.channel.send(`Hijacking emojis from ${guild}. Please be patient...`);

  const targetEmojis = emojiNames ? 
    guild.emojis.filter(e => emojiNames.includes(e.name.toLowerCase()))
    : guild.emojis;

  const nonDuplicateEmojis = targetEmojis.filter(
    e => !this.guild.emojis.exists('name', e.name)
  );

  const creation = (await Promise.all(nonDuplicateEmojis.map(
      e => this.guild.createEmoji(e.url, e.name).catch(error => null)
    )
  ));

  const emojis = creation.filter(e => !!e);

  const allEmojis = emojis.map(e => 
    `${e}`
  ).join("");

  if (creation.length != emojis.length){
    const limited = creation.length - emojis.length;
    await this.channel.send(`Adding ${limited} emojis failed due to 50 emoji limits`);
  }

  if (targetEmojis.length != nonDuplicateEmojis.length){
    const dupes = targetEmojis.length - nonDuplicateEmojis.length;
    await this.channel.send(`Ignoring ${dupes}/${targetEmojis.length} that already exist..`);
  }

  if (emojis.length)
    await this.channel.send(`\n${allEmojis}\nSuccess! Hijacked ${emojis.length} emojis from ${guild}.`);
  else
    await this.channel.send(`Failure, no emojis were added!`);
};

function acceptInvite(inv){
  return request({
    uri: `https://discordapp.com/api/invite/${inv}`,
    method: 'POST',
    headers: {
      authorization: config.token,
      'content-length': 0,
    },
    json: true
  });
}