import fetch from 'node-fetch'

let handler = async (m, { conn, command, args, text }) => {

    if (!text) return m.reply('✳️ Ingresa un link válido')

    try {
        m.react(rwait)

        
        let url = text.trim()
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url

        // 📸 Full page si termina en "f"
        let full = /f$/i.test(command)


        let res = await fetch(global.API('fg_ss', '/api/ssweb', { url, delay: 1000, full }))

        if (!res.ok) throw new Error(`Error API: ${res.status}`)

        let buffer = await res.buffer()

       await conn.sendFile(m.chat, buffer, 'captura.png', '✅ Aquí tienes tu captura', m)

        m.react(done)

    } catch (e) {
       
        m.reply('❌ Error al generar la captura')
        
    }
}

handler.help = ['ssweb <url>']
handler.tags = ['tools']
handler.command = ['ssweb', 'ss', 'captura', 'ssf', 'sswebf']

export default handler