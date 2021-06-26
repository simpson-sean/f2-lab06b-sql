function getFactionIdByName(factions, name) {
    const matchedFaction = factions.find(faction => {
        return faction.faction === name;
    });
    
    return matchedFaction.id;
}

module.exports = {
    getFactionIdByName: getFactionIdByName
};
