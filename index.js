const qrcode = require('qrcode-terminal');
const fs = require('fs');

const { Client, LocalAuth } = require('whatsapp-web.js');
const { time } = require('console');

const USERCONFIGS_FILE_PATH = './data/user_datas.json';
var fromConfigs = JSON.parse("{}");

const readUserCfg = (user, key, defaultValue, inFun = false) =>{
    if(fromConfigs[user] == undefined)
    {
        var nCfg = {};
        nCfg[key] = defaultValue;
        fromConfigs[user] = nCfg;
    }

    var nCfg = fromConfigs[user];

    if (inFun)
        return nCfg;
    else
        return nCfg[key];
}

const setUserCfg = (user, key, val) => {
    var nCfg = readUserCfg(user, key, val, true);

    nCfg[key] = val;

    fromConfigs[user] = nCfg;
}

if(fs.existsSync(USERCONFIGS_FILE_PATH)) {
    fs.readFile(USERCONFIGS_FILE_PATH, (err, data) => {
        fromConfigs = JSON.parse(data);
    })
}

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-9807" }),
    puppeteer: { 
        headless: true,
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    var wInfo = false;

    if(!readUserCfg(message.from, "disabled_bot", false))
    {
        if(message.body.startsWith("!")){ // custom commands
            wInfo = true;
            
            if(message.body === '!help') {
                setTimeout(() => {client.sendMessage(message.from, "!help-eglence | Eğlenebileceğiniz komutlar");}, 1000);
                setTimeout(() => {client.sendMessage(message.from, '!help-casino  | Ufak çaplı "Musto-Casino"');}, 1500);
                setTimeout(() => {client.sendMessage(message.from, "!help-tayyip  | Kaliteli tayyip şakaları ve memeleri");}, 2000);
                setTimeout(() => {client.sendMessage(message.from, "!help-coin    | Musto coin uçtu, Sende kullan...");}, 2500);
            }
        
            if(message.body === '!a-m-d') {
                setUserCfg(message.from, "disabled_bot", true);
                message.reply('Oto mesajlar kapatıldı güle güle');
            }
        }
        else{ // Normal speakbot
            var mblt = message.body.toLowerCase();
            if(mblt.includes("sik"))
            {
                wInfo = true;
                message.reply("Küfretme lan yarrak, Ben küfür ediyor muyum?");
            }
            else if(mblt == "ohaa" || mblt == "ohaa" || mblt == "ohaaa")
            {
                wInfo = true;
                client.sendMessage(message.from, "Bunda bu kadar şaşırılacak ne var?");
            }
            else if(mblt.includes("hsktr") || mblt.includes("hass") || mblt.includes("hssktr")) {
                client.sendMessage(message.from, "Bunda bu kadar şaşırılacak ne var ki ?");
            }
            else if(mblt.includes("selam") || mblt.includes("naber"))
            {
                wInfo = true;
                message.reply("Aleyküm selam, İyi senden ?");
            }
            else if (mblt.includes("selam") || mblt.includes("kanka"))
            {
                    wInfo = true;
                    message.reply("Kankam aleyküm selam");
            }
            else if (mblt.includes("selam") || mblt.includes("dayı"))
            {
                    wInfo = true;
                    message.reply("OOO Dayı, aleyküm selam :)");
            }
            else if (mblt.includes("kanka"))
            {
                    wInfo = true;
                    message.reply("efem");
            }
            else if (mblt.includes("selam"))
            {
                wInfo = true;
                message.reply("A selam");
            }
        }
    }

    if(!readUserCfg(message.from, "disabled_bot", false) && !wInfo)
    {
        if(!message.body.startsWith("!"))
        {
            setTimeout(() => {client.sendMessage(message.from, "Merhaba Ben Musto Bot");}, 1000);
            setTimeout(() => {client.sendMessage(message.from, "Sana nasıl yardımcı olabilirim ?");}, 1500);
            setTimeout(() => {client.sendMessage(message.from, "!help ile yardım komutlarını görüntüleyebilirsin.");}, 2000);
            setTimeout(() => {client.sendMessage(message.from, "eğer istersen !a-m-d yazarak Beni kapatbilirsin :/");}, 2500);
            setTimeout(() => {client.sendMessage(message.from, "vaz geçersen !a-m-e yazarak Tekrar açabilirsin :)");}, 3000);
        }
    }

    if(message.body === '!a-m-e' && readUserCfg(message.from, "disabled_bot", true)) {
        setUserCfg(message.from, "disabled_bot", false);
        message.reply('Oto mesajlar açıldı teşekkürler');
	}


    fs.writeFile(USERCONFIGS_FILE_PATH, JSON.stringify(fromConfigs), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.initialize();