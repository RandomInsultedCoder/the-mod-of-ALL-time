let modInfo = {
	name: "The SCP Tree",
	id: "SCP-05",
	author: "[ARGON1321]",
	pointsName: "Fabric of reality",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
// This function should be in your mod.js file (or wherever you defined it originally)

function getPointGen() {
	// canGenPoints() is a function that should return true when you want to start generating points.
	// For this game, that's probably as soon as the game starts, or after buying the first upgrade.
	// We'll assume it's true after buying upgrade r, 11.
	if (!canGenPoints() || !hasUpgrade('r', 11))
		return new Decimal(0)

	// Start with a base gain of 1 "Reality fabric" per second.
	// Upgrade r, 11 ("Universe existence") enables this.
	let gain = new Decimal(1)

	// --- REALITY (r) LAYER BONUSES ---

	// Upgrade r, 13 ("Matter") boosts fabric gain based on your Reality cloth.
	if (hasUpgrade('r', 13)) gain = gain.times(upgradeEffect('r', 13))

	// Upgrade r, 22 ("Stellar Fusion") boosts fabric gain based on your total Reality cloth.
	if (hasUpgrade('r', 22)) gain = gain.times(upgradeEffect('r', 22))


	// --- (Add bonuses from other future layers here) ---


	return gain
}
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}