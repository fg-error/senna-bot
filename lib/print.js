import { WAMessageStubType } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {

  // ========= USER =========

  const rawJid =
    m.key?.participant ||
    m.participant ||
    m.sender ||
    ''

  const senderJid = conn.decodeJid(rawJid)
  const number = senderJid.split('@')[0]

  const formattedUser =
    senderJid.endsWith('@s.whatsapp.net')
      ? PhoneNumber('+' + number).getNumber('international') || '+' + number
      : senderJid

  const name = await conn.getName(senderJid).catch(() => null)
  const sender = `${formattedUser}${name ? ' ~' + name : ''}`


  // ========= BOT =========

  const botJid = conn.decodeJid(conn.user?.id || '')
  const botNumber = botJid.split('@')[0]

  const formattedBot =
    PhoneNumber('+' + botNumber).getNumber('international') || '+' + botNumber

  const botName = conn.user?.name || 'Bot'
  const me = `${formattedBot} ~${botName}`


  // ========= CONTEXTO =========

  const isChannel = m.chat?.endsWith('@newsletter')
  const isGroup = m.isGroup && !isChannel
  const isPrivate = !m.isGroup && !isChannel

  let chatName = ''
  let contextIcon = '💬'
  let contextLabel = 'Chat Privado'

  if (isChannel) {
    contextIcon = '📢'
    contextLabel = 'Canal'
    try {
      const meta = await conn.newsletterMetadata("jid", m.chat)

      const thread = meta?.thread_metadata

chatName =
  thread?.name?.text ||
  m.chat.split('@')[0]

    } catch {
      chatName = m.chat.split('@')[0]
    }
  }

  if (isGroup) {
    contextIcon = '👥'
    contextLabel = 'Grupo'
    try {
      const meta = await conn.groupMetadata(m.chat)
      chatName = meta?.subject || m.chat
    } catch {
      chatName = m.chat
    }
  }


  // ========= ADMIN DETECTION =========

  let isAdmin = false
  let isSuperAdmin = false
  let isBotAdmin = false

  if (isGroup) {
    try {
      const metadata = await conn.groupMetadata(m.chat)

      const senderData = metadata.participants.find(p =>
        conn.decodeJid(p.id) === senderJid
      )

      const botData = metadata.participants.find(p =>
        conn.decodeJid(p.id) === botJid
      )

      isAdmin = senderData?.admin === 'admin'
      isSuperAdmin = senderData?.admin === 'superadmin'
      isBotAdmin =
        botData?.admin === 'admin' ||
        botData?.admin === 'superadmin'

    } catch {}
  }


  // ========= MENSAJE =========

  const messageType =
    Object.keys(m.message || {})[0] || m.mtype || ''

  const content = m.message ? Object.values(m.message)[0] : {}

  const filesize =
    content?.fileLength?.low ||
    content?.fileLength ||
    m.text?.length ||
    0

  const size =
    filesize === 0
      ? '0 B'
      : (filesize / 1024 ** Math.floor(Math.log(filesize) / Math.log(1024))).toFixed(1)
        + ' ' +
        ['B', 'KB', 'MB', 'GB'][Math.floor(Math.log(filesize) / Math.log(1024))]

  const duration = content?.seconds || 0

  const niceType =
    messageType
      .replace(/Message$/i, '')
      .replace('extendedText', 'Text')
      .replace(/^./, v => v.toUpperCase())


  // ========= FLAGS =========

  const isBotMessage = senderJid === botJid

  // ========= PRINT =========

  console.log(`
${chalk.hex('#FE0041').bold('╭━━━〔 MESSAGE LOG 〕━━━⬣')}
🤖 ${chalk.cyan(me)}
⏰ ${chalk.black(chalk.bgGreen(
      new Date((m.messageTimestamp || Date.now()/1000) * 1000)
        .toLocaleTimeString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' })
    ))}
📦 ${chalk.black(chalk.bgYellow(niceType))}  ${chalk.magenta(size)}
👤 ${chalk.redBright(sender)}
📍 ${contextIcon} ${chalk.green(contextLabel)}${chatName ? ' ~ ' + chalk.cyan(chatName) : ''}
${!isSuperAdmin && isAdmin ? '👑 Admin  ' : ''}${isBotMessage ? '🤖 Mensaje Bot  ' : ''}
${chalk.hex('#FE0041').bold('╰━━━━━━━━━━━━━━━━━━━━⬣')}
`.trim())


  // ========= EXTRA =========

  if (/audio|video/i.test(messageType) && duration) {
    console.log(
      `⏳ Duración: ${Math.floor(duration / 60)
        .toString()
        .padStart(2, 0)}:${(duration % 60)
        .toString()
        .padStart(2, 0)}`
    )
  }

  if (/document/i.test(messageType)) {
    console.log(`📄 ${content?.fileName || 'Documento'}`)
  }

  if (/sticker/i.test(messageType)) {
    console.log(`🧩 Sticker`)
  }

  if (/image/i.test(messageType)) {
    console.log(`🖼 Imagen`)
  }

  if (typeof m.text === 'string' && m.text) {

    let log = m.text.replace(/\u200e+/g, '')

    if (log.length < 2048) {
      log = log.replace(urlRegex, url => chalk.blueBright(url))
    }

    console.log(
      m.error
        ? chalk.red(log)
        : m.isCommand
          ? chalk.yellow(log)
          : log
    )
  }

  console.log()
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"))
})