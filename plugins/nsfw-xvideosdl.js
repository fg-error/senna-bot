
import fetch from 'node-fetch'
import fg from 'fg-senna'
let handler = async (m, {conn, text, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
   // if (!chat.nsfw) throw `🚫 El grupo no admite contenido nsfw\nUsa este grupo\n${fg_gpnsfw}\n\nSi eres admin habilita con\n*${usedPrefix}enable* nsfw`
    let user = global.db.data.users[m.sender].age
    //if (user < 17) throw `❎ ${mssg.nsfwAge}`
    if (!text) throw `✳️ Ingrese lo que desea buscar`
   m.react(rwait)

   if (text.includes('http://') || text.includes('https://')) {
        if (!text.includes('xvideos.com')) return m.reply(`❎ Revisa que link sea correcto`)

        try {     
            let xv = await fg.xvideos(text)
            conn.sendFile(m.chat, xv.url_dl, xv.title + '.mp4', `
≡  *XVIDEOS DL*
                
*📌Titulo*: ${xv.title}
*👍Likes* : ${xv.likes}
`.trim(), m, false, { asDocument: chat.useDocument })
    m.react(done)
    } catch (e) {
        m.reply(`🔴 Error`)
    }
    } else {

    try {
    let res = await fg.sxvideos(text)
    let fgg = res.map((v, i) => `📌 *Titulo* : ${v.title}\n⌚ *Duracion:* ${v.duration}\n*🔗Link:* ${v.url}\n`).join('─────────────────\n\n') 
    m.reply(fgg)
    } catch (e) {
    m.reply(`🔴 Error`, null, fwc)
     } 
    }

}
handler.help = ['xvideos'] 
handler.tags = ['nsfw', 'prem']
handler.command = ['xvideossearch', 'xvideo', 'xvideos', 'xvideodl'] 
//handler.diamond = 5
handler.group = true
handler.premium = true
handler.register = true

export default handler
