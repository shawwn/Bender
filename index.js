const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const split = require('split-string');


const modules = {};
["event", "emoji", "color"].forEach(
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
  
  const keep = (value, state) => {
    return value !== '\\' && (value !== '"' || state.prev() === '\\');
  };
  const args = split(message.content.slice(1).trim(), {separator: ' ', quotes: ['"'], keep: keep})//.split(/\s+/g);
  const command = args.shift().toLowerCase().split(".");
  const handler = modules[command[0]];

  if (!handler) return;

  await handler[command[1] || ""].apply({client: client, message: message}, args);
});

client.login(config.token);

