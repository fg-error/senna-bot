
import { createHash } from 'crypto'
let handler = async function (m, { conn, args, usedPrefix}) {
  if (!args[0]) throw `✳️ Verifique su número de serie con el comando\n\n${usedPrefix}nserie`
  let user = global.db.data.users[m.sender]
  let sn = createHash('md5').update(m.sender).digest('hex')
  if (args[0] !== sn) throw `⚠️ *Número de serie incorrecto*`
  user.registered = false
  user.rgenero = false
  m.reply(`✅ Registro Eliminado`, null, fwc)
}
handler.help = ['unreg <Num Serie>'] 
handler.tags = ['rg']
handler.command = ['unreg'] 
handler.register = true

export default handler

