import fetch from 'node-fetch'
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i

let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!args[0])
        throw `Ingrese un link GitHub\n\n📌 Ejemplo : ${usedPrefix + command} https://github.com/FG98F/dylux-bot`

    if (!regex.test(args[0]))
        throw `Ingrese un link GitHub válido`

    let [, user, repo] = args[0].match(regex)
    repo = repo.replace(/\.git$/, '')

    // 🔎 Obtener info del repo
    let api = `https://api.github.com/repos/${user}/${repo}`
    let res = await fetch(api)
    if (!res.ok) throw 'Repositorio no encontrado'
    let json = await res.json()

    // 📊 Datos solicitados
    let caption = `
⭐Stars: ${json.stargazers_count}
🍴 Forks: ${json.forks_count}

📅 Creado: ${json.created_at.slice(0,10)}
🔄 Actualizado: ${json.updated_at.slice(0,10)}

👤 Owner: ${json.owner.login}
🔗 Perfil: ${json.owner.html_url}
`.trim()

    // 📥 Link directo correcto
    let url = `https://codeload.github.com/${user}/${repo}/zip/refs/heads/${json.default_branch}`
    let filename = `${user}-${repo}.zip`

    await conn.sendFile(m.chat, url, filename, caption, m, false, { mimetype: 'application/zip', asDocument: true })
}
handler.help = ['gitclone <url>']
handler.tags = ['dl']
handler.command = ['gitclone']
handler.diamond = true

export default handler