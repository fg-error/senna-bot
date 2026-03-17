const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys')

import NodeCache from "node-cache"
import crypto from "crypto"
import fs from "fs"
import pino from "pino"
import readline from "readline"
import { Boom } from "@hapi/boom"
import { makeWASocket } from "../lib/simple.js"

if (!(global.conns instanceof Array)) global.conns = []

let handler = async (m, { conn: parent, args, usedPrefix, command }) => {

let userBot = global.db.data.users[m.sender]

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

const { version } = await fetchLatestBaileysVersion()

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
version,
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(
state.keys,
pino({ level: "fatal" })
)
},
markOnlineOnConnect: true,
generateHighQualityLinkPreview: true,
msgRetryCounterCache,
userDevicesCache,

getMessage: async (key) => {
try {
let jid = jidNormalizedUser(key.remoteJid)
let msg = await store?.loadMessage(jid, key.id)
return msg?.message || ""
} catch {
return ""
}
}
}

let conn = makeWASocket(connectionOptions)


if (methodCode && !conn.authState.creds.registered) {

if (!phoneNumber) return

let cleanedNumber = phoneNumber.replace(/[^0-9]/g, "")

setTimeout(async () => {

try {

let codeBot = await conn.requestPairingCode(cleanedNumber)

codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot

await parent.sendFile(
m.chat,
"https://i.ibb.co/SKKdvRb/code.jpg",
"code.jpg",
`➤ *Código de Vinculación*

*${codeBot}*

1. Abre WhatsApp
2. Menú ⋮
3. Dispositivos vinculados
4. Vincular con número
5. Introduce el código

⚠️ El código solo funciona para este número.`,
m
)

} catch (err) {
console.log("Error generando pairing code:", err)
}

}, 3000)

}

conn.isInit = false
let isInit = true

async function connectionUpdate(update) {

const { connection, lastDisconnect, isNewLogin } = update
if (isNewLogin) conn.isInit = true

const code =
lastDisconnect?.error?.output?.statusCode ||
lastDisconnect?.error?.output?.payload?.statusCode

if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {

let i = global.conns.indexOf(conn)
if (i < 0) return console.log(await reloadHandler(true).catch(console.error))

delete global.conns[i]
global.conns.splice(i, 1)

if (code === DisconnectReason.connectionClosed) {

parent.sendMessage(m.chat, {
text: "⛔ La conexión se cerró, tendrás que reconectarte enviando el ID"
}, { quoted: m })

}

}

if (connection === "open") {


conn.isInit = true
global.conns.push(conn)

//-- Log 

let logMsg = `
┌─⊷ 🤖 *SUB-BOT CONECTADO*
▢ 🤖 Bot: wa.me/${conn.user?.id?.split(":")[0]}
▢ 🕒 Hora: ${new Date().toLocaleString()}
└──────────────
`
//await parent.sendMessage(canal_logid, { text: logMsg })
await parent.reply(canal_logid, logMsg, m, fwc)

await parent.sendMessage(m.chat, {
text: args[0]
? "✅ Conectado con éxito"
: `✅ *Conectado con éxito!*

En unos segundos te mandaremos el *ID* para reconectarte`
}, { quoted: m })

await sleep(5000)

if (args[0]) return

await parent.sendMessage(conn.user.jid, { text: "✅ Conectado con éxito" })
await parent.sendMessage(conn.user.jid, {
text: `${usedPrefix + command} ${authFolderB}`
})

}

}

let handlerModule = await import("../handler.js")

async function reloadHandler(restatConn = false) {

try {
const Handler = await import(`../handler.js?update=${Date.now()}`)
if (Object.keys(Handler || {}).length) handlerModule = Handler
} catch (e) {
console.error(e)
}

if (restatConn) {
try { conn.ws.close() } catch {}
conn.ev.removeAllListeners()
conn = makeWASocket(connectionOptions)
isInit = true
}

if (!isInit) {

conn.ev.off("messages.upsert", conn.handler)
conn.ev.off("group-participants.update", conn.participantsUpdate)
conn.ev.off("groups.update", conn.groupsUpdate)
conn.ev.off("message.delete", conn.onDelete)
conn.ev.off("connection.update", conn.connectionUpdate)
conn.ev.off("creds.update", conn.credsUpdate)

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

conn.ev.on("messages.upsert", conn.handler)
conn.ev.on("group-participants.update", conn.participantsUpdate)
conn.ev.on("groups.update", conn.groupsUpdate)
conn.ev.on("connection.update", conn.connectionUpdate)
conn.ev.on("creds.update", conn.credsUpdate)

isInit = false
return true

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