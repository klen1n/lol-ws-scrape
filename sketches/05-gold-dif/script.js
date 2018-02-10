console.clear()
d3.select('body').selectAppend('div.tooltip')

// mk tg cg tdc h maxHealth
var isTotalGold = false
d3.loadData('../04-champ-dmg/games.json', (err, res) => {
  games = res[0]

  games.forEach(game => {
    var {headers, players} = game

    headers = headers.split(',')
    game.players = game.players.map(parsePath)

    function parsePath(p){
      var outPath = p.ticks.split(' ').map(str => {
        var rv = {}
        str.split(',').forEach((d, i) => rv[headers[i]] = d)

        return rv
      })

      outPath.forEach((d, i) => {
        // d.p = i ? outPath[i - 1] : d
        d.i = i

        d.time = i*5 + 10
        d.percentHealth = d.h/d.maxHealth        
      })

      outPath.meta = p.meta

      outPath.name = p.meta.summonerName

      return outPath
    }
  })

  gameSel = d3.select('#graph').html('')
    .appendMany('div', games)
    .st({height: 200, width: 300, display: 'inline-block'})
    .each(drawGame)

  if (window.goldInterval) window.goldInterval.stop()
  window.goldInterval = d3.interval(update, 2000)


})


function drawGame(game){
  var bPlayers = game.players.slice(0, 5)
  var rPlayers = game.players.slice(5, 10)

  game.ticks = game.players[0].map((d, i) => {
    // var data = game.players.map()

    var bcg = d3.sum(bPlayers, d => d[i].cg)
    var btg = d3.sum(bPlayers, d => d[i].tg)
    var rcg = d3.sum(rPlayers, d => d[i].cg)
    var rtg = d3.sum(rPlayers, d => d[i].tg)

    var total = btg + rtg

    var rv = [btg - bcg, bcg, rcg, rtg - rcg]

    rv = rv.concat(rv.map(d => d/total))

    rv[0] = -rv[0]
    rv[1] = -rv[1]

    rv.i = i
    rv.time = d.time

    return rv
  })

  var stackTotal = d3.stack()
      .keys([1, 0, 2, 3])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetDiverging)
  seriesTotal = stackTotal(game.ticks)

  var temp = seriesTotal[0]
  seriesTotal[0] = seriesTotal[1]
  seriesTotal[1] = temp
  // console.log(temp)

  var stackPercent = d3.stack()
      .keys([4, 5, 6, 7])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone)
  seriesPercent = stackPercent(game.ticks)


  var sel = d3.select(this)
  sel.append('h4')
    .text(game.gameMeta.generatedName.split('|G1')[0].replace('|', ' v. '))
    .st({fontSize: 14, textAlign: '', marginBottom: 10, marginTop: 20})

  var c = d3.conventions({
    sel: d3.select(this),
    layers: 'dcs',
    margin: {top: 0, left: 35, right: 0, bottom: 60}
  })

  var {x, y, layers: [divSel, ctx, svg]} = c

  x.domain([0, 60*70])
  y.domain([0, 1])

  // y.domain([.2, .8])
  // sel.select('svg').st({overflow: 'hidden'})

  c.xAxis.ticks(5)
    .tickFormat(d => d/60 + (d == 60*50 ? ' ' : ''))
    .tickValues(d3.range(0, 60*70, 60*10))

  c.yAxis.ticks(5)
    .tickValues([])
    .tickFormat(d3.format('.0%'))


  d3.drawAxis(c)

  var area = d3.area()
    .x((d, i) =>  c.x(d.data.time))
    .y0(d => c.y(d[0]))
    .y1(d => c.y(d[1]))

  game.pathSel = svg.appendMany('path.area', seriesPercent)
    .at({
      d: area,
      fill: (d, i) => i < 2 ? 'rgb(33, 150, 243)' : 'rgb(244, 67, 54)',
      fillOpacity: (d, i) => i == 1 || i == 2 ? .4 : 1 
    })

  //mk tg cg h maxHealth


  game.c = c
  game.seriesPercent = seriesPercent
  game.seriesTotal = seriesTotal
  game.area = area
}


function update(){
  isTotalGold = !isTotalGold

  games.forEach(({c, pathSel, area, seriesTotal, seriesPercent}) => {
    if (isTotalGold){
      c.y.domain([-80000, 80000])
      pathSel.data(seriesTotal)
    } else{
      c.y.domain([0, 1])
      pathSel.data(seriesPercent)
    }

    pathSel
      .transition().duration(1000)
      .at({d: area})
  })
}

