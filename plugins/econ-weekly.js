
const we = 5000
let cooldown = 604800000
let handler = async (m, {conn}) => {
	
  let user = global.db.data.users[m.sender]
  if (new Date - user.weekly < cooldown) throw `⏱️ Se llama recompensa semanal 😉. Vuelve en\n *${msToTime((user.weekly + cooldown) - new Date())}*`
  user.coin += we
  m.reply(`
🎁 *RECOMPENSA SEMANAL*\n\n¡Oh! ya ha pasado una semana? De todos modos, aquí tienes

🪙 *Coins* : +${we.toLocaleString()}`)
  user.weekly = new Date * 1
}
handler.help = ['weekly']
handler.tags = ['econ']
handler.command = ['weekly', 'semanal'] 

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24), 
    days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 365)
    
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds
  days    = (days > 0)  ? days  : 0;

  return days + ` Dia ` + hours + ` Hora ` + minutes + ` Minutos`
}
