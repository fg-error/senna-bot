
import fg from 'fg-senna'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  
if (!args[0]) throw `✳️ Ingrese un Link de Facebook\n\n📌 Ejemplo :\n*${usedPrefix + command}* https://fb.watch/d7nB8-L-gR/`
  m.react(rwait)

  try {
    let res = await fg.fbdl(args[0])
    conn.sendFile(m.chat, res.HD, 'fb.mp4', `✅ Resultado`, m, null, fwc)
    m.react(done)
  } catch (error) {
    m.reply("error intente mas tarde") 
  }
}
handler.help = ['facebook'].map(v => v + ' <url>')
handler.tags = ['dl']
handler.command = /^((facebook|fb)(downloder|dl)?)$/i
handler.diamond = true

export default handler
