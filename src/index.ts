import * as dotenv from 'dotenv'
import { Telegraf, Context } from "telegraf";
import { Update } from 'typegram';
import * as scrapper from './scrapper';
import Session from './session';
dotenv.config()


class LaundryBot {
    private bot: Telegraf<Context>;
    private session: Session;

    constructor() {
        const TOKEN = process.env.BOT_TOKEN
        if (!TOKEN) {
            console.error('No token provided');
            process.exit(1);
        }

        this.session = new Session();

        this.bot = new Telegraf(TOKEN);
        this.bot.start((ctx: Context) => ctx.reply('Welcome!'));
        this.bot.command('username', (ctx) => this.addUsername(ctx, ctx.from.id, ctx.message.text));
        this.bot.command('available', (ctx) => this.getAvailableSlots(ctx, ctx.from.id));

        this.bot.launch();
        console.log('Bot started');
    }

    private addUsername(ctx: Context, userId: number, text: string) {
        const username = text.split(' ')[1];
        if (username.length != 13) {
            ctx.reply('Username must be in te format:\n/username 0000-0000-000')
        }
        this.session.addUsername(userId, username);
        ctx.reply('Username saved!');
    }

    private async getAvailableSlots(ctx: Context, userId: number) {
        const username = this.session.getUsername(userId);
        if (!username) {
            ctx.reply('You must add a username first!');
            return;
        }
        const msg = await ctx.reply('Loading ...');
        const res = await scrapper.getAvailableSlots(username);
        ctx.telegram.editMessageText(ctx.chat?.id, msg.message_id, undefined, res.join('\n'));
    }

}

new LaundryBot();