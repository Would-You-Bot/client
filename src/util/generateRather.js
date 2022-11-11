function generateRegular(_PowersList, pw1, pw2) {
    if(pw1 === pw2) {
        let a = _PowersList[Math.floor(Math.random() * _PowersList.length)];
        let b = _PowersList[Math.floor(Math.random() * _PowersList.length)];
        return generateRegular(_PowersList,a,b)
    }
    return {
        power1: pw1,
        power2: pw2
    }
}
function generateMixed(_PowersList, result, _type, pw1, pw2, ) {
    if(pw1 === pw2) {
        let a = result.customMessages.filter(c => c.type === _type)[Math.floor(Math.random() * result.customMessages.filter(c => c.type === _type).length)].msg;
        let b = power2 = _PowersList[Math.floor(Math.random() * _PowersList.length)];
        return generateMixed(_PowersList, result, _type,a,b)
    }
    return {
        power1: pw1,
        power2: pw2
    }
}
function generateCustom(result, _type, pw1, pw2) {
    if(pw1 === pw2) {
        let a = result.customMessages.filter(c => c.type === _type)[Math.floor(Math.random() * result.customMessages.filter(c => c.type === _type).length)].msg;
        let b = result.customMessages.filter(c => c.type === _type)[Math.floor(Math.random() * result.customMessages.filter(c => c.type === _type).length)].msg;
        return generateCustom(a,b)
    }
    return {
        power1: pw1,
        power2: pw2
    }
}
module.exports = async (result, _PowersList, _type) => {
    let power1;
    let power2;
    if (result.customTypes === "regular") {
        /* 
            1. Generate 2 random powers from _PowerList given as param > rather.js and replay system trough buttons. (useful,useles)
            2. Check if both powers are the same. If so regenerate. Otherwise return them -> generateRegular()
            3. Set powers to generated power messages.
        */
        power1 = _PowersList[Math.floor(Math.random() * _PowersList.length)];
        power2 = _PowersList[Math.floor(Math.random() * _PowersList.length)];
        let powers = generateRegular(_PowersList,power1, power2);
        power1 = powers.power1;
        power2 = powers.power2;
    } else if (result.customTypes === "mixed") {
        /* 
            1. Check if there are custom messages. If yes generate a custom power + normal power. If double run regenerate.
            2. If no custom messages handle as regular.
        */
        if (result.customMessages.filter(c => c.type === _type) != 0) {
            power1 = result.customMessages.filter(c => c.type === _type)[Math.floor(Math.random() * result.customMessages.filter(c => c.type === _type).length)].msg
            power2 = _PowersList[Math.floor(Math.random() * _PowersList.length)];
            let powers = generateMixed(_PowersList, result, _type, power1, power2);
            power1 = powers.power1
            power2 = powers.power2
        } else {
            power1 = _PowersList[Math.floor(Math.random() * _PowersList.length)];
            power2 = _PowersList[Math.floor(Math.random() * _PowersList.length)];
            let powers = generateRegular(_PowersList,power1, power2);
            power1 = powers.power1
            power2 = powers.power2
        }
    } else if (result.customTypes === "custom") {
        /* 
            1. Generate 2 random powers from custom powers give as a param trough db results 
            2. Check if both powers are the same. If so regenerate. Otherwise return them -> generateCustom()
            3. Set powers to generated power messages.
        */
        if (result.customMessages.filter(c => c.type === _type) == 0) return await interaction.reply({ ephemeral: true, content: `${Rather.button.nocustom}` })
        power1 = result.customMessages.filter(c => c.type === _type)[Math.floor(Math.random() * result.customMessages.filter(c => c.type === _type).length)].msg;
        power2 = result.customMessages.filter(c => c.type === _type)[Math.floor(Math.random() * result.customMessages.filter(c => c.type === _type).length)].msg;
        let powers = generateCustom(power1, power2);
        power1 = powers.power1;
        power2 = powers.power2;
    }
    return {
        power1: power1,
        power2: power2
    }
}