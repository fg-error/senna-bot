
import fetch from 'node-fetch'
let handler= async (m, { conn, args, text, usedPrefix, command }) => {
	
    if (!args[0]) throw `📌Ejemplo : ${usedPrefix + command} fg.error` 
    try {
    let pon = await fetch(global.API('fgmods', '/api/search/igstalk', { username: args[0] }, 'apikey'))
    let res = await pon.json()
    let te = `
┌──「 *STALKING* 
▢ *🔖Nombre:* ${res.result.name} 
▢ *🔖Usuario:* ${res.result.username}
▢ *👥Seguidores:* ${res.result.followers}
▢ *🫂Siguiendo:* ${res.result.following}
▢ *📌Bio:* ${res.result.description}
▢ *🏝️Pots:* ${res.result.posts}
▢ *🔗link:* https://instagram.com/${res.result.username.replace(/^@/, '')}
└────────────`

     await conn.sendFile(m.chat, res.result.profile, 'igstalk.png', te, m, null, fwc)
    } catch {
        m.reply(`✳️ Error`)
      }
     
}
handler.help = ['igstalk']
handler.tags = ['dl']
handler.command = ['igstalk'] 

export default handler
