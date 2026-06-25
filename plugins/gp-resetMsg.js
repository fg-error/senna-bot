let handler = async (m, { conn }) => {

    let stats = global.db.data.statsMsg || {}
    if (!stats[m.chat]) {
        return m.reply('⚠️ No hay contador en este grupo')
    }

    // borrar datos del grupo
    delete stats[m.chat]

    global.db.data.statsMsg = stats

    m.reply('🧹 *Contador de mensajes reiniciado en este grupo*')
}

handler.help = ['resetmsg']
handler.tags = ['group']
handler.command = ['resetmsg']
handler.group = true
handler.admin = true 

export default handler