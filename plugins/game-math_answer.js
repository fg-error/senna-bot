let handler = m => m

handler.before = async function (m) {

if (!m.text) return !0
if (isNaN(m.text)) return !0

this.math = this.math ? this.math : {}
let id = m.chat

// no hay juego activo
if (!(id in this.math)) return !0

let mathData = this.math[id]
let math = mathData[1]

// 🔒 SOLO aceptar respuestas citando el mensaje
if (!m.quoted) return !0
if (m.quoted.id !== mathData[0].id) return !0

// asegurar usuario
if (!global.db.data.users[m.sender])
global.db.data.users[m.sender] = { coin: 0 }

let user = global.db.data.users[m.sender]
if (!user.coin) user.coin = 0

// respuesta correcta
if (Number(m.text) === Number(math.result)) {

user.coin += math.bonus

clearTimeout(mathData[3])
delete this.math[id]

m.reply(`✅ *Respuesta correcta!*

🎁 Ganaste *+${math.bonus} 🪙*`)

} else {

mathData[2]--

if (mathData[2] <= 0) {

clearTimeout(mathData[3])
delete this.math[id]

m.reply(`❌ *Se acabaron las oportunidades*

📌 Respuesta: *${math.result}*`)

} else {

m.reply(`❎ *Incorrecto*

🔄 Te quedan *${mathData[2]} oportunidades*`)
}

}

return !0
}

export default handler