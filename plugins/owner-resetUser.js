let handler = async (m, { conn }) => {

  let user
  if (m.quoted) {
    user = m.quoted.sender
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0]
  } else {
    user = m.sender
  }

  // 📌 Verificar si existe en la DB
  if (!global.db.data.users[user]) {
    return m.reply('❏ El usuario no está en la base de datos')
  }

  delete global.db.data.users[user]

  let number = user.split('@')[0]

  conn.reply(
    m.chat,
    `*❏ USUARIO ELIMINADO*\n\n✅ @${number} fue eliminado de la base de datos`,
    m,
    { mentions: [user] }
  )
}

handler.help = ['reset-user']
handler.tags = ['owner']
handler.command = ['reset-user', 'resetuser']
handler.rowner = true

export default handler