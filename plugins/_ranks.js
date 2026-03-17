
global.rpg = {
	
  role(level) {
    level = parseInt(level)
    if (isNaN(level)) return { name: '', level: '' }
    
    const role = [
      { name: "Novice", level: 0 }, { name: "Apprentice", level: 4 }, 
      { name: "Adept", level: 8 }, { name: "Magus", level: 12 }, 
      { name: "Master", level: 16 }, { name: "Guardian", level: 20 }, 
      { name: "Champion", level: 24 }, { name: "Hero", level: 28 }, 
      { name: "Legend", level: 32 }, { name: "Myth", level: 36 },
      { name: "Wizard", level: 48 }, { name: "Archmage", level: 52 }, 
      { name: "Sage", level: 56 }, { name: "Divine", level: 60 }, 
      { name: "All-Father", level: 100 }
    ];

    return role.reverse().find(role => level >= role.level)
  }
}
