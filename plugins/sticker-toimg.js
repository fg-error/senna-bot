import sharp from 'sharp'

let handler = async (m, { conn }) => {

if (!m.quoted) throw '✳️ Responde a un sticker'

let q = m.quoted
if (!/sticker/.test(q.mediaType)) throw '✳️ Responde a un sticker'

let media = await q.download()
if (!media) throw 'No se pudo descargar el sticker'

let img = await sharp(media)
  .png()
  .toBuffer()

await conn.sendFile(
  m.chat, img, 'imagen.png', '✅ Sticker convertido a imagen', m)

}

handler.help = ['toimg']
handler.tags = ['sticker']
handler.command = ['toimg','jpg','aimg']

export default handler