import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import {faker} from '@faker-js/faker';
import readline from 'readline-sync';

const randstr = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            
        resolve(text);
});

const getEmailRandom = () => new Promise((resolve, reject) => {
    fetch(`https://generator.email/`, {
        method: "get",
        headers: {
            accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-encoding": "gzip, deflate, br"
        }
    })
        .then(res => res.text())
        .then(text => {
            const $ = cheerio.load(text);
            const result = [];
            $('.e7m.tt-suggestions').find('div > p').each(function (index, element) {
                result.push($(element).text());
            });
            resolve(result);
        })
        .catch(err => reject(err));
});

const GetOtp = (email, domain) => new Promise((resolve, reject) => {
        fetch(`https://generator.email/${domain}/${email}`, {
            method: "get",
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br",
                "cookie": `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randstr(3)}; surl=${domain}%2F${email}`,
                "upgrade-insecure-requests": 1,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
             }
        })
        .then(res => res.text())
        .then(text => {
            let $ = cheerio.load(text);
            let src = $('#blueOverride');
            const srcc = src.attr('href')
            resolve(srcc);
        })
        .catch(err => console.log(err));
});

async function functionRegist(reff,email,name){
    
    const res = await fetch(`https://api.getwaitlist.com/api/v1/waiter`,{
        method:"POST",
        headers:{
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://waitlist.golayr.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        },
        body:JSON.stringify({
            "email": email,
            "api_key": "HEK52Y",
            "first_name": name,
            "referral_link": reff
          })
    })
    return res.json()
}

async function getVerif(linkverif){
    const res = await fetch(linkverif,{
        method:"GET",
        headers:{
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        }
    })
    return res
}

(async()=>{
    console.clear()
    console.log(`
++++++++++++++++++++++++++++++++++++++++++++++++
+               BOT AUTO REFF LAYR             +
================================================
+                Author: Conny                 +
+                                              +
++++++++++++++++++++++++++++++++++++++++++++++++
  `);
    console.info(' ')
    let tanyareff = readline.question('Link reff : ');
    while(true){
        try {
            console.log('==========================')
            const linkreff = tanyareff
            const domainList = await getEmailRandom();
            const domain = domainList[Math.floor(Math.random() * domainList.length)];
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${await randstr(5)}`;
            const email = `${username}${await randstr(5)}@${domain}`.toLowerCase();

            const regist = await functionRegist(linkreff,email,username)

            if(regist.verified == false){
                console.log('--> sukses regist')
                console.log('--> menunggu verif reff...')

                let linkConfirm;
                    do {
                        linkConfirm = await GetOtp(email.split("@")[0], email.split("@")[1]);
                        console.log(`---> Wait for veriff link..`)

                    } while (!linkConfirm);

                const verif = await getVerif(linkConfirm)
                if(verif.status == 200){
                    console.log('--> Sukses Reff')
                    console.log('==========================\n')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    
})()