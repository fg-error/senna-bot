import fg from 'fg-senna'

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) throw `✳️ Ingrese lo que desea buscar`

  try {

    let res = await fg.wallpaper(text)

    if (!res || !res.length) {
      throw `❌ No se encontraron resultados`
    }

    let random = pickRandom(res)

    await conn.sendMessage(m.chat, { image: { url: random.image }, caption: `🖼️ *Wallpaper encontrado*\n\n📌 ${random.title}`}, { quoted: m })

  } catch (error) {
    m.reply(`❌ Error al buscar wallpaper`)
  }

}
handler.help = ['wallpaper']
handler.tags = ['img']
handler.command = ['wallpaper','wallpapers','wp']
handler.diamond = true

export default handler

function pickRandom(list){
  return list[Math.floor(Math.random() * list.length)]
}