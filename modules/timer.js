
const delay = ms => new Promise(r => setTimeout(r, ms));

exports.countdown = 
async function(countdownTime){
	if (countdownTime > 60){
		await this.channel.send(`*${this.member} Error! Exceeds maximum of 60 seconds*`);
    	return;
	}

	const msg = await this.channel.send(`*${countdownTime}*`);

	while (countdownTime--){
		await delay(1000);
		msg.edit(`*${countdownTime}*`);	
	}
}