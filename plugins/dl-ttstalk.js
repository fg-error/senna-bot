import fg from "fg-senna"

let handler = async (m, { conn, text }) => {

  if (!text) throw `✳️ Ingrese un nombre de usuario de tiktok`

  try {

    let res = await fg.ttstalk(text)

    let txt = `
┌──「 *TIKTOK STALK* 
▢ *🔖Nombre:* ${res.name}
▢ *🔖Usuario:* ${res.username}
▢ *👥Seguidores:* ${res.followers}
▢ *🫂Siguiendo:* ${res.following}
▢ *❤️Likes:* ${res.likes}
▢ *🎥Videos:* ${res.videos}
▢ *👥Amigos:* ${res.friends}
▢ *📌Desc:* ${res.bio}
▢ *🔗Link:* https://tiktok.com/@${res.username}
└────────────`

    await conn.sendFile(m.chat, res.avatar, 'tt.png', txt, m, null, fwc)

  } catch (e) {

    console.log(e)
    m.reply(`✳️ Error al obtener información del usuario`)

  }

}

handler.help = ['tiktokstalk']
handler.tags = ['dl']
handler.command = /^t(tstalk|iktokstalk)$/i

export default handler