import { createHash } from 'crypto'

let handler = async function (m, { conn, text, usedPrefix, command }) {

  text = text || m.text || ''
  text = text.trim()

  let user = global.db.data.users[m.sender]

  if (user.registered)
    return m.reply(`✳️ Ya estás registrado.\nUsa ${usedPrefix}unreg <sn> para eliminar tu registro.`)

  let ejemplo = `✳️ Uso correcto:
${usedPrefix + command} Nombre+Edad+Genero

Ejemplo:
${usedPrefix + command} FG+20+M

M = Hombre
F = Mujer
N = Otro`

  // 🔥 SEPARAMOS MANUALMENTE (SIN REGEX PROBLEMÁTICA)
  let parts = text.split('+')

  if (parts.length !== 3) return m.reply(ejemplo)

  let name = parts[0].trim()
  let age = parseInt(parts[1])
  let gen = parts[2].trim().toUpperCase()

  if (!name || !age || !gen) return m.reply(ejemplo)

  if (name.length > 30)
    return m.reply('✳️ El nombre es demasiado largo.')

  if (age < 10)
    return m.reply('🚼 Eres muy pequeño.')

  if (age > 60)
    return m.reply('👴🏻 Wow el abuelo quiere jugar.')

  if (!['M','F','N'].includes(gen))
    return m.reply('✳️ Género inválido. Usa M, F o N.')

  let genero =
    gen === 'M' ? '🙆🏻‍♂️ Hombre' :
    gen === 'F' ? '🤵🏻‍♀️ Mujer' :
    '⚧ Otro'

  user.name = name
  user.age = age
  user.genero = genero
  user.regTime = Date.now()
  user.registered = true

  let sn = createHash('md5').update(m.sender).digest('hex')

  let msg = `
┌─「 REGISTRADO 」─
▢ Nombre: ${name}
▢ Edad: ${age}
▢ Género: ${genero}
▢ Serial:
${sn}
└──────────────`

  await conn.reply(m.chat, msg.trim(), m)
}

handler.help = ['reg Nombre+Edad+Genero']
handler.tags = ['rg']
handler.command = ['reg','register','registrar','verify']

export default handler