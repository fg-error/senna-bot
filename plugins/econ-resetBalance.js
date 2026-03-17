
let handler = async (m, { conn, args }) => {
  let list = Object.entries(global.db.data.users)
  
  list.forEach(([user, data]) => {
    data.diamond = Number(20)
    data.coin = Number(0)
    data.bank = Number(0)
    data.crime = Number(0)
    data.lastmiming = Number(0)
    data.lastwork = Number(0)
    data.lastclaim = Number(0)
    data.weekly = Number(0)
    //data.level = Number(0)
    //data.exp = Number(0)
  })
  m.reply(`✅ Se reinicio la economía del bot`)
}

handler.command = /^(resetbalance|resetbal|reseteconomia)$/i
handler.rowner = true

export default handler 
