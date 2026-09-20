
let handler = async (m, { conn, text }) => {
    if (!text) throw `✳️ Por favor, ingrese el enlace de un canal.`;

    try {
        let id = text
            .replace(/https:\/\/(www\.)?whatsapp\.com\/channel\//, "")
            .split("/")[0]
            .trim();

        let metadata = await conn.newsletterMetadata("invite", id);

        let thread = metadata.thread_metadata;

        let name = thread?.name?.text || "No disponible";
        let subscribers = thread?.subscribers_count || "0";

        let created = thread?.creation_time? new Date(Number(thread.creation_time) * 1000).toLocaleString("es-ES") : "No disponible";

        let img = thread?.preview?.direct_path? `https://pps.whatsapp.net${thread.preview.direct_path}` : null;

        let info = `
*📢 INFO DEL CANAL*

📌 *ID:* ${metadata.id}
🫧 *Nombre:* ${name}
👥 *Seguidores:* ${subscribers}
⏳ *Creado el:* ${created}
`.trim();

        if (img) {
            await conn.sendFile(m.chat, img, 'channel.jpg', info, m);
        } else {
            await conn.reply(m.chat, info, m);
        }

    } catch (e) {
        throw "❌ Error al obtener la información del canal.";
    }
};

handler.help = ['ci <link>'];
handler.tags = ['tools'];
handler.command = ['ci', 'channelinfo', 'cinfo'];

export default handler;