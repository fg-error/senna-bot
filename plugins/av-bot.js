
let handler = async (m, { conn}) => {

let name = await conn.getName(m.sender)
let av = `./src/mp3/${pickRandom(["criss", "andrea"])}.mp3`
let fg_logo = `https://i.ibb.co/1zdz2j3/logo.jpg`

conn.sendButton(m.chat, `Hola *${name}*\n`, global.fg_ig, null, [
      ['⦙☰ Menu', '/help'],
      ['⦙☰ Menu 2', '/menu2'],
      [`⌬ Grupos`, '/gpdylux']
    ], m) 

    conn.sendFile(m.chat, av, 'audio.ogg', '', m, true, { asAudio: true, ptt: false})
    //await conn.sendFile(m.chat, av, 'file.mp4', '', m, 1, { mimetype: 'audio/mp4' })
} 

handler.customPrefix = /^(bot|senna|dylux)$/i
handler.command = new RegExp

export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
