import fg from "fg-senna"
let handler = async (m, { conn, text }) => {

    try {
       let res = await fg.apks(text)
       let {name, developer, icon, dl_apk, date} = res[0]

       m.react(rwait)
  let caption = `
*📌Nombre:* ${name}
*🔼Subido:* ${date}`

       await conn.sendFile(m.chat, icon, 'icon.png', caption, m, null, fwc)
//m.reply(caption)
 await conn.sendFile(m.chat, dl_apk, name, '', m, null, { mimetype: 'application/vnd.android.package-archive', asDocument: true })
 m.react(done)
} catch(e) {
   m.reply("Error: intenta mas tarde")
 }
 
}
handler.help = ['apk <text>']
handler.tags = ['dl']
handler.command = ["apk", "app"]

export default handler