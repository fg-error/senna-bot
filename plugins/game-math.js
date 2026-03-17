let handler = async (m, { conn, args, usedPrefix, command }) => {

conn.math = conn.math ? conn.math : {}

let txt = `
🧮 *Juego de Matemáticas*

📊 *Dificultades disponibles*

🟢 noob
🟢 fácil
🟡 normal
🟠 difícil
🔴 experto
🔥 maestro
💀 extremo
☠️ imposible

📌 *Ejemplo*
${usedPrefix + command} normal
`

if (!args[0]) throw txt

let mode = args[0].toLowerCase()
if (!(mode in modes)) throw txt

let id = m.chat

if (id in conn.math)
return conn.reply(
m.chat,
`⚠️ Todavía hay una pregunta sin responder en este chat`,
conn.math[id][0]
)

let math = genMath(mode)

conn.math[id] = [
await conn.reply(
m.chat,
`🧠 *Resuelve la operación*

❓ ${math.str} = ?

⏱ Tiempo: ${(math.time / 1000).toFixed(0)} segundos
💰 Recompensa: ${math.bonus} 🪙`,
m
),
math,
4,
setTimeout(() => {
if (conn.math[id]) {
conn.reply(
m.chat,
`⏰ *Se acabó el tiempo!*

✅ La respuesta correcta era:
*${math.result}*`,
conn.math[id][0]
)
delete conn.math[id]
}
}, math.time)
]

}

handler.help = ['math <modo>']
handler.tags = ['game']
handler.command = ['mates','mate','math','matemáticas']

export default handler


let modes = {

noob:      [-5, 5,  -5, 5,  '+-',    20000,  50],
fácil:     [-10, 10, -10, 10, '+-',   20000,  100],
normal:    [-30, 30, -30, 30, '+-*',  30000,  250],
difícil:   [-80, 80, -80, 80, '+-*',  35000,  400],
experto:   [-150,150,-150,150,'+-*/', 40000,  700],
maestro:   [-300,300,-300,300,'+-*/', 45000,  1000],
extremo:   [-500,500,-500,500,'+-*/', 50000,  1500],
imposible: [-1000,1000,-1000,1000,'*/',60000, 2000]

}

let operators = {
'+': '+',
'-': '-',
'*': '×',
'/': '÷'
}

function genMath(mode){

let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]

let a = randomInt(a1, a2)
let b = randomInt(b1, b2)

let op = pickRandom([...ops])

// evitar divisiones con decimales
if(op == '/'){
b = randomInt(1, 10)
a = b * randomInt(1, 20)
}

let result = new Function(`return ${a} ${op} ${b}`)()

return {
str: `${a} ${operators[op]} ${b}`,
mode,
time,
bonus,
result
}

}

function randomInt(from, to){

if(from > to) [from, to] = [to, from]

from = Math.floor(from)
to = Math.floor(to)

return Math.floor((to - from) * Math.random() + from)

}

function pickRandom(list){
return list[Math.floor(Math.random() * list.length)]
}

handler.modes = modes