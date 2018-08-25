const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");


const modules = {};
["event", "emoji"].forEach(
  v => modules[v] = require(`./${v}.js`)
);

["ready", "guildCreate", "guildDelete"].forEach(
  v => client.on(v, () => {
  	//todo
  })
)

client.on("message", async message => {
  if (message.author.bot /*|| message.author.id == client.user.id*/) return;
  if (!/^!/.test(message.content)) return;
  
  const args = message.content.slice(1).trim().split(/\s+/g);
  const command = args.shift().toLowerCase().split(".");
  const handler = modules[command[0]];

  if (!handler) return;

  await handler[command[1] || ""].apply({client: client, message: message}, args);
});

client.login(config.token);

