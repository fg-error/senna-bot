import fs from "fs"
import path from "path"

let handler = async (m, { conn, usedPrefix }) => {

    //if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, `✳️ Este comando es solo para *Sub Bots Activos*`, m)
    
    let basePath = "./bebots"

    if (!fs.existsSync(basePath)) {
        return conn.reply(m.chat, "❌ No existe ninguna sesión guardada.", m)
    }

    let folders = fs.readdirSync(basePath)

    let senderNumber = await conn.getNum(m.sender)

    let carpt = []

    for (let folder of folders) {
        let folderPath = path.join(basePath, folder)
        let credsPath = path.join(folderPath, "creds.json")

        if (!fs.existsSync(credsPath)) continue

        try {
            let creds = JSON.parse(fs.readFileSync(credsPath))
            let botNumber = creds?.me?.id?.split(":")[0]

            if (!botNumber) continue

            if (botNumber === senderNumber) {

                //--obtener fecha de modificación
                let stat = fs.statSync(folderPath)

                carpt.push({
                    id: folder,
                    number: botNumber,
                    time: stat.mtimeMs // fecha en ms
                })
            }

        } catch (e) {
            continue
        }
    }

    if (carpt.length === 0) {
        return conn.reply(m.chat, `✳️ Aun no eres Sub-Bot\n\n Usa: ${usedPrefix}botclone`, m)
    }

    //--más reciente
    carpt.sort((a, b) => b.time - a.time)

    let act = carpt[0]

    let txt = `
┌─⊷  🤖 TU SUB-BOT
▢ 🤖 wa.me/${act.number}
▢ 📂 ID: ${act.id}
▢ 🔗 ${usedPrefix}bebot ${act.id}
└──────────────`

    await conn.reply(m.sender, txt, m)
    await conn.reply(m.chat, "✅ Tu Codigo se envió a su privado", m)

    m.react("✅")
}
handler.help = ['getcode']
handler.tags = ['bebot']
handler.command = ['getcode', "code"]
//handler.owner = true

export default handler