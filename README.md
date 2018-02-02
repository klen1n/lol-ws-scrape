## data-grabber

these are the tools that grab data from lolesports when a game is live, and merge it into a full dataset for the viz. very messy/hacky, so not really well documented, but brief how to use it:

```bash
node index.js # run this while games are live, ideally just keep this on a long running process on a server
```


## todo

scrape game logs

- baron, inhib, tower deaths?

## ideas


### jungle routes overlayed

- 


### stop watch use

show a timeline of stopwatch activations


### gold earned v value of items

stacked area chart


### direction moved each frame

do some players more left and right more?


### bot back timings



### tp lines


### invade paths


## Player tick data

abilityPower: 0
armor: 31
armorPen: 0
armorPenPercent: 0
assists: 0
attackDamage: 77
attackSpeed: 100
ccReduction: 0
cg: 0
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
md: 0
mdc: 0
mk: 0
movementSpeed: 676
p: 360
participantId: 4
pd: 0
pdc: 0
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
td: 0
tdc: 0
teamId: 100
tg: 500
trd: 0
trdc: 0
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