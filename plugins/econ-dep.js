
let handler = async (m, { conn, text, usedPrefix, command, args }) => {
 
    if (!text) throw `✳️ Uso del comando\n\n*${usedPrefix + command}* <monto o all>`
  
   if (args[0].toLowerCase() !== 'all' && !/^[1-9]\d*$/.test(args[0])) throw `✳️ La cantidad debe ser un número válido`
    let all =  Math.floor(global.db.data.users[m.sender].coin)
    let count = args[0].replace('all', all)
     count = Math.max(1, count)
     
  //  if (isNaN(count)) throw `✳️ ${mssg.isNan}`
  
    if (global.db.data.users[m.sender].coin >= count) {
      global.db.data.users[m.sender].coin -= count
      global.db.data.users[m.sender].bank += count
  
      m.reply(`✅ Has depositado *${count}🪙* al Banco`, null, fwc)
    } else m.reply(`❎ No tienes dinero para depositar`, null, fwc)
  
  }
  handler.help = ['dep']
  handler.tags = ['econ']
  handler.command = ['dep','depositar'] 
  
  export default handler
  