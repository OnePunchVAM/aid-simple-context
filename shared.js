/*
 * Configuration
 */
const statsFormatterConfig = {
  order: ["Author's Note", "Scene", "Think", "Focus", "World Info"],
  alignVertical: true,
  truncateLabels: true,
  truncateSep: ""
}


/*
 * WorldInfo Tracking Plugin
 */
class TrackingPlugin {
  STAT_TEMPLATE = { key: "World Info", color: "goldenrod" }

  constructor() {
    if (!state.trackingPlugin) state.trackingPlugin = {
      isDisabled: false,
      isDebug: false
    }
    this.state = state.trackingPlugin
  }

  execute(text) {
    // Don't run if disabled
    if (this.state.isDisabled) return

    // Gather context
    const frontLines = (state.memory.frontMemory || "").split("\n")
    const context = info.memoryLength ? text.slice(info.memoryLength) : text
    const allowedContext = context.slice(-(info.maxChars - info.memoryLength))
    const lines = allowedContext.split("\n").concat(frontLines)
    lines.reverse()

    // Go through each world info entry and check to see
    // if it can be found within the context provided
    const trackedKeys = []
    for (let idx = 0; idx < lines.length; idx++) {
      const match = worldInfo.find(i => i.entry === lines[idx])
      if (!match) continue
      // Detect EWIJSON and display full key if found
      const matchKey = match.keys.includes("#") ? match.keys : match.keys.split(",")[0].trim()
      trackedKeys.push(this.state.isDebug ? `${matchKey} (${idx})` : matchKey)
    }

    this.displayStat(trackedKeys.join(", "))
  }

  displayStat(value) {
    const stat = state.displayStats.find(s => s.key === this.STAT_TEMPLATE.key)

    // If the value is valid, create/update stat
    if (value !== undefined && value !== "") {
      if (stat) stat.value = value
      else state.displayStats.push(Object.assign({ value }, this.STAT_TEMPLATE))
    }
    // Otherwise remove stat from list
    else if (stat) {
      state.displayStats = state.displayStats.filter(s => s.key !== this.STAT_TEMPLATE.key)
    }
  }
}
const trackingPlugin = new TrackingPlugin()


/*
 * Stats Formatter Plugin
 */
class StatsFormatterPlugin {
  constructor() {
    if (!state.displayStats) state.displayStats = []
    if (!state.statsFormatterPlugin) state.statsFormatterPlugin = {
      isDisabled: false,
      displayStats: []
    }
    this.state = state.statsFormatterPlugin
  }

  execute(options = {}) {
    // Set defaults
    options.order = options.order || []
    options.alignVertical = !!options.alignVertical
    options.truncateLabels = !!options.truncateLabels
    options.truncateSep = options.truncateSep || ""

    // Don't run if disabled
    if (this.state.isDisabled) return

    // Detect new stats and add them to state
    const existingKeys = this.state.displayStats.map(s => s.key)
    const newStats = state.displayStats.filter(s => s.key !== options.truncateSep && !existingKeys.includes(s.key))
    if (newStats.length) this.state.displayStats = this.state.displayStats.concat(newStats)

    // Detect stats that are updated
    const newStatsKeys = newStats.map(s => s.key)
    const updateStats = state.displayStats.filter(s => s.key !== options.truncateSep && !newStatsKeys.includes(s.key))
    if (updateStats.length) this.state.displayStats.map(stat => {
      for (let updateStat of updateStats) {
        if (updateStat.key === stat.key) {
          stat.value = updateStat.value
          return stat
        }
      }
      return stat
    })

    // Remove stats with undefined value
    this.state.displayStats = this.state.displayStats.filter(s => s.value !== undefined)

    // Do ordering
    const orderedStats = []
    for (let statName of options.order) {
      const stat = this.state.displayStats.find(s => s.key.toLowerCase() === statName.toLowerCase())
      if (stat) orderedStats.push(stat)
    }
    const orderedKeys = orderedStats.map(s => s.key)
    this.state.displayStats = orderedStats.concat(this.state.displayStats.filter(s => !orderedKeys.includes(s.key)))

    // Do formatting
    if (options.truncateLabels) {
      state.displayStats = this.state.displayStats.map(stat => Object.assign({}, stat, {
        key: options.truncateSep,
        value: stat.value + " :" + options.truncateSep + (options.alignVertical ? "\n" : "")
      }))
    } else {
      let allStatsButLast = this.state.displayStats.slice(0, -1)
      let suffix = options.alignVertical ? "\n" : " "
      allStatsButLast = allStatsButLast.map(s => Object.assign({}, s, {value: s.value + suffix}))
      state.displayStats = allStatsButLast.concat(this.state.displayStats.slice(-1))
    }
  }
}
const statsFormatterPlugin = new StatsFormatterPlugin()


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  STAT_STORY_TEMPLATE = { key: "Author's Note", color: "dimgrey" }
  STAT_SCENE_TEMPLATE = { key: "Scene", color: "lightsteelblue" }
  STAT_THINK_TEMPLATE = { key: "Think", color: "darkseagreen" }
  STAT_FOCUS_TEMPLATE = { key: "Focus", color: "indianred" }

  controlList = ["enable", "disable", "show", "hide", "reset", "debug"] // Plugin Controls
  commandList = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Story
    "you", "at", "with", "time", "desc", // Scene
    "think", // Think
    "focus" // Focus
  ]

  commandMatch = /^> You say "\/(\w+)( .*)?"$|^> You \/(\w+)( .*)?[.]$|^\/(\w+)( .*)?$/
  enclosureMatch = /([^\w]"[^"]+"[^\w])|([^\w]'[^']+'[^\w])|([^\w]\[[^]]+][^\w])|([^\w]\([^)]+\)[^\w])|([^\w]{[^}]+}[^\w])|([^\w]<[^>]+>[^\w])/g
  sentenceMatch = /([^!?.]+[!?.]+)|([^!?.]+$)/g

  constructor() {
    this.commandList = this.controlList.concat(this.commandList)
    // Setup plugin state/scope
    if (!state.simpleContextPlugin) state.simpleContextPlugin = {
      isDebug: false,
      isHidden: false,
      isDisabled: false,
      shuffleContext: false,
      data: {},
      context: {}
    }
    this.state = state.simpleContextPlugin
    if (!state.displayStats) state.displayStats = []
  }

  /*
   * Helper Functions
   */
  isVisible() {
    return !this.state.isDisabled && !this.state.isHidden
  }

  appendPeriod(content) {
    return !content.endsWith(".") ? content + "." : content
  }

  removePeriod(content) {
    return content.endsWith(".") ? content.slice(0, -1) : content
  }

  toTitleCase(content) {
    return content.charAt(0).toUpperCase() + content.slice(1)
  }

  displayStat(template, value) {
    const stat = state.displayStats.find(s => s.key === template.key)
    if (stat) stat.value = value
    else state.displayStats.push(Object.assign({ value }, template))
  }

  updateHUD() {
    if (this.isVisible()) {
      state.trackingPlugin.isDisabled = false
      state.statsFormatterPlugin.isDisabled = false
      this.displayStat(this.STAT_STORY_TEMPLATE, this.state.context.story)
      this.displayStat(this.STAT_SCENE_TEMPLATE, this.state.context.scene)
      this.displayStat(this.STAT_THINK_TEMPLATE, this.state.context.think)
      this.displayStat(this.STAT_FOCUS_TEMPLATE, this.state.context.focus)
    } else {
      state.trackingPlugin.isDisabled = true
      state.statsFormatterPlugin.isDisabled = true
      state.displayStats = []
    }
  }

  replaceEnclosures(text) {
    const enclosures = []
    const modifiedText = text.replace(this.enclosureMatch, (_, match) => {
      if (!match) return _
      enclosures.push(match)
      return `{{${enclosures.length - 1}}}`
    })
    return { modifiedText, enclosures }
  }

  insertEnclosures(text, matches) {
    for (let idx = 0; idx < matches.length; idx++) text = text.replace(`{{${idx}}}`, matches[idx])
    return text
  }

  getSentences(text) {
    let { modifiedText, enclosures } = this.replaceEnclosures(text)
    let sentences = modifiedText.match(this.sentenceMatch) || []
    return sentences.map(s => this.insertEnclosures(s, enclosures))
  }

  /*
   * Returns: false, if new modified context exceeds 85% limit.
   * Where:
   *   originalSize is the length of the original, unmodified text.
   *   entrySize is the length of the world entry being inserted.
   *   totalSize is the total modified size so far.
   */
  validEntrySize(originalSize, entrySize, totalSize) {
    if (originalSize === 0) return false
    const modifiedPercent = (totalSize + entrySize) / originalSize
    return modifiedPercent < 0.85
  }

  /*
   * Input Handler
   * - Takes new command and refreshes context and HUD (if visible and enabled)
   * - Updates when valid command is entered into the prompt (ie, `/name John Smith`)
   * - Can clear state by executing the command without any arguments (ie, `/name`)
   */
  inputModifier(text) {
    // Check if no input (ie, prompt AI)
    if (!text) {
      this.state.shuffleContext = true
      return text
    }

    // Detection for multi-line commands, filter out double ups of newlines
    let modifiedText = text.split("\n").map(l => this.inputHandler(l)).join("\n")
      .replace(/[\n]{2,}/g, "\n")

    // Cleanup for multi commands
    if (modifiedText === "\n") modifiedText = ""

    return modifiedText
  }

  inputHandler(text) {
    // Check if a command was inputted
    let match = this.commandMatch.exec(text)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Check if the command was valid
    const cmd = match[1].toLowerCase()
    const value = match.length > 2 && match[2] ? match[2].trim() : undefined
    if (!this.commandList.includes(cmd)) return text

    // Detect for Controls, handle state and perform actions (ie, hide HUD)
    if (this.controlList.includes(cmd)) {
      if (cmd === "debug") {
        this.state.isDebug = !this.state.isDebug
        state.trackingPlugin.isDebug = this.state.isDebug
        if (!this.state.isDebug) state.message = ""
        else if (this.isVisible()) state.message = "Enter something into the prompt to start debugging the context.."
      }
      else if (cmd === "enable" || cmd === "disable") this.state.isDisabled = (cmd === "disable")
      else if (cmd === "show" || cmd === "hide") this.state.isHidden = (cmd === "hide")
      else if (cmd === "reset") {
        this.state.context = {}
        this.state.data = {}
      }
      this.updateHUD()
      return
    } else {
      // If value passed assign it to the data store, otherwise delete it (ie, `/name`)
      if (value) this.state.data[cmd] = value
      else delete this.state.data[cmd]
    }

    // Story - Author's Notes, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
    const story = []
    delete this.state.context.story
    if (this.state.data.note) story.push(this.appendPeriod(this.state.data.note))
    if (this.state.data.title) story.push(`Title: ${this.appendPeriod(this.state.data.title)}`)
    if (this.state.data.author) story.push(`Author: ${this.appendPeriod(this.state.data.author)}`)
    if (this.state.data.genre) story.push(`Genre: ${this.appendPeriod(this.state.data.genre)}`)
    if (this.state.data.setting) story.push(`Setting: ${this.appendPeriod(this.state.data.setting)}`)
    if (this.state.data.theme) story.push(`Theme: ${this.appendPeriod(this.state.data.theme)}`)
    if (this.state.data.subject) story.push(`Subject: ${this.appendPeriod(this.state.data.subject)}`)
    if (this.state.data.style) story.push(`Writing Style: ${this.appendPeriod(this.state.data.style)}`)
    if (this.state.data.rating) story.push(`Rating: ${this.appendPeriod(this.state.data.rating)}`)
    if (story.length) this.state.context.story = story.join(" ")

    // Scene - Name, location, present company, time and scene description
    const scene = []
    delete this.state.context.scene
    if (this.state.data.you) scene.push(`You are ${this.appendPeriod(this.state.data.you)}`)
    if (this.state.data.at && this.state.data.with) scene.push(`You are at ${this.removePeriod(this.state.data.at)} with ${this.appendPeriod(this.state.data.with)}`)
    else if (this.state.data.at) scene.push(`You are at ${this.appendPeriod(this.state.data.at)}`)
    else if (this.state.data.with) scene.push(`You are with ${this.appendPeriod(this.state.data.with)}`)
    if (this.state.data.time) scene.push(`It is ${this.appendPeriod(this.state.data.time)}`)
    if (this.state.data.desc) scene.push(this.toTitleCase(this.appendPeriod(this.state.data.desc)))
    if (scene.length) this.state.context.scene = scene.join(" ")

    // Think - This input is placed six positions back in context
    delete this.state.context.think
    if (this.state.data.think) this.state.context.think = this.toTitleCase(this.appendPeriod(this.state.data.think))

    // Focus - This input is pushed to the front of context
    delete this.state.context.focus
    if (this.state.data.focus) this.state.context.focus = this.toTitleCase(this.appendPeriod(this.state.data.focus))

    // Display HUD
    this.updateHUD()

    return ""
  }

  /*
   * Context Injector
   * - Takes existing set state and dynamically injects it into the context
   * - Is responsible for injecting custom World Info entries and tracking them in the HUD
   * - Keeps track of the amount of modified context and ensures it does not exceed the 85% rule
   *   while injecting as much as possible
   */
  contextModifier(text) {
    if (this.state.isDisabled) return text;

    const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ""
    const context = info.memoryLength ? text.slice(info.memoryLength) : text

    // Setup character limits for each group
    const originalSize = context.length
    const limit = { focus: 100, think: 500, header: 1200 }
    const sentenceGroups = { focus: [], think: [], header: [], rest: []}

    // Break context into sentences
    let sentences = this.getSentences(context)
    sentences.reverse()

    // Group sentences by character length
    let totalSize = 0
    let firstEntry = true
    for (let sentence of sentences) {
      totalSize += sentence.length
      if (firstEntry || totalSize <= limit.focus) sentenceGroups.focus.push(sentence)
      else if (totalSize <= limit.think) sentenceGroups.think.push(sentence)
      else if (totalSize <= limit.header) sentenceGroups.header.push(sentence)
      else sentenceGroups.rest.push(sentence)
      firstEntry = false
    }

    // Account for characters that will be removed later
    const lengthMod = 6

    // Inject pre focus sentences
    totalSize = 0
    sentences = [...sentenceGroups.focus]
    // Insert focus
    if (this.state.context.focus) {
      const entry = `\n{{[ ${this.state.context.focus}]}}\n`
      const entryLength = (entry.length - lengthMod)
      if (this.validEntrySize(originalSize, entryLength, totalSize)) {
        sentences.push(entry)
        totalSize += entryLength
      }
    }

    // Inject pre think sentences
    sentences = [...sentences, ...sentenceGroups.think]
    // Insert think
    if (this.state.context.think) {
      const entry = `\n{{[ ${this.state.context.think}]}}\n`
      const entryLength = (entry.length - lengthMod)
      if (this.validEntrySize(originalSize, entryLength, totalSize)) {
        sentences.push(entry)
        totalSize += entryLength // Account for characters that will be removed later
      }
    }

    // Inject pre header sentences
    sentences = [...sentences, ...sentenceGroups.header]
    // Insert header - character and scene
    if (this.state.context.scene) {
      const entry = `\n{{[ ${this.state.context.scene}]}}\n`
      const entryLength = (entry.length - lengthMod)
      if (this.validEntrySize(originalSize, entryLength, totalSize)) {
        sentences.push(entry)
        totalSize += entryLength
      }
    }
    // Insert header - author's note
    if (this.state.context.story) {
      const entry = `\n{{[Author's note: ${this.state.context.story}]}}\n`
      const entryLength = (entry.length - lengthMod)
      if (this.validEntrySize(originalSize, entryLength, totalSize)) {
        sentences.push(entry)
        totalSize += entryLength
      }
    }

    // Inject the remaining sentences
    sentences = [...sentences, ...sentenceGroups.rest]

    // Only grab World Info that is detected in combinedContext
    const combinedContext = sentences.join("")
    const detectedInfo = worldInfo.filter(info => {
      for (let key of info.keys.split(",").map(key => key.trim())) if (combinedContext.includes(key)) return true
      return false
    })

    // Remember to reverse the array again to get the correct order
    sentences.reverse()

    // Insert World Info
    if (detectedInfo.length) {
      const injectedKeys = []
      const parseSentences = [...sentences]
      sentences = []
      for (let sentence of parseSentences) {
        for (let info of detectedInfo) {
          if (injectedKeys.includes(info.keys)) continue
          const keys = info.keys.split(",").map(key => key.trim())
          for (let key of keys) {
            const entry = `\n{{${info.entry}}}\n`
            const entryLength = (entry.length - lengthMod)
            if (sentence.match(new RegExp(`[^\w]${key}[^\w]`)) && this.validEntrySize(originalSize, entryLength, totalSize)) {
              sentences.push(entry)
              injectedKeys.push(info.keys)
              totalSize += entryLength
              break
            }
          }
        }
        sentences.push(sentence)
      }
    }

    // Create new context and fix newlines for injected entries
    let modifiedContext = sentences.join("")
      .replace(/}}\n\n{{|\n\n{{|}}\n\n|\n{{|}}\n/g, "\n")
      .replace(/^\n/g, "")

    // Keep within maxChars
    modifiedContext = modifiedContext.slice(-(info.maxChars - info.memoryLength))

    console.log({sentences, lines: modifiedContext.split("\n")})

    // Debug output
    if (this.state.isDebug && this.isVisible()) {
      let debugLines = modifiedContext.split("\n")
      debugLines.reverse()
      debugLines = debugLines.map((l, i) => `(${i + 1}) ${l.slice(0, 25)}..`)
      debugLines.reverse()
      state.message = debugLines.join("\n")
    }

    return [contextMemory, modifiedContext].join("")
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
