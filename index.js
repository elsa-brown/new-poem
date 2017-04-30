/* POEM ~ Interactive Music Box */

const Tone = require('tone')
const ScrollMagic = require('scrollmagic')


/* poem text */
const poemText = `I like to think\n
(and the sooner the better!)\n
of a cybernetic meadow\n
where mammals and computers\n
live together in mutually\n
programming harmony\n
like pure water\n
touching clear sky.\n
~\n
I like to think\n
(right now, please!)\n
of a cybernetic forest\n
filled with pines and electronics\n
where deer stroll peacefully\n
past computers\n
as if they were flowers\n
with spinning blossoms.\n
~\n
I like to think\n
(it has to be!)\n
of a cybernetic ecology\n
where we are free of our labors\n
and joined back to nature,\n
returned to our mammal\n
brothers and sisters,\n
and all watched over\n
by machines of loving grace.\n`

/* string manipulation: converting poem to frequency values */

const poemLines = poemText.split(/\r?\n/).filter((elem) => elem !== '') 

console.log('textLines is', poemLines)

// calculate median frequency for each line of poem and store as array
let frequencies = []
for (var i = 0; i < poemLines.length; i++) {
  let line = poemLines[i]
  if (line === '~') continue

  let lineArray = line.split('')
    .map((letter, idx) => line.charCodeAt(idx))
      .map((int) => int)

  let subValue = 0
  let value = 0
  lineArray.forEach((int) => {
    subValue += int
    value += Math.floor(subValue / lineArray.length)
  })
  frequencies.push(value)
}

console.log('frequencies', frequencies)

/* string manipulation complete! */


/* make layout */

// create A + B 'segment' divs for Scroll Magic scenes
// 'A' segments for text, 'B' segments for sound
const layout = () => {
  let height = -3
  while (height < poemLines.length + 3) {
    let divPair = []
    let textDiv = document.createElement('h3')
      textDiv.style.border = 'solid white'
      textDiv.style.height = '50px'
      textDiv.id = `A-${height}`
      textDiv.className = 'textDiv'
    if (height >= 0 && height < poemLines.length) {
      textDiv.innerHTML = poemLines[height]
    }
    let breakDiv = document.createElement('div')
      breakDiv.style.border = 'solid yellow'
      breakDiv.style.height = '10px'
      breakDiv.id = `B-${height}`
      breakDiv.className = 'className'

    divPair.push(textDiv, breakDiv)
    let docFrag = document.createDocumentFragment();
    divPair.forEach((div, idx) => docFrag.appendChild(divPair[idx]))

    document.getElementById('segments')
      .appendChild(docFrag)

    height++
  }
  console.log('layout complete', (height))
}

layout()

/* layout completed! */


/* text fade functions */


/* SCROLL MAGIC */

// create controller object
let controller = new ScrollMagic.Controller()

// store ids from every segment div
let segmentIds = Array.from(document.getElementById('segments').children).map((child) => {return child.id})

/* create Scroll Magic scenes */

const direction = (evt) => 
  evt.target.controller().info('scrollDirection')

const createScrollScenes = () => {

  let idx = 0
  segmentIds.forEach((id) => {
    console.log('idx is', idx)
    if (id[0] === 'A') {
      new ScrollMagic.Scene({
        triggerElement: `#${id}`,
        duration: 50
      })
      .addTo(controller)
      .on('enter', (e) => {
        //console.log('segment id is', id)
        let dir = direction(e)
        dir === 'FORWARD' ? idx++ : idx--
        // create envelope for tone instrument
        const env = new Tone.AmplitudeEnvelope({
          attack: 0.1,
          decay: 0.05,
          sustain: 0.01,
          release: 0.002
        }).toMaster();
        //create an oscillator and connect it to the envelope
        let osc = new Tone.Oscillator({
          partials: [],
          type: 'sine',
          frequency: frequencies[idx],
          volume: -8,
        }).connect(env).start();
        console.log('frequency is', frequencies[idx])
        //console.log('direction is', dir)
        env.triggerAttack()
        //idx++
      })
    } else if (id[0] === 'B') {
        new ScrollMagic.Scene({
          triggerElement: `#${id}`,
          duration: 10
      })
      .addTo(controller)
      .on('enter', () => {
        env.triggerRelease()
      })
    }
  })
}

createScrollScenes()

/* Scroll Magic scenes created */

/* SCROLL MAGIC complete! */
