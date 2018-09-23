


const request = require('request-promise-native');

async function img(s){
	const data = await request.get({url : 'https://www.google.com/search', qs: {
		q: s,
		tbm: 'isch'
	},
	headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.16 Safari/537.36'}});

	const firstResult = (data.match(/"ou":"(.+?)","ow":/) || [])[1];

	if (!firstResult){
		await this.channel.send(`*${this.author} Sorry, no results found!*`);
	}

	await this.channel.send(`${firstResult}`);
}

img.RAW = true;
exports.image = exports.img = img;
