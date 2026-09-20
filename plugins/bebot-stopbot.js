let handler = async (m, { conn }) => {
if (global.conn.user.jid === conn.user.jid) {
await conn.reply(m.chat, '✳️ ¿Por qué no vas directamente a la terminal?', m)
} else {
await conn.reply(m.chat, `✅ Bot desconectado`, m)
m.react(done)
conn.intentionalStop = true
global.conns = global.conns.filter(c => c !== conn)
try {
conn.ws?.close()
} catch {}
}
}

handler.help = ['stop']
handler.tags = ['bebot']
handler.command = ['stop', 'stopbot', 'stopbebot']
handler.owner = true

export default handler 