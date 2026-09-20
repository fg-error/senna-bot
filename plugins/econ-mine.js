
let cooldown = 14400000
let handler = async (m, { conn }) => {

  let hasil = Math.floor(Math.random() * 500)
  let user = global.db.data.users[m.sender]
  if (new Date - user.lastmiming < cooldown) throw `⏳ _Podras regresar a la mina en_ *${msToTime((user.lastmiming + cooldown) - new Date())}*`
  user.coin += hasil
  m.reply(`
🎉 Genial! minaste *${hasil} 🪙*`, null, fwc)
  user.lastmiming = new Date * 1
}
handler.help = ['mine']
handler.tags = ['econ']
handler.command = ['minar', 'miming', 'mine'] 

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
