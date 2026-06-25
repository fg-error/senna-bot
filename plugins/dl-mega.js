 
import { File } from 'megajs'
import mime from 'mime-types'
let handler = async (m, { conn, args }) => {
	if (!args[0]) throw `✳️ Ingrese link de Mega`
	m.react(rwait)
	
	try {
	let file = File.fromURL(args[0])
	file = await file.loadAttributes()
	let data = await file.downloadBuffer()
	let type = mime.contentType(file.name); 
	let size = formatFileSize(file.size)

	let cap = ` 
*📌Nombre:* ${file.name}
*⚖️Tamaño:* ${size}
`
 await conn.sendFile(m.chat, data, file.name, cap, m, null, { mimetype: type, asDocument: true })
	m.react(done)
	} catch {
    m.reply(`✳️ Error`)
  }
}
handler.help = ['mega']
handler.tags = ['dl', 'prem']
handler.command = ['mega', 'megadl']
handler.premium = false

export default handler

// convierte Bytes a KB, MB o GB
let formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1024 * 1024) {
    const kilobytes = Math.round(bytes / 1024);
    return kilobytes + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    const megabytes = (bytes / (1024 * 1024)).toFixed(2);
    return megabytes + " MB";
  } else {
    const gigabytes = (bytes / (1024 * 1024 * 1024)).toFixed(2);
    return gigabytes + " GB";
  }
};
