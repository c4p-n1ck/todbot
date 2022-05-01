import {
  event,
  CommandClient,
  command,
  CommandContext,
  GatewayIntents
} from 'https://deno.land/x/harmony/mod.ts'
import { config } from "https://deno.land/x/dotenv/mod.ts";

const api_baseurl = "https://api.truthordarebot.xyz/v1";

const captalize = (text: string) => {
  let out = ""; text.split(' ').forEach(txt => {
    out += txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase() + " ";
  }); return out.replace(/(^[ '\^\$\*#&]+)|([ '\^\$\*#&]+$)/g, '')
}

const use_api = async (type: string) => {
  const resp = await fetch(`${api_baseurl}/${type}`);
  return await resp.json()
}

class TruthOrDateClient extends CommandClient {
  constructor() {
    super({
      prefix: ['!', '.', '-', '\\.', '$', '#', '@', '\\', '%', '^', '&', '*', ':', ';', "'", '"', '?', ',', '>'],
      caseSensitive: false
    })
  }

  @event()
  ready(): void {
    console.info(`[\x1b[34m*\x1b[0m] Logged in as \x1b[32m${this.user?.tag}\x1b[0m!`);
  }

  @command({ aliases: 't' })
  Truth(ctx: CommandContext): void {
    use_api('truth').then( data => {
      ctx.message.reply(data['question']);
    });
  }

  @command({ aliases: 'd' })
  Dare(ctx: CommandContext): void {
    use_api('dare').then( data => {
      ctx.message.reply(data['question']);
    });
  }

  @command({ aliases: ['w', 'wouldYouRather', 'would-you-rather', 'would_you_rather'] })
  Wyr(ctx: CommandContext): void {
    use_api('wyr').then( data => {
      ctx.message.reply(data['question']);
    });
  }

  @command({ aliases: ['n', 'neverHaveIever', 'never-have-i-ever', 'never_have_i_ever'] })
  Nhie(ctx: CommandContext): void {
    use_api('nhie').then( data => {
      ctx.message.reply(data['question']);
    });
  }

  @command({ aliases: ['pa', 'paranoid'] })
  Paranoia(ctx: CommandContext): void {
    use_api('paranoia').then( data => {
      ctx.message.reply(data['question']);
    });
  }

  @command({ aliases: ['ra', 'random', 'play'] })
  Random(ctx: CommandContext): void {
    const types = ['dare', 'truth', 'wyr', 'nhie', 'paranoia'];
    const random_type = types[Math.floor(Math.random() * types.length)];
    use_api(random_type).then( data => {
      // ctx.message.reply(`${captalize(data['type'])}: ${data['question']}`);
      ctx.message.reply(`_${data['type']}_: **\`${data['question']}\`**`);
    });
  }

  @command({ aliases: ['p', 'poing', 'pong'] })
  Ping(ctx: CommandContext): void {
    ctx.message.reply(`**:ping_pong: Pong! \`${ctx.client.gateway.ping}ms\`**`);
  }

  @command({ aliases: ['pussy', 'miau', 'meow', "c", "m", "biralo"] })
  Cat(ctx: CommandContext): void {
    fetch('https://extension.bboxy.xyz/cat').then( resp => {
      resp.json().then( cat_url => {
        ctx.message.reply(cat_url);
      }) 
    })
  }

  @command({ aliases: ['h', 'how'] })
  Help(ctx: CommandContext): void {
    ctx.message.reply(`\`!ping\`   - **Pings the bot, while returning its latency.**
\`!dare\`   - **Sends a dare as a reply.**
\`!truth\`  - **Sends a truth as a reply.**
\`!wyr\`    - **Send a "Would You Rather"-type question via reply.**
\`!nhie\`   - **Never Have I Ever related query in the reply.**
\`!random\` - **Sends a random question via reply.**
\`!help\`   - **Shows this page :)**`);
  }

}

const bot = new TruthOrDateClient();
const env = config();

bot.connect(env.TOKEN, [
  GatewayIntents.DIRECT_MESSAGES,
  GatewayIntents.GUILDS,
  GatewayIntents.GUILD_MESSAGES
])
