let handler = async (m, { conn, usedPrefix }) => {

let text = `🎰 *RULETA CASINO*

Puedes realizar apuestas en diferentes espacios de la ruleta.

📌 *Uso del comando*
${usedPrefix}roulette <cantidad> <espacio>

💰 *Multiplicadores de pago*

🎯 *x36* → Número exacto  
• Ej: 7, 12, 30

📦 *x3* → Docenas  
• 1-12  
• 13-24  
• 25-36  

📊 *x3* → Columnas  
• 1st  
• 2nd  
• 3rd  

🔢 *x2* → Mitades  
• 1-18  
• 19-36  

⚖️ *x2* → Par / Impar  
• odd  
• even  

🎨 *x2* → Colores  
• red  
• black  

🧪 *Ejemplos*
${usedPrefix}roulette 200 odd
${usedPrefix}roulette 600 2nd
${usedPrefix}roulette 500 17
`

let img = "https://i.ibb.co/YjsxJwR/ruleta.png"

await conn.sendFile(m.chat, img, "ruleta.jpg", text, m)
}

handler.help = ["roulette-info"]
handler.tags = ["game"]
handler.command = ['roulette-info','ruleta-info','info-ruleta']

export default handler