
import yts from 'yt-search'
let handler = async (m, {conn, text }) => {
  if (!text) throw `✳️ Ingrese lo que desea buscar en YT`
  let results = await yts(text)
	let tes = results.videos
let teks = tes.map(v => `
📌 ${v.title}
*⌚Duracion:* ${v.timestamp}
*📆Subido:* ${v.ago}
*👀Vistas:* ${v.views.toLocaleString()}
*🔗Link:* ${v.url}
`.trim()).join('\n________________________\n\n')
	conn.sendFile(m.chat, tes[0].image, 'yts.jpeg', teks, m, null, fwc)
}
handler.help = ['ytsearch'] 
handler.tags = ['dl']
handler.command = ['ytsearch', 'yts'] 

export default handler
