const {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys')
import NodeCache from "node-cache"
import crypto from "crypto"
import fs from "fs"
import pino from "pino"
import readline from "readline"
import { makeWASocket } from "../lib/simple.js"

if (!(global.conns instanceof Array)) global.conns = []

let handler = async (m, { conn: parent, args, usedPrefix, command }) => {
if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == parent.user.jid)) {
throw `📌 Este comando solo puede ser usado en el bot principal\n\nwa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}botclone`
}

async function startBot() {
let authFolderB
let nameR = `senna_${crypto.randomBytes(10).toString('base64').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6)}`

if (args[0] && fs.existsSync(`./bebots/${args[0]}`)) {
authFolderB = args[0]
if (!fs.existsSync(`./bebots/${authFolderB}/creds.json`)) {
fs.rmSync(`./bebots/${authFolderB}`, { recursive: true, force: true })
authFolderB = nameR
fs.mkdirSync(`./bebots/${authFolderB}`, { recursive: true })
}
} else {
authFolderB = nameR
fs.mkdirSync(`./bebots/${authFolderB}`, { recursive: true })
}

const { state, saveCreds } = await useMultiFileAuthState(`./bebots/${authFolderB}`)
const msgRetryCounterCache = new NodeCache()
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

let phoneNumber
try {
phoneNumber = await parent.getNum(m.sender)
} catch {
phoneNumber = null
}

const methodCode = !!phoneNumber || process.argv.includes("code")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const connectionOptions = {
logger: pino({ level: "silent" }),
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
},
markOnlineOnConnect: true,
generateHighQualityLinkPreview: true,
msgRetryCounterCache,
userDevicesCache,
getMessage: async (key) => {
try {
let jid = jidNormalizedUser(key.remoteJid)
let msg = await conn?.loadMessage?.(jid, key.id)
return msg?.message || undefined
} catch {
return undefined
}
}
}

let conn = makeWASocket(connectionOptions)
let handlerModule = await import("../handler.js")
let isInit = true
let reconnecting = false
let reconnectTimer = null
let reconnectAttempts = 0
let connectionNotified = false
const maxReconnectDelay = 60000

async function onDelete(updates) {

  for (const update of updates) {
  try {
      await handlerModule.deleteUpdate.call(conn, update)
    } catch (e) {
      console.error('SUB-BOT Error en delete listener:', e)
    }
  }
}

//---  
async function replaceExistingConnection(newConn) {

const newJid = jidNormalizedUser(newConn.user?.jid || newConn.user?.id)

if (!newJid) return

const oldConnections = global.conns.filter(c => {
if (!c || c === newConn || !c.user) return false

const oldJid = jidNormalizedUser(c.user?.jid || c.user?.id)

return oldJid === newJid
})

for (const oldConn of oldConnections) {

console.log(`✅SUB-BOT: Nueva sesión detectada: ${newJid}`)
console.log(`⚠️ SUB-BOT: Cerrando conexión anterior...`)

oldConn.intentionalStop = true

global.conns = global.conns.filter(c => c !== oldConn)

try {
oldConn.reconnecting = false
} catch {}

try {
if (oldConn.reconnectTimer) {
clearTimeout(oldConn.reconnectTimer)
oldConn.reconnectTimer = null
}
} catch {}

try {
oldConn.ws?.close()
} catch {}

try {
oldConn.ev?.removeAllListeners()
} catch {}

console.log(`✅ SUB-BOT: Conexión anterior eliminada: ${newJid}`)
}

}

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin } = update

if (isNewLogin) conn.isInit = true

if (connection === "open") {

reconnecting = false
reconnectAttempts = 0

if (reconnectTimer) {
clearTimeout(reconnectTimer)
reconnectTimer = null
}

conn.isInit = true

await replaceExistingConnection(conn)

if (!global.conns.includes(conn))
global.conns.push(conn)

if (connectionNotified) return

connectionNotified = true

let logMsg = `
┌─⊷ 🤖 *SUB-BOT CONECTADO*
▢ 🤖 Bot: wa.me/${conn.user?.id?.split(":")[0]}
▢ 🕒 Hora: ${new Date().toLocaleString("es-AR", {
timeZone: "America/Argentina/Buenos_Aires"
})}
└──────────────
`
//await parent.reply(canal_logid, logMsg, m, fwc)

await parent.sendMessage(m.chat, { text: args[0]? "✅ Conectado con éxito": `✅ *¡Conectado con éxito!*\n\nEn unos segundos te mandaremos el *ID* para reconectarte`}, { quoted: m }).catch(() => {})

if (args[0]) return

await sleep(5000)

await parent.sendMessage(conn.user.jid, {text: "✅ Conectado con éxito"})
await parent.sendMessage(conn.user.jid, {text: `${usedPrefix + command} ${authFolderB}`})

return
}

if (connection !== "close") return

if (conn.intentionalStop) {
console.log(`✅ SUB-BOT: Detenido manualmente: ${authFolderB}`)
global.conns = global.conns.filter(c => c !== conn)
return
}

const statusCode =
lastDisconnect?.error?.output?.statusCode ||
lastDisconnect?.error?.output?.payload?.statusCode ||
lastDisconnect?.error?.statusCode

const reason = statusCode || "desconocido"

console.log(`⚠️SUB-BOT: Conexión cerrada: ${reason}`)

if (statusCode === DisconnectReason.loggedOut) {
console.log(`✅ SUB-BOT: Sesión cerrada: ${authFolderB}`)
global.conns = global.conns.filter(c => c !== conn)
return
}

if (statusCode === DisconnectReason.badSession) {
console.log(`⚠️ SUB-BOT: Sesión inválida: ${authFolderB}`)
global.conns = global.conns.filter(c => c !== conn)
try {
fs.rmSync(`./bebots/${authFolderB}`, { recursive: true, force: true })
} catch {}
return
}

if (reconnecting) return

reconnecting = true
global.conns = global.conns.filter(c => c !== conn)

reconnectAttempts++

const delay = Math.min(5000 * Math.pow(2, reconnectAttempts - 1), maxReconnectDelay)

console.log(`🔄 SUB-BOT: Reconectando en ${Math.round(delay / 1000)}s... Intento ${reconnectAttempts}`)

reconnectTimer = setTimeout(async () => {
await reloadHandler(true)
reconnecting = false

}, delay)
}

async function reloadHandler(restartConn = false) {

const Handler = await import(`../handler.js?update=${Date.now()}`)
if (Object.keys(Handler || {}).length) handlerModule = Handler


if (restartConn) {
try {
conn.ev.off("messages.upsert", conn.handler)
conn.ev.off("messages.update", conn.onDelete)
conn.ev.off("group-participants.update", conn.participantsUpdate)
conn.ev.off("groups.update", conn.groupsUpdate)
conn.ev.off("connection.update", conn.connectionUpdate)
conn.ev.off("creds.update", conn.credsUpdate)
} catch {}

try {
conn.ws?.close()
} catch {}

try {
conn.ev?.removeAllListeners()
} catch {}

conn = makeWASocket(connectionOptions)
conn.isInit = false
}

conn.welcome = global.conn?.welcome || ""
conn.bye = global.conn?.bye || ""
conn.spromote = global.conn?.spromote || ""
conn.sdemote = global.conn?.sdemote || ""

conn.handler = handlerModule.handler.bind(conn)
conn.participantsUpdate = handlerModule.participantsUpdate.bind(conn)
conn.groupsUpdate = handlerModule.groupsUpdate.bind(conn)
conn.connectionUpdate = connectionUpdate.bind(conn)
conn.credsUpdate = saveCreds.bind(conn)
conn.onDelete = onDelete

conn.ev.on("messages.upsert", conn.handler)
conn.ev.on("messages.update", conn.onDelete)
conn.ev.on("group-participants.update", conn.participantsUpdate)
conn.ev.on("groups.update", conn.groupsUpdate)
conn.ev.on("connection.update", conn.connectionUpdate)
conn.ev.on("creds.update", conn.credsUpdate)

isInit = false
return true
}

if (methodCode && !state.creds.registered) {
if (!phoneNumber) return

let cleanedNumber = phoneNumber.replace(/[^0-9]/g, "")

setTimeout(async () => {

let codeBot = await conn.requestPairingCode(cleanedNumber)
codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot

await parent.sendFile(m.chat, "https://i.ibb.co/SKKdvRb/code.jpg", "code.jpg",
`➤ *Código de Vinculación*

*${codeBot}*

1. Abre WhatsApp
2. Menú ⋮
3. Dispositivos vinculados
4. Vincular con número
5. Introduce el código

⚠️ El código solo funciona para este número.`, m)

}, 3000)
}

await reloadHandler(false)
}

startBot()
}

handler.help = ["botclone"]
handler.tags = ["bebot"]
handler.command = ["bebot", "serbot", "jadibot", "botclone", "clonebot"]

export default handler

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms))
}