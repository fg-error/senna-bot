
let free = 1500
let cooldown = 86400000
let handler = async (m, {conn}) => {
  let user = global.db.data.users[m.sender]
  if (new Date - user.lastclaim < cooldown) throw `🎁 Ya recogiste tu recompensa diaria. Vuelve en *${msToTime((user.lastclaim + cooldown) - new Date())}*`
  user.coin += free
  m.reply(`
🎁 *RECOMPENSA DIARIA*

*Coins* : +${free.toLocaleString()} 🪙`, null, fwc)
  user.lastclaim = new Date * 1
}
handler.help = ['daily']
handler.tags = ['econ']
handler.command = ['daily', 'claim'] 


export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + ` Hora ` + minutes + ` Minutos`
}
