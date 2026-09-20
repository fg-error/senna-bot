
let handler = async (m, {conn, usedPrefix}) => {
	
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[who]
    if (!(who in global.db.data.users)) throw `✳️ Usuario no esta registrado`
    conn.reply(m.chat, `
 ≡ *Nombre:* @${who.split('@')[0]}

 💰 *MONEDERO*
┌───⊷
▢ *💎Diamantes:* _${user.diamond.toLocaleString()}_
▢ *🪙Coins:* _${user.coin.toLocaleString()}_
└──────────────

🏦 *BANCO*
┌───⊷
▢ *🪙Coins:* _${user.bank.toLocaleString()}_
└──────────────
`, m, { mentions: [who] })
}
handler.help = ['balance']
handler.tags = ['econ']
handler.command = ['bal', 'diamantes', 'diamond', 'balance'] 

export default handler
