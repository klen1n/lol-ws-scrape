https://1wheel.github.io/lol-ws-scrape/sketches/01-paths/
https://1wheel.github.io/lol-ws-scrape/sketches/02-all-jungle/
https://1wheel.github.io/lol-ws-scrape/sketches/03-invade-routes/
https://1wheel.github.io/lol-ws-scrape/sketches/04-champ-dmg/
https://1wheel.github.io/lol-ws-scrape/sketches/05-gold-dif/
https://1wheel.github.io/lol-ws-scrape/sketches/06-health-timeline/
https://1wheel.github.io/lol-ws-scrape/sketches/07-cs-dif/

scraping code from https://github.com/remixz/lol-game-analysis/tree/master/data-grabber

```bash
node index.js # run this while games are live, ideally just keep this on a long running process on a server
```


## todo

scrape game logs

- baron, inhib, tower deaths?

## ideas


### jungle routes overlayed

- 

### differences in cs by position over time


### gold earned v value of items

stacked area chart


### health of every player over time


### stop watch use

show a timeline of stopwatch activations


### direction moved each frame

do some players more left and right more?


### bot back timings



### tp lines


### invade paths


## Player tick data

https://github.com/remixz/lol-game-analysis/blob/92b745b22e83726abfef46a9c29fbbaae9e710bc/src/components/PlayerTable/index.js

abilityPower: 0
armor: 31
armorPen: 0
armorPenPercent: 0
assists: 0
attackDamage: 77
attackSpeed: 100
ccReduction: 0
cg: 0 // current gold
championId: 81
championName: "Ezreal"
deaths: 0
doubleKills: 0
h: 559
healthRegen: 12
items: [2031, 3302, 3340]
kills: 0
level: 1
lifesteal: 0
magicPen: 0
magicPenPercent: 0
magicResist: 30
masteries: []
maxHealth: 559
maxPower: 360
md: 0 // Magic Damage
mdc: 0
mk: 0 // Minions Killed
movementSpeed: 676
p: 360
participantId: 4
pd: 0 // Physical Damage Dealt
pdc: 0 // Physical Damage Dealt Champs
pentaKills: 0
playerId: "1375"
powerRegen: 16
profileIconId: 23
quadraKills: 0
runes: []
skills: {}
skinIndex: 8
spellVamp: 0
summonerName: "GGS Deftly"
summonersSpell1: 4
summonersSpell2: 7
td: 0  // Total Damage Dealt
tdc: 0 // Total Damage to Champions
teamId: 100
tg: 500  // Total Gold
trd: 0  // True Damage Dealt
trdc: 0 // True Damage to Champions
tripleKills: 0
wardsKilled: 0
wardsPlaced: 0
x: 628
xp: 0
y: 724


### team tick data

baronsKilled: 0
color: "blue"
dragonsKilled: 0
firstBlood: false
inhibitorsKilled: 0
matchDefeat: 0
matchVictory: 0
teamId: 100
towersKilled: 0