//-- process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';
import { createRequire } from "module";
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws';
import chalk from 'chalk'
import { readdirSync, statSync, existsSync, readFileSync, watch } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';

import { makeWASocket } from './lib/simple.js'
import { protoType, serialize } from './lib/simple.js'

import { Low, JSONFile } from 'lowdb';
import pino from 'pino';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js'
import readline from 'readline'

const {
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    jidNormalizedUser
} = await import('@whiskeysockets/baileys')

import moment from 'moment-timezone'
import NodeCache from 'node-cache'
import fs from 'fs'
const { chain } = lodash

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }
global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }
global.__require = function require(dir = import.meta.url) { return createRequire(dir) }

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(global.conn, ...args) }

global.timestamp = {
    start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

// global.opts['db'] = "mongodb+srv://dbdyluxbot:password@cluster0.xwbxda5.mongodb.net/?retryWrites=true&w=majority"

global.db = new Low(
    /https?:\/\//.test(opts['db'] || '') ?
        new cloudDBAdapter(opts['db']) :
        /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
            (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
            new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)

global.DATABASE = global.db

global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
        if (!global.db.READ) {
            clearInterval(this)
            resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
        }
    }, 1 * 1000))
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(global.db.data || {})
    }
    global.db.chain = chain(global.db.data)
}
loadDatabase()

//-- SESSION
global.authFile = `sessions`
const { state, saveCreds } = await useMultiFileAuthState(global.authFile)
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

const connectionOptions = {
    logger: pino({ level: 'silent' }),
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    userDevicesCache,
    cachedGroupMetadata: async (jid) => {
        return global.conn?.chats?.[jid]?.metadata
    },
    getMessage: async (key) => {
        try {
            const jid = jidNormalizedUser(key.remoteJid)
            const msg = await store.loadMessage(jid, key.id)
            return msg?.message || undefined
        } catch {
            return undefined
        }
    }
}

global.conn = makeWASocket(connectionOptions)
store.bind(global.conn)
global.conn.store = store
global.conn.ev.on('creds.update', saveCreds)

//--
let phoneNumber = global.botNumber[0]

if (!fs.existsSync(`./${authFile}/creds.json`)) {
    const askNumber = () => {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
            rl.question('📲 Ingresa tu número con código país (ej: 549xxxxx): ', (num) => {
                rl.close()
                resolve(num.trim())
            })
        })
    }

    setTimeout(async () => {
        try {
            if (!phoneNumber) phoneNumber = await askNumber()

            if (!/^\d+$/.test(phoneNumber)) {
                console.log('❌ Número inválido. Usa solo números con código país.')
                process.exit(1)
            }

            let code = await global.conn.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join('-') || code

            console.log('\n')
            console.log(chalk.bold.cyan('╔══════════════════════════════════════╗'))
            console.log(chalk.bold.cyan('║        📲 CÓDIGO DE VINCULACIÓN      ║'))
            console.log(chalk.bold.cyan('╚══════════════════════════════════════╝'))
            console.log('\n')
            console.log(chalk.bold.red('        ╔════════════════════╗'))
            console.log(chalk.bold.red('        ║') + chalk.bold.yellow(`     ${code}      `) + chalk.bold.red('║'))
            console.log(chalk.bold.red('        ╚════════════════════╝'))
            console.log('\n')
            console.log(chalk.bold.hex('#FFD700')('📱 PASOS PARA VINCULAR:\n'))
            console.log(chalk.hex('#00BFFF')('   1) ') + chalk.bold.green('Abre WhatsApp'))
            console.log(chalk.hex('#00BFFF')('   2) ') + chalk.bold.cyan('Ve a Dispositivos vinculados'))
            console.log(chalk.hex('#00BFFF')('   3) ') + chalk.bold.magenta('Toca "Vincular con número"'))
            console.log('\n')
        } catch (e) {
            console.error('❌ Error generando código de vinculación:', e)
        }
    }, 3000)
}
//--

global.conn.isInit = false

if (!opts['test']) {
    setInterval(async () => {
        if (global.db.data) await global.db.write().catch(console.error)
        if (opts['autocleartmp']) {
            try {
                await clearTmp()
            } catch (e) {
                console.error(e)
            }
        }
    }, 60 * 1000)
}

//-- Clear
async function clearTmp() {
    const tmp = [tmpdir(), join(__dirname, './tmp')]
    const files = []

    for (const dir of tmp) {
        if (!existsSync(dir)) continue
        for (const file of readdirSync(dir)) files.push(join(dir, file))
    }

    for (const file of files) {
        try {
            const stats = statSync(file)
            if (stats.isFile() && Date.now() - stats.mtimeMs >= 60_000) {
                await fs.promises.unlink(file).catch(() => {})
            }
        } catch {}
    }
}

setInterval(async () => {
    await clearTmp()
    // console.log(chalk.cyan(`✅ Auto clear | Se limpio la carpeta tmp`))
}, 60000)

//-- Connection
async function connectionUpdate(update) {
    const { connection, lastDisconnect } = update

    if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut

        if (shouldReconnect) {
            console.log('♻ Reconectando...')
            await global.reloadHandler(true)
        } else {
            console.log('❌ Sesión cerrada. Borra la carpeta sessions.')
        }
    }

    if (connection === 'open') {
        console.log('🟢 BOT CONECTADO')
    }
}

//--
process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')

global.reloadHandler = async function (restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) {
        console.error(e)
    }

    if (restatConn) {
        try {
            global.conn.ws.close()
        } catch {}

        global.conn.ev.removeAllListeners()

        global.conn = makeWASocket(connectionOptions)
        store.bind(global.conn)
        global.conn.store = store
        global.conn.ev.on('creds.update', saveCreds)

        isInit = true
    }

    if (!isInit) {
        global.conn.ev.off('messages.upsert', global.conn.handler)
        global.conn.ev.off('group-participants.update', global.conn.participantsUpdate)
        global.conn.ev.off('groups.update', global.conn.groupsUpdate)
        global.conn.ev.off('connection.update', global.conn.connectionUpdate)
        global.conn.ev.off('creds.update', global.conn.credsUpdate)
    }

    global.conn.welcome = 'Hola, @user\nBienvenido a @group'
    global.conn.bye = 'adiós @user'
    global.conn.spromote = '@user ahora es administrador 🛡️'
    global.conn.sdemote = '@user ya no es administrador'
    global.conn.sDesc = '📝 *La descripción del grupo fue actualizada:*\n\n@desc'
    global.conn.sSubject = '📢 *El nombre del grupo cambió a:*\n\n@group'
    global.conn.sIcon = '🖼️ *Se actualizó la foto del grupo.*'
    global.conn.sRevoke = '🔗 *El enlace del grupo fue restablecido:*\n\n@revoke'

    global.conn.handler = handler.handler.bind(global.conn)
    global.conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
    global.conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
    global.conn.connectionUpdate = connectionUpdate.bind(global.conn)
    global.conn.credsUpdate = saveCreds.bind(global.conn, true)

    global.conn.ev.on('messages.upsert', global.conn.handler)
    global.conn.ev.on('group-participants.update', global.conn.participantsUpdate)
    global.conn.ev.on('groups.update', global.conn.groupsUpdate)
    global.conn.ev.on('connection.update', global.conn.connectionUpdate)
    global.conn.ev.on('creds.update', global.conn.credsUpdate)

    global.conn.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            try {
                await handler.deleteUpdate.call(global.conn, update)
            } catch (e) {
                console.error('Error en delete listener:', e)
            }
        }
    })

    isInit = false
    return true
}

//-- Plugins
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}

//-----
async function filesInit() {
    const start = Date.now()
    let ok = 0
    let fail = 0

    for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
        try {
            let file = global.__filename(join(pluginFolder, filename))
            const module = await import(file)
            global.plugins[filename] = module.default || module
            ok++
        } catch (e) {
            console.log(chalk.red(`❌ Error en ${filename}`))
            fail++
            delete global.plugins[filename]
        }
    }

    const end = Date.now()

    console.log(
        chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━') + '\n' +
        chalk.white('📦 Plugins detectados: ') + chalk.bold(ok + fail) + '\n' +
        chalk.green('🟢 Correctos: ') + chalk.bold.green(ok) + '\n' +
        chalk.red('🔴 Con error: ') + chalk.bold.red(fail) + '\n' +
        chalk.magenta('⚡ Tiempo: ') + chalk.bold.magenta(`${end - start}ms`) + '\n' +
        chalk.cyan.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━')
    )
}

filesInit()
//-----

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED:', err)
})

//-- Plugin Hot Reload
global.reload = async (_ev, filename) => {
    if (!pluginFilter(filename)) return

    const start = Date.now()
    const filePath = join(pluginFolder, filename)
    const dir = global.__filename(filePath, true)
    const isExisting = filename in global.plugins
    const exists = existsSync(dir)

    try {
        // 🗑 Plugin eliminado
        if (!exists) {
            if (isExisting) {
                delete global.plugins[filename]
                console.log(chalk.red(`🗑 Plugin eliminado → ${filename}`))
            }
            return
        }

        // 🔍 Validar sintaxis antes de importar
        const code = readFileSync(dir, 'utf8')
        const err = syntaxerror(code, filename, {
            sourceType: 'module',
            allowAwaitOutsideFunction: true
        })

        if (err) {
            const { line, column, message } = err
            const lines = code.split('\n')
            const errorLine = lines[line - 1]

            console.log(
                chalk.red.bold(`❌ Error de sintaxis en ${filename}`) +
                `\n${chalk.yellow(`📍 Línea: ${line}, Columna: ${column}`)}` +
                `\n${chalk.gray(message)}` +
                `\n\n${chalk.white(errorLine)}` +
                `\n${' '.repeat(column - 1)}${chalk.red('^')}`
            )
            return
        }

        // ♻ Import dinámico con cache-bust
        const module = await import(`${global.__filename(dir)}?update=${Date.now()}`)
        global.plugins[filename] = module.default || module

        const end = Date.now()

        if (isExisting) {
            console.log(chalk.cyan(`♻ Plugin recargado → ${filename}`) + chalk.gray(` (${end - start}ms)`))
        } else {
            console.log(chalk.green(`✨ Nuevo plugin → ${filename}`) + chalk.gray(` (${end - start}ms)`))
        }

    } catch (e) {
        console.log(
            chalk.red.bold(`❌ Error cargando ${filename}`) +
            '\n' +
            chalk.gray(e.message)
        )
    } finally {
        global.plugins = Object.fromEntries(
            Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        )
    }
}

//---
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

//-- Quick Test
async function _quickTest() {
    const start = Date.now()

    const check = (cmd, args = []) => {
        return new Promise(resolve => {
            const p = spawn(cmd, args)
            p.on('close', code => resolve(code !== 127))
            p.on('error', () => resolve(false))
        })
    }

    const [ffmpeg, ffmpegWebp, convert, magick, gm] = await Promise.all([
        check('ffmpeg'),
        check('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        check('convert'),
        check('magick'),
        check('gm')
    ])

    const imageMagick = convert || magick || gm

    global.support = Object.freeze({
        ffmpeg,
        ffmpegWebp,
        imageMagick
    })

    const end = Date.now()

    console.log(
        chalk.cyan.bold('━━━━━━━━━━━━━━━━━━━━━━') + '\n' +
        chalk.yellow.bold('🔎 SISTEMA CHECK') + '\n' +
        chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━') + '\n' +
        `🎬 FFmpeg        : ${ffmpeg ? chalk.green('✔ OK') : chalk.red('✖ FAIL')}\n` +
        `🖼 WebP Support  : ${ffmpegWebp ? chalk.green('✔ OK') : chalk.red('✖ FAIL')}\n` +
        `🧰 ImageMagick   : ${imageMagick ? chalk.green('✔ OK') : chalk.red('✖ FAIL')}\n` +
        chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━') + '\n' +
        chalk.magenta(`⚡ Tiempo: ${end - start}ms`) + '\n' +
        chalk.cyan.bold('━━━━━━━━━━━━━━━━━━━━━━')
    )

    if (!ffmpeg) conn.logger.warn('Instala FFmpeg para enviar videos.')
    if (ffmpeg && !ffmpegWebp) conn.logger.warn('FFmpeg no tiene soporte WebP (stickers animados pueden fallar).')
    if (!imageMagick) conn.logger.warn('Instala ImageMagick o GraphicsMagick para stickers.')
}

_quickTest()
    .then(() => console.log('✅ Prueba rápida realizada!'))
    .catch(console.error)