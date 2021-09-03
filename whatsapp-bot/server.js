const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch');
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

//WIKI
function makeWikiRequest()
{
  var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "query",
    format: "json",
    list: "random",
    rnlimit: "10"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
return fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
      console.log('execute')
        var randoms = response.query.random;
        for (var r in randoms) {
          if(randoms[r].ns==0)
          {
            return("ערך אקראי:\n"+randoms[r].title+'\n'+"לינק: "+"https://en.wikipedia.org/wiki/"+titletosearch(randoms[r].title))
          }
        }
        return("TRY AGAIN :(")
    })
}
function titletosearch(title)
{
  return title.replace(" ","_")
}
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();
var Gematria = require('gematria');

//WEATHER
function makeWeatherRequests(city)
{
  let url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=df7b1130b51853c79a3c341a962c6461"
  console.log(url)
    return fetch(encodeURI(url))
    .then(function(response){return response.json();})
    .then(function(response) {
      if(response.cod!=200)
        return "העיר לא נמצאה"
      else
      {
        return("*"+response.name+"*"+"\n"+
        "*"+response.main.temp+'\xB0'+"*"+"\n"+
        "טמפרטורה מורגשת: "+response.main.feels_like+'\xB0'+"\n"+
        "מדינה: "+"*"+response.sys.country+"*"+"\n"+
        "מיקום העיר: "+"https://www.google.com/maps/?q="+response.coord.lat+","+response.coord.lon

        )
      }
    })
}
//CORONA
function getCoronaData(country)
{
  let url = "https://worldometers.p.rapidapi.com/api/coronavirus/country/"+country;
  console.log(country)
  console.log(url)
  return fetch(encodeURI(url), {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2319fd2794msh529fffcf7f3493dp1abac2jsn50240c1fc7d8",
		"x-rapidapi-host": "worldometers.p.rapidapi.com"
	}
})
.then(response => {
	return response.json()
})
.then(response => {
	return("מדינה: "+"*"+response.data.Country+"*\n"+
  "אוכלוסיה: "+response.data.Population+"\n"+
  "חולים פעילים: "+response.data["Active Cases"]+"\n"+
  "חולים קשה: "+response.data.Critical+"\n"+
  "סך הכל מקרים: "+response.data["Total Cases"]+"\n"+
  "סך הכל מקרי המוות: "+response.data["Total Deaths"]+"\n"+
  "מספר המחלימים: " +response.data["Total Recovered"]+"\n"+
  "מספר החולים למיליון איש: ")+response.data["Total Cases/1M pop"]+"\n"+
  "סך הכל בדיקות: "+response.data["Total Tests"]+"\n"+
  "עודכן לארחונה ב: "+response.last_update+"\n"+
  "מיקום המדינה: "+"https://www.google.com/maps/search/?api=1&query="+response.data.Country
  
})
.catch((error) => {
  return "המדינה לא נמצאה"
});
}
//WHATSAPP

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('message', async (message) => {
  console.log(message.body)
  if(message.body === 'ךרע' || message.body === 'ערך') {
    makeWikiRequest().then(function(result) {
      message.reply(result)
  });
  }
  if(message.body === 'ביד' || message.body === 'דיב') {
    let chat = await message.getChat();
    if (!chat.isGroup) 
    {
      message.reply("תהנה אח יקר\n"+sites[Math.floor(Math.random() * sites.length)])
    }
    else{
      message.reply("לא מתאים אח שלנו")
    }
  }
  if(message.body === 'פקודות' || message.body === 'תודוקפ') {
    message.reply("מידע על הקבוצה - מידע על הקבוצה שבה נכתבה ההודעה"+"\n"+"גימטריה *מילה*"+"\n"+"תחזית של עיר - תחזית *עיר*"+"\n"+"ערך רנדומלי בוויקיפדיה - ערך"+"\n"+"נתנונים על קורונה - קורונה *מדינה*(באנגלית)")
  }
  if(message.body.includes('תחזית') || message.body.includes('תיזחת')) {
    let cityname = message.body.split(" ")[1]
    if(message.body.split(" ")[2]!=null)
      cityname=cityname+" "+message.body.split(" ")[2]
    console.log(cityname)
    makeWeatherRequests(cityname).then(function(result) {
      console.log(result)
      message.reply(result)
  });
  }
  if(message.body.includes('קורונה') || message.body.includes('הנורוק')) {
    let countryname = message.body.split(" ")[1]
    if(message.body.split(" ")[2]!=null)
      countryname=countryname+message.body.split(" ")[2]
    console.log(countryname)
      getCoronaData(countryname).then(function(result) {
      message.reply(result)
  });
  }
  if(message.body.includes('גימטריה') || message.body.includes('הירטמיג')) {
    if (message.body.match(/[a-z]/i)) {
      message.reply("רק אותיות בעברית")
    }
    else
    {
      let sum='';
      const words = message.body.split(" ")
      for(let i=1;i<words.length-1;i++)
        sum = sum+words[i]+" "
      console.log(sum)
      var gimatriya = Gematria(sum);
      message.reply(sum+" = "+gimatriya.toMisparHaPanim()+" בגימטריה")
    }
  }
  if (message.body === 'מידע על הקבוצה' || message.body === 'הצובקה לע עדימ') {
    let chat = await message.getChat();
    if (chat.isGroup) {
        message.reply(`
            שם הקבוצה: ${chat.name}
            תיאור: ${chat.description}
            קיים מ-: ${chat.createdAt.toDateString()}
            נוצר על ידי: +${chat.owner.user}
            מספר משתתפים: ${chat.participants.length}
        `);
    } else {
        message.reply('פקודה רק לקבוצות');
    }
 
}});
client.initialize();
