const Discord = require("discord.js");
const config = require("./config.json");
const split = require('split-string');
const fs = require("fs");


const client = new Discord.Client();
exports.client = client;
exports.config = config;

const dir = "./modules";
const modules = new Map(fs.readdirSync(dir).filter(v => /\.js$/.test(v)).map(v => 
  [v.match(/[^.]+/)[0], require(`${dir}/${v}`)]
));

client.on("message", async message => {
  if (message.author.bot /*|| message.author.id == client.user.id*/) return;
  if (!/^!/.test(message.content)) return;
  
  const keep = (value, state) => {
    return value !== '\\' && (value !== '"' || state.prev() === '\\');
  };

  const cmdMatches = message.content.match(/^!(\S+)([^]*)/);
  const command = cmdMatches[1].toLowerCase().split(".");
  const handler = modules.get(command[0]);

  if (!handler) return;

  const func = handler[command[1] || ""];

  if (!func) return;

  if (func.RAW){
    await func.call(message, cmdMatches[2].trim());
  }else{
    const args = split(message.content.slice(1).trim(), {separator: ' ', quotes: ['"'], keep: keep})//.split(/\s+/g);
    await func.apply(message, args);
  }
});

client.login(config.token);

console.log("Bender is running....");