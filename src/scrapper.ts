import puppeteer from 'puppeteer';
import { parse, HTMLElement } from 'node-html-parser';

export default class Scrapper {

    private headless: boolean;
    private browser: puppeteer.Browser | null = null;

    constructor(headless: boolean = false) {
        this.headless = headless;
    }

    private async getBrowser(): Promise<puppeteer.Browser> {
        if (this.browser === null) {
            this.browser = await puppeteer.launch({ headless: this.headless });
        }
        return this.browser;
    }

    private async loadAvailableSlotsPage(username: string): Promise<puppeteer.Page> {
        const page = await (await this.getBrowser()).newPage();
        await page.goto('https://sssb.aptustotal.se/AptusPortal/Account/Login');
        await page.type('#UserName', username);
        await page.type('#Password', username);
        await page.click('#btnLogin');
        await new Promise(r => setTimeout(r, 500));
        await page.goto('https://sssb.aptustotal.se/AptusPortal/CustomerBooking/FirstAvailable?categoryId=35&firstX=10')
        return page;
    }

    public async getAvailableSlots(username: string): Promise<string[]> {
        const page = await this.loadAvailableSlotsPage(username);
        const html = await page.$eval('#content', el => el.innerHTML)
        const parsedHtml = parse(html);
        const cards = parsedHtml.querySelectorAll('.bookingCard');
        const avaibleSlots = cards.map((c, i) => {
            const parseText = (text: HTMLElement) => {
                return text.text.trim().replace(/\n/g, '');
            }
            const divs = c.querySelectorAll('div');
            const time = parseText(divs[0]);
            const date = parseText(divs[1]);
            const gruppo = parseText(divs[3]);
            const edificio = parseText(divs[4]);
            return `${i+1}) ${time} ${date}\n${gruppo} | ${edificio}\n`;
        })
        page.close()
        return avaibleSlots;
    }

    public async bookSlot(username: string, slot: number): Promise<void> {
        const page = await this.loadAvailableSlotsPage(username);
        await page.click(`.bookingCard:nth-child(${slot + 1}) button`);
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({path: `./assets/${username}.png`});
        await page.close();
    }
}
