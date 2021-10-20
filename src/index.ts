import * as dotenv from 'dotenv'
import { Telegraf, Context } from "telegraf";
import Session from './session';
import Scrapper from './scrapper';
dotenv.config()


class LaundryBot {
    private bot: Telegraf<Context>;
    private session: Session;
    private scrapper: Scrapper;

    constructor() {
        const TOKEN = process.env.BOT_TOKEN
        if (!TOKEN) {
            console.error('No token provided');
            process.exit(1);
        }

        this.session = new Session();
        this.scrapper = new Scrapper();

        this.bot = new Telegraf(TOKEN);
        this.bot.start((ctx: Context) => ctx.reply('Welcome!'));
        this.bot.command('username', (ctx) => this.addUsername(ctx, ctx.from.id, ctx.message.text));
        this.bot.command('available', (ctx) => this.getAvailableSlots(ctx, ctx.from.id));
        this.bot.command('book', (ctx) => this.book(ctx, ctx.from.id, ctx.message.text));

        this.bot.launch();
        console.log('Bot started');
    }

    private addUsername(ctx: Context, userId: number, text: string) {
        const username = text.split(' ')[1];
        if (!username || username.length != 13) {
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
        const msgPromise = ctx.reply('Loading ...');
        const res = await this.scrapper.getAvailableSlots(username);
        ctx.telegram.editMessageText(ctx.chat?.id, (await msgPromise).message_id, undefined, res.join('\n'));
    }

    private async book(ctx: Context, userId: number, text: string) {
        const slot = +text.split(' ')[1];
        if (!slot || slot < 1 || slot > 10) {
            ctx.reply('Slot must be between 1 and 10');
            return;
        }

        const msgPromise = await ctx.reply(`Booking slot ${slot}\nLoading ...`);
        const username = this.session.getUsername(userId);
        await this.scrapper.bookSlot(username, slot);
        await ctx.telegram.deleteMessage(ctx.chat!.id, (await msgPromise).message_id);
        await ctx.replyWithPhoto({ source: `./assets/${username}.png` }, { caption: `Slot ${slot} Booked!` });
    }

}

new LaundryBot();