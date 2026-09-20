
import fg from 'fg-senna' 
let free = 150 // limite de descarga
let prem = 500
let handler = async (m, { conn, args, usedPrefix, command, isOwner, isPrems }) => {

	if (!args[0]) throw `✳️ Ingrese un link`
	m.react(rwait) 
	
	try {
	let res = await fg.gdrive(args[0])

	let limit = isPrems || isOwner ? prem : free
    let isLimit = res.fileSizeB > limit * 1024 * 1024
	 await m.reply(`
≡ *Google Drive DL*

*📌Nombre:* ${res.fileName}
*⚖️Tamaño:* ${res.fileSize}
${isLimit ? `\n▢ El archivo supera el límite de descarga *+${free} MB* Pásate a premium para poder descargar archivos de hasta *${prem} MB*` : ''} 
`)
		
	if(!isLimit) conn.sendMessage(m.chat, { document: { url: res.downloadUrl }, fileName: res.fileName, mimetype: res.mimetype }, { quoted: m })
	m.react(done)
   } catch {
	m.reply("error") 
  }
}
handler.help = ['gdrive']
handler.tags = ['dl', 'prem']
handler.command = ['gdrive']
handler.diamond = true
//handler.premium = true

export default handler
