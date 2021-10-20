import puppeteer from 'puppeteer';
import { parse, HTMLElement } from 'node-html-parser';

export async function getAvailableSlots(username: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://sssb.aptustotal.se/AptusPortal/Account/Login');
    await page.type('#UserName', username);
    await page.type('#Password', username);
    await page.click('#btnLogin');
    await page.waitForNavigation({waitUntil: 'networkidle2'})
    await page.goto('https://sssb.aptustotal.se/AptusPortal/CustomerBooking/FirstAvailable?categoryId=35&firstX=10')
    const html = await page.$eval('#content', el => el.innerHTML)
    const parsedHtml = parse(html);
    const cards = parsedHtml.querySelectorAll('.bookingCard');
    const avaibleSlots = cards.map(c => {
        const parseText = (text: HTMLElement) => {
            return text.text.trim().replace(/\n/g, '');
        }
        const divs = c.querySelectorAll('div');
        const time = parseText(divs[0]);
        const date = parseText(divs[1]);
        const gruppo = parseText(divs[3]);
        const edificio = parseText(divs[4]);
        return `${time} ${date}\n${gruppo} | ${edificio}\n`;
    })
    await browser.close();
    return avaibleSlots;
}