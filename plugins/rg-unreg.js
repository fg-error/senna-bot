
import { createHash } from 'crypto'
let handler = async function (m, { conn, args, usedPrefix}) {
  if (!args[0]) throw `✳️ Verifique su *Serial* con el comando\n\n${usedPrefix}serial`
  let user = global.db.data.users[m.sender]
  const sn = createHash('md5').update(m.sender).digest('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
  if (args[0] !== sn) throw `⚠️ *Serial incorrecto*`
  user.registered = false
  user.rgenero = false
  m.reply(`✅ Registro Eliminado`, null, fwc)
}
handler.help = ['unreg <Num Serie>'] 
handler.tags = ['rg']
handler.command = ['unreg'] 
handler.register = true

export default handler

