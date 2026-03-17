const betData = {}
const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]

const RANGES = {
  "1-12":[1,12],
  "13-24":[13,24],
  "25-36":[25,36],
  "1-18":[1,18],
  "19-36":[19,36]
}

let handler = async (m, { usedPrefix, command, args }) => {

  const user = global.db.data.users[m.sender]
  const id = m.sender

  if (betData[id]) {
    const remaining = getRemainingTime(betData[id])
    return m.reply(`⏳ Ya apostaste. Espera *${remaining}s*`)
  }

  if (args.length < 2)
    throw `✳️ Uso:\n*${usedPrefix + command} <cantidad> <espacio>*`

  const amount = Number(args[0])
  const space = args[1].toLowerCase()

  if (!amount || amount < 100)
    throw `💰 La apuesta mínima es *100 coins*`

  if (amount > 10000)
    throw `🚫 Máximo permitido *10000 coins*`

  if (user.coin < amount)
    throw `❌ No tienes suficientes coins`

  const number = /^\d+$/.test(space) ? Number(space) : null
  if (number && (number < 1 || number > 36))
    throw `🎯 Número debe ser entre *1 y 36*`

  const result = Math.floor(Math.random() * 36) + 1
  const color = RED_NUMBERS.includes(result) ? "rojo" : "negro"

  m.reply(`🎲 Apostaste *${amount} coins* en *${space}*\n\n⏳ Girando ruleta...`)
 
  betData[id] = Date.now()

  await new Promise(r => setTimeout(r, 10000))

  let multiplier = getMultiplier(space, result)

  let msg = `🎰 Resultado: *${color} ${result}*\n\n`

  if (multiplier > 0) {
    const profit = amount * multiplier - amount
    user.coin += profit
    msg += `🎉 Ganaste *+${profit} coins*`
  } else {
    user.coin -= amount
    msg += `💀 Perdiste *-${amount} coins*`
  }

  m.reply(msg, null, fwc)

  delete betData[id]
}

handler.help = ['roulette']
handler.tags = ['game']
handler.command = ['roulette','ruleta']

export default handler


function getMultiplier(space, result){

  if (/^\d+$/.test(space)) {
    return Number(space) === result ? 36 : 0
  }

  if (space === "odd") return result % 2 ? 2 : 0
  if (space === "even") return result % 2 === 0 ? 2 : 0

  if (space === "red") return RED_NUMBERS.includes(result) ? 2 : 0
  if (space === "black") return !RED_NUMBERS.includes(result) ? 2 : 0

  if (space === "1st") return (result-1)%3 === 0 ? 3 : 0
  if (space === "2nd") return (result-2)%3 === 0 ? 3 : 0
  if (space === "3rd") return result%3 === 0 ? 3 : 0

  if (RANGES[space]) {
    const [a,b] = RANGES[space]
    return result >= a && result <= b ? 2 : 0
  }

  return 0
}

function getRemainingTime(timestamp){
  const cooldown = 20000
  const remaining = cooldown - (Date.now() - timestamp)
  return Math.ceil(remaining/1000)
}