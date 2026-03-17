 
let handler = async (m, { conn }) => {

m.reply(`
≡  *${botName}ᴮᴼᵀ ┃ SUPPORT*

◈ ━━━━━━━━━━━━━━━━━━━━ ◈
▢ Canal
${fg_canal}

▢ Canal de Logs
${canal_log}

▢ Grupo *1*
${fg_group}

▢ Grupo *NSFW* 🔞 
${fg_gpnsfw}

◈ ━━━━━━━━━━━━━━━━━━━━ ◈
▢ Todos los Grupos
 https://instabio.cc/fg98ff

▢ *Telegram*
• https://t.me/fg_userss
 ▢ *PayPal*
• https://paypal.me/fg98f
▢ *YouTube*
• https://www.youtube.com/fg98f`)

}
handler.help = ['support']
handler.tags = ['main']
handler.command = ['grupos', 'groups', 'support'] 

export default handler
