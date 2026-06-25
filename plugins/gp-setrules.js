
let handler = async function (m, { conn, text, usedPrefix }) {
	
	let chat = global.db.data.chats[m.chat]
  if (text) {
    chat.rules = text
    m.reply(`✅ Se estableció las *Normas del Grupo*`)
  } else throw `✳️ Ingrese las Normas del Grupo`
     
} 
handler.help = ['setrules <text>']
handler.tags = ['group']
handler.command = ['setrules', 'addrules', 'addrule'] 
handler.group = true
handler.admin = true

export default handler
