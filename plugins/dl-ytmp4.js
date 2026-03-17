 
import fetch from 'node-fetch'
import fg from 'fg-senna' 
let limit = 320
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
	if (!args || !args[0]) throw `✳️ Ejemplo :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`
    if (!args[0].match(/youtu/gi)) throw `❎ ingresa link de YouTube `
	 let chat = global.db.data.chats[m.chat]
	 m.react(rwait)  
try {
    	let q = args[1] || '360p'
	    
        let res = await fg.ytv(args[0], q)

let { title, dl_url, thumb, size, sizeB, duration, quality } = res

let isLimit = limit * 1024 * 1024 < sizeB

 await conn.loadingMsg(m.chat, '📥 Descargando', ` ${isLimit ? `≡  *FG YTDL*\n\n▢ *⚖️Tamaño*: ${size}\n\n▢ _Supera el limite de descarga_ *+${limit} MB*` : '✅ Descarga Completada' }`, ["▬▭▭▭▭▭", "▬▬▭▭▭▭", "▬▬▬▭▭▭", "▬▬▬▬▭▭", "▬▬▬▬▬▭", "▬▬▬▬▬▬"], m)
 
  if(!isLimit) conn.sendFile(m.chat, dl_url, title + '.mp4', `
≡  *FG YTDL*

*📌Titulo:* ${title}
*⚖️Tamaño:* ${size}
*🎞️Calidad* : ${q}
`.trim(), m, false, { asDocument: chat.useDocument })
	m.react(done) 
		
	} catch (e) {
		await m.reply(`❎ Error`)
		} 
}
handler.help = ['ytmp4 <link yt>']
handler.tags = ['dl'] 
handler.command = ['ytmp4', 'fgmp4']
handler.diamond = false

export default handler