
import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk' 
import { fileURLToPath } from 'url' 

global.owner = [
  ['5491168352204', 'FG', true],
  ['59172945992']
] //Numeros de owner 

global.mods = [''] 
global.prems = ['50489079501', '573143917092']
global.botNumber = ['']  //-- numero del bot
global.APIs = { // API Prefix
  // name: 'https://website' 
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
  //fgmods: 'https://api-fgmods.ddns.net'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.fgmods.xyz': 'shen' //--- Regístrese en https://api.fgmods.xyz/
}

// Sticker WM
global.packname = 'Senna┃ᴮᴼᵀ' 
global.author = '@fg.error' 

//--info FG
global.botName = 'Senna'
global.fg_ig = 'https://instagram.com/fg.error' 
global.fg_sc = 'https://github.com/FG98F/dylux-bot' 
global.fg_yt = 'https://youtube.com/fg98f'
global.fg_pyp = 'https://paypal.me/fg98f'
global.fg_logo = 'https://i.ibb.co/1zdz2j3/logo.jpg' 

//--- Grupos WA
global.id_canal = '120363177092661333@newsletter' //-ID de canal de WhatsApp
global.canal_log = 'https://whatsapp.com/channel/0029Vb5vgQAHgZWYchqbIb0u'
global.canal_logid = '120363398698937291@newsletter'
global.fg_canal = 'https://whatsapp.com/channel/0029VaCeuZd6mYPQiWqxXj1F'
global.fg_group = "https://chat.whatsapp.com/BESBo5xjvIZE4YVvth6Yzr"
global.fg_gpnsfw = 'https://chat.whatsapp.com/F0JTTyZ3hsoL7OlU8TEpuH' //--GP NSFW

//--emojis
global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 

global.multiplier = 69 

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
