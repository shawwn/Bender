const request = require('request-promise-native');

async function search(s){
	const data = await request.get({url : 'https://en.wikipedia.org/w/api.php', qs: {
		action: 'query',
		list: 'search',
		utf8: '',
		format: 'json',
		srlimit: 1,
		srsearch: s
	}, json: true});

	const firstResult = data.query.search[0];

	if (!firstResult){
		await this.channel.send(`*${this.author} Sorry, no results found!*`);
	}

	const title = firstResult.title.replace(/ /g, '_');
	await this.channel.send(`https://en.wikipedia.org/wiki/${title}`)
}

search.RAW = true;

exports[""] = search;