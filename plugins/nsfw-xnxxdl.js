 
import fetch from 'node-fetch'
import fg from 'fg-senna'
let handler = async (m, { conn, args, text, usedPrefix, command }) => {

 let chat = global.db.data.chats[m.chat]
  if (!chat.nsfw) throw `🚫 El grupo no admite contenido nsfw\nUsa este grupo\n${fg_gpnsfw}\n\nSi eres admin habilita con\n*${usedPrefix}enable* nsfw`
  let user = global.db.data.users[m.sender].age
  if (user < 17) throw `❎ Eres menor de edad! vuelve cuando tengas mas de 18`
  if (!text) throw `✳️ Ingresa lo que desea buscar`
    
    m.react(rwait)
    if (text.includes('http://') || text.includes('https://')) {
        if (!text.includes('xnxx.com')) return m.reply(`❎ Revisa que el link correcto`)
        try {
            let xn = await fg.xnxx(text)
            conn.sendFile(m.chat, xn.url_dl, xn.title + '.mp4', `
≡  *XNXX DL*
            
*📌Titulo*: ${xn.title}
*⌚Duracion:* ${xn.duration}
*🎞️Calidad:* ${xn.quality}
`.trim(), m, false, { asDocument: chat.useDocument })
 m.react(done)
 } catch (e) {
    m.reply(`🔴 Error `)
 }
    } else {
        try {
            let res = await fg.sxnxx(text)
             let fgg = res.result.map((v, i) => `*📌Titulo* : ${v.title}\n*🔗Link:* ${v.link}\n`).join('─────────────────\n\n') 
              if (res.status) m.reply(fgg)       
              } catch (e) {
              m.reply(`🔴 Error`, null, fwc)
               }
    }
}
handler.help = ['xnxx'] 
handler.tags = ['nsfw', 'prem']
handler.command = ['xnxxsearch', 'xnxxdl', 'xnxx'] 
handler.diamond = 2
handler.premium = false
handler.register = true

export default handler
