import fg from 'fg-senna'
import axios from "axios"

let handler = async (m, { conn, text }) => {
  if (!text) throw '✳️ Ingrese el nombre de un paquete'

  let img = 'https://i.ibb.co/HxNbmxd/npm2.png'
  m.react(rwait)

  try {
    let pkg = await npm(text)

    let caption = `
▢ *Nombre del paquete:* ${pkg.name}
▢ *Versión:* ${pkg.version}
▢ *Dueño:* ${pkg.owner || 'Desconocido'}
▢ *Publicado:* ${pkg.publishedDate || 'No disponible'}
▢ *Descripción:* ${pkg.description || 'Sin descripción'}
▢ *Página:* ${pkg.homepage || 'No disponible'}
▢ *Link:* ${pkg.packageLink}
`.trim()

    await conn.sendFile(m.chat, img, 'npm.png', caption, m)

    await conn.sendFile(
      m.chat,
      pkg.downloadLink,
      `${pkg.packageName}-${pkg.version}.tgz`,
      '',
      m,
      null,
      { mimetype: 'application/zip', asDocument: true }
    )

    m.react(done)

  } catch (err) {
    m.reply(`✳️ Error: ${err.message}`)
  }
}

handler.help = ['npm <paquete>']
handler.tags = ['tools']
handler.command = ['npm', 'npmdl', 'npmsearch']

export default handler


async function npm(query) {
  try {

    const response = await axios.get(`https://registry.npmjs.org/${query}`, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const data = response.data
    const name = data.name
    const description = data.description
    const version = data['dist-tags'].latest

    const packageLink = `https://www.npmjs.com/package/${name}`

    const lastSlashIndex = name.lastIndexOf('/')
    const packageName = lastSlashIndex !== -1
      ? name.substring(lastSlashIndex + 1)
      : name

    const downloadLink = `https://registry.npmjs.org/${name}/-/${packageName}-${version}.tgz`

    const owner = data.maintainers?.[0]?.name || null
    const homepage = data.homepage || null
    const license = data.license || null
    const dependencies = data.versions?.[version]?.dependencies || {}

    const publishedDate = data.time?.[version] || null

    return {
      name,
      description,
      version,
      packageLink,
      packageName,
      downloadLink,
      publishedDate,
      owner,
      homepage,
      license,
      dependencies
    }

  } catch (err) {
    throw new Error('Error al buscar información del paquete: ' + err.message)
  }
}