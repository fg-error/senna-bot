import { toAudio, toPTT } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const isQuoted = m.quoted ? m.quoted : m
    const mime = (m.quoted ? m.quoted : m.msg).mimetype || ''

    // Validar tipo de archivo
    if (!/audio|video/i.test(mime)) {
      throw `⚠️ Respondé a un video o audio con *${usedPrefix + command}*`
    }

    // Descargar media
    const media = await isQuoted.download()
    if (!media) throw '❌ No se pudo descargar el archivo'

    // ================= MP3 =================
    if (/mp3|audio$/i.test(command)) {
      const audio = await toAudio(media, 'mp4')
      if (!audio?.data) throw '❌ Error al convertir a MP3'

      conn.sendFile(m.chat, audio.data, 'audio.ogg', '', m, false)
      //conn.sendMessage(m.chat, {document: audio.data, mimetype: 'audio/mpeg', fileName: 'audio.mp3'},{ quoted: m })
    }

    // ================= PTT / VOICE =================
    if (/vn|av$/i.test(command)) {
      const audio = await toPTT(media, 'mp4')
      if (!audio?.data) throw '❌ Error al convertir a nota de voz'

    conn.sendMessage(m.chat,{audio: audio.data, mimetype: 'audio/mp4', ptt: true },{ quoted: m })
    //conn.sendFile(m.chat, audio.data, 'audio.ogg', '', m, true, { asAudio: true, ptt: true})

    }

  } catch (err) {
    console.error('Error converter:', err)
    m.reply(typeof err === 'string' ? err : '❌ Ocurrió un error inesperado')
  }
}

handler.help = ['tomp3', 'toav']
handler.tags = ['tools']
handler.command = ['tomp3', 'tovn', 'toav', "toaudio"]

export default handler