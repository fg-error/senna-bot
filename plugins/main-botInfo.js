
import speed from 'performance-now'
let handler = async (m, { conn, usedPrefix, command }) => {
    let start = speed()
    let uptime = await getUptime()
    let end = speed()
    let latency = (end - start).toFixed(4)

    let cmds = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    let totalreg = Object.keys(global.db.data.users)
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true)

    let message = `
 ≡ *ESTADO*
- *Ping:* ${latency} _ms_
- *Uptime:* ${uptime}
- *Comandos:* ${cmds} 

*≡ USUARIOS DEL BOT*
- *Total:* ${totalreg.length.toLocaleString()}
- *Registrados:* ${rtotalreg.length.toLocaleString()} 

*≡ OWNER*
  *FG98*
▢ *Instagram :*
- ${fg_ig}
▢ *Telegram :*
- t.me/fg_userss (grupo)
▢ *YouTube :*
- https://youtube.com/fg98f`

    m.reply(message, null, fwc)
}
handler.help = ['info']
handler.tags = ['main']
handler.command = ['info', 'infobot', 'botinfo']

export default handler

// - - 
async function getUptime() {
    if (process.send) {
        process.send('uptime')
        let _muptime = await new Promise(resolve => {
            process.once('message', resolve)
            setTimeout(() => resolve(0), 1000)
        });
        return formatUptime(_muptime * 1000)
    }
    return formatUptime(0)
}

// - - 
function formatUptime(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}d ${h}h ${m}m ${s}s`
}
