
let handler = async (m, { conn, participants, groupMetadata }) => {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/avatar_contact.png'
    const { isBanned, welcome, detect, sWelcome, sBye, sPromote, sDemote, antiLink, nsfw, captcha, useDocument } = global.db.data.chats[m.chat]
    const groupAdmins = participants.filter(p => p.admin)
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
    let text = `
┌──「 *INFO DE GRUPO* 」
▢ *♻️ID:*
   • ${groupMetadata.id} 
▢ *🔖Nombre:* 
• ${groupMetadata.subject}
▢ *👥miembros:* ${participants.length}
▢ *🤿Dueño del grupo:*
• wa.me/${owner.split('@')[0]}
▢ *🕵🏻‍♂️Admins:* ${groupAdmins.length}

▢ *🪢 Configuración de grupo:*
• 📮 *Welcome:* ${welcome ? '✅' : '❎'}
• ❕ *Detect:* ${detect ? '✅' : '❎'}
• 🔞 *Nsfw:* ${nsfw ? '✅' : '❎'}
• 🚨 *Anti Link Wha:* ${antiLink ? '✅' : '❎'}
• 🧬 *Captcha:* ${captcha ? '✅' : '❎'}
• 📑 *Document:* ${useDocument ? '✅' : '❎'}

*▢  📬 Configuración de Mensajes:*
• *Welcome:* ${sWelcome}
• *Bye:* ${sBye}

▢ *📌Descripcion* :
   • ${groupMetadata.desc?.toString() || 'desconocido'}
`.trim()
    conn.sendFile(m.chat, pp, 'pp.jpg', text, m, null, fwc)
}

handler.help = ['infogp']
handler.tags = ['group']
handler.command = ['infogrupo', 'groupinfo', 'infogp'] 
handler.group = true

export default handler
