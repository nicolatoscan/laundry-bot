
import axios from 'axios';
import { parse } from 'node-html-parser';

// async function getCose() {


//     const pippo = await axios.get('https://sssb.aptustotal.se/AptusPortal/Account/Login');
//     console.log(pippo.data);
//     return;


//     const sessId = '';
//     const aspxAuth = '';
//     const verToken = ''

//     const res = await axios.get('https://sssb.aptustotal.se/AptusPortal/CustomerBooking/FirstAvailable?categoryId=35&firstX=10', { 'headers': {
//         'cookie':  `ASP.NET_SessionId=${sessId}; __RequestVerificationToken_L0FwdHVzUG9ydGFs0=${verToken}; .ASPXAUTH=${aspxAuth}`
//     } })
//     const rootHtml =  parse(res.data as string);
//     const bookingCard = rootHtml.querySelectorAll('#content > .bookingCard');
//     console.log(bookingCard.map(x => x.innerHTML));
// }

// getCose();
