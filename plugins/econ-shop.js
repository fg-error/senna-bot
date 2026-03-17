
let handler = async (m, { conn, usedPrefix, command, args }) => {
  
  m.reply(`
┌───⊷ *TIANDA* ⊶
▢ _01_ - Diamante = 200🪙
▢ _02_ - Premiun =  1h 50💎  (1d 800💎)
└────────────── 

Puedes comprar usando *${usedPrefix}buy* <ID> <monto>

📌Ejemplo:
*${usedPrefix}buy* 01 20
*${usedPrefix}buy* 02 1h
  `, null, fwc)
}
handler.help = ['shop']
handler.tags = ['econ']
handler.command = ['shop', 'tienda'] 

export default handler
