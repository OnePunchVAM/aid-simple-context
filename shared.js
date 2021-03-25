/*
 * Configuration
 */
const SC_LABEL = {
  // HUD
  notes: "✒️",
  pov: "🕹️",
  scene: "🎬",
  think: "💭",
  focus: "🧠",
  track: "🔦",
  // Entry UI
  label: "🏷️",
  keys: "🔎",
  main: "📑",
  seen: "👁️",
  heard: "🦻🏼",
  topic: "💬",
  check: "✔️",
  cross: "❌"
}

const SC_COLOR = {
  // HUD
  notes: "dimgrey",
  pov: "slategrey",
  scene: "steelblue",
  think: "seagreen",
  focus: "indianred",
  track: "chocolate",
  // Entry UI
  label: "indianred",
  keys: "chocolate",
  main: "steelblue",
  heard: "seagreen",
  seen: "seagreen",
  topic: "seagreen"
}


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
  ENTRY_BACK = "<"
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
  controlList = ["enable", "disable", "show", "hide", "min", "max", "reset", "debug"] // Plugin Controls
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
      isMinimized: false,
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
      if (!match[1] && match[0].startsWith("/")) return false
      else if (match[1]) {
        // Add global flag to all regex keys
        let flags = match[2] ? (match[2].includes("g") ? match[2] : `g${match[2]}`) : "g"
        return new RegExp(match[1], flags)
      }
      else return new RegExp(this.escapeRegExp(match[0].trim()), "g")
    }).filter(k => !!k)
  }

  getVanillaKeys(keys) {
    return [...keys.matchAll(this.keyMatch)].map(m => !m[1] && m[0]).filter(k => !!k)
  }

  getEntry(text) {
    let json = this.getJson(text)
    if (typeof json !== 'object' || Array.isArray(json) || !json[this.ENTRY_KEY_MAIN]) {
      json = {}
      json[this.ENTRY_KEY_MAIN] = text
    }
    return json
  }

  getValidEntry(text, modifiedSize, originalSize, encapsulate=false, replaceYou=false) {
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
      const vanillaKeys = this.getVanillaKeys(info.keys)
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
      metrics.matchText = matches[0][0]
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

  processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, properties) {
    for (let metrics of infoMetrics) {
      for (let prop of properties) {
        const count = metrics[prop].length
        const idx = count > 0 ? (prop === this.ENTRY_KEY_MAIN ? metrics[prop][count - 1] : metrics[prop][0]) : -1
        if (idx > -1) {
          if (!indexedMetrics[idx]) indexedMetrics[idx] = []
          const validEntry = this.getValidEntry(metrics.entry[prop], modifiedSize, originalSize)
          if (validEntry) {
            indexedMetrics[idx].push(validEntry.text)
            modifiedSize = validEntry.modifiedSize
            if (prop === this.ENTRY_KEY_MAIN) this.state.track.push(metrics.matchText)
          }
        }
      }
    }
    return modifiedSize
  }

  injectWorldInfo(sentences, injectedIds, modifiedSize, originalSize, injectLinear=false) {
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

    // Main positions itself towards the end of the context (last position in history found)
    // Mention, Heard and Seen position themselves towards the front of the context
    const indexedMetrics = {}
    if (injectLinear) {
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, [
        this.ENTRY_KEY_MAIN, this.ENTRY_KEY_HEARD, this.ENTRY_KEY_SEEN, this.ENTRY_KEY_TOPIC
      ])
    }
    else {
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, [this.ENTRY_KEY_MAIN])
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, [this.ENTRY_KEY_HEARD])
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, [this.ENTRY_KEY_SEEN])
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, [this.ENTRY_KEY_TOPIC])
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
  
  getEntryStats() {
    const displayStats = []
    if (this.state.entry.label) displayStats.push({ key: SC_LABEL.label, color: SC_COLOR.label, value: `${this.state.entry.label}\n` })
    if (this.state.entry.keys) displayStats.push({ key: SC_LABEL.keys, color: SC_COLOR.keys, value: `${this.state.entry.keys}\n` })
    if (this.state.entry.json[this.ENTRY_KEY_MAIN]) displayStats.push({ key: SC_LABEL.main, color: SC_COLOR.main, value: `${this.state.entry.json[this.ENTRY_KEY_MAIN]}\n` })
    if (this.state.entry.json[this.ENTRY_KEY_HEARD]) displayStats.push({ key: SC_LABEL.heard, color: SC_COLOR.heard, value: `${this.state.entry.json[this.ENTRY_KEY_HEARD]}\n` })
    if (this.state.entry.json[this.ENTRY_KEY_SEEN]) displayStats.push({ key: SC_LABEL.seen, color: SC_COLOR.seen, value: `${this.state.entry.json[this.ENTRY_KEY_SEEN]}\n` })
    if (this.state.entry.json[this.ENTRY_KEY_TOPIC]) displayStats.push({ key: SC_LABEL.topic, color: SC_COLOR.topic, value: `${this.state.entry.json[this.ENTRY_KEY_TOPIC]}\n` })
    return displayStats
  }

  getInfoStats() {
    const displayStats = []
    if (!this.isVisible()) return displayStats
    if (this.state.isMinimized) {
      if (this.state.context.focus) displayStats.push({ key: SC_LABEL.focus, color: SC_COLOR.focus, value: `${this.state.context.focus}\n` })
      if (this.state.track) displayStats.push({ key: SC_LABEL.track, color: SC_COLOR.track, value: `${this.state.track.join(", ")}\n` })
    }
    else {
      if (this.state.context.notes) displayStats.push({ key: SC_LABEL.notes, color: SC_COLOR.notes, value: `${this.state.context.notes}\n` })
      if (this.state.context.pov) displayStats.push({ key: SC_LABEL.pov, color: SC_COLOR.pov, value: `${this.state.context.pov}\n` })
      if (this.state.context.scene) displayStats.push({ key: SC_LABEL.scene, color: SC_COLOR.scene, value: `${this.state.context.scene}\n` })
      if (this.state.context.think) displayStats.push({ key: SC_LABEL.think, color: SC_COLOR.think, value: `${this.state.context.think}\n` })
      if (this.state.context.focus) displayStats.push({ key: SC_LABEL.focus, color: SC_COLOR.focus, value: `${this.state.context.focus}\n` })
      if (this.state.track) displayStats.push({ key: SC_LABEL.track, color: SC_COLOR.track, value: `${this.state.track.join(", ")}\n` })
    }
    return displayStats
  }

  updateHUD() {
    // Clear out Simple Context stats, keep stats from other mods
    const labels = Object.values(SC_LABEL)
    state.displayStats = state.displayStats.filter(s => !labels.includes(s.key))

    // Get correct stats to display
    const hudStats = this.state.entry.step ? this.getEntryStats() : this.getInfoStats()

    // Display stats
    state.displayStats = [...hudStats, ...state.displayStats]
  }

  updateEntryPrompt(promptText, hints=true) {
    const output = []
    if (hints && !this.state.isMinimized) output.push(`Hint: Type ${this.ENTRY_BACK} to go back, ${this.ENTRY_SKIP} to skip, ${this.ENTRY_SKIP_ALL} to skip all, ${this.ENTRY_DELETE} to delete and ${this.ENTRY_CANCEL} to cancel.\n\n`)
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
      this.state.entry.json = this.getEntry(this.state.entry.source.entry)
    }
    else {
      this.state.entry.json = {}
    }
  }

  setEntryJson(json, key, text) {
    if (text === this.ENTRY_SKIP) return
    if (json[key] && text === this.ENTRY_DELETE) delete json[key]
    else json[key] = text
  }

  entryConfirmStep() {
    this.state.entry.step = "Confirm"
    this.updateEntryPrompt(`${SC_LABEL.check} Are you happy with these changes? (y/n)`, false)
  }

  entryTopicStep() {
    this.state.entry.step = "Topic"
    this.updateEntryPrompt(`${SC_LABEL.topic} Enter entry to inject when TOPIC of conversation (optional):`)
  }

  entrySeenStep() {
    this.state.entry.step = "Seen"
    this.updateEntryPrompt(`${SC_LABEL.seen} Enter entry to inject when SEEN (optional):`)
  }

  entryHeardStep() {
    this.state.entry.step = "Heard"
    this.updateEntryPrompt(`${SC_LABEL.heard} Enter entry to inject when HEARD speaking (optional):`)
  }

  entryMainStep() {
    this.state.entry.step = "Main"
    this.updateEntryPrompt(`${SC_LABEL.main} Enter the MAIN entry to inject when keys found:`)
  }

  entryKeysStep() {
    this.state.entry.step = "Keys"
    this.updateEntryPrompt(`${SC_LABEL.keys} Enter the KEYS used to trigger entry injection:`)
  }

  entryLabelStep() {
    this.state.entry.step = "Label"
    this.updateEntryPrompt(`${SC_LABEL.label} Enter the LABEL used to refer to this entry: `)
  }

  entryExitHandler() {
    state.message = this.state.entry.previousMessage
    this.state.entry = {}
    this.updateHUD()
  }

  entryConfirmHandler(text) {
    if (text === this.ENTRY_BACK) return this.entryTopicStep()
    const confirmed = text.toLowerCase().startsWith("y")
    if (!confirmed) return this.entryExitHandler()
    const entry = JSON.stringify(this.state.entry.json)

    // Add new World Info
    if (!this.state.entry.source) {
      addWorldEntry(this.state.entry.keys, entry)
      const info = worldInfo.find(i => i.keys === this.state.entry.keys)
      this.setNameIndex(this.state.entry.label, info.id)
    }

    // Update existing World Info
    else {
      updateWorldEntry(this.state.entry.sourceIndex, this.state.entry.keys, entry)
      this.setNameIndex(this.state.entry.label, this.state.entry.source.id, this.state.entry.oldLabel)
    }

    // Reset everything back
    this.entryExitHandler()
  }

  entryTopicHandler(text) {
    // Set values accordingly
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    if (text === this.ENTRY_BACK) return this.entrySeenStep()
    this.setEntryJson(this.state.entry.json, this.ENTRY_KEY_TOPIC, text)

    // Proceed to next step
    this.entryConfirmStep()
  }

  entrySeenHandler(text) {
    // Set values accordingly
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    if (text === this.ENTRY_BACK) return this.entryHeardStep()
    this.setEntryJson(this.state.entry.json, this.ENTRY_KEY_SEEN, text)

    // Proceed to next step
    this.entryTopicStep()
  }

  entryHeardHandler(text) {
    // Set values accordingly
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    if (text === this.ENTRY_BACK) return this.entryMainStep()
    this.setEntryJson(this.state.entry.json, this.ENTRY_KEY_HEARD, text)

    // Proceed to next step
    this.entrySeenStep()
  }

  entryMainHandler(text) {
    // Detect skip all
    if (text === this.ENTRY_SKIP_ALL) {
      if (this.state.entry.source) return this.entryConfirmStep()
      else return this.entryMainStep()
    }

    // Detect back
    if (text === this.ENTRY_BACK) return this.entryKeysStep()

    // Set values accordingly
    if (!this.state.entry.source && text === this.ENTRY_SKIP) return this.entryMainStep()
    this.setEntryJson(this.state.entry.json, this.ENTRY_KEY_MAIN, text)

    // Proceed to next step
    this.entryHeardStep()
  }

  entryKeysHandler(text) {
    // Detect skip all
    if (text === this.ENTRY_SKIP_ALL) {
      if (this.state.entry.source) return this.entryConfirmStep()
      else return this.entryKeysStep()
    }

    // Detect back
    if (text === this.ENTRY_BACK) return this.entryLabelStep()

    // Handle skip
    if (text === this.ENTRY_SKIP) {
      if (this.state.entry.source) return this.entryMainStep()
      else return this.entryKeysStep()
    }

    // Detect conflicting/existing keys and display error
    const loweredText = text.toLowerCase()
    const existingIdx = worldInfo.findIndex(i => i.keys.toLowerCase() === loweredText)
    if (existingIdx !== -1 && existingIdx !== this.state.entry.sourceIndex) {
      if (!this.state.entry.source && this.getIndexByKey(text) === -1) {
        this.state.entry.sourceIndex = existingIdx
        this.setEntrySource()
      }
      else {
        return this.updateEntryPrompt(`${SC_LABEL.cross} ERROR! World Info with that key already exists, try again: `)
      }
    }

    // Ensure valid regex if regex key
    const keys = this.getKeys(text)
    if (!keys.length) return this.updateEntryPrompt(`${SC_LABEL.cross} ERROR! Invalid regex detected in keys, try again: `)

    // Update keys to regex format
    this.state.entry.keys = keys.map(k => k.toString()).join(", ")

    // Otherwise proceed to entry input
    this.entryMainStep()
  }

  entryLabelHandler(text) {
    // Detect skip
    if (text === this.ENTRY_SKIP_ALL) return this.entryConfirmStep()
    if (text === this.ENTRY_BACK) return this.entryLabelStep()
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
      else if (cmd === "min" || cmd === "max") this.state.isMinimized = (cmd === "min")
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

    // Used to keep track of how much modified context has been applied to prevent 85% lockout
    let modifiedSize = 0

    // Build author's note entry
    const noteEntry = this.getValidEntry(`Author's note: ${this.state.context.notes}`, modifiedSize, originalSize, true)
    if (noteEntry) modifiedSize = noteEntry.modifiedSize

    // Build pov entry
    const povEntry = this.getValidEntry(this.state.context.pov, modifiedSize, originalSize, true)
    if (povEntry) modifiedSize = povEntry.modifiedSize

    // Build scene entry
    const sceneEntry = this.getValidEntry(this.state.context.scene, modifiedSize, originalSize, true)
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

    // Inject pov entry
    if (povEntry) header.push(povEntry.text)

    // Inject author's note entry
    if (noteEntry) header.push(noteEntry.text)

    // Get the ids and size of all entries automatically injected by AID, determine new max length of context
    const reversedContext = context.split("\n")
    reversedContext.reverse()
    let { injectedIds, autoInjectedSize } = this.detectWorldInfo(reversedContext.join("\n"))
    const maxSize = info.maxChars - info.memoryLength - autoInjectedSize

    // Inject World Info into header
    const headerInject = this.injectWorldInfo(header, injectedIds, modifiedSize, originalSize, true)
    header = headerInject.sentences

    // Inject World Info into story
    const sentencesInject = this.injectWorldInfo(sentences, headerInject.injectedIds, headerInject.modifiedSize, originalSize)
    sentences = sentencesInject.sentences

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
