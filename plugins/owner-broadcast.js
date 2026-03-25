let handler = async (m, { conn, text }) => {

  // 📌 Obtener chats
  let chats = Object.entries(conn.chats)
    .filter(([_, chat]) => chat?.isChats)
    .map(v => v[0])

  if (!chats.length) throw '❌ No hay chats disponibles'

  // 📩 Mensaje (quoted o actual)
  let msg = m.quoted ? await m.getQuotedObj().catch(_ => null) : m

  let teks = text || msg?.text || ''
  if (!teks) throw '❌ Escribí o respondé a un mensaje'

  // 🧾 Formato del mensaje
  let finalText = /bc|broadcast|tx/i.test(teks)
    ? teks
    : `*TRANSMISIÓN ┃ STAFF*\n━━━━━━━━━━━━━━━\n\n${teks}`

  await conn.reply(m.chat, `📢 Enviando a *${chats.length} chats...*`, m)

  let sukses = 0
  let gagal = 0

  for (let id of chats) {
    try {
      await conn.copyNForward(
        id,
        conn.cMod(m.chat, msg, finalText),
        true
      )
      sukses++

      // ⏱️ Delay anti-ban
      await new Promise(r => setTimeout(r, 800))

    } catch (e) {
      gagal++
    }
  }

  // ✅ Resultado
  await conn.reply(m.chat, `✅ Transmisión enviada\n\n✔️ Enviados: ${sukses}\n❌ Fallidos: ${gagal}`,m)
}

handler.help = ['tx <mensaje>']
handler.tags = ['owner']
handler.command = /^(broadcast|bc|tx)$/i
handler.owner = true

export default handler