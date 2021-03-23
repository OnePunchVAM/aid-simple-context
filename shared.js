/*
 * Configuration
 */
const statsFormatterConfig = {
  order: [
    "Author's Note", "Scene", "Think", "Focus", "World Info", // Default UI
    "Name", "Keys", "Entry", "Hidden" // Entry UI
  ],
  colors: {
    "Author's Note": "dimgrey",
    "Scene": "steelblue",
    "Think": "seagreen",
    "Focus": "indianred",
    "World Info": "darkgoldenrod",
    "Name": "indianred",
    "Keys": "seagreen",
    "Entry": "steelblue",
    "Hidden": "darkgoldenrod"
  },
  alignVertical: true,
  truncateLabels: false
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

  clear() {
    this.state.displayStats = []
    state.displayStats = []
  }

  execute(options = {}) {
    // Don't run if disabled
    if (this.state.isDisabled) return

    // Set defaults
    options.order = options.order || []
    options.colors = options.colors || {}
    options.alignVertical = !!options.alignVertical
    options.truncateLabels = !!options.truncateLabels

    // Detect new stats and add them to state
    const existingKeys = this.state.displayStats.map(s => s.key)
    const newStats = state.displayStats.filter(s => s.key !== "" && !existingKeys.includes(s.key))
    if (newStats.length) this.state.displayStats = this.state.displayStats.concat(newStats)

    // Detect stats that are updated
    const newStatsKeys = newStats.map(s => s.key)
    const updateStats = state.displayStats.filter(s => s.key !== "" && !newStatsKeys.includes(s.key))
    if (updateStats.length) this.state.displayStats = this.state.displayStats.map(stat => {
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
    const displayStats = this.state.displayStats.map(stat => {
      const formattedStat = {
        key: options.truncateLabels ? "" : stat.key,
        value: "" + stat.value + (options.truncateLabels ? " :" : "") + (options.alignVertical ? "\n" : " ")
      }

      // Do color override
      const colorOverride = options.colors[stat.key]
      if (colorOverride) formattedStat.color = colorOverride

      // Return newly created object
      return Object.assign({}, stat, formattedStat)
    })

    // Remove newline from last line if vertical alignment
    if (options.alignVertical && displayStats.length) {
      displayStats[displayStats.length - 1].value = displayStats[displayStats.length - 1].value.slice(0, -1)
    }

    // Apply changes
    state.displayStats = displayStats
  }
}
const statsFormatterPlugin = new StatsFormatterPlugin()


/*
 * Paragraph Formatter Plugin
 */
class ParagraphFormatterPlugin {
  constructor() {
    if (!state.paragraphFormatterPlugin) state.paragraphFormatterPlugin = {
      isDisabled: false,
      isSceneBreak: false
    }
    this.state = state.paragraphFormatterPlugin
  }

  inputModifier(text) {
    return this.displayModifier(text)
  }

  outputModifier(text) {
    return this.displayModifier(text)
  }

  displayModifier(text) {
    // Don't run if disabled
    if (this.state.isDisabled || !text) return text
    let modifiedText = text

    // Remove ending newline(s)
    modifiedText = modifiedText.replace(/([^\n])\n+$/g, "$1")

    // Replace starting newline
    modifiedText = modifiedText.replace(/^\n+([^\n])/g, "\n\n$1")

    // Find single newlines and replace with double
    modifiedText = modifiedText.replace(/([^\n])\n([^\n])/g, "$1\n\n$2")

    // Find three or more consecutive newlines and reduce
    modifiedText = modifiedText.replace(/[\n]{3,}/g, "\n\n")

    // Detect scene break at end for next input
    if (modifiedText.endsWith("--")) this.state.isSceneBreak = true
    // If scene break and next input, add newlines
    else if (this.state.isSceneBreak) {
      if (!modifiedText.startsWith("\n\n")) modifiedText = "\n\n" + modifiedText
      this.state.isSceneBreak = false
    }
    // Add whitespace to end if not there
    else modifiedText = modifiedText.replace(/(?<=[!?.])$/g, " ")

    return modifiedText
  }
}
const paragraphFormatterPlugin = new ParagraphFormatterPlugin()


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  // Can change these
  ENTRY_CANCEL = "!"
  ENTRY_SKIP = "@"
  ENTRY_INDEX_KEYS = "_index"
  SECTION_SIZES = { focus: 150, think: 600, scene: 1000 }

  // Don't change these
  controlList = ["enable", "disable", "show", "hide", "reset", "debug"] // Plugin Controls
  commandList = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Story
    "you", "at", "with", "desc", // Scene
    "think", // Think
    "focus" // Focus
  ]
  commandMatch = /^> You say "\/(\w+)\s?(.*)?"$|^> You \/(\w+)\s?(.*)?[.]$|^\/(\w+)\s?(.*)?$/
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
      context: {},
      entry: {}
    }
    this.state = state.simpleContextPlugin
    if (!state.displayStats) state.displayStats = []
  }

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
    if (key instanceof RegExp) {
      const match = text.match(key)
      const result = match && match.length && match[0]
      if (result) console.log('ere', match)
      return result
    }
    return text.toLowerCase().includes(key.toLowerCase()) && key
  }

  getPluginContext() {
    return [
      (this.state.context.story || ""), (this.state.context.scene || ""),
      (this.state.context.think || ""), (this.state.context.focus || "")
    ].join(" ")
  }

  getKeys(keys) {
    const matches = [...keys.matchAll(this.keyMatch)]
    try {
      return matches.map(m => {
        if (!m[1] && m[0].startsWith("/")) throw "Invalid regex found!"
        return m[1] ? new RegExp(m[1], m[2]) : m[0].trim()
      })
    } catch (e) {
      return []
    }
  }

  getEntry(entry, originalSize, modifiedSize, encapsulate=false, replaceYou=true) {
    if (!entry) return

    // Encapsulation of entry in brackets
    if (encapsulate) entry = `<< ${entry}>>>>`

    // Replace your name in with "you"
    if (replaceYou && this.state.data.you) entry = entry.replace(this.state.data.you, "you")

    // Final forms
    const text = `\n{|${entry}|}\n`
    const size = (entry.length + 4)

    // Validate entry for context overflow
    if (this.validEntrySize(originalSize, size, modifiedSize)) return { text, size }
  }

  cleanEntries(entries) {
    entries = ` ${entries.join("[@]")} `
    entries = entries.replace(/([^\n])(\[@]\n{\|)/g, "$1\n$2")
    entries = entries.replace(/(\|}\n\[@])([^\n])/g, "$1\n$2")
    entries = entries.replace(/\n{\||\|}\n/g, "\n")
    entries = entries.slice(1, -1)
    return entries.split("[@]")
  }

  replaceEnclosures(text) {
    // Add temporary space to each end of the string for matching start and end enclosures
    let modifiedText = ` ${text} `

    // Fix enclosures with less than 2 characters between them
    modifiedText = modifiedText.replace(this.brokenEnclosureMatch, "$1$2@$3")

    // Insert all enclosures found into an array and replace existing text with a reference to it's index
    let enclosures = []
    modifiedText = modifiedText.replace(this.enclosureMatch, (_, prefix, match, suffix) => {
      if (!prefix || !match || !suffix) return _
      enclosures.push(match)
      return `${prefix === "@" ? "" : prefix}{${enclosures.length - 1}}${suffix}`
    })

    // Remove temporary space at start and end
    modifiedText = modifiedText.slice(1, -1)
    return { modifiedText, enclosures }
  }

  insertEnclosures(text, matches) {
    for (let idx = 0; idx < matches.length; idx++) text = text.replace(`{${idx}}`, matches[idx])
    return text
  }

  getSentences(text) {
    let { modifiedText, enclosures } = this.replaceEnclosures(text)
    let sentences = modifiedText.match(this.sentenceMatch) || []
    return sentences.map(s => this.insertEnclosures(s, enclosures))
  }

  groupBySize(sentences) {
    const groups = { focus: [], think: [], scene: [], filler: [], history: [] }
    let totalSize = 0
    let firstEntry = true
    let sceneBreak = false

    // Group sentences by character length boundaries
    for (let sentence of sentences) {
      totalSize += sentence.length
      if (firstEntry || (!sceneBreak && totalSize <= this.SECTION_SIZES.focus)) groups.focus.push(sentence)
      else if (!sceneBreak && totalSize <= this.SECTION_SIZES.think) groups.think.push(sentence)
      else if (!sceneBreak && totalSize <= this.SECTION_SIZES.scene) groups.scene.push(sentence)
      else if (!sceneBreak) groups.filler.push(sentence)
      else groups.history.push(sentence)
      firstEntry = false

      // Check for scene break
      if (sentence.includes("\n--")) sceneBreak = true
    }
    return groups
  }

  validEntrySize(originalSize, entrySize, totalSize) {
    if (originalSize === 0) return false
    const modifiedPercent = (totalSize + entrySize) / originalSize
    return modifiedPercent < 0.85
  }

  detectWorldInfo(originalText, pluginText) {
    const combinedText = originalText + "\n" + pluginText
    const originalLowered = originalText.toLowerCase()
    const trackedInfo = []
    const detectedInfo = []
    let autoInjectedSize = 0
    delete this.state.context.track

    // Find all world info entries
    for (let info of worldInfo) {
      const keys = this.getKeys(info.keys)
      const vanillaKeys = keys.filter(k => !(k instanceof RegExp))
      let autoInjected = false

      // Search through vanilla keys for matches in original context
      // These entries are auto injected by AID and their total size needs to be tracked
      for (let key of vanillaKeys) {
        if (!originalLowered.includes(key.toLowerCase())) continue
        autoInjected = true
        autoInjectedSize += info.entry.length
        trackedInfo.push(key)
        break
      }

      // If this entry was auto injected skip to next world info
      if (autoInjected) continue

      // Otherwise search through all keys for match, using regex where appropriate
      for (let key of keys) {
        const match = this.hasKey(combinedText, key)
        if (match) {
          detectedInfo.push(info)
          trackedInfo.push(match)
          break
        }
      }
    }

    // Set context information for tracked keys
    if (trackedInfo.length) this.state.context.track = trackedInfo.join(", ")
    return { detectedInfo, autoInjectedSize }
  }

  updateDebug(context, finalContext, finalSentences, detectedInfo) {
    if (!this.state.isDebug) return

    // Output to AID Script Diagnostics
    console.log({
      context: context.split("\n"),
      entireContext: finalSentences.join("").split("\n"),
      finalContext: finalContext.split("\n"),
      finalSentences,
      detectedInfo
    })

    // Don't hijack state.message while doing creating/updating a World Info entry
    if (this.state.entry.step) return

    // Output context to state.message with numbered lines
    let debugLines = finalContext.split("\n")
    debugLines.reverse()
    debugLines = debugLines.map((l, i) => "(" + (i < 9 ? "0" : "") + `${i + 1}) ${l}`)
    debugLines.reverse()
    state.message = debugLines.join("\n")
  }

  updateHUD() {
    // Display entry UI
    if (this.state.entry.step) {
      state.statsFormatterPlugin.isDisabled = false
      state.displayStats = [
        { key: "Name", value: this.state.entry.name, color: "dimgrey" },
        { key: "Keys", value: this.state.entry.keys, color: "dimgrey" },
        { key: "Entry", value: this.state.entry.entry, color: "dimgrey" },
        { key: "Hidden", value: this.state.entry.hidden, color: "dimgrey" }
      ]
    }

    // Display default UI
    else {
      state.statsFormatterPlugin.isDisabled = !this.isVisible()

      // If not visible clear stats and return
      if (!this.isVisible()) {
        state.displayStats = []
        return
      }

      // Update default stats
      state.displayStats = [
        { key: "Author's Note", value: this.state.context.story, color: "dimgrey" },
        { key: "Scene", value: this.state.context.scene, color: "dimgrey" },
        { key: "Think", value: this.state.context.think, color: "dimgrey" },
        { key: "Focus", value: this.state.context.focus, color: "dimgrey" },
        { key: "World Info", value: this.state.context.track, color: "dimgrey" }
      ]
    }

    statsFormatterPlugin.execute(statsFormatterConfig)
  }

  updateEntryHUD(promptText) {
    const output = []
    output.push(`(Hint: You can type ${this.ENTRY_SKIP} to skip and ${this.ENTRY_CANCEL} to cancel at any time.)`)
    output.push(`\n${promptText}`)
    state.message = output.join("\n")
    this.updateHUD()
  }

  getIndexByName(name) {
    const indexInfo = worldInfo.find(i => i.keys === this.ENTRY_INDEX_KEYS)
    const indexData = indexInfo ? JSON.parse(indexInfo.entry) : []
    const index = indexData.find(i => i.name === name)
    return index ? worldInfo.findIndex(i => i.id === index.id) : -1
  }

  getIndexByKey(key) {
    const indexInfo = worldInfo.find(i => i.keys === this.ENTRY_INDEX_KEYS)
    const indexData = indexInfo ? JSON.parse(indexInfo.entry) : []
    const ids = indexData.map(i => i.id)
    return worldInfo.findIndex(i => i.keys === key && ids.includes(i.id))
  }

  setNameIndex(name, id, oldName) {
    const indexIdx = worldInfo.findIndex(i => i.keys === this.ENTRY_INDEX_KEYS)
    const indexInfo = indexIdx !== -1 && worldInfo[indexIdx]
    const indexData = indexInfo ? JSON.parse(indexInfo.entry) : []
    indexData.push({ id, name })
    if (oldName) {
      const oldIdx = indexData.findIndex(i => i.name === oldName)
      if (oldIdx !== -1) delete indexData[oldIdx]
    }
    if (indexInfo) updateWorldEntry(indexIdx, this.ENTRY_INDEX_KEYS, JSON.stringify(indexData))
    else addWorldEntry(this.ENTRY_INDEX_KEYS, JSON.stringify(indexData))
  }

  entryExitUI() {
    state.message = this.state.entry.previousMessage
    this.state.entry = {}
    statsFormatterPlugin.clear()
    this.updateHUD()
  }

  entrySetSource() {
    if (this.state.entry.sourceIndex !== -1) {
      this.state.entry.source = worldInfo[this.state.entry.sourceIndex]
      this.state.entry.keys = this.state.entry.source.keys
      this.state.entry.entry = this.state.entry.source.entry
      this.state.entry.hidden = this.state.entry.source.hidden.toString()
    }
  }

  entryConfirmHandler(text) {
    const confirmed = text.toLowerCase().startsWith("y")
    if (!confirmed) return this.entryExitUI()

    // Add new World Info
    if (!this.state.entry.source) {
      const keys = `${this.state.entry.keys}`
      addWorldEntry(keys, `${this.state.entry.entry}`)
      const info = worldInfo.find(i => i.keys === keys)
      this.setNameIndex(this.state.entry.name, info.id)
    }

    // Update existing World Info
    else {
      updateWorldEntry(this.state.entry.sourceIndex, `${this.state.entry.keys}`, `${this.state.entry.entry}`)
      this.setNameIndex(this.state.entry.name, this.state.entry.source.id, this.state.entry.oldName)
    }

    // Reset everything back
    this.entryExitUI()
  }

  entryEntryHandler(text) {
    // Set values accordingly
    if (!this.state.entry.source && text === this.ENTRY_SKIP) return this.entryExitUI()
    else if (text !== this.ENTRY_SKIP) this.state.entry.entry = text

    // Proceed to next step
    this.state.entry.step = "Confirm"
    this.updateEntryHUD("> Are you happy with these changes? (y/n)")
  }

  entryKeysHandler(text) {
    // Set values accordingly
    if (!this.state.entry.source && text === this.ENTRY_SKIP) return this.entryExitUI()
    else if (text !== this.ENTRY_SKIP) this.state.entry.keys = text

    // Detect conflicting/existing keys and display error
    if (text !== this.ENTRY_SKIP) {
      const loweredText = this.state.entry.keys.toLowerCase()
      const existingIdx = worldInfo.findIndex(i => i.keys.toLowerCase() === loweredText)
      if (existingIdx !== -1 && existingIdx !== this.state.entry.sourceIndex) {
        if (!this.state.entry.source && this.getIndexByKey(text) === -1) {
          this.state.entry.sourceIndex = existingIdx
          this.entrySetSource()
        }
        else {
          return this.updateEntryHUD("> ERROR! World Info with that key already exists, try again: ")
        }
      }
    }

    // Ensure valid regex if regex key
    const keys = this.getKeys(text)
    if (!keys.length) return this.updateEntryHUD("> ERROR! Invalid regex detected in key, try again: ")

    // Otherwise proceed to entry input
    this.state.entry.step = "Entry"
    this.updateEntryHUD(`> Enter new value for ENTRY:`)
  }

  entryNameHandler(text) {
    // Detect skip
    if (text !== this.ENTRY_SKIP) {
      if (this.state.entry.source) this.state.entry.oldName = this.state.entry.name
      this.state.entry.name = text
    }

    // Proceed to next step
    this.state.entry.step = "Keys"
    this.updateEntryHUD(`> Enter new value for KEYS:`)
  }

  entryHandler(text) {
    const modifiedText = text.slice(1)

    // Already processing input
    if (this.state.entry.step) {
      const handlerString = `entry${this.state.entry.step}Handler`
      console.log(handlerString)
      if (modifiedText === this.ENTRY_CANCEL) this.entryExitUI()
      // Dynamically execute function based on step
      else if (typeof this[handlerString] === 'function') this[handlerString](modifiedText)
      else this.entryExitUI()
      return ""
    }

    // Quick check to return early if possible
    if (!modifiedText.startsWith("/") || modifiedText.includes("\n")) return text

    // Match a command
    let match = this.commandMatch.exec(modifiedText)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Ensure correct command is passed
    const cmd = match[1].toLowerCase()
    if (!["entry", "e"].includes(cmd)) return text

    // Ensure entry name is passed
    const params = match.length > 1 && match[2] && match[2].trim()
    if (!params) return ""

    // Setup index and preload entry if found
    this.state.entry.name = params
    this.state.entry.sourceIndex = this.getIndexByName(this.state.entry.name)
    this.entrySetSource()

    // Store current message away to restore once done
    this.state.entry.previousMessage = state.message
    statsFormatterPlugin.clear()

    if (this.state.entry.source) {
      this.state.entry.step = "Name"
      this.updateEntryHUD("> Enter new value for NAME: ")
    } else {
      this.state.entry.step = "Keys"
      this.updateEntryHUD("> Enter new value for KEYS: ")
    }

    return ""
  }

  commandHandler(text) {
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
        state.message = this.state.isDebug ? "Enter something into the prompt to start debugging the context.." : ""
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

    // Scene - Name, location, present company and scene description
    const scene = []
    delete this.state.context.scene
    if (this.state.data.you) scene.push(`You are ${this.appendPeriod(this.state.data.you)}`)
    if (this.state.data.at && this.state.data.with) scene.push(`You are at ${this.removePeriod(this.state.data.at)} with ${this.appendPeriod(this.state.data.with)}`)
    else if (this.state.data.at) scene.push(`You are at ${this.appendPeriod(this.state.data.at)}`)
    else if (this.state.data.with) scene.push(`You are with ${this.appendPeriod(this.state.data.with)}`)
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
   * Input Handler
   * - Takes new command and refreshes context and HUD (if visible and enabled)
   * - Updates when valid command is entered into the prompt (ie, `/name John Smith`)
   * - Can clear state by executing the command without any arguments (ie, `/name`)
   */
  inputModifier(text) {
    let modifiedText = this.entryHandler(text)

    // Check if no input (ie, prompt AI)
    if (!modifiedText) return modifiedText

    // Detection for multi-line commands, filter out double ups of newlines
    modifiedText = text.split("\n").map(l => this.commandHandler(l)).join("\n")

    // Cleanup for commands
    if (["\n", "\n\n"].includes(modifiedText)) modifiedText = ""

    return modifiedText
  }

  /*
   * Context Injector
   * - Takes existing set state and dynamically injects it into the context
   * - Is responsible for injecting custom World Info entries, including regex matching of keys where applicable
   * - Keeps track of the amount of modified context and ensures it does not exceed the 85% rule
   *   while injecting as much as possible
   */
  contextModifier(text) {
    if (this.state.isDisabled || !text) return text;

    // Split context and memory
    const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ""
    const context = info.memoryLength ? text.slice(info.memoryLength) : text
    const originalSize = context.length

    // Parse combined context for world info keys, and setup world info stat in HUD
    // Also return the size of all entries automatically injected by AID
    const pluginContext = this.getPluginContext()
    const reversedContext = context.split("\n")
    reversedContext.reverse()
    const { detectedInfo, autoInjectedSize } = this.detectWorldInfo(reversedContext.join("\n"), pluginContext)
    const maxSize = info.maxChars - info.memoryLength - autoInjectedSize

    // Break context into sentences and reverse for easier traversal
    let sentences = this.getSentences(context)
    sentences.reverse()

    // Group sentences by character length
    const sentenceGroups = this.groupBySize(sentences)

    // Account for changes made by paragraph formatter plugin
    let modifiedSize = 0

    // Build author's note entry
    const noteEntry = this.getEntry(`Author's note: ${this.state.context.story}`, originalSize, modifiedSize, true)
    if (noteEntry) modifiedSize += noteEntry.size

    // Build scene entry
    const sceneEntry = this.getEntry(this.state.context.scene, originalSize, modifiedSize, true, false)
    if (sceneEntry) modifiedSize += sceneEntry.size

    // Build think entry
    const thinkEntry = this.getEntry(this.state.context.think, originalSize, modifiedSize, true)
    if (thinkEntry) modifiedSize += thinkEntry.size

    // Build focus entry
    const focusEntry = this.getEntry(this.state.context.focus, originalSize, modifiedSize, true)
    if (focusEntry) modifiedSize += focusEntry.size

    // Inject focus entry
    sentences = [...sentenceGroups.focus]
    if (focusEntry) sentences.push(focusEntry.text)

    // Inject think entry
    sentences = [...sentences, ...sentenceGroups.think]
    if (thinkEntry) sentences.push(thinkEntry.text)

    // Inject scene entry
    sentences = [...sentences, ...sentenceGroups.scene]
    if (sceneEntry) sentences.push(sceneEntry.text)

    // Create header group, inject author's note entry
    let header = []
    if (noteEntry) header.push(noteEntry.text)

    // Inject World Info
    if (detectedInfo.length) {
      let injectedKeys = []
      let injectedSentences = []

      // Inject into header
      const combinedHeader = header.join(" ")
      for (let info of detectedInfo) {
        if (injectedKeys.includes(info.keys)) continue
        for (let key of this.getKeys(info.keys)) {
          const entry = this.hasKey(combinedHeader, key) && this.getEntry(info.entry, originalSize, modifiedSize)
          if (!entry) continue
          injectedKeys.push(info.keys)
          header.push(entry.text)
          modifiedSize += entry.size
          break
        }
      }

      // Inject into front sentences
      for (let sentence of sentences) {
        injectedSentences.push(sentence)
        for (let info of detectedInfo) {
          if (injectedKeys.includes(info.keys)) continue
          for (let key of this.getKeys(info.keys)) {
            const entry = this.hasKey(sentence, key) && this.getEntry(info.entry, originalSize, modifiedSize)
            if (!entry) continue
            injectedKeys.push(info.keys)
            injectedSentences.push(entry.text)
            modifiedSize += entry.size
            break
          }
        }
      }

      // Inject into filler sentences
      for (let sentence of sentenceGroups.filler) {
        injectedSentences.push(sentence)
        for (let info of detectedInfo) {
          if (injectedKeys.includes(info.keys)) continue
          for (let key of this.getKeys(info.keys)) {
            const entry = this.hasKey(sentence, key) && this.getEntry(info.entry, originalSize, modifiedSize)
            if (!entry) continue
            injectedKeys.push(info.keys)
            injectedSentences.push(entry.text)
            modifiedSize += entry.size
            break
          }
        }
      }

      sentences = injectedSentences
    }

    // Clean up placeholder text and add remaining sentences
    sentences = this.cleanEntries(sentences)
    header = this.cleanEntries(header)

    // Fill in gap with filler content
    let totalSize = 0
    let filterBreak = false
    const headerSize = header.join("").length
    sentences = sentences.filter(sentence => {
      if (filterBreak) return false
      const calcSize = totalSize + sentence.length + headerSize
      if (calcSize < maxSize) {
        totalSize += sentence.length
        return true
      } else {
        filterBreak = true
      }
    })

    // Fill in past content
    const history = filterBreak ? [] : sentenceGroups.history.filter(sentence => {
      if (filterBreak) return false
      const calcSize = totalSize + sentence.length + headerSize
      if (calcSize < maxSize) {
        totalSize += sentence.length
        return true
      } else {
        filterBreak = true
      }
    })

    // Remove last sentence as it usually is cut anyway
    if (history.length) history.pop()
    else sentences.pop()

    // Create list of all recognised sentences
    const finalSentences = [...sentences, ...header, ...history]

    // Remember to reverse the array again to get the correct order
    finalSentences.reverse()

    // Cleanup empty lines and two or more consecutive newlines
    const entireContext = finalSentences.join("")
      .replace(/([\n]{2,})/g, "\n")
      .split("\n").filter(l => !!l).join("\n")

    // Keep within maxChars and remove last entry if it is a custom entry
    const lines = entireContext.slice(-maxSize).split("\n")
    const finalContext = [contextMemory, lines.join("\n")].join("")

    // Debug output
    this.updateDebug(context, finalContext, finalSentences, detectedInfo)

    // Display HUD
    this.updateHUD()

    return finalContext
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
