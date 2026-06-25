 
import fg from "fg-senna"
let handler = async (m, { conn, args, usedPrefix, command }) => {
    
      
    let img = await fg.pack()

  
    conn.sendFile(m.chat, img, 'img.jpg', `✅ Resultado`, m, null, fwc)
  
    m.react('🤤')
  
}
handler.help = ['tvid']
handler.tags = ['img']
handler.command = ['pack', 'cosplay']
handler.premium = false
handler.diamond = true
 
export default handler
