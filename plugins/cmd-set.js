
let handler = async (m, { text, usedPrefix, command }) => {
    global.db.data.sticker = global.db.data.sticker || {}
    if (!m.quoted) throw `✳️ Responde a un mensaje`
    if (!m.quoted.fileSha256) throw `⚠️ Responde a un sticker`
    if (!text) throw `✳️ Falta el comando`
    let sticker = global.db.data.sticker
    let hash = m.quoted.fileSha256.toString('base64')
    if (sticker[hash] && sticker[hash].locked) throw '⚠️ No tienes permiso para cambiar este comando de Sticker'
    sticker[hash] = {
        text,
        mentionedJid: m.mentionedJid,
        creator: m.sender,
        at: + new Date,
        locked: false,
    }
    m.reply(`✅ Comando guardado`)
}


handler.help = ['setcmd <text>']
handler.tags = ['cmd']
handler.command = ['setcmd']
handler.rowner = true

export default handler
