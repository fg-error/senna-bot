import {
  proto,
  generateWAMessageFromContent,
  areJidsSameUser
} from '@whiskeysockets/baileys'

export async function all(m, chatUpdate) {
  if (m.isBaileys) return
  if (!m.message) return
  if (!m.msg?.fileSha256) return

  const hashKey = Buffer.from(m.msg.fileSha256).toString('base64')
  if (!(hashKey in global.db.data.sticker)) return

  let { text, mentionedJid } = global.db.data.sticker[hashKey]

  const msgContent = {
    conversation: text
  }

  let messages = generateWAMessageFromContent(
    m.chat,
    msgContent,
    {
      userJid: this.user.id,
      quoted: m.quoted?.fakeObj
    }
  )

  messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
  messages.key.id = m.key.id
  messages.pushName = m.pushName
  if (m.isGroup) messages.participant = m.sender

  const upsert = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)],
    type: 'append'
  }

  this.ev.emit('messages.upsert', upsert)
}