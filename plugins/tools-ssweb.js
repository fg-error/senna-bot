
import fetch from 'node-fetch'
let handler = async (m, { conn, command, args, text }) => {
      
    if (!text) return m.reply(`✳️ ingrese el link`)
    m.react(rwait)   
	let full = /f$/i.test(command)
    let url = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0]
    let ss = await (await fetch(global.API('nrtm', '/api/ssweb', { delay: 1000, url: url }))).buffer()
    conn.sendFile(m.chat, ss, 'ssweb.png', `✅ Resultado`, m, null, fwc) 
   m.react(done) 
}  
handler.help = ['ssweb <url>']
handler.tags = ['tools']
handler.command = ['ssweb', 'ss', 'captura', 'ssf', 'sswebf'] 

export default handler
