
let handler = async function (m, { conn, text, usedPrefix }) {
	
	let chat = global.db.data.chats[m.chat]
    if (chat.rules === '') throw `✳️ Grupo sin Reglas por el momento`
     m.reply(`📜 *Normas del Grupo*\n\n${chat.rules}`, null, fwc)
     
}
handler.help = ['rules']
handler.tags = ['group']
handler.command = ['rules', 'reglas'] 

export default handler
