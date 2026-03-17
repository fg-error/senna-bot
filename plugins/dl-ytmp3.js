 
import fetch from 'node-fetch'
import fg from 'fg-senna' 

let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
    if (!args || !args[0]) throw `✳️ Ejemplo :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`
    if (!args[0].match(/youtu/gi)) throw `❎ ingresa link de YouTube `
     let chat = global.db.data.chats[m.chat]
     m.react(rwait)  
try {
        let res = await fg.ytv(args[0], "240p")

let { title, dl_url, thumb, size, sizeB, duration, quality } = res

conn.sendFile(m.chat, dl_url, title + '.mp3', `
 ≡  *FG YTDL*
  
▢ *📌Titulo* : ${title}
`.trim(), m, false, { mimetype: 'audio/mpeg', asDocument: chat.useDocument })
    m.react(done) 
        
    } catch (e) {
        await m.reply(`❎ Error`)
        } 
}
handler.help = ['ytmp3 <url>']
handler.tags = ['dl']
handler.command = ['ytmp3', 'fgmp3'] 
handler.diamond = false

export default handler