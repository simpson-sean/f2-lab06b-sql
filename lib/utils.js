
function getFactionById(faction, name) {
    const matchFaction = faction.find(faction => {
        return faction.faction === name;

    });

    return matchFaction.id;
}

module.exports = {
    getFactionById: getFactionById

};