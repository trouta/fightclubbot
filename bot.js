const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
//const talkedRecently = new Set();

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.msgs = require('./msgs.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

var dictWins = {'xgoldenxmaknaex#8491': 0};
var dictLosses = {'xgoldenxmaknaex#8491': 0};
var dictRank = {'xgoldenxmaknaex#8491' : 'Master of the known universe'};
var used = false;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');

	var testChannel = client.channels.find(channel => channel.id === '610534720626884617');
	setInterval(function() {
		testChannel.send('A new challenger is approaching! To challenge, enter the command f!attack.');
	}, 30 * 60 * 1000);
});

client.on('message', message => {
	if (message.content.startsWith('write')) {
	editedMessage = message.content.slice(6);
	client.msgs[message.author.username] = {
		message: editedMessage
	}
	fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
		if (err) throw err;
		message.channel.send('Message written.');
	});
}

if (message.content.startsWith('read')) {
	let _message = client.msgs[message.author.username].message;
	message.channel.send('Message is: ' + _message);
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (commandName === 'help') {
		message.channel.send('Use the command f!attack to challenge the opponent, and use the command f!rank to view your current standing.');
	}

	if (commandName === 'rank') {
		var inDictionary = false;
		for(var key in dictRank) {
			if (message.author.tag === key) {
				inDictionary = true;
			}
		}
		if (!inDictionary) {
			dictRank[message.author.tag] = 'Peasant';
		}
		message.channel.send(`${message.author}\'s current rank is **${dictRank[message.author.tag]}**.`);
	}

	if (commandName === 'attack') {
		if (used) return;

		var success = Math.floor(Math.random() * Math.floor(2));
		var inDictionary = false;
		var highestCount = 0;
		var strongest = "";
		var previousWins = dictWins[message.author.tag];

		if (success == 0) {
			var losses = 0;

			for(var key in dictLosses) {
				if (message.author.tag === key) {
					dictLosses[key]++;
					losses = dictLosses[key];
					inDictionary = true;
				}
			}
			if (!inDictionary) {
				dictLosses[message.author.tag] = 1;
				losses = dictLosses[key];
			}
			message.channel.send(`Sorry, ${message.author}. You were unsuccessful in your challenge. Better luck next time!\nCurrent record: Wins:  ${dictWins[message.author.tag]}; Losses: ${dictLosses[message.author.tag]}`);
		}

		else {
			var wins = 0;

			for(var key in dictWins) {
				if (message.author.tag === key) {
					dictWins[key]++;
					wins = dictWins[key];
					inDictionary = true;
					if (dictWins[key] > highestCount) {
						strongest = key;
					}
				}
			}
			if (!inDictionary) {
				dictWins[message.author.tag] = 1;
				wins = dictWins[key];
			}
			message.channel.send(`Congratulations, ${message.author}. You were successful in your challenge. Your record of wins has increased by 1!\nCurrent record: Wins:  ${dictWins[message.author.tag]}; Losses: ${dictLosses[message.author.tag]}`);

		}

		if (dictWins[message.author.tag] !== 0 && dictWins[message.author.tag]%5 == 0 && (previousWins !== dictWins[message.author.tag])) {
			var wins = dictWins[message.author.tag];
			var dictRankTitles = {5 : 'Citizen', 10 : 'Volunteer', 15 : 'Tyro', 20 : 'Legionary', 25 : 'Veteran', 30 : 'Corporal', 35 : 'Sergeant', 40 : 'First Sergeant', 45 : 'Lieutenant', 50 : 'Captain', 55 : 'Major', 60 : 'Centurion', 65 : 'Colonel', 70 : 'Tribune', 75 : 'Brigadier', 80 : 'Prefect', 85 : 'Praetorian', 90 : 'Palatine', 95 : 'August Palatine', 100 : 'Legate', 105 : 'General', 110 : 'Warlord', 115 : 'Grand Warlord', 120 : 'Overlord', 125 : 'Grand Overlord'};

			for (key in dictRankTitles) {
				if (key == wins){
					message.channel.send(`Congralutions, ${message.author}! You have moved up one rank. Your new rank: **${dictRankTitles[key]}**`);
					dictRank[message.author.tag] = dictRankTitles[key];
				}
			}
		}

		if (message.author.tag === strongest) {
			message.channel.send(`Congratulations, ${message.author}! You are the strongest warrior in the server!`);
		}
		setTimeout(() => {

		});
	}
});

client.login(token);
