
let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    try {
        let media = await q.download?.()
        let caption = q.text || ''
        await conn.sendFile(m.chat, media, null, caption, m, null, fwc)
    } catch (e) {
        m.reply('✳️ Eso no es un mensaje de View Once.')
    }
}
handler.help = ['readvo']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver', 'readvo'] 

export default handler
