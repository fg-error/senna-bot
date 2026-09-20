import { sticker } from '../lib/sticker.js'
import axios from 'axios'

let handler = async (m, { conn }) => {
  const img = (await axios.get('https://raw.githubusercontent.com/fg-error/fg-team/refs/heads/main/img/hu.json')).data
  const url = pickRandom(img) 

  const stiker = await sticker(null, url, global.packname, global.author)
  await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true })
}

handler.customPrefix = /^(jsjs)$/i
handler.command = new RegExp

export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}