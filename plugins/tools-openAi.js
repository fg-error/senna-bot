import axios from 'axios'

let chats = {}
let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  // comando reset
  if (command === 'resetai') {
    delete chats[m.sender]
    return m.reply('🧠 Memoria reiniciada')
  }

  if (!text) return m.reply(`✳️ Uso del comando\n\n*${usedPrefix + command}* texto`)

  try {
   m.react("💬")
    let res = await gpt(m.sender, text)

    m.reply(res, null, fwc)
    

  } catch (e) {
    m.reply('❎ Error: intenta más tarde')
  }

}
handler.help = ['ai <text>', "resetai <elimina memoria gpt>"]
handler.tags = ['tools']
handler.command = ["ia","ai", "resetai", "gpt", "openai", "senna"]

export default handler


async function gpt(userId, text) {

   let syst = `Eres Senna Bot, un asistente inteligente, rápido y útil.
Fuiste creado como bot de WhatsApp por FG, y estás basado en un modelo de lenguaje desarrollado por OpenAI.

Respondes de forma clara, breve y directa, pero con un toque de personalidad.
Usas Markdown para mejorar la lectura cuando sea necesario.

Reglas:
- No des respuestas innecesariamente largas
- Sé preciso y útil
- Si algo no se entiende, pide aclaración
- Puedes usar humor ligero cuando encaje
- Prioriza ayudar al usuario por encima de todo`

  if (!chats[userId]) {
    chats[userId] = [
      {
        role: "system",
        content: syst
      }
    ]
  }

  chats[userId].push({
    role: "user",
    content: text
  })

  // --- límite de memoria
  let MAX_MESSAGES = 12

  if (chats[userId].length > MAX_MESSAGES) {
    chats[userId] = [
      chats[userId][0], 
      ...chats[userId].slice(-10)
    ]
  }

  try {
    const { data } = await axios.post('https://aichat-api.vercel.app/chatgpt', {
      messages: chats[userId]
    }, {
      timeout: 20000 
    })

    let res = data?.content?.trim() || 'Sin respuesta'

    chats[userId].push({
      role: "assistant",
      content: res
    })

    return res

  } catch (err) {
    
    return '⚠️ La IA no responde, intenta de nuevo'
  }
}