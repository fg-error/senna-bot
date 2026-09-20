
import fg from 'fg-senna'
let handler = async (m, {conn, text }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : ''
   if (!teks) throw `✳️ Ingrese el texto`
   try {
 let res = await fg.lyrics(text);
 let mes = `▢ *${res.title}*
▢ *${res.artist}*

▢ ${res.lyrics}`;
    conn.sendFile(m.chat, res.image, 'img.png', mes, m, null, fwc);
} catch (e) {
	m.react(error)
} 

}
handler.help = ['lyrics']
handler.tags = ['tools']
handler.command = ['letra', 'lyrics', 'letras'] 

export default handler
