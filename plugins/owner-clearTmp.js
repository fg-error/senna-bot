
import { tmpdir } from 'os'
import path, { join } from 'path'
import fs from 'fs'
import { readdirSync, unlinkSync, rmSync } from 'fs'
let handler = async (m, { conn, __dirname, args }) => {

  m.reply(`✅ Se limpió la carpeta *tmp + sessions*`)
  m.react(done)
   
  // -- eliminar archivos temporales ---
  const tmpDirs = [tmpdir(), join(__dirname, '../tmp')]
  const tmpFiles = []
  tmpDirs.forEach((dir) => readdirSync(dir).forEach((file) => tmpFiles.push(join(dir, file))))
  tmpFiles.forEach((file) => {
    const filePath = file
    if (fs.lstatSync(filePath).isDirectory()) {
      rmSync(filePath, { recursive: true, force: true })
    } else {
      unlinkSync(filePath)
    }
  })

  // -- eliminar sesiones del bot ---
  const Sessions = "./sessions"
  readdirSync(Sessions).forEach((file) => {
    const filePath = `${Sessions}/${file}`
    if (file !== 'creds.json') {
      if (fs.lstatSync(filePath).isDirectory()) {
        rmSync(filePath, { recursive: true, force: true })
      } else {
        unlinkSync(filePath)
      }
    }
  })

  //--
const bots = './bebots'
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000

if (fs.existsSync(bots)) {
  for (let dir of fs.readdirSync(bots)) {
    let botPath = join(bots, dir)
    let credsPath = join(botPath, 'creds.json')

    try {
      if (!fs.existsSync(botPath)) continue

      // ❌ No hay creds → borrar bot completo
      if (!fs.existsSync(credsPath)) {
        fs.rmSync(botPath, { recursive: true, force: true })
        continue
      }

      // 🧠 Ver actividad 
      let stat = fs.statSync(credsPath)
      let isOld = (Date.now() - stat.mtimeMs) > ONE_WEEK

      // ⏳ Inactivo → borrar todo
      if (isOld) {
        fs.rmSync(botPath, { recursive: true, force: true })
        continue
      }

      // 🔧 Activo → limpiar archivos menos creds
      for (let file of fs.readdirSync(botPath)) {
        if (file === 'creds.json') continue

        let filePath = join(botPath, file)

        try {
          if (fs.lstatSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true })
          } else {
            fs.unlinkSync(filePath)
          }
        } catch {}
      }

    } catch {}
  }
}
  //--
  
}
handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = /^(cleartmp)$/i
handler.rowner = true

export default handler
