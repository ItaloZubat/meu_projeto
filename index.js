const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');


async function scrapeData(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const scrapedData = [];
    $('.gs-c-promo-heading').each((index, element) => {
        const title = $(element).text();
        const link = $(element).attr('href');
        scrapedData.push({ title, link: `https://www.bbc.com${link}` });
    });

    return scrapedData;
}

async function sendEmail(subject, data) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'italomonarcos@gmail.com', 
            pass: 'senha'
        }
    });

    const text = data.map(item => `${item.title}: ${item.link}`).join('\n');
    
    const mailOptions = {
        from: 'italomonarcos@gmail.com', 
        to: 'senha', 
        subject: subject,
        text: text
    };

    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
}

(async () => {
    const url = 'https://www.bbc.com/portuguese';
    const data = await scrapeData(url);
    await sendEmail('Últimas Notícias da BBC', data);
})();
