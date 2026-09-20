
import fg from "fg-senna"
let handler = async (m, { conn, args, usedPrefix, command }) => {

   
      const img = await fg.feed() 
       conn.sendFile(m.chat, img, 'img.jpg', `✅ *Resultado* 😈`, m)
         m.react(dmoji) 
 
}

handler.help = ['feed']
handler.tags = ['img']
handler.command = ['feed', 'fua', "antojito"] 
//handler.diamond = true

export default handler
