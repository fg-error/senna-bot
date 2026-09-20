
import fg from 'fg-senna';
let handler  = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) throw `✳️ Ejemplo: *${usedPrefix + command}* Billie Eilish`
  let res = await fg.gimage(text)
  conn.sendFile(m.chat, res.getRandom(), 'img.png', `
✅ Resultado`, m, null, fwc)
}
handler.help = ['imagen']
handler.tags = ['img']
handler.command = /^(img|image|gimage|imagen)$/i
handler.diamond = true

export default handler
