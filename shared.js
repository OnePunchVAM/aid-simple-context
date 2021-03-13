/*
 * Configuration
 */
const statsFormatterConfig = {
  order: ["Author's Note", "Scene", "Think", "Focus", "World Info"],
  alignVertical: true,
  truncateLabels: true
}


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
    // Don't run if disabled
    if (this.state.isDisabled) return

    // Set defaults
    options.order = options.order || []
    options.alignVertical = !!options.alignVertical
    options.truncateLabels = !!options.truncateLabels

    // Detect new stats and add them to state
    const existingKeys = this.state.displayStats.map(s => s.key)
    const newStats = state.displayStats.filter(s => s.key !== "" && !existingKeys.includes(s.key))
    if (newStats.length) this.state.displayStats = this.state.displayStats.concat(newStats)

    // Detect stats that are updated
    const newStatsKeys = newStats.map(s => s.key)
    const updateStats = state.displayStats.filter(s => s.key !== "" && !newStatsKeys.includes(s.key))
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
        key: "",
        value: stat.value + " :" + (options.alignVertical ? "\n" : "")
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
 * Paragraph Formatter Plugin
 */
class ParagraphFormatterPlugin {
  constructor() {
    if (!state.paragraphFormatterPlugin) state.paragraphFormatterPlugin = {
      isDisabled: false
    }
    this.state = state.paragraphFormatterPlugin
  }

  inputModifier(text) {
    // Don't run if disabled
    if (this.state.isDisabled) return
    let modifiedText = text

    // Replace starting newline
    modifiedText = modifiedText.replace(/^\n+([^\n])/g, "\n\n$1")

    return modifiedText
  }

  contextModifier(text) {
    // Don't run if disabled
    if (this.state.isDisabled) return
    let modifiedText = text

    // Find two or more consecutive newlines and reduce
    modifiedText = modifiedText.replace(/[\n]{2,}/g, "\n")

    return modifiedText
  }

  outputModifier(text) {
    // Don't run if disabled
    if (this.state.isDisabled) return
    let modifiedText = text

    // Remove ending newline(s)
    modifiedText = modifiedText.replace(/([^\n])\n+$/g, "$1")

    // Replace starting newline
    modifiedText = modifiedText.replace(/^\n+([^\n])/g, "\n\n$1")

    // Find single newlines and replace with double
    modifiedText = modifiedText.replace(/([^\n])\n([^\n])/g, "$1\n\n$2")

    // Find three or more consecutive newlines and reduce
    modifiedText = modifiedText.replace(/[\n]{3,}/g, "\n\n")

    return modifiedText
  }
}
const paragraphFormatterPlugin = new ParagraphFormatterPlugin()


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  SCENE_BREAK_STRING = "\n--"
  SECTION_SIZES = { focus: 150, think: 600, header: 1200 }

  STAT_STORY_TEMPLATE = { key: "Author's Note", color: "dimgrey" }
  STAT_SCENE_TEMPLATE = { key: "Scene", color: "lightsteelblue" }
  STAT_THINK_TEMPLATE = { key: "Think", color: "darkseagreen" }
  STAT_FOCUS_TEMPLATE = { key: "Focus", color: "indianred" }
  STAT_TRACK_TEMPLATE = { key: "World Info", color: "goldenrod" }

  controlList = ["enable", "disable", "show", "hide", "reset", "debug"] // Plugin Controls
  commandList = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Story
    "you", "at", "with", "time", "desc", // Scene
    "think", // Think
    "focus" // Focus
  ]

  commandMatch = /^> You say "\/(\w+)( .*)?"$|^> You \/(\w+)( .*)?[.]$|^\/(\w+)( .*)?$/
  vanillaKeyMatch = /[^,]+/g
  keyMatch = /.?\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)|[^,]+/g
  brokenEnclosureMatch = /(")([^\w])(")|(')([^\w])(')|(\[)([^\w])(])|(\()([^\w])(\))|({)([^\w])(})|(<)([^\w])(>)/g
  enclosureMatch = /([^\w])("[^"]+")([^\w])|([^\w])('[^']+')([^\w])|([^\w])(\[[^]]+])([^\w])|([^\w])(\([^)]+\))([^\w])|([^\w])({[^}]+})([^\w])|([^\w])(<[^<]+>)([^\w])/g
  sentenceMatch = /([^!?.]+[!?.]+[\s]+?)|([^!?.]+[!?.]+$)|([^!?.]+$)/g

  constructor() {
    this.commandList = this.controlList.concat(this.commandList)
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

  hasKey(text, key) {
    if (key instanceof RegExp) return text.match(key)
    return text.includes(key)
  }

  getPluginContext() {
    return [
      (this.state.context.story || ""), (this.state.context.scene || ""),
      (this.state.context.think || ""), (this.state.context.focus || "")
    ].join(" ")
  }

  getKeys(keys) {
    const matches = [...keys.matchAll(this.keyMatch)]
    if (!matches.length) return [keys]
    return matches.map(m => (m.length === 3 && m[1]) ? new RegExp(m[1], m[2]) : m[0].trim())
  }

  getEntry(entry, replaceYou=false) {
    if (replaceYou && this.state.data.you) entry = entry.replace(this.state.data.you, "you")
    entry = `\n{{${entry}#!#}}\n`
    return { entryText: entry, entrySize: (entry.length - 6)}
  }

  injectEntry(entry, originalSize, modifiedSize) {
    const invalid = { entryText: "", entrySize: 0 }
    if (!entry) return invalid
    const { entryText, entrySize } = this.getEntry(`[ ${entry}]`)
    if (!this.validEntrySize(originalSize, entrySize, modifiedSize)) return invalid
    return { entryText, entrySize }
  }

  replaceEnclosures(text) {
    // Add temporary space to each end of the string for matching start and end enclosures
    let modifiedText = ` ${text} `
    let modifiedSize = 0

    // Fix enclosures with less than 2 characters between them
    modifiedText = modifiedText.replace(this.brokenEnclosureMatch, (_, prefix, match, suffix) => {
      if (!prefix || !match || !suffix) return _
      modifiedSize += 1
      return `${prefix} ${match}${suffix}`
    })

    // Insert all enclosures found into an array and replace existing text with a reference to it's index
    const enclosures = []
    modifiedText = modifiedText.replace(this.enclosureMatch, (_, prefix, match, suffix) => {
      if (!prefix || !match || !suffix) return _
      enclosures.push(match)
      return `${prefix}{${enclosures.length - 1}}${suffix}`
    })

    // Remove temporary space at start and end
    modifiedText = modifiedText.slice(1, -1)
    return { modifiedText, modifiedSize, enclosures }
  }

  insertEnclosures(text, matches) {
    for (let idx = 0; idx < matches.length; idx++) text = text.replace(`{${idx}}`, matches[idx])
    return text
  }

  getSentences(text) {
    let { modifiedText, modifiedSize, enclosures } = this.replaceEnclosures(text)
    let sentences = modifiedText.match(this.sentenceMatch) || []
    return { sentences: sentences.map(s => this.insertEnclosures(s, enclosures)), modifiedSize }
  }

  groupBySize(sentences) {
    let totalSize = 0
    let firstEntry = true
    const groups = { focus: [], think: [], header: [], rest: [] }
    for (let sentence of sentences) {
      totalSize += sentence.length
      if (firstEntry || totalSize <= this.SECTION_SIZES.focus) groups.focus.push(sentence)
      else if (totalSize <= this.SECTION_SIZES.think) groups.think.push(sentence)
      else if (totalSize <= this.SECTION_SIZES.header) groups.header.push(sentence)
      else groups.rest.push(sentence)
      firstEntry = false
    }
    return groups
  }

  detectWorldInfo(originalText, pluginText) {
    const combinedText = originalText + " " + pluginText
    const trackedInfo = []
    const detectedInfo = []
    let autoInjectedSize = 0

    // Find all world info entries
    for (let info of worldInfo) {
      const keys = this.getKeys(info.keys)
      const vanillaKeys = keys.filter(k => !(k instanceof RegExp))
      let autoInjected = false

      // Search through vanilla keys for matches in original context
      // These entries are auto injected by AID and their total size needs to be tracked
      for (let key of vanillaKeys) {
        if (!originalText.includes(key)) continue
        autoInjected = true
        autoInjectedSize += info.entry.length
        trackedInfo.push(key)
        break
      }

      // If this entry was auto injected skip to next world info
      if (autoInjected) continue

      // Otherwise search through all keys for match, using regex where appropriate
      for (let key of keys) {
        // Regex matching
        if (key instanceof RegExp) {
          const match = combinedText.match(key)
          if (match && match.length) {
            detectedInfo.push(info)
            trackedInfo.push(match[0])
            break
          }
        }
        // Straight string matching
        else {
          if (pluginText.includes(key)) {
            detectedInfo.push(info)
            trackedInfo.push(key)
            break
          }
        }
      }
    }

    // Do a count of matched keys and add them to state context for display
    const trackedCounts = {}
    for (let match of trackedInfo) trackedCounts[match] = (trackedCounts[match] || 0) + 1
    this.state.context.track = Object.entries(trackedCounts).map(e => `${e[0]}` + (e[1] > 1 ? ` [x${e[1]}]` : "")).join(", ")
    detectedInfo.reverse()

    return { detectedInfo, autoInjectedSize }
  }

  displayStat(template, value) {
    if (!value) return
    const stat = state.displayStats.find(s => s.key === template.key)
    if (stat) stat.value = value
    else state.displayStats.push(Object.assign({ value }, template))
  }

  updateHUD() {
    if (this.isVisible()) {
      this.displayStat(this.STAT_STORY_TEMPLATE, this.state.context.story)
      this.displayStat(this.STAT_SCENE_TEMPLATE, this.state.context.scene)
      this.displayStat(this.STAT_THINK_TEMPLATE, this.state.context.think)
      this.displayStat(this.STAT_FOCUS_TEMPLATE, this.state.context.focus)
      this.displayStat(this.STAT_TRACK_TEMPLATE, this.state.context.track)
    } else {
      state.displayStats = []
    }

    // Handle external plugin integration
    state.statsFormatterPlugin.isDisabled = !this.isVisible()
  }

  /*
   * Returns: false, if new context entry exceeds 85% limit.
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

    // Cleanup for commands
    if (["\n", "\n\n"].includes(modifiedText)) modifiedText = ""

    return modifiedText
  }

  inputHandler(text) {
    // Check if a command was inputted
    let match = this.commandMatch.exec(text)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Check if the command was valid
    const cmd = match[1].toLowerCase()
    const params = match.length > 2 && match[2] ? match[2].trim() : undefined
    if (!this.commandList.includes(cmd)) return text

    // Detect for Controls, handle state and perform actions (ie, hide HUD)
    if (this.controlList.includes(cmd)) {
      if (cmd === "debug") {
        this.state.isDebug = !this.state.isDebug
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
      if (params) this.state.data[cmd] = params
      else delete this.state.data[cmd]
    }

    // Story - Author's Notes, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
    const story = []
    delete this.state.context.story
    if (this.state.data.note) story.push(`Author's note: ${this.appendPeriod(this.state.data.note)}`)
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

    this.updateHUD()
    return ""
  }

  /*
   * Context Injector
   * - Takes existing set state and dynamically injects it into the context
   * - Is responsible for injecting custom World Info entries, including regex matching of keys where applicable
   * - Keeps track of the amount of modified context and ensures it does not exceed the 85% rule
   *   while injecting as much as possible
   */
  contextModifier(text) {
    if (this.state.isDisabled) return text;

    // Split context and memory
    const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ""
    const context = info.memoryLength ? text.slice(info.memoryLength) : text
    const originalSize = context.length

    // Parse combined context for world info keys, and setup world info stat in HUD
    // Also return the size of all entries automatically injected by AID
    const pluginContext = this.getPluginContext()
    const { detectedInfo, autoInjectedSize } = this.detectWorldInfo(context, pluginContext)

    // Break context into sentences and reverse for easier traversal
    let { sentences, modifiedSize } = this.getSentences(context)
    sentences.reverse()

    // Group sentences by character length
    const sentenceGroups = this.groupBySize(sentences)

    // Inject focus group
    let finalSentences = [...sentenceGroups.focus]
    let entry = this.injectEntry(this.state.context.focus, originalSize, modifiedSize)
    if (entry) {
      finalSentences.push(entry.entryText)
      modifiedSize += entry.entrySize
    }

    // Insert think group
    finalSentences = [...finalSentences, ...sentenceGroups.think]
    entry = this.injectEntry(this.state.context.think, originalSize, modifiedSize)
    if (entry) {
      finalSentences.push(entry.entryText)
      modifiedSize += entry.entrySize
    }

    // Insert header group
    finalSentences = [...finalSentences, ...sentenceGroups.header]
    entry = this.injectEntry(this.state.context.scene, originalSize, modifiedSize)
    if (entry) {
      finalSentences.push(entry.entryText)
      modifiedSize += entry.entrySize
    }
    entry = this.injectEntry(this.state.context.story, originalSize, modifiedSize)
    if (entry) {
      finalSentences.push(entry.entryText)
      modifiedSize += entry.entrySize
    }

    // Insert remaining lines
    finalSentences = [...finalSentences, ...sentenceGroups.rest]

    // Remember to reverse the array again to get the correct order
    finalSentences.reverse()

    // Insert World Info
    if (detectedInfo.length) {
      const injectedKeys = []
      const parseSentences = [...finalSentences]
      finalSentences = []
      for (let sentence of parseSentences) {
        for (let info of detectedInfo) {
          if (injectedKeys.includes(info.keys)) continue
          for (let key of this.getKeys(info.keys)) {
            const { entryText, entrySize } = this.getEntry(info.entry, true)
            if (this.hasKey(sentence, key) && this.validEntrySize(originalSize, entrySize, modifiedSize)) {
              finalSentences.push(entryText)
              injectedKeys.push(info.keys)
              modifiedSize += entrySize
              break
            }
          }
        }
        finalSentences.push(sentence)
      }
    }

    // Dynamically change position of header based on suspected normal world info injections
    // Detect "--" and reposition plugin context just above

    // Create new context and fix newlines for injected entries
    const entireContext = finalSentences.join("")
      .replace(/}}\n\n{{|\n\n{{|}}\n\n|\n{{|}}\n/g, "\n")
      .replace(/^\n/g, "")

    // Keep within maxChars and remove last entry if it is a custom entry
    let lines = entireContext.slice(-(info.maxChars - info.memoryLength)).split("\n")
    if (lines.length && lines[0].endsWith("#!#")) lines.shift()
    lines = lines.map(l => l.replace(/#!#$/, ""))
    const finalContext = lines.join("\n")

    // Debug output
    if (this.state.isDebug) {
      console.log({
        detectedInfo,
        originalContext: context.split("\n"),
        sentences,
        finalSentences,
        entireContext: entireContext.split("\n"),
        finalContext: finalContext.split("\n")
      })
      if (this.isVisible()) {
        let debugLines = finalContext.split("\n")
        debugLines.reverse()
        debugLines = debugLines.map((l, i) => "(" + (i < 9 ? "0" : "") + `${i + 1}) ${l}`)
        debugLines.reverse()
        state.message = debugLines.join("\n")
      }
    }

    // Display HUD
    this.updateHUD()

    return [contextMemory, finalContext].join("")
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
