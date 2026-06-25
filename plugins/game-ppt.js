let poin = 200
let cooldown = 15000

let handler = async (m, { args, usedPrefix, command }) => {

  if (!args[0]) {
    throw `✳️ Usa el comando así:\n\n${usedPrefix + command} piedra\n${usedPrefix + command} papel\n${usedPrefix + command} tijera`
  }

  let text = args[0].toLowerCase()
  let user = global.db.data.users[m.sender]

  if (!user) global.db.data.users[m.sender] = { coin: 0, lastppt: 0 }
  if (!user.coin) user.coin = 0
  if (!user.lastppt) user.lastppt = 0

  if (new Date - user.lastppt < cooldown) {
    let tiempo = msToTime((user.lastppt + cooldown) - new Date())
    throw `⏳ Espera ${tiempo} para volver a jugar`
  }

  if (user.coin < poin) {
    return m.reply(`❌ Necesitas al menos ${poin} 🪙 para jugar`)
  }

  let opciones = ['piedra', 'papel', 'tijera']
  if (!opciones.includes(text)) {
    throw `✳️ Opciones válidas:\n- piedra\n- papel\n- tijera`
  }

  let bot = opciones[Math.floor(Math.random() * opciones.length)]
  user.lastppt = new Date * 1

  let resultado = ''
  let cambio = 0

  if (text === bot) {
    resultado = '🤝 Empate'
    cambio = 10
  } else if (
    (text === 'piedra' && bot === 'tijera') ||
    (text === 'tijera' && bot === 'papel') ||
    (text === 'papel' && bot === 'piedra')
  ) {
    resultado = '🎉 Ganaste'
    cambio = poin
  } else {
    resultado = '😔 Perdiste'
    cambio = -poin
  }

  user.coin += cambio

  m.reply(
`🎮 Piedra, Papel o Tijera

👤 Tú: ${text}
🤖 Bot: ${bot}

${resultado}
${cambio > 0 ? `+${cambio}` : cambio} 🪙`
  )
}

handler.help = ['ppt <piedra|papel|tijera>']
handler.tags = ['game']
handler.command = ['ppt']

export default handler

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  if (seconds < 10) seconds = "0" + seconds
  return seconds + " segundos"
}