import { createHash } from 'crypto'

const REGEX = /^\s*([^+|]+?)\s*[\+|]\s*([0-9]{1,3})\s*[\+|]\s*([MFN])\s*$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {

  let user = global.db.data.users[m.sender] || {}

  // Verificar si ya está registrado
 if (user.registered) throw `✅ Ya estás registrado.\n\nUsa *${usedPrefix}unreg <sn>* para eliminar tu registro.`
  

  text = (text || '').trim()

  const ayuda = `📌 *Formato incorrecto*

👉 Usa el comando así:
*${usedPrefix + command} Nombre+Edad+Género*

📍 Ejemplo:
*${usedPrefix + command} FG+20+M*

📋 Géneros disponibles:
- *M* → Hombre
- *F* → Mujer
- *N* → Otro`

  // Validar formato
  if (!REGEX.test(text)) throw ayuda

  const match = text.match(REGEX)
  if (!match) throw ayuda

  let [, nombre, edadRaw, generoRaw] = match

  // Limpiar nombre
  nombre = nombre.replace(/[^\p{L}\p{N} ]/gu, '').trim()

  if (!nombre) throw '❌ El nombre no puede estar vacío.'
  if (nombre.length > 30) throw '❌ El nombre es demasiado largo (máx. 30 caracteres).'

  // Validar edad
  let edad = parseInt(edadRaw)

  if (isNaN(edad)) throw '❌ La edad debe ser un número válido.'
  if (edad < 10) throw '🚼 Debes tener al menos 10 años para registrarte.'
  if (edad > 60) throw '👴 Edad fuera del rango permitido.'

  // Validar género
  let generoKey = generoRaw.toUpperCase()

  const generos = {
    M: '🙆🏻‍♂️ Hombre',
    F: '🤵🏻‍♀️ Mujer',
    N: '⚧ Otro'
  }

  const genero = generos[generoKey]

  if (!genero) {
    throw `❌ Género inválido.

Usa:
- M (Hombre)
- F (Mujer)
- N (Otro)`
  }

  // Foto de perfil 
  let foto = await conn.profilePictureUrl(m.sender, 'image').catch(() => './src/avatar_contact.png')

  // Generar serial único
 const serial = createHash('md5').update(m.sender).digest('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)

  // Guardar datos
  user.name = nombre
  user.age = edad
  user.genero = genero
  user.regTime = Date.now()
  user.registered = true

  global.db.data.users[m.sender] = user

  const mensaje = `
┌─「 ✅ REGISTRADO 」─
▢ 👤 Nombre: ${nombre}
▢ 🎂 Edad: ${edad}
▢ ⚧ Género: ${genero}
▢ 🔑 Serial: ${serial}
└──────────────`.trim()

  await conn.sendFile(m.chat, foto, 'registro.jpg', mensaje, m)
}

handler.help = ['reg <nombre+edad+género>']
handler.tags = ['rg']
handler.command = ['reg', 'register', 'registrar', 'verify']

export default handler