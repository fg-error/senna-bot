let handler = async (m, { conn, args, participants }) => {

  if (!args[0] || isNaN(args[0]))
    return m.reply('✳️ Ingresa un prefijo válido\nEjemplo: .num 54')

  let prefix = args[0].replace(/\+/g, '')

  let users = []

  for (let p of participants) {

    // Usar phoneNumber si existe
    let jid = p.phoneNumber || p.id
    if (!jid) continue

    if (jid === conn.user.jid) continue

    let number = jid.split('@')[0]

    if (!/^\d+$/.test(number)) continue

    if (number.startsWith(prefix)) {
      users.push(jid)
    }
  }

  if (!users.length)
    return m.reply(`✳️ No hay miembros con el prefijo +${prefix}`)

  let text = `≡ Usuarios con prefijo +${prefix}\n\n`
  text += `Total: ${users.length}\n\n`

  for (let jid of users) {
    let number = jid.split('@')[0]
    text += `▢ @${number}\n`
  }

  await conn.sendMessage(m.chat, {
    text,
    mentions: users
  }, { quoted: m })
}

handler.help = ['num <54>']
handler.tags = ['group']
handler.command = ['num']
handler.admin = true

export default handler