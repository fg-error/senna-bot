import yts from 'yt-search'
import fg from 'fg-senna'

let limit = 320
let confirmation = {}

let handler = async (m, { conn, args, text, usedPrefix, command }) => {

if (!text) throw `✳️ Ejemplo\n${usedPrefix + command} Lil Peep`

let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    let chat = global.db.data.chats[m.chat];

let res = await yts(text)
let vid = res.videos[0]

if (!vid) throw `❎ Video no encontrado`

let { title, thumbnail, url, timestamp, views, ago } = vid

m.react('🎧')

let msg = `≡ *FG MUSIC*
┌──────────────
▢ 📌 *Titulo:* ${title}
▢ 📆 *Subido:* ${ago}
▢ ⌚ *Duración:* ${timestamp}
▢ 👀 *Vistas:* ${views.toLocaleString()}
└──────────────

Responde al mensaje con 1 o 2:

1 = MP3
2 = MP4
`

await conn.sendFile(m.chat, thumbnail, "play.jpg", msg, m)

// Guardar en memoria para confirmar después
    confirmation[m.sender] = {
        sender: m.sender,
        to: who,
        url: url, 
        chat: chat, 
        timeout: setTimeout(() => {
            delete confirmation[m.sender];

            //conn.reply(m.chat, `⏳ Tiempo de respuesta agotado. Vuelve a intentarlo.`, m);
        }, 60000), // 1 minuto de espera
    };


}

handler.help = ['play']
handler.tags = ['dl']
handler.command = ['play','playvid']

export default handler

handler.before = async m => {
    if (m.isBaileys) return; // Ignorar mensajes del bot
    if (!(m.sender in confirmation)) return; // Solo continuar si hay confirmación pendiente

    let { sender, timeout, url, chat } = confirmation[m.sender]; // Desestructuración que incluye la url y chat
    if (m.text.trim() === '1') {
        clearTimeout(timeout);
        delete confirmation[m.sender];

                  let res = await fg.ytv(url, "240p")
               
               let { title, dl_url, thumb, size, sizeB, duration, quality } = res
               
               conn.sendFile(m.chat, dl_url, title + '.mp3', `
≡  *FG YTDL*
                 
▢ *📌Titulo* : ${title}
`.trim(), m, false, { mimetype: 'audio/mpeg', asDocument: chat.useDocument })
                   m.react(done) 

    } else if (m.text.trim() === '2') {
        clearTimeout(timeout);
        delete confirmation[m.sender];

        let res = await fg.ytv(url, "480p")
        
        let { title, dl_url, thumb, size, sizeB, duration, quality } = res
        
        let isLimit = limit * 1024 * 1024 < sizeB
        
         await conn.loadingMsg(m.chat, '📥 Descargando', ` ${isLimit ? `≡  *FG YTDL*\n\n▢ *⚖️Tamaño*: ${size}\n\n▢ _Supera el limite de descarga_ *+${limit} MB*` : '✅ Descarga Completada' }`, ["▬▭▭▭▭▭", "▬▬▭▭▭▭", "▬▬▬▭▭▭", "▬▬▬▬▭▭", "▬▬▬▬▬▭", "▬▬▬▬▬▬"], m)
         
          if(!isLimit) conn.sendFile(m.chat, dl_url, title + '.mp4', `
≡  *FG YTDL*
        
*📌Titulo:* ${title}
*⚖️Tamaño:* ${size}
`.trim(), m, false, { asDocument: chat.useDocument })
            m.react(done)
    }

}