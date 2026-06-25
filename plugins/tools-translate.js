import { translate } from '@vitalets/google-translate-api'

const defaultLang = 'es'

let handler = async (m, { args, usedPrefix, command }) => {

    let example = `
📌 *Ejemplo :*

*${usedPrefix + command}* <idioma> [texto]
*${usedPrefix + command}* es Hello World

≡ *Lista de Idiomas Admitidos:* 

https://cloud.google.com/translate/docs/languages
`.trim()

    if (!args.length && !m.quoted) throw example

    let lang = args[0]
    let text = args.slice(1).join(' ')

    if (!lang || lang.length !== 2) {
        lang = defaultLang
        text = args.join(' ')
    }

    if (!text && m.quoted?.text) {
        text = m.quoted.text
    }

    if (!text) throw example

    try {
        let result = await translate(text, {
            to: lang,
            autoCorrect: true
        }).catch(() => null)

        if (!result || !result.text) {
            throw '❌ Error al traducir el texto.'
        }

        m.reply(result.text, null, fwc)

    } catch (e) {
        throw example
    }
}

handler.help = ['trad <leng> <text>']
handler.tags = ['tools']
handler.command = ['translate', 'tl', 'trad', 'tr', 'traducir']

export default handler