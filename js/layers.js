addLayer("r", {
    name: "Reality", 
    symbol: "R", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0), // Keep track of total cloth for some upgrades
    }},
    color: "#4BDC13",
    requires: new Decimal(10), 
    resource: "Reality cloth", 
    baseResource: "Reality fabrics", 
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent: 0.5, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('r', 14)) mult = mult.times(upgradeEffect('r', 14))
        
        // The new Life layer will boost Reality cloth gain
        if (hasUpgrade('l', 11)) mult = mult.times(upgradeEffect('l', 11));
        if (player.l.unlocked) mult = mult.times(tmp.l.effect);

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, 
    hotkeys: [
        {key: "r", description: "Press R to produce Reality cloth.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    // Update point generation to be affected by our upgrades
    // This part usually goes in your main game file (e.g., mod.js)
    /*
    Example point generation function in mod.js:
    
    function getPointGen() {
        if(!canGenPoints())
            return new Decimal(0)

        let gain = new Decimal(1)
        if (hasUpgrade('r', 13)) gain = gain.times(upgradeEffect('r', 13))
        if (hasUpgrade('r', 22)) gain = gain.times(upgradeEffect('r', 22))
        return gain
    }
    */

    upgrades: {
        // ROW 1
        11: {
            title: "Universe existence",
            description: "Add reality, generating 1 Reality fabric per second.",
            cost: new Decimal(1),
        },
        12: {
            title: "Stars",
            description: "Add Hydrogen, in turn gravity makes them into stars. A prerequisite for many things.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade('r', 11) },
        },
        13: {
            title: "Matter",
            description: "Adds matter around stars, causing orbits. Boosts Reality fabric gain based on your Reality cloth.",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('r', 12) },
            effect() {
                // Now also boosted by upgrade 21!
                let eff = player[this.layer].points.add(1).pow(0.5)
                if (hasUpgrade('r', 21)) eff = eff.pow(1.5);
                return eff;
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Gravity",
            description: "Add some gravity, to cause matter to clump. Increases your Reality cloth production based on Reality fabrics.",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade('r', 13) },
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        // ROW 2
        21: {
            title: "Planetary Formation",
            description: "Matter coalesces into planets, significantly boosting the 'Matter' upgrade's effect.",
            cost: new Decimal(150),
            unlocked() { return hasUpgrade('r', 14) },
        },
        22: {
            title: "Stellar Fusion",
            description: "Stars begin fusing heavier elements, boosting Reality fabric gain based on your total Reality cloth.",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade('r', 21) },
            effect() {
                // Using .total ensures the bonus doesn't disappear on reset
                return player[this.layer].total.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23: {
            title: "The Spark of Life",
            description: "On a rare, sheltered planet, the conditions are perfect for something new to emerge. Unlocks the Life layer.",
            cost: new Decimal(2500),
            unlocked() { return hasUpgrade('r', 22) },
        },
    },
})
addLayer("l", {
    name: "Life", 
    symbol: "L", 
    position: 0, 
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#00BDE5",
    requires: new Decimal(10000), // Requires 10,000 Reality cloth to start
    resource: "Life Essence", 
    baseResource: "Reality cloth", 
    baseAmount() {return player.r.points}, 
    type: "static", // Static layers increase cost for each purchase
    exponent: 1.2, // Cost scaling
    base: 5, // The base cost for the first Life Essence will be 10000 * 5
    
    gainMult() { 
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },
    
    row: 1, // This places it in the second row of the tree
    layerShown(){return hasUpgrade('r', 23) || player.l.unlocked},

    // Life Essence provides a powerful boost to Reality Cloth gain
    effect() {
        return player.l.points.pow(1.5).add(1);
    },
    effectDescription() {
        return "which are boosting Reality cloth gain by " + format(tmp.l.effect) + "x"
    },

    hotkeys: [
        {key: "l", description: "Press L to create Life Essence.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        11: {
            title: "Cellular Division",
            description: "Life learns to replicate. Boosts Reality cloth gain by your Life Essence.",
            cost: new Decimal(2), // Costs 2 Life Essence
            effect() {
                return player.l.points.add(1).pow(2);
            },
            effectDisplay() { return format(this.effect())+"x" },
        },
        12: {
            title: "Photosynthesis",
            description: "Life learns to create its own energy. Passively generate 1% of the Reality cloth you would get on reset each second.",
            cost: new Decimal(4),
            unlocked() { return hasUpgrade('l', 11) },
        },
    },

    // This is a TMT feature for passive generation
    passiveGeneration() {
        if (hasUpgrade('l', 12)) return 0.01;
        return 0;
    }
})