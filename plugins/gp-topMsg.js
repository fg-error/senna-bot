let handler = async (m, { conn }) => {
    let stats = global.db.data.statsMsg || {}

    if (!stats[m.chat]) return m.reply('📊 No hay datos aún en este grupo')

    let users = Object.entries(stats[m.chat])

    let sorted = users.sort((a, b) => b[1] - a[1])

    let top = sorted.slice(0, 10)

    let text = '🏆 *TOP MENSAJES DEL GRUPO*\n\n'

    for (let i = 0; i < top.length; i++) {
        let user = top[i][0]
        let count = top[i][1]

        text += `${i + 1}. @${user.split('@')[0]} ➭ *${count} mensajes*\n`
    }

    conn.reply(m.chat, text, m, {
        mentions: top.map(v => v[0])
    })
}
handler.help = ['topmsg']
handler.tags = ['group']
handler.command = ['topmsg']
handler.group = true

export default handler