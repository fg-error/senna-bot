import fs from 'fs'
import { promises as fsp } from 'fs'
import archiver from 'archiver'
import path from 'path'

const formatSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}

let handler = async (m, { conn }) => {
  const filePath = path.resolve('./database.json')
  const zipPath = path.resolve(`./database-${Date.now()}.zip`)

  try {

    // verificar archivo
    await fsp.access(filePath)

    // tamaño archivo
    const stats = await fsp.stat(filePath)
    const size = formatSize(stats.size)

    // crear zip
    await new Promise((resolve, reject) => {

      const output = fs.createWriteStream(zipPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      output.on('close', resolve)
      archive.on('error', reject)

      archive.pipe(output)
      archive.file(filePath, { name: 'database.json' })
      archive.finalize()

    })

    await conn.sendFile(m.chat, zipPath, 'database.zip', `📦 *Backup de Database*\n📂 Tamaño: ${size}`, m, null, { mimetype: 'application/zip', asDocument: true })

    // eliminar zip
    await fsp.unlink(zipPath)

  } catch (err) {

    try {

      // fallback enviar json directo
      const buffer = await fsp.readFile(filePath)

      await conn.sendFile(m.chat, buffer, 'database.json', '⚠️ No se pudo comprimir, enviando database directa.', m, null, { mimetype: 'application/json', asDocument: true })

    } catch (e) {
      await conn.reply(m.chat, '❌ Error al obtener la database.', m)
    }

  }
}

handler.command = ['getdb']
handler.rowner = true

export default handler