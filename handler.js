 import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'



/**
 * @type {import('@whiskeysockets/baileys')}
 */
const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)

const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))
 
/**
 * Handle messages upsert
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
export async function handler(chatUpdate) {

     let settings = {}

    this.msgqueque = this.msgqueque || []


    if (!chatUpdate)
        return
    //this.pushMessage(chatUpdate.messages).catch(console.error)

    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()

//--
global.db.data ||= {}
global.db.data.users ||= {}
global.db.data.chats ||= {}
global.db.data.stats ||= {}
global.db.data.settings ||= {}
    

    
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.coin = 0
        m.diamond = false

        try {
    // =============================
    // USER INIT
    // =============================

    const userDefaults = {
        exp: 0,
        coin: 0,
        diamond: 20,
        bank: 0,
        registered: false,
        name: m.name,
        age: -1,
        regTime: -1,
        afk: -1,
        afkReason: '',
        banned: false,

        level: 0,
        role: 'Novato',
        autolevelup: false,
    }

    if (!global.db.data.users[m.sender])
        global.db.data.users[m.sender] = {}

    let user = global.db.data.users[m.sender]

    for (let key in userDefaults) {
        if (!(key in user) || user[key] === undefined || user[key] === null) {
            user[key] = userDefaults[key]
        }
    }

    // =============================
    // CHAT INIT
    // =============================

    const chatDefaults = {
        isBanned: false,
        welcome: false,
        detect: false,
        sWelcome: '',
        sBye: '',
        sPromote: '',
        sDemote: '',
        antiLink: false,
        nsfw: false,
        rules: '',
        antiBotClone: false
    }

    if (!global.db.data.chats[m.chat])
        global.db.data.chats[m.chat] = {}

    let chat = global.db.data.chats[m.chat]

    for (let key in chatDefaults) {
        if (!(key in chat) || chat[key] === undefined || chat[key] === null) {
            chat[key] = chatDefaults[key]
        }
    }

    // =============================
    // SETTINGS INIT
    // =============================

    if (!global.db.data.settings)
        global.db.data.settings = {}

    if (this.user?.jid) {

        const settingDefaults = {
            self: false,
            autoread: false,
            restrict: false,
            status: 0,
            solopv: false,
            sologp: false
        }

        if (!global.db.data.settings[this.user.jid])
            global.db.data.settings[this.user.jid] = {}

        settings = global.db.data.settings[this.user.jid]

        for (let key in settingDefaults) {
            if (!(key in settings)) {
                settings[key] = settingDefaults[key]
            }
        }
    }

} catch (e) {
    console.error('Error initializing data:', e)
}

//---- AA  

// =============================
// BASIC MESSAGE GUARDS
// =============================

const opts = global.opts || {}
const isGroup = m.chat?.endsWith('g.us')
const text = typeof m.text === 'string' ? m.text : ''

m.text = text

// Modo escucha (no responde nada)
if (opts.nyimak) return
// Modo self (solo responde a sí mismo)
if (opts.self && !m.fromMe) return
// Solo privado
if (settings.solopv && isGroup) return
// Solo grupos (con excepciones permitidas en privado)
if (settings.sologp && !isGroup) {

    const allowedPrivateCmd = [
        'jadibot','bebot','getcode','serbot','bots',
        'stop','support','donate','off','on','s',
        'tiktok','code','newcode','join'
    ]

    const firstWord = text.trim().split(' ')[0]
    const command = firstWord.replace(/^[!./#?]/, '').toLowerCase()

    if (!allowedPrivateCmd.includes(command)) return
}
// Solo estados
if (opts.swonly && m.chat !== 'status@broadcast') return


// =============================
// SAFE USER INIT (Minimal Fallback)
// =============================

if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
        exp: 0,
        diamond: 20,
        level: 0,
        prem: false
    }
}


let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

const botNumber = this.user?.id?.replace(/:[0-9]+/g, '') || ''
const sender = ((await conn.getJid(m.sender)) || m.sender).split(':')[0] + '@s.whatsapp.net'
const normalize = v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

const isROwner = sender === botNumber || global.owner.some(v => sender === normalize(Array.isArray(v) ? v[0] : v))
const isOwner = isROwner || m.fromMe
const isMods = isOwner || global.mods.map(v => normalize(v)).includes(sender)
const isPrems = isROwner || global.prems.map(v => normalize(v)).includes(sender) || (_user?.prem === true)


        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)

            if (opts.queque && m.text && !(isMods || isPrems)) {
   let previousID = this.msgqueque[this.msgqueque.length - 1]
   this.msgqueque.push(m.id || m.key.id)

   while (this.msgqueque.includes(previousID)) {
      await delay(5000)
   }
}

        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        //let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
        
           const groupMetadata = m.isGroup? conn.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(() => null) : null
           const participants = groupMetadata?.participants || []


            const senderJid = this.decodeJid(m.sender)

              const user = m.isGroup ? participants.find(u => this.decodeJid(u.id) === senderJid) || {} : {}
           // const user = participants.find((u) => (u.jid || u.phoneNumber || u.id) === m.sender) || {};
              const bot  = participants.find((u) => (u.jid || u.phoneNumber || u.id) === this.user.jid) || {};


const isRAdmin = user.admin === 'superadmin'
const isAdmin = user?.admin === 'admin' || user?.admin === 'superadmin'
const isBotAdmin  = bot?.admin === 'admin' || bot?.admin === 'superadmin' || false;

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)

            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
                
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
//--
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }

            if (typeof plugin !== 'function')
                continue

            
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Usuarios Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // Ganancia de XP por comando
                if (xp > 200)
                    m.reply('chirrido -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.diamond && global.db.data.users[m.sender].diamond < plugin.diamond * 1) {
                    this.reply(m.chat, `✳️ Tus diamantes se agotaron\nuse el siguiente comando para comprar más diamantes\n\n*${usedPrefix}buy*`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `✳️ nivel requerido ${plugin.level} para usar este comando. \nTu nivel ${_user.level}`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.diamond = m.diamond || plugin.diamond || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                           m.reply(e) //error en el comando
                         // console.error(e)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.diamond)
                        m.reply(`Usaste *${+m.diamond}* 💎`)
                }
                break
            }
            //
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.diamond -= m.diamond * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (opts['autoread'])
            await this.chatRead(m.chat, m.isGroup ? m.sender : undefined, m.id || m.key.id).catch(() => { })
    }
}
//--
export async function participantsUpdate({ id, participants, action }) {
    if (opts['self']) return
    if (global.db.data == null) await loadDatabase()

    let chat = global.db.data.chats[id] || {}
    let text = ''

    // 🔥 Normalizador para v7
    const normalize = (p) =>
        typeof p === 'string' ? p : p?.id

    switch (action) {

        case 'add':
        case 'remove':
            if (!chat.welcome) break

            let groupMetadata =
                await this.groupMetadata(id).catch(_ => null) ||
                (conn.chats[id] || {}).metadata

            if (!groupMetadata) return

            for (let participant of participants) {

                const user = normalize(participant)
                if (!user) continue

                let pp = 'https://i.ibb.co/1ZxrXKJ/avatar-contact.jpg'
                let ppgp = 'https://i.ibb.co/1ZxrXKJ/avatar-contact.jpg'

                try { pp = await this.profilePictureUrl(user, 'image') } catch {}
                try { ppgp = await this.profilePictureUrl(id, 'image') } catch {}

                text = (action === 'add'
                    ? (chat.sWelcome || this.welcome || conn.welcome || 'Bienvenido, @user')
                        .replace('@group', await this.getName(id))
                        .replace('@desc', groupMetadata.desc?.toString() || 'Desconocido')
                    : (chat.sBye || this.bye || conn.bye || 'Adiós, @user')
                ).replace('@user', '@' + user.split('@')[0])

                try {
                    let imageUrl = action === 'add'
                        ? API('fgmods', '/api/welcome', {
                            username: await this.getName(user),
                            groupname: await this.getName(id),
                            groupicon: ppgp,
                            membercount: groupMetadata.participants?.length || 0,
                            profile: pp,
                            background: 'https://i.ibb.co/fkFmQC2/eve.jpg'
                        }, 'apikey')
                        : API('fgmods', '/api/goodbye2', {
                            username: await this.getName(user),
                            groupname: await this.getName(id),
                            groupicon: ppgp,
                            membercount: groupMetadata.participants?.length || 0,
                            profile: pp,
                            background: 'https://i.ibb.co/jh9367t/akali.jpg'
                        }, 'apikey')

                    await this.sendFile(id, imageUrl, 'welcome.jpg', text, null, false, {
                        mentions: [user]
                    })

                } catch {
                    await this.sendFile(id, pp, 'profile.jpg', text, null, false, {
                        mentions: [user]
                    })
                }
            }
            break


        case 'promote':
        case 'demote':
            if (!chat.detect) break

            for (let participant of participants) {

                const user = normalize(participant)
                if (!user) continue

                let pp = await this.profilePictureUrl(user, 'image')
                    .catch(_ => 'https://i.ibb.co/1ZxrXKJ/avatar-contact.jpg')

                text = action === 'promote'
                    ? (chat.sPromote || this.spromote || conn.spromote || '@user ahora es administrador')
                    : (chat.sDemote || this.sdemote || conn.sdemote || '@user ya no es administrador')

                text = text.replace('@user', '@' + user.split('@')[0])

                await this.sendFile(id, pp, 'pp.jpg', text, null, false, {
                    mentions: [user]
                })
            }
            break
    }
}

/**
 * Handle groups update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || 'Descripción cambiada a \n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || 'El nombre del grupo cambió a \n@group').replace('@group', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || 'El icono del grupo cambió a').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || 'El enlace del grupo cambia a\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}


global.dfail = (type, m, conn) => {
    let msg = {
        rowner: `👑 Este comando solo puede ser utilizado por el *Creador del bot*`,
        owner: `🔱 Este comando solo puede ser utilizado por el *Owner y Sub Bots*`,
        mods: `🔰 Esta función es solo para *Para moderadores del Bot*`,
        premium: `💠 Este comando es solo para miembros *Premium*\n\nEscribe */premium* para más info`,
        group: `⚙️ Este comando solo se puede usar en grupos`,
        private: `📮 Este comando solo se puede usar en el chat *privado del Bot*`,
        admin: `🛡️ Este comando es solo para *Admins* del grupos`,
        botAdmin: `💥 ¡Para usar este comando debo ser *Administrador!*`,
        unreg: `📇 Regístrese para usar esta función  Escribiendo:\n\n*/reg*`,
        restrict: '🔐 Esta característica está *deshabilitada*'
    }[type]
    //if (msg) return conn.sendButton(m.chat, msg, mssg.ig, null, [['🔖 OK', 'khajs'], ['⦙☰ MENU', '/menu'] ], m)
    if (msg) return m.reply(msg)
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("✅  Se actualizo 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
}) 
