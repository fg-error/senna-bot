
let handler = async (m, { conn, args, usedPrefix, command }) => {
   
let exa = `✳️ Uso del comando
*${usedPrefix + command}*  [Tipo] [Monto] [@user]

📌 Ejemplo : 
*${usedPrefix + command}* coin 65 @${m.sender.split('@')[0]}

📍 Artículos transferibles
┌──────────────
▢ *diamond* = Diamante} 💎
▢ *coin* = Coins 🪙
└──────────────`

 if (!args[0] || !args[1] ) return m.reply(exa, null, { mentions: [m.sender] })
    
    let type = args[0].toLowerCase()
    let amount = parseInt(args[1])
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
    if (!who) return m.reply(`✳️ Mensiona a alguien`)
    
    if (!['coin', 'diamond'].includes(type)) return m.reply(exa, null, { mentions: [m.sender] })
    
    if (isNaN(amount) || amount <= 1) throw `✳️ Debe ser un numero valido`
    
    let user = global.db.data.users[m.sender]
    let whoData = global.db.data.users[who]
    
    if (!whoData) return m.reply(`✳️ El usuario no esta en mi DB`)
    
    let currencyName = type === 'coin' ? `Coin` : `Diamante`
    
    if (user[type] < amount) throw `✳️ *${currencyName}* Insuficiente para transferir`
    
    user[type] -= amount;
    whoData[type] += amount;
    
    m.reply(`✅ Se realizó la transferencia de \n\n*${amount}* *${currencyName}* a @${who.split('@')[0]}.`, null, { mentions: [who] })
}
handler.help = ['transfer'].map(v => v + ' [tipo] [monto] [@tag]')
handler.tags = ['econ']
handler.command = ['payxp','paydi', 'transfer', 'darxp','dardi', 'pay']
handler.disabled = false

export default handler

