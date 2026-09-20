import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command, text }) => {

  const pluginNames = Object.keys(global.plugins)
    .map(name => name.replace('.js', ''))

  if (!text) {
    return m.reply(`
✳️ Uso del comando:
${usedPrefix + command} <nombre>

📌 Ejemplo:
${usedPrefix + command} main-menu
`.trim())
  }

  if (!pluginNames.includes(text)) {
    return m.reply(`
📌 Ejemplo:
${usedPrefix + command} main-menu

≡ Lista de Plugins
┌─⊷
${pluginNames.map(name => `▢ ${name}`).join('\n')}
└───────────
`.trim())
  }

  try {
    const pluginPath = path.join('./plugins', `${text}.js`)

    if (!fs.existsSync(pluginPath))
      return m.reply('❎ El archivo no existe en la carpeta plugins')

    // Leer archivo
    const fileBuffer = fs.readFileSync(pluginPath)

    // Enviar directamente como documento
    await conn.sendMessage(m.chat, {
      document: fileBuffer,
      mimetype: 'application/javascript',
      fileName: `${text}.js`
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❎ Error al enviar el plugin')
  }
}

handler.help = ['getplugin <nombre>']
handler.tags = ['owner']
handler.command = ['getplugin']
handler.rowner = true

export default handler