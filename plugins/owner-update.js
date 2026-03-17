import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

let handler = async (m, { conn, text }) => {

  try {

    m.react('⏳')

    const { stdout, stderr } = await execPromise(
      'git pull' + (text ? ' ' + text : '')
    )

    let result = stdout || '✅ Repo actualizado.'

    if (stderr) result += '\n⚠️ ' + stderr

    await conn.reply(m.chat, `📦 *Git Update*\n\n${result}`, m)

    // recargar plugins si existe el sistema
    if (global.reload) {
      global.reload()
    }

    m.react('✅')

  } catch (err) {

    await conn.reply(
      m.chat,
      `❌ *Error al actualizar*\n\n${err.message}`,
      m
    )

    m.react('❌')

  }

}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'fix', 'fixed']
handler.rowner = true

export default handler