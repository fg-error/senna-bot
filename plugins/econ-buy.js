 
let precioDiamante = 200;
let precioPremiumHora = 50;
let precioPremiumDia = 800;
let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  if (!args[1]) throw `📌 Ejemplo: *${usedPrefix + command}* <ID> <cantidad>\nEjemplo: *${usedPrefix + command}* _01_ 5\n\n*${usedPrefix}shop* Para ver todos los *Items*`;

  let option = args[0];
  let input = args[1];
  let user = global.db.data.users[m.sender];

  if (option === '01') {
    let sca = args[1];
    if (sca.toLowerCase() !== 'all' && !/^[1-9]\d*$/.test(sca)) throw `✳️ Debe ser un numero valido`;

    let all =  Math.floor(user.coin / precioDiamante)
   let count = sca.replace('all', all)
   count = Math.max(1, count)
    //if (isNaN(count)) throw `✳️ ${mssg.isNan}`;
    
    
    let totalCost = precioDiamante * count;

    if (user.coin >= totalCost) {
      user.coin -= totalCost;
      user.diamond += count;

      m.reply(`
┌─「 *COMPROBANTE* 」
‣ *Comprado:* Diamante
‣ *Cantidad comprada:* ${count.toLocaleString()} 💎 
‣ *Gastado:* -${totalCost.toLocaleString()} 🪙
└──────────────`, null, fwc);
    } else {
      m.reply(`❎ No tienes suficientes Coins para comprar *${count}* 💎`, null, fwc);
    }
  } else if (option === '02') {
    let count = 0;
    let unit = '';

    if (input.endsWith('h')) {
      count = parseInt(input.slice(0, -1));
      unit = 'horas';
    } else if (input.endsWith('d')) {
      count = parseInt(input.slice(0, -1));
      unit = 'días';
    } else {
      throw `✳️ ${mssg.noTime} 

*Ejemplo:*
${usedPrefix + command} <ID> <cantidad>
${usedPrefix + command} 02 4d

h = Hora 
d = Dia
`;
    }

    //if (isNaN(count)) throw `✳️ ${mssg.isNan}`;
    if (!/^[1-9]\d*$/.test(count)) throw `✳️ La cantidad debe ser un número válido`;

    let precioPremium = 0;

    if (unit === 'horas') {
      precioPremium = precioPremiumHora * count;
    } else if (unit === 'días') {
      precioPremium = precioPremiumDia * count;
    }

    if (user.diamond >= precioPremium) {
      user.diamond -= precioPremium;
      let horas = 0;

      if (unit === 'horas') {
        horas = count * 3600000;
      } else if (unit === 'días') {
        horas = count * 86400000;
      }

      const now = new Date() * 1;

      if (now < user.premiumTime) {
        user.premiumTime += horas;
      } else {
        user.premiumTime = now + horas;
      }

      user.prem = true;

      m.reply(`
┌─「 *COMPROBANTE* 」
‣ *Comprado:* Premium
‣ *Cantidad:* ${count} ${unit}
‣ *Gastado:* -${precioPremium} 💎
└──────────────`, null, fwc);
    } else {
      m.reply(`❎ No tienes sufucientes Diamantes para comprar ${count} ${unit} de Premium`, null, fwc);
    }
  } else {
    throw `✳️ Ese ítem no existe:\n\n*${usedPrefix}shop* para ver los itens disponibles`;
  }

};
handler.help = ['buy <item>'];
handler.tags = ['econ'];
handler.command = ['buy'];

export default handler;
