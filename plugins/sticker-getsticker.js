import fg from 'fg-senna'

let handler = async (m, { conn, text, usedPrefix, command }) => {

if (!text) {
throw `✳️ Ingrese el texto

📌 Ejemplo:
${usedPrefix + command} messi`
}

try {

let json = await fg.getsticker(text)

if (!json || !json.sticker_url || !json.sticker_url.length) {
return m.reply('❌ No se encontraron stickers')
}

// limitar para evitar crash
let stickers = json.sticker_url.slice(0, 10)

await m.reply(`
✅ *Resultado encontrado*

▢ *Título:* ${json.title || 'Sin título'}
▢ *Total pack:* ${json.sticker_url.length}
▢ *Enviando:* ${stickers.length}
`)

for (let url of stickers) {

try {

// enviar directo sin convertir
await conn.sendFile(m.chat, url, 'sticker.webp', '', m, false, { asSticker: true })

// delay para evitar flood
await delay(800)

} catch (e) {
console.log('Error enviando sticker:', e)
}

}

} catch (err) {

console.error(err)
m.reply('❎ Error al buscar stickers')

}

}
handler.help = ['getsticker <texto>']
handler.tags = ['sticker']
handler.command = ['getsticker','getstick','stickersearch','sticksearch']
handler.diamond = true

export default handler

const delay = ms => new Promise(res => setTimeout(res, ms))