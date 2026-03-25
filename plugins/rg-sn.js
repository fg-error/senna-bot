import { createHash } from 'crypto'

let handler = async function (m, { conn, text, usedPrefix }) {
const serial = createHash('md5').update(m.sender).digest('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
m.reply(`
▢ *Tu Serial* : ${serial}
`, null, fwc)
}
handler.help = ['serial']
handler.tags = ['rg']
handler.command = ['nserie', 'sn', 'mysn', "resial"] 
handler.register = true

export default handler
