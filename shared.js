/*
 * Configuration
 */
const SC_LABEL = {
  notes: "✒️",
  pov: "🕹️",
  scene: "🎬",
  think: "💭",
  focus: "🧠",
  track: "🔦",
  label: "🏷️",
  keys: "🔎",
  main: "📑",
  seen: "👁️",
  heard: "🦻🏼",
  topic: "💬",
  check: "✔️",
  cross: "❌"
}

const statsFormatterConfig = {
  order: [
    SC_LABEL.notes, SC_LABEL.pov, SC_LABEL.scene, SC_LABEL.think, SC_LABEL.focus, SC_LABEL.track, // Default UI
    SC_LABEL.label, SC_LABEL.keys, SC_LABEL.main, SC_LABEL.heard, SC_LABEL.seen, SC_LABEL.topic // Entry UI
  ],
  colors: {
    [SC_LABEL.notes]: "dimgrey",
    [SC_LABEL.pov]: "slategrey",
    [SC_LABEL.scene]: "steelblue",
    [SC_LABEL.think]: "seagreen",
    [SC_LABEL.focus]: "indianred",
    [SC_LABEL.track]: "chocolate",
    [SC_LABEL.label]: "indianred",
    [SC_LABEL.keys]: "chocolate",
    [SC_LABEL.main]: "steelblue",
    [SC_LABEL.heard]: "seagreen",
    [SC_LABEL.seen]: "seagreen",
    [SC_LABEL.topic]: "seagreen"
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
      return Object.assign({ color: "dimgrey" }, stat, formattedStat)
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
  ENTRY_SKIP = ">"
  ENTRY_SKIP_ALL = ">>"
  ENTRY_CANCEL = "!"
  ENTRY_DELETE = "^"
  ENTRY_INDEX_KEYS = "_index"
  ENTRY_KEY_MAIN = "main"
  ENTRY_KEY_HEARD = "heard"
  ENTRY_KEY_SEEN = "seen"
  ENTRY_KEY_TOPIC = "topic"

  // Determines total characters between each section, rounded by whole sentences.
  SECTION_SIZES = { focus: 150, think: 500, scene: 1000 }

  // Don't change these
  controlList = ["enable", "disable", "show", "hide", "reset", "debug"] // Plugin Controls
  commandList = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Notes
    "you", "at", "with", // PoV
    "scene", // Scene
    "think", // Think
    "focus" // Focus
  ]
  entryCommandList = ["entry", "e"]
  commandMatch = /^> You say "\/(\w+)\s?(.*)?"$|^> You \/(\w+)\s?(.*)?[.]$|^\/(\w+)\s?(.*)?$/
  keyMatch = /.?\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)|[^,]+/g
  brokenEnclosureMatch = /(")([^\w])(")|(')([^\w])(')|(\[)([^\w])(])|(\()([^\w])(\))|({)([^\w])(})|(<)([^\w])(>)/g
  enclosureMatch = /([^\w])("[^"]+")([^\w])|([^\w])('[^']+')([^\w])|([^\w])(\[[^]]+])([^\w])|([^\w])(\([^)]+\))([^\w])|([^\w])({[^}]+})([^\w])|([^\w])(<[^<]+>)([^\w])/g
  sentenceMatch = /([^!?.]+[!?.]+[\s]+?)|([^!?.]+[!?.]+$)|([^!?.]+$)/g
  escapeRegExpMatch = /[.*+?^${}()|[\]\\]/g

  constructor() {
    this.commandList = this.controlList.concat(this.commandList)
    if (!state.simpleContextPlugin) state.simpleContextPlugin = {
      isDebug: false,
      isHidden: false,
      isDisabled: false,
      shuffleContext: false,
      data: {},
      track: [],
      context: {},
      entry: {}
    }
    this.state = state.simpleContextPlugin
    if (!state.displayStats) state.displayStats = []
  }

  isVisible() {
    return !this.state.isDisabled && !this.state.isHidden
  }

  getJson(text) {
    try {
      return JSON.parse(text)
    }
    catch (e) {
      return text
    }
  }

  escapeRegExp(text) {
    return text.replace(this.escapeRegExpMatch, '\\$&'); // $& means the whole matched string
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

  getSentences(text) {
    let { modifiedText, enclosures } = this.replaceEnclosures(text)
    let sentences = modifiedText.match(this.sentenceMatch) || []
    return sentences.map(s => this.insertEnclosures(s, enclosures))
  }

  getKeys(keys) {
    return [...keys.matchAll(this.keyMatch)].map(match => {
      if (!match[1] && match[0].startsWith("/")) throw "Invalid regex found!"
      else if (match[1]) {
        // Add global flag to all regex keys
        let flags = match[2] ? (match[2].includes("g") ? match[2] : `g${match[2]}`) : "g"
        return new RegExp(match[1], flags)
      }
      else return new RegExp(this.escapeRegExp(match[0].trim()), "g")
    })
  }

  getEntry(text) {
    let json = this.getJson(text)
    if (typeof json !== 'object' || Array.isArray(json) || !json[this.ENTRY_KEY_MAIN]) {
      json = {}
      json[this.ENTRY_KEY_MAIN] = text
    }
    return json
  }

  getValidEntry(text, modifiedSize, originalSize, encapsulate=false, replaceYou=true) {
    if (!text) return

    // Encapsulation of entry in brackets
    if (encapsulate) text = `<< ${text}>>>>`

    // Replace your name in with "you"
    if (replaceYou && this.state.data.you) text = text.replace(this.state.data.you, "you")

    // Final forms
    text = `\n{|${text}|}\n`
    const entrySize = (text.length + 4)

    // Validate entry for context overflow
    if (!this.validEntrySize(modifiedSize, originalSize, entrySize)) return

    // Update size counter and return new text
    modifiedSize += entrySize
    return { text, modifiedSize }
  }

  validEntrySize(modifiedSize, originalSize, entrySize) {
    if (originalSize === 0) return false
    const modifiedPercent = (modifiedSize + entrySize) / originalSize
    return modifiedPercent < 0.85
  }

  cleanEntries(entries) {
    entries = ` ${entries.join("[@]")} `
    entries = entries.replace(/([^\n])(\[@]\n{\|)/g, "$1\n$2")
    entries = entries.replace(/(\|}\n\[@])([^\n])/g, "$1\n$2")
    entries = entries.replace(/\n{\||\|}\n/g, "\n")
    entries = entries.slice(1, -1)
    return entries.split("[@]")
  }

  detectWorldInfo(originalText) {
    const originalLowered = originalText.toLowerCase()
    const injectedIds = []
    let autoInjectedSize = 0

    // Search through vanilla keys for matches in original context
    // These entries are auto injected by AID and their total size needs to be tracked
    for (let info of worldInfo) {
      const vanillaKeys = this.getKeys(info.keys).filter(k => !(k instanceof RegExp))
      for (let key of vanillaKeys) {
        if (!originalLowered.includes(key.toLowerCase())) continue
        autoInjectedSize += info.entry.length
        injectedIds.push(info.id)
        this.state.track.push(key)
        break
      }
    }

    return { injectedIds, autoInjectedSize }
  }

  updateMetrics(metrics, text, idx) {
    let updated = false
    const action = "[^\w](see|look|observe|watch|examine|describe|view|glance|glare|gaze|frown|ogle|stare)[^\w]"
    const pastAction = "[^\w](seen|shown|viewed|glimpsed|spotted)[^\w]"

    // Iterate over each key for matches
    for (let key of metrics.keys) {
      // refCount - determine if key matched at all
      let matches = [...text.matchAll(key)]
      if (!matches.length) continue
      metrics[this.ENTRY_KEY_MAIN].push(idx)
      metrics.matchText = matches[0]
      updated = true

      // Get structured entry object, only perform matching if entry key's found
      const pattern = key.toString().split("/").slice(1, -1).join("/")

      // determine if match is owner of quotations, ie ".*".*(pattern)  or  (pattern).*".*"
      if (metrics.entry[this.ENTRY_KEY_HEARD]) {
        matches = [...text.matchAll(new RegExp(`${pattern}[^"]+"[^"]+"|"[^"]+"[^"]+${pattern}`, key.flags))]
        if (matches.length) metrics[this.ENTRY_KEY_HEARD].push(idx)
      }

      // combination of match and specific lookup regex, ie (glance|look|observe).*(pattern)
      if (metrics.entry[this.ENTRY_KEY_SEEN]) {
        matches = [...text.matchAll(new RegExp(`${action}.*${pattern}|${pattern}.*${pastAction}`, key.flags))]
        if (matches.length) metrics[this.ENTRY_KEY_SEEN].push(idx)
      }

      // match within quotations, ".*(pattern).*"
      if (metrics.entry[this.ENTRY_KEY_TOPIC]) {
        matches = [...text.matchAll(new RegExp(`"([^"]+)?${pattern}([^"]+)?"`, key.flags))]
        if (matches.length) metrics[this.ENTRY_KEY_TOPIC].push(idx)
      }
    }

    return updated
  }

  injectWorldInfo(sentences, injectedIds, modifiedSize, originalSize) {
    const remainingInfo = worldInfo.filter(i => !injectedIds.includes(i.id))

    // Collect metric data on keys that match, including indexes of sentences where found
    const infoMetrics = []
    for (let idx = 0; idx < sentences.length; idx++) {
      for (const info of remainingInfo) {
        // Load existing match data or create new
        const existing = infoMetrics.find(m => m.id === info.id)
        const metrics = existing || {
          id: info.id, matchText: "",
          entry: this.getEntry(info.entry),
          keys: this.getKeys(info.keys),
          [this.ENTRY_KEY_MAIN]: [], [this.ENTRY_KEY_HEARD]: [],
          [this.ENTRY_KEY_SEEN]: [], [this.ENTRY_KEY_TOPIC]: []
        }

        // Get metrics associated with sentence
        if (!this.updateMetrics(metrics, sentences[idx], idx)) continue

        // Update match data with new metrics
        if (!existing) infoMetrics.push(metrics)
      }
    }

    // Process main context injection before everything else
    // Main positions itself towards the end of the context (last position in history found)
    const indexedMetrics = {}
    for (let metrics of infoMetrics) {
      const mainIdx = metrics[this.ENTRY_KEY_MAIN].length && metrics[this.ENTRY_KEY_MAIN][metrics.main.length - 1]
      if (mainIdx !== undefined) {
        if (!indexedMetrics[mainIdx]) indexedMetrics[mainIdx] = []
        const validEntry = this.getValidEntry(metrics.entry[this.ENTRY_KEY_MAIN], modifiedSize, originalSize)
        if (validEntry) {
          indexedMetrics[mainIdx].push(validEntry.text)
          modifiedSize = validEntry.modifiedSize
          if (!this.state.isDebug) this.state.track.push(metrics.matchText)
          else {
            const metricCounts = [
              metrics[this.ENTRY_KEY_MAIN].length, metrics[this.ENTRY_KEY_HEARD].length,
              metrics[this.ENTRY_KEY_SEEN].length, metrics[this.ENTRY_KEY_TOPIC].length
            ]
            this.state.track.push(`${metrics.matchText} [${metricCounts.join(",")}]`)
          }
        }
      }
    }

    // Then process each context addon, doing a full entry each time
    // Mention, Heard and Seen position themselves towards the front of the context
    for (let metrics of infoMetrics) {
      for (let prop of [this.ENTRY_KEY_HEARD, this.ENTRY_KEY_SEEN, this.ENTRY_KEY_TOPIC]) {
        const idx = metrics[prop].length && metrics[prop][0]
        if (idx !== undefined) {
          if (!indexedMetrics[idx]) indexedMetrics[idx] = []
          const validEntry = this.getValidEntry(metrics.entry[prop], modifiedSize, originalSize)
          if (validEntry) {
            indexedMetrics[idx].push(validEntry.text)
            modifiedSize = validEntry.modifiedSize
          }
        }
      }
    }

    // Reverse all entries
    Object.values(indexedMetrics).map(i => i.reverse())

    // Insert into context
    const orderedIndexes = Object.keys(indexedMetrics).map(k => Number(k))
    orderedIndexes.sort((a, b) => b - a)
    for (let idx of orderedIndexes) {
      const adjustedIdx = (idx === (sentences.length - 1)) ? idx : (idx + 1)
      sentences.splice(adjustedIdx, 0, ...indexedMetrics[idx])
    }

    return { sentences, injectedIds, modifiedSize }
  }

  updateDebug(context, finalContext, finalSentences) {
    if (!this.state.isDebug) return

    // Output to AID Script Diagnostics
    console.log({
      context: context.split("\n"),
      entireContext: finalSentences.join("").split("\n"),
      finalContext: finalContext.split("\n"),
      finalSentences
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
    statsFormatterPlugin.clear()

    // Display entry UI
    if (this.state.entry.step) {
      state.statsFormatterPlugin.isDisabled = false
      state.displayStats = [
        { key: SC_LABEL.label, value: this.state.entry.label },
        { key: SC_LABEL.keys, value: this.state.entry.keys },
        { key: SC_LABEL.main, value: this.state.entry.entry[this.ENTRY_KEY_MAIN] },
        { key: SC_LABEL.heard, value: this.state.entry.entry[this.ENTRY_KEY_HEARD] },
        { key: SC_LABEL.seen, value: this.state.entry.entry[this.ENTRY_KEY_SEEN] },
        { key: SC_LABEL.topic, value: this.state.entry.entry[this.ENTRY_KEY_TOPIC] }
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
        { key: SC_LABEL.notes, value: this.state.context.notes },
        { key: SC_LABEL.pov, value: this.state.context.pov },
        { key: SC_LABEL.scene, value: this.state.context.scene },
        { key: SC_LABEL.think, value: this.state.context.think },
        { key: SC_LABEL.focus, value: this.state.context.focus },
        { key: SC_LABEL.track, value: this.state.track.join(", ") || undefined }
      ]
    }

    statsFormatterPlugin.execute(statsFormatterConfig)
  }

  updateEntryHUD(promptText, optional=false, hints=true) {
    const output = []
    if (hints) {
      output.push(`Hint: You can type ${this.ENTRY_SKIP} to skip and ${this.ENTRY_CANCEL} to cancel at any time.`)
      output.push(`When editing ${this.ENTRY_SKIP_ALL} can be used to skip all` + (optional ? ` and ${this.ENTRY_DELETE} to delete.` : "."))
      output.push("")
    }
    output.push(`${promptText}`)
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

  setEntrySource() {
    if (this.state.entry.sourceIndex !== -1) {
      this.state.entry.source = worldInfo[this.state.entry.sourceIndex]
      this.state.entry.keys = this.state.entry.source.keys
      this.state.entry.entry = this.getEntry(this.state.entry.source.entry)
    }
    else {
      this.state.entry.entry = {}
    }
  }

  setEntryJson(entry, key, text) {
    if (text === this.ENTRY_SKIP) return
    if (entry[key] && text === this.ENTRY_DELETE) delete entry[key]
    else entry[key] = text
  }

  entryConfirmStep() {
    this.state.entry.step = "Confirm"
    this.updateEntryHUD(`${SC_LABEL.check} Are you happy with these changes? (y/n)`, false, false)
  }

  entryTopicStep() {
    this.state.entry.step = "Topic"
    this.updateEntryHUD(`${SC_LABEL.topic} Enter entry to inject when TOPIC of conversation (optional):`, true)
  }

  entrySeenStep() {
    this.state.entry.step = "Seen"
    this.updateEntryHUD(`${SC_LABEL.seen} Enter entry to inject when SEEN (optional):`, true)
  }

  entryHeardStep() {
    this.state.entry.step = "Heard"
    this.updateEntryHUD(`${SC_LABEL.heard} Enter entry to inject when HEARD speaking (optional):`, true)
  }

  entryMainStep() {
    this.state.entry.step = "Main"
    this.updateEntryHUD(`${SC_LABEL.main} Enter the MAIN entry to inject when keys found:`)
  }

  entryKeysStep() {
    this.state.entry.step = "Keys"
    this.updateEntryHUD(`${SC_LABEL.keys} Enter the KEYS used to trigger entry injection:`)
  }

  entryLabelStep() {
    this.state.entry.step = "Label"
    this.updateEntryHUD(`${SC_LABEL.label} Enter the LABEL used to refer to this entry: `)
  }

  entryExitHandler() {
    state.message = this.state.entry.previousMessage
    this.state.entry = {}
    this.updateHUD()
  }

  entryConfirmHandler(text) {
    const confirmed = text.toLowerCase().startsWith("y")
    if (!confirmed) return this.entryExitHandler()
    this.state.entry.entry = JSON.stringify(this.state.entry.entry)

    // Add new World Info
    if (!this.state.entry.source) {
      const keys = `${this.state.entry.keys}`
      addWorldEntry(keys, `${this.state.entry.entry}`)
      const info = worldInfo.find(i => i.keys === keys)
      this.setNameIndex(this.state.entry.label, info.id)
    }

    // Update existing World Info
    else {
      updateWorldEntry(this.state.entry.sourceIndex, `${this.state.entry.keys}`, `${this.state.entry.entry}`)
      this.setNameIndex(this.state.entry.label, this.state.entry.source.id, this.state.entry.oldLabel)
    }

    // Reset everything back
    this.entryExitHandler()
  }

  entryTopicHandler(text) {
    // Set values accordingly
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    this.setEntryJson(this.state.entry.entry, this.ENTRY_KEY_TOPIC, text)

    // Proceed to next step
    this.entryConfirmStep()
  }

  entrySeenHandler(text) {
    // Set values accordingly
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    this.setEntryJson(this.state.entry.entry, this.ENTRY_KEY_SEEN, text)

    // Proceed to next step
    this.entryTopicStep()
  }

  entryHeardHandler(text) {
    // Set values accordingly
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    this.setEntryJson(this.state.entry.entry, this.ENTRY_KEY_HEARD, text)

    // Proceed to next step
    this.entrySeenStep()
  }

  entryMainHandler(text) {
    // Detect skip all
    if (text === this.ENTRY_SKIP_ALL) {
      if (this.state.entry.source) return this.entryConfirmStep()
      else return this.entryMainStep()
    }

    // Set values accordingly
    if (!this.state.entry.source && text === this.ENTRY_SKIP) return this.entryMainStep()
    this.setEntryJson(this.state.entry.entry, this.ENTRY_KEY_MAIN, text)

    // Proceed to next step
    this.entryHeardStep()
  }

  entryKeysHandler(text) {
    // Detect skip all
    if (text === this.ENTRY_SKIP_ALL) {
      if (this.state.entry.source) return this.entryConfirmStep()
      else return this.entryKeysStep()
    }

    // Set values accordingly
    if (!this.state.entry.source && text === this.ENTRY_SKIP) return this.entryKeysStep()
    else if (text !== this.ENTRY_SKIP) this.state.entry.keys = text

    // Detect conflicting/existing keys and display error
    if (text !== this.ENTRY_SKIP) {
      const loweredText = this.state.entry.keys.toLowerCase()
      const existingIdx = worldInfo.findIndex(i => i.keys.toLowerCase() === loweredText)
      if (existingIdx !== -1 && existingIdx !== this.state.entry.sourceIndex) {
        if (!this.state.entry.source && this.getIndexByKey(text) === -1) {
          this.state.entry.sourceIndex = existingIdx
          this.setEntrySource()
        }
        else {
          return this.updateEntryHUD(`${SC_LABEL.cross} ERROR! World Info with that key already exists, try again: `)
        }
      }
    }

    // Ensure valid regex if regex key
    const keys = this.getKeys(text)
    if (!keys.length) return this.updateEntryHUD(`${SC_LABEL.cross} ERROR! Invalid regex detected in keys, try again: `)

    // Otherwise proceed to entry input
    this.entryMainStep()
  }

  entryLabelHandler(text) {
    // Detect skip
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    if (text !== this.ENTRY_SKIP) {
      if (this.state.entry.source) this.state.entry.oldLabel = this.state.entry.label
      this.state.entry.label = text
    }

    // Proceed to next step
    this.entryKeysStep()
  }

  entryHandler(text) {
    const modifiedText = text.slice(1)

    // Already processing input
    if (this.state.entry.step) {
      const handlerString = `entry${this.state.entry.step}Handler`
      if (modifiedText === this.ENTRY_CANCEL) this.entryExitHandler()
      // Dynamically execute function based on step
      else if (typeof this[handlerString] === 'function') this[handlerString](modifiedText)
      else this.entryExitHandler()
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
    if (!this.entryCommandList.includes(cmd)) return text

    // Ensure entry name is passed
    const params = match.length > 1 && match[2] && match[2].trim()
    if (!params) return ""

    // Setup index and preload entry if found
    this.state.entry.label = params
    this.state.entry.sourceIndex = this.getIndexByName(this.state.entry.label)
    this.setEntrySource()

    // Store current message away to restore once done
    this.state.entry.previousMessage = state.message

    if (this.state.entry.source) this.entryLabelStep()
    else this.entryKeysStep()

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

    // Notes - Author's Note, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
    // Placed at the very end of context.
    const notes = []
    delete this.state.context.notes
    if (this.state.data.note) notes.push(this.appendPeriod(this.state.data.note))
    if (this.state.data.title) notes.push(`Title: ${this.appendPeriod(this.state.data.title)}`)
    if (this.state.data.author) notes.push(`Author: ${this.appendPeriod(this.state.data.author)}`)
    if (this.state.data.genre) notes.push(`Genre: ${this.appendPeriod(this.state.data.genre)}`)
    if (this.state.data.setting) notes.push(`Setting: ${this.appendPeriod(this.state.data.setting)}`)
    if (this.state.data.theme) notes.push(`Theme: ${this.appendPeriod(this.state.data.theme)}`)
    if (this.state.data.subject) notes.push(`Subject: ${this.appendPeriod(this.state.data.subject)}`)
    if (this.state.data.style) notes.push(`Writing Style: ${this.appendPeriod(this.state.data.style)}`)
    if (this.state.data.rating) notes.push(`Rating: ${this.appendPeriod(this.state.data.rating)}`)
    if (notes.length) this.state.context.notes = notes.join(" ")

    // POV - Name, location and present company
    // Placed directly under Author's Notes
    const pov = []
    delete this.state.context.pov
    if (this.state.data.you) pov.push(`You are ${this.appendPeriod(this.state.data.you)}`)
    if (this.state.data.at) pov.push(`You are at ${this.appendPeriod(this.state.data.at)}`)
    if (this.state.data.with) pov.push(`You are with ${this.appendPeriod(this.state.data.with)}`)
    if (pov.length) this.state.context.pov = pov.join(" ")

    // Scene - Used to provide the premise for generated context
    // Placed 1000 characters from the front of context
    delete this.state.context.scene
    if (this.state.data.scene) this.state.context.scene = this.toTitleCase(this.appendPeriod(this.state.data.scene))

    // Think - Use to nudge a story in a certain direction
    // Placed 550 characters from the front of context
    delete this.state.context.think
    if (this.state.data.think) this.state.context.think = this.toTitleCase(this.appendPeriod(this.state.data.think))

    // Focus - Use to force a narrative or story direction
    // Placed 150 characters from the front of context
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
    this.state.track = []

    // Split context and memory
    const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ""
    const context = info.memoryLength ? text.slice(info.memoryLength) : text
    const originalSize = context.length

    // Break context into sentences and reverse for easier traversal
    let sentences = this.getSentences(context)
    sentences.reverse()

    // Group sentences by character length
    const sentenceGroups = this.groupBySize(sentences)

    // Account for changes made by paragraph formatter plugin
    let modifiedSize = 0

    // Build author's note entry
    const noteEntry = this.getValidEntry(`Author's note: ${this.state.context.notes}`, modifiedSize, originalSize, true)
    if (noteEntry) modifiedSize = noteEntry.modifiedSize

    // Build pov entry
    const povEntry = this.getValidEntry(this.state.context.pov, modifiedSize, originalSize, true)
    if (povEntry) modifiedSize = povEntry.modifiedSize

    // Build scene entry
    const sceneEntry = this.getValidEntry(this.state.context.scene, modifiedSize, originalSize, true, false)
    if (sceneEntry) modifiedSize = sceneEntry.modifiedSize

    // Build think entry
    const thinkEntry = this.getValidEntry(this.state.context.think, modifiedSize, originalSize, true)
    if (thinkEntry) modifiedSize = thinkEntry.modifiedSize

    // Build focus entry
    const focusEntry = this.getValidEntry(this.state.context.focus, modifiedSize, originalSize, true)
    if (focusEntry) modifiedSize = focusEntry.modifiedSize

    // Inject focus entry
    sentences = [...sentenceGroups.focus]
    if (focusEntry) sentences.push(focusEntry.text)

    // Inject think entry
    sentences = [...sentences, ...sentenceGroups.think]
    if (thinkEntry) sentences.push(thinkEntry.text)

    // Inject scene entry
    sentences = [...sentences, ...sentenceGroups.scene]
    if (sceneEntry) sentences.push(sceneEntry.text)

    // Inject filler at end
    sentences = [...sentences, ...sentenceGroups.filler]

    // Create header group
    let header = []

    // Inject author's note entry
    if (noteEntry) header.push(noteEntry.text)

    // Inject pov entry
    if (povEntry) header.push(povEntry.text)

    // Get the ids and size of all entries automatically injected by AID, determine new max length of context
    const reversedContext = context.split("\n")
    reversedContext.reverse()
    let { injectedIds, autoInjectedSize } = this.detectWorldInfo(reversedContext.join("\n"))
    const maxSize = info.maxChars - info.memoryLength - autoInjectedSize

    // Inject World Info into story
    const sentencesInject = this.injectWorldInfo(sentences, injectedIds, modifiedSize, originalSize)
    sentences = sentencesInject.sentences

    // Inject World Info into header
    const headerInject = this.injectWorldInfo(header, sentencesInject.injectedIds, sentencesInject.modifiedSize, originalSize)
    header = headerInject.sentences

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
    this.updateDebug(context, finalContext, finalSentences)

    // Display HUD
    this.updateHUD()

    return finalContext
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
