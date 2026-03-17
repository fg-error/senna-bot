 

import fg from 'fg-senna'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    
        if (!args[0]) throw `📌 Ejemplo : ${usedPrefix + command} https://vm.tiktok.com/ZMYG92bUh/`
        if (!args[0].match(/tiktok/gi)) throw `❎ ${mssg.noLink('TikTok')}`
        m.react(rwait)
      
        try {
        
        let data = await fg.tiktok(args[0])

        if (!data.result.images) {
            let tex = `
┌─⊷ *TIKTOK DL* 
▢ *Nombre:* ${data.result.author.nickname}
▢ *usuario:* ${data.result.author.unique_id}
▢ *Duracion:* ${data.result.duration}
▢ *Likes:* ${data.result.digg_count}
▢ *Vistas:* ${data.result.play_count}
▢ *Desc:* ${data.result.title}
└───────────
`
            conn.sendFile(m.chat, data.result.play, 'tiktok.mp4', tex, m, null, fwc);
            m.react(done)
        } else {
            let cap = `
▢ *Likes:* ${data.result.digg_count}
▢ *Desc:* ${data.result.title}
`
            for (let ttdl of data.result.images) {
                conn.sendMessage(m.chat, { image: { url: ttdl }, caption: cap }, { quoted: m })
            }
            conn.sendFile(m.chat, data.result.play, 'tiktok.mp3', '', m, null, { mimetype: 'audio/mp4' })
            m.react(done)
        }

      } catch (error) {
        m.reply(`❎ Error`)
    }
   
}

handler.help = ['tiktok']
handler.tags = ['dl']
handler.command = ['tiktok', 'tt', 'tiktokimg', 'tiktokslide']
handler.diamond = true

export default handler
