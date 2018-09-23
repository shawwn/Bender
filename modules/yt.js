const request = require('request-promise-native');

async function search(s){
	const data = await request.get({url : 'https://www.youtube.com/results', qs: {
		search_query: s
	},
	headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.16 Safari/537.36'}});

	const firstResult = data.match(/<img src="https:\/\/i\.ytimg\.com\/vi\/([^\/]+)/)[1];

	if (!firstResult){
		await this.channel.send(`*${this.author} Sorry, no results found!*`);
	}

	await this.channel.send(`https://www.youtube.com/watch?v=${firstResult}`);
}

search.RAW = true;
exports[""] = exports.search = search;