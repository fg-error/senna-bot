
let handler = async (m, { conn, text, usedPrefix, command, args }) => {
 
  if (!text) throw `✳️ Cuantos *Coins* estas intentando retirar?`

 // let count = parseInt(args[0])
  let user = global.db.data.users[m.sender]
  
  if (args[0].toLowerCase() !== 'all' && !/^[1-9]\d*$/.test(args[0])) throw `✳️ Debe ser un numero valido`
  let all =  Math.floor(global.db.data.users[m.sender].bank)
  let count = args[0].replace('all', all)
   count = Math.max(1, count)

  if (isNaN(count)) throw `✳️ Debe ser un mumero valido`
  if (count > user.bank) throw `✳️ No puedes retirar mas de lo que tienes en el banco`

    user.bank -= count
    user.coin += count

    m.reply(`✅ Has retirado *${count.toLocaleString()}🪙*`, null, fwc)
  
}
handler.help = ['wd']
handler.tags = ['econ']
handler.command = ['withdraw','wd', 'retirar']

export default handler
