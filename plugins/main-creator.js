
function handler(m) {
   let data = global.owner.filter(([id, isCreator]) => id && isCreator);

    let numberowner = data[0]?.[0] || ''
    let gmail = "fg98ff@gmail.com"
    let instagram = fg_ig
    let onum = 'Número del creador'

    const contacts = data.map(([id, name]) => [id, name, numberowner, gmail, instagram, onum])

    this.sendContact(m.chat, contacts, m)
    
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño', 'fgowner'] 

export default handler
