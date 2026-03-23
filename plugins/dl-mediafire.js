
import fg from 'fg-senna'
import fetch from 'node-fetch'
let free = 150 // limite de descarga
let prem = 800
let handler = async (m, { conn, args, text, usedPrefix, command, isOwner, isPrems }) => {
	  
   if (!args[0]) throw `✳️ Ingrese link de Mediafire`
    if (!args[0].match(/mediafire/gi)) throw `❎ Ingrese link de Mediafire`
    m.react(rwait)

    let limit = isPrems || isOwner ? prem : free
  try {

	let res = await fg.mediafire(args[0])
    let { url, type, filename, ext, aploud, size, sizeB } = res
   
	   let isLimit = limit * 1024 * 1024 < sizeB
    let caption = `
   ≡ *MEDIAFIRE DL*

*📌Nombre:* ${filename}
*⚖️Tamaño:* ${size}
*🔼Subido:* ${aploud}
${isLimit ? `\n▢ Limite superado *+${free} MB* pasate a premium para descargar hasta *${prem} MB*` : ''} 
`.trim()
//await conn.sendFile(m.chat, ss, 'ssweb.png', caption, m, null, fwc)
m.reply(caption)
if(!isLimit) await conn.sendFile(m.chat, url, filename, '', m, null, { mimetype: ext, asDocument: true })
 
m.react(done)
  } catch {
    m.reply("error")
  }

  

}
handler.help = ['mediafire <url>']
handler.tags = ['dl', 'prem']
handler.command = ['mediafire', 'mfire'] 
handler.diamond = true
handler.premium = false

export default handler