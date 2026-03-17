
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { xpRange } from '../lib/levelling.js'
let handler = async (m, { conn, usedPrefix, command}) => {

let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
if (!(who in global.db.data.users)) throw `✳️ El usuario no se encuntra en mi base de datos`
let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')
let user = global.db.data.users[who]
let { name, exp, diamond, lastclaim, registered, regTime, age, level, role, warn, genero, prem, coin, bank} = global.db.data.users[who]
let { min, xp, max } = xpRange(user.level, global.multiplier)
let username = conn.getName(who)
let math = max - xp
let premG = global.prems.includes(who.split`@`[0]) || prem
let sn = createHash('md5').update(who).digest('hex')

let str = `
┌───「 *PERFIL* 」
▢ *🔖Nombre:* 
   • ${username} ${registered ? '\n   • ' + name + ' ': ''}
   • @${who.replace(/@.+/, '')}
▢ *📱Numero:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
▢ *🔗Link:* wa.me/${who.split`@`[0]}${registered ? `\n▢ *🎈Edad:* ${age}\n▢ *🧬Genero:* ${genero}` : ''}
▢ *🪙Coins:* ${bank.toLocaleString()}
▢ *💎Diamantes:* ${diamond.toLocaleString()}
▢ *🆙Nivel:* ${level}
▢ *⬆️XP:* Total ${exp} (${user.exp - min} / ${xp})\n${math <= 0 ? `Listo para *${usedPrefix}levelup*` : `_*${math}xp*_ Falta para subir de Nivel`}
▢ *🏆Rango:* ${role}
▢ *📇Registrado:* ${registered ? '✅': '❎'}
▢ *🎟️Premium:* ${premG ? '✅' : '❎'}
└──────────────`
    conn.sendFile(m.chat, pp, 'perfil.jpg', str, m, false, { mentions: [who] })
    m.react(done)

}
handler.help = ['profile']
handler.tags = ['group']
handler.command = ['profile', 'perfil']

export default handler
