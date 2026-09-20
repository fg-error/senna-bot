import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args }) => {

let users = Object.entries(global.db.data.users).map(([jid, data]) => ({
  jid,
  exp: data.exp || 0,
  coin: data.coin || 0,
  bank: data.bank || 0,
  diamond: data.diamond || 0,
  level: data.level || 0
}))

let len = args[0] ? Math.min(50, Math.max(parseInt(args[0]), 5)) : 5

let topBank = [...users].sort((a,b)=> b.bank - a.bank).slice(0,len)
let topDiamond = [...users].sort((a,b)=> b.diamond - a.diamond).slice(0,len)
let topLevel = [...users].sort((a,b)=> b.level - a.level).slice(0,len)

let rankBank = users.sort((a,b)=> b.bank - a.bank).findIndex(v => areJidsSameUser(v.jid, m.sender)) + 1
let rankDiamond = users.sort((a,b)=> b.diamond - a.diamond).findIndex(v => areJidsSameUser(v.jid, m.sender)) + 1
let rankLevel = users.sort((a,b)=> b.level - a.level).findIndex(v => areJidsSameUser(v.jid, m.sender)) + 1

let text = `_Reinicio 01/01/2027_
≡ *TABLA DE CLASIFICACION*

▢ *TOP ${len} COINS* 🪙
Tu: *${rankBank}* De *${users.length}*

${topBank.map((u,i)=>`*${i+1}.* @${u.jid.split('@')[0]} ➭ _${u.bank.toLocaleString()}_ 🪙`).join('\n')}

▢ *TOP ${len} DIAMANTES* 💎
Tu: *${rankDiamond}* De *${users.length}*

${topDiamond.map((u,i)=>`*${i+1}.* @${u.jid.split('@')[0]} ➭ _${u.diamond.toLocaleString()}_ 💎`).join('\n')}

▢ *TOP ${len} NIVEL* ⬆️
Tu: *${rankLevel}* De *${users.length}*

${topLevel.map((u,i)=>`*${i+1}.* @${u.jid.split('@')[0]} ➭ _Nivel ${u.level}_`).join('\n')}
`.trim()

let mentions = [...new Set([
...topBank.map(u=>u.jid),
...topDiamond.map(u=>u.jid),
...topLevel.map(u=>u.jid)
])]

conn.reply(m.chat, text, m, { mentions })

}

handler.help = ['leaderboard']
handler.tags = ['econ']
handler.command = ['leaderboard','lb','top']

export default handler