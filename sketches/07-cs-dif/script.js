console.clear()
d3.select('body').selectAppend('div.tooltip')

// mk tg cg tdc h maxHealth
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
        d.p = i ? outPath[i - 1] : d
        d.n = i != outPath.length - 1 ? outPath[i + 1] : d
        d.i = i

        d.time = i*5 + 10
        d.percentHealth = d.h/d.maxHealth        
      })

      outPath.meta = p.meta

      outPath.name = p.meta.summonerName

      return outPath
    }
  })


  roles = d3.range(0, 5).map(roleI => {
    return games.map(game => {
      var p0 = game.players[roleI]
      var p1 = game.players[roleI + 5]

      if (_.last(p0).mk < _.last(p1).mk) [p0, p1] = [p1, p0]
      var rv = p0.map((d, i) => d.mk - p1[i].mk)

      rv.playerName = p0.name  + ' v. ' + p1.name
      rv.gameName = game.gameMeta.generatedName
        .split('|G1')[0].replace('|', ' v. ')

      return rv
    })
  })

  var names = 'Top Jungle Mid Bot Support'.split(' ')
  roles.forEach((d, i) => d.name = names[i])

  gameSel = d3.select('#graph').html('')
    .appendMany('div', roles.reverse())
    .st({height: 200, width: 300, display: 'inline-block'})
    .each(drawRole)
})


function drawRole(role){
  var sel = d3.select(this)
  sel.append('h4')
    .text(role.name)
    .st({fontSize: 14, textAlign: '', marginBottom: 10, marginTop: 20})

  var c = d3.conventions({
    sel,
    margin: {top: 0, left: 25, right: 0, bottom: 60}
  })

  var {x, y, svg} = c

  x.domain([0, 60*70])
  y.domain([0, 100])

  c.xAxis
    .tickFormat(d => d/60 + (d == 60*50 ? ' ' : ''))
    .tickValues(d3.range(0, 60*70, 60*10))

  c.yAxis.ticks(5)

  d3.drawAxis(c)

  var line = d3.line()
    .x((d, i) =>  c.x(i*5 + 10))
    .y(d => c.y(d))
    .curve(d3.curveStep)

  svg.appendMany('path.gold-curve', role)
    .at({
      d: line,
      fill: 'none',
      stroke: '#000',
      opacity: .3,
    })
    .call(d3.attachTooltip)
    .on('mouseover', d => {
      d3.select('.tooltip').text(d.playerName)

      d3.selectAll('.gold-curve')
        .st({opacity: e => e.gameName == d.gameName ? 1 : .3})
    })



}

