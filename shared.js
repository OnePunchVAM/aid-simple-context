/*
 * Configuration
 */
const SC_DEFAULT_DATA = {
  // Uncomment out the following lines to initialize the script with preset data
  // note: "A story about a hobbit.",
  // style: "detailed, playful",
  // genre: "fantasy",
  // rating: "T",
  // you: "John Smith",
  // scene: "You are an average joe.",
  // think: "You wonder if you can eat the clouds."
}

// Index World Info key and injection trigger labels
const SC_INDEX_KEY = "_index"
const SC_TRIGGER_MAIN = "main"
const SC_TRIGGER_SEEN = "seen"
const SC_TRIGGER_HEARD = "heard"
const SC_TRIGGER_TOPIC = "topic"

// HUD and UI labels and colors
const SC_LABEL = {
  // HUD
  notes: "✒️",
  pov: "🕹️",
  scene: "🎬",
  think: "💭",
  focus: "🧠",
  track: " ",
  // Entry UI
  label: "🏷️",
  keys: "🔍",
  [SC_TRIGGER_MAIN]: "📑",
  [SC_TRIGGER_SEEN]: "👁️",
  [SC_TRIGGER_HEARD]: "🎙️",
  [SC_TRIGGER_TOPIC]: "💬",
  // General UI
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
  [SC_TRIGGER_MAIN]: "steelblue",
  [SC_TRIGGER_SEEN]: "seagreen",
  [SC_TRIGGER_HEARD]: "seagreen",
  [SC_TRIGGER_TOPIC]: "seagreen"
}

// Commands used during entry update and creation
const SC_CMD = {
  BACK: "<",
  BACK_ALL: "<<",
  SKIP: ">",
  SKIP_ALL: ">>",
  CANCEL: "!",
  DELETE: "^",
  HINTS: "?"
}

// Determines total characters between each section, rounded by whole sentences.
const SC_SECTION_SIZES = {
  FOCUS: 150,
  THINK: 500,
  SCENE: 1000
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


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  sceneBreak = "\n\n--\n\n"
  controlList = ["enable", "disable", "show", "hide", "min", "max", "format", "reset", "debug"] // Plugin Controls
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
  missingFormatMatch = /^[^\[({<].*[^\])}>]$/g
  youReplacements = [
    ["you is", "you are"],
    ["you was", "you were"],
    [/([.!?]\s+)you /g, "$1You"]
  ]

  constructor() {
    this.commandList = this.controlList.concat(this.commandList)
    if (!state.simpleContextPlugin) state.simpleContextPlugin = {
      data: Object.assign({}, SC_DEFAULT_DATA),
      you: undefined,
      context: {},
      track: [],
      entry: {},
      isDebug: false,
      isHidden: false,
      isDisabled: false,
      isMinimized: false,
      isFormatted: true,
      isVerbose: true
    }
    this.state = state.simpleContextPlugin
    this.paragraphFormatterPlugin = new ParagraphFormatterPlugin()
    if (!state.displayStats) state.displayStats = []
    if (Object.keys(this.state.data).length) this.updateHUD()
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

  groupPush(groups, sentence, firstEntry, sceneBreak, totalSize) {
    if (firstEntry || (!sceneBreak && totalSize <= SC_SECTION_SIZES.FOCUS)) groups.focus.push(sentence)
    else if (!sceneBreak && totalSize <= SC_SECTION_SIZES.THINK) groups.think.push(sentence)
    else if (!sceneBreak && totalSize <= SC_SECTION_SIZES.SCENE) groups.scene.push(sentence)
    else if (!sceneBreak) groups.filler.push(sentence)
    else groups.history.push(sentence)
  }


  groupBySize(sentences) {
    const groups = { focus: [], think: [], scene: [], filler: [], history: [] }
    let totalSize = 0
    let firstEntry = true
    let prepSceneBreak = false
    let sceneBreak = false

    // Group sentences by character length boundaries
    for (let sentence of sentences) {
      totalSize += sentence.length

      // Check for scene break
      if (!sceneBreak && sentence.startsWith(this.sceneBreak)) {
        this.groupPush(groups, this.sceneBreak, firstEntry, true, totalSize)
        sentence = sentence.slice(this.sceneBreak.length)
        prepSceneBreak = true
      }

      // Check total size and place in correct array
      this.groupPush(groups, sentence, firstEntry, sceneBreak, totalSize)
      sceneBreak = prepSceneBreak
      firstEntry = false
    }
    return groups
  }

  getSentences(text) {
    let { modifiedText, enclosures } = this.replaceEnclosures(text)
    let sentences = modifiedText.match(this.sentenceMatch) || []
    return sentences.map(s => this.insertEnclosures(s, enclosures))
  }

  getKeysRegExp(keys) {
    let flags = "g"
    let brokenRegex = false
    let pattern = [...keys.matchAll(this.keyMatch)].map(match => {
      if (!match[1] && match[0].startsWith("/")) brokenRegex = true
      if (match[2]) flags = match[2].includes("g") ? match[2] : `g${match[2]}`
      return match[1] ? (match[1].includes("|") ? `(${match[1]})` : match[1]) : this.escapeRegExp(match[0].trim())
    })
    if (brokenRegex) return false
    return new RegExp(pattern.join("|"), flags)
  }

  getVanillaKeys(keys) {
    return [...keys.matchAll(this.keyMatch)].map(m => !m[1] && m[0]).filter(k => !!k)
  }

  getEntry(text) {
    let json = this.getJson(text)
    if (typeof json !== 'object' || Array.isArray(json) || !json[SC_TRIGGER_MAIN]) {
      json = {}
      json[SC_TRIGGER_MAIN] = text
    }
    return json
  }

  getValidEntry(text, modifiedSize, originalSize, replaceYou=true) {
    if (!text) return

    // Replace match for each key in World Info entry matching /you command with the string "you"
    if (replaceYou && this.state.you) {
      const key = this.getKeysRegExp(this.state.you.keys)
      if (key) {
        text = text.replace(key, "you")
        for (let [find, replace] of this.youReplacements) text = text.replace(find, replace)
      }
    }

    // Encapsulation of entry in brackets
    const match = text.match(this.missingFormatMatch)
    if (match) text = `<< ${this.toTitleCase(this.appendPeriod(text))}>>>>`

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
    const injectedEntries = []
    let autoInjectedSize = 0

    // Search through vanilla keys for matches in original context
    // These entries are auto injected by AID and their total size needs to be tracked
    for (let info of worldInfo) {
      const vanillaKeys = this.getVanillaKeys(info.keys)
      for (let key of vanillaKeys) {
        if (!originalLowered.includes(key.toLowerCase())) continue
        autoInjectedSize += info.entry.length
        injectedEntries.push({ id: info.id, label: key, matches: [SC_TRIGGER_MAIN] })
        break
      }
    }

    return { injectedEntries, autoInjectedSize }
  }

  processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, injectedEntries, triggers) {
    // Run through everything tagged for injection
    for (let metrics of infoMetrics) {
      // Keep track of what's injected so we don't inject twice!
      let injectedEntry = injectedEntries.find(e => e.id === metrics.id)
      if (!injectedEntry) {
        let label = this.getIndexLabel(metrics.id)
        if (!label) label = `(${metrics.matchText})`
        else if (this.state.isDebug) label = `${label} (${metrics.matchText})`
        injectedEntry = { id: metrics.id, label, matches: [] }
        injectedEntries.push(injectedEntry)
      }

      // Run through each entry type (ie, main, heard, seen, etc)
      for (let trigger of triggers) {
        // Skip if already injected
        if (injectedEntry.matches.includes(trigger)) continue

        // Determine placement of injection
        const count = metrics[trigger].length
        const idx = count > 0 ? (trigger === SC_TRIGGER_MAIN ? metrics[trigger][count - 1] : metrics[trigger][0]) : -1

        // Validate entry can be inserted
        if (idx > -1) {
          if (!indexedMetrics[idx]) indexedMetrics[idx] = []
          const validEntry = this.getValidEntry(metrics.entry[trigger], modifiedSize, originalSize)
          if (validEntry) {
            indexedMetrics[idx].push(validEntry.text)
            modifiedSize = validEntry.modifiedSize
            injectedEntry.matches.push(trigger)
          }
        }
      }
    }
    return modifiedSize
  }

  matchMetrics(metrics, text, idx) {
    const action = "[^\w](see|look|observe|watch|examine|describe|view|glance|glare|gaze|frown|ogle|stare)[^\w]"
    const pastAction = "[^\w](seen|shown|viewed|glimpsed|spotted)[^\w]"
    let updated = false

    // Track singular pronoun assignment (he, she her, him, his, hers, himself, herself, it)

    // Need to create mega-regex of all keys

    // refCount - determine if key matched at all
    let matches = [...text.matchAll(metrics.key)]
    if (!matches.length) return
    metrics[SC_TRIGGER_MAIN].push(idx)
    metrics.matchText = matches[0][0]
    updated = true

    // Get structured entry object, only perform matching if entry key's found
    const pattern = metrics.key.toString().split("/").slice(1, -1).join("/")

    // combination of match and specific lookup regex, ie (glance|look|observe).*(pattern)
    if (metrics.entry[SC_TRIGGER_SEEN]) {
      matches = [...text.matchAll(new RegExp(`${action}.*${pattern}|${pattern}.*${pastAction}`, metrics.key.flags))]
      if (matches.length) metrics[SC_TRIGGER_SEEN].push(idx)
    }

    // determine if match is owner of quotations, ie ".*".*(pattern)  or  (pattern).*".*"
    if (metrics.entry[SC_TRIGGER_HEARD]) {
      matches = [...text.matchAll(new RegExp(`${pattern}[^"]+"[^"]+"|"[^"]+"[^"]+${pattern}`, metrics.key.flags))]
      if (matches.length) metrics[SC_TRIGGER_HEARD].push(idx)
    }

    // match within quotations, ".*(pattern).*"
    if (metrics.entry[SC_TRIGGER_TOPIC]) {
      matches = [...text.matchAll(new RegExp(`"([^"]+)?${pattern}([^"]+)?"`, metrics.key.flags))]
      if (matches.length) metrics[SC_TRIGGER_TOPIC].push(idx)
    }

    return updated
  }

  injectWorldInfo(sentences, injectedEntries, modifiedSize, originalSize, injectLinear=false) {
    // Collect metric data on keys that match, including indexes of sentences where found
    const infoMetrics = []
    for (let idx = 0; idx < sentences.length; idx++) {
      for (const info of worldInfo) {
        // Load existing match data or create new
        const existing = infoMetrics.find(m => m.id === info.id)

        // Ensure valid key
        const key = this.getKeysRegExp(info.keys)
        if (!key) continue

        // Setup metrics object
        const metrics = existing || {
          id: info.id, matchText: "",
          entry: this.getEntry(info.entry),
          key: key,
          [SC_TRIGGER_MAIN]: [], [SC_TRIGGER_HEARD]: [],
          [SC_TRIGGER_SEEN]: [], [SC_TRIGGER_TOPIC]: []
        }

        // Get metrics associated with sentence
        if (!this.matchMetrics(metrics, sentences[idx], idx, injectedEntries)) continue

        // Update match data with new metrics
        if (!existing) infoMetrics.push(metrics)
      }
    }

    // Main positions itself towards the end of the context (last position in history found)
    // Mention, Heard and Seen position themselves towards the front of the context
    const indexedMetrics = {}
    if (injectLinear) {
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, injectedEntries, [
        SC_TRIGGER_MAIN, SC_TRIGGER_SEEN, SC_TRIGGER_HEARD, SC_TRIGGER_TOPIC
      ])
    }
    else {
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, injectedEntries, [SC_TRIGGER_MAIN])
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, injectedEntries, [SC_TRIGGER_SEEN])
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, injectedEntries, [SC_TRIGGER_HEARD])
      modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, injectedEntries, [SC_TRIGGER_TOPIC])
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

    return { sentences, modifiedSize }
  }
  
  getEntryStats() {
    const displayStats = []
    if (this.state.entry.label) displayStats.push({ key: SC_LABEL.label, color: SC_COLOR.label, value: `${this.state.entry.label}\n` })
    if (this.state.entry.keys) displayStats.push({ key: SC_LABEL.keys, color: SC_COLOR.keys, value: `${this.state.entry.keys}\n` })
    for (let trigger of [SC_TRIGGER_MAIN, SC_TRIGGER_HEARD, SC_TRIGGER_SEEN, SC_TRIGGER_TOPIC]) {
      if (this.state.entry.json[trigger]) displayStats.push({ key: SC_LABEL[trigger], color: SC_COLOR[trigger], value: `${this.state.entry.json[trigger]}\n` })
    }
    return displayStats
  }

  getInfoStats() {
    const displayStats = []
    if (!this.isVisible()) return displayStats
    if (this.state.track.length) displayStats.push({ key: SC_LABEL.track, color: SC_COLOR.track, value: `${this.state.track.join(" | ")} :\n` })
    const contextKeys = this.state.isMinimized ? ["think", "focus"] : ["notes", "pov", "scene", "think", "focus"]
    for (let key of contextKeys) {
      if (this.state.context[key]) displayStats.push({ key: SC_LABEL[key], color: SC_COLOR[key], value: `${this.state.context[key]}\n` })
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
    if (hints && !this.state.isVerbose) output.push(`Hint: Type ${SC_CMD.BACK_ALL} to go to start, ${SC_CMD.BACK} to go back, ${SC_CMD.SKIP} to skip, ${SC_CMD.SKIP_ALL} to skip all, ${SC_CMD.DELETE} to delete, ${SC_CMD.CANCEL} to cancel and ${SC_CMD.HINTS} to toggle hints.\n\n`)
    output.push(`${promptText}`)
    state.message = output.join("\n")
    this.updateHUD()
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

  matchInfo(text) {
    for (let info of worldInfo) {
      const key = this.getKeysRegExp(info.keys)
      if (!key) continue
      const matches = [...text.matchAll(key)]
      if (matches.length) return info
    }
  }

  getIndex() {
    const indexIdx = worldInfo.findIndex(i => i.keys === SC_INDEX_KEY)
    const indexInfo = indexIdx !== -1 && worldInfo[indexIdx]
    const indexJson = indexInfo ? JSON.parse(indexInfo.entry) : []
    return { indexIdx, indexInfo, indexJson }
  }

  getIndexLabel(id) {
    const { indexJson } = this.getIndex()
    const index = indexJson.find(i => i.id === id)
    return index && index.label
  }

  setIndex(id, label, oldLabel) {
    const { indexIdx, indexInfo, indexJson } = this.getIndex()

    // Add index if not found
    if (!indexJson.find(e => e.id === id)) indexJson.push({ id, label })

    // Attempt to delete old label if found
    if (oldLabel) {
      const oldIdx = indexJson.findIndex(i => i.label === oldLabel)
      if (oldIdx !== -1) delete indexJson[oldIdx]
    }

    // Add or update world info index
    if (indexInfo) updateWorldEntry(indexIdx, SC_INDEX_KEY, JSON.stringify(indexJson))
    else addWorldEntry(SC_INDEX_KEY, JSON.stringify(indexJson))
  }

  getEntryIndexByIndexLabel(label) {
    const { indexJson } = this.getIndex()
    const index = indexJson.find(i => i.label === label)
    return index ? worldInfo.findIndex(i => i.id === index.id) : -1
  }

  getEntryIndexByKeys(keys) {
    const { indexJson } = this.getIndex()
    const ids = indexJson.map(i => i.id)
    return worldInfo.findIndex(i => i.keys === keys && ids.includes(i.id))
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
    if (json[key] && text === SC_CMD.DELETE) delete json[key]
    else json[key] = text
  }

  entryConfirmStep() {
    this.state.entry.step = "Confirm"
    this.updateEntryPrompt(`${SC_LABEL.check} Are you happy with these changes? (y/n)`, false)
  }

  entryTopicStep() {
    this.state.entry.step = "Topic"
    this.updateEntryPrompt(`${SC_LABEL[SC_TRIGGER_TOPIC]} Enter entry to inject when TOPIC of conversation (optional):`)
  }

  entrySeenStep() {
    this.state.entry.step = "Seen"
    this.updateEntryPrompt(`${SC_LABEL[SC_TRIGGER_SEEN]} Enter entry to inject when SEEN (optional):`)
  }

  entryHeardStep() {
    this.state.entry.step = "Heard"
    this.updateEntryPrompt(`${SC_LABEL[SC_TRIGGER_HEARD]} Enter entry to inject when HEARD (optional):`)
  }

  entryMainStep() {
    this.state.entry.step = "Main"
    this.updateEntryPrompt(`${SC_LABEL[SC_TRIGGER_MAIN]} Enter the MAIN entry to inject when keys found:`)
  }

  entryKeysStep() {
    this.state.entry.step = "Keys"
    this.updateEntryPrompt(`${SC_LABEL.keys} Enter the KEYS used to trigger entry injection:`)
  }

  entryLabelStep() {
    this.state.entry.step = "Label"
    this.updateEntryPrompt(`${SC_LABEL.label} Enter the LABEL used to refer to this entry: `)
  }

  entryIsValid() {
    return this.state.entry.json[SC_TRIGGER_MAIN] && this.state.entry.keys
  }

  entryExitHandler() {
    state.message = this.state.entry.previousMessage
    this.state.entry = {}
    this.updateHUD()
  }

  entryConfirmHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if ([SC_CMD.SKIP, SC_CMD.SKIP_ALL, SC_CMD.DELETE].includes(text)) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryTopicStep()
    if (!text.toLowerCase().startsWith("y")) return this.entryExitHandler()

    // Add new World Info
    const entry = JSON.stringify(this.state.entry.json)
    if (!this.state.entry.source) {
      addWorldEntry(this.state.entry.keys, entry)
      const info = worldInfo.find(i => i.keys === this.state.entry.keys)
      this.setIndex(info.id, this.state.entry.label)
    }
    // Update existing World Info
    else {
      updateWorldEntry(this.state.entry.sourceIndex, this.state.entry.keys, entry)
      this.setIndex(this.state.entry.source.id, this.state.entry.label, this.state.entry.oldLabel)
    }

    // Update preloaded info
    if (this.state.data.you) this.state.you = this.matchInfo(this.state.data.you)

    // Reset everything back
    this.entryExitHandler()
  }

  entryTopicHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entrySeenStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(this.state.entry.json, SC_TRIGGER_TOPIC, text)
    this.entryConfirmStep()
  }

  entrySeenHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryHeardStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(this.state.entry.json, SC_TRIGGER_SEEN, text)
    this.entryTopicStep()
  }

  entryHeardHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryMainStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(this.state.entry.json, SC_TRIGGER_HEARD, text)
    this.entrySeenStep()
  }

  entryMainHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (this.state.entry.source || this.entryIsValid()) return this.entryConfirmStep()
      else return this.entryMainStep()
    }
    if (text === SC_CMD.BACK) return this.entryKeysStep()
    if (text === SC_CMD.SKIP) {
      if (this.state.entry.source || this.state.entry.json[SC_TRIGGER_MAIN]) return this.entryHeardStep()
      else return this.entryMainStep()
    }
    this.setEntryJson(this.state.entry.json, SC_TRIGGER_MAIN, text)
    this.entryHeardStep()
  }

  entryKeysHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (this.state.entry.source || this.entryIsValid()) return this.entryConfirmStep()
      else return this.entryKeysStep()
    }
    if (text === SC_CMD.BACK) return this.entryLabelStep()
    if (text === SC_CMD.SKIP) {
      if (this.state.entry.source || this.state.entry.keys) return this.entryMainStep()
      else return this.entryKeysStep()
    }

    // Detect conflicting/existing keys and display error
    const loweredText = text.toLowerCase()
    const existingIdx = worldInfo.findIndex(i => i.keys.toLowerCase() === loweredText)
    if (existingIdx !== -1 && existingIdx !== this.state.entry.sourceIndex) {
      if (!this.state.entry.source && this.getEntryIndexByKeys(text) === -1) {
        this.state.entry.sourceIndex = existingIdx
        this.setEntrySource()
      }
      else {
        return this.updateEntryPrompt(`${SC_LABEL.cross} ERROR! World Info with that key already exists, try again: `)
      }
    }

    // Ensure valid regex if regex key
    const key = this.getKeysRegExp(text)
    if (!key) return this.updateEntryPrompt(`${SC_LABEL.cross} ERROR! Invalid regex detected in keys, try again: `)

    // Update keys to regex format
    this.state.entry.keys = key.toString()

    // Otherwise proceed to entry input
    this.entryMainStep()
  }

  entryLabelHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryLabelStep()
    if (text !== SC_CMD.SKIP) {
      if (this.state.entry.source) this.state.entry.oldLabel = this.state.entry.label
      this.state.entry.label = text
    }
    this.entryKeysStep()
  }

  entryHandler(text) {
    const modifiedText = text.slice(1)

    // Hints toggling
    if (modifiedText === SC_CMD.HINTS) {
      this.state.isVerbose = !this.state.isVerbose
      const stepString = `entry${this.state.entry.step}Step`
      if (typeof this[stepString] === 'function') this[stepString]()
      else this.entryExitHandler()
      return ""
    }

    // Already processing input
    if (this.state.entry.step) {
      const handlerString = `entry${this.state.entry.step}Handler`
      if (modifiedText === SC_CMD.CANCEL) this.entryExitHandler()
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

    // Ensure entry label is passed
    const params = match.length > 1 && match[2] && match[2].trim()
    if (!params) return ""

    // Setup index and preload entry if found
    this.state.entry.label = params
    this.state.entry.sourceIndex = this.getEntryIndexByIndexLabel(this.state.entry.label)
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
      else if (cmd === "format") this.state.isFormatted = !this.state.isFormatted
      else if (cmd === "reset") {
        this.state.context = {}
        this.state.data = {}
      }
      this.updateHUD()
      return
    } else {
      // If value passed assign it to the data store, otherwise delete it (ie, `/you`)
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
    if (this.state.data.you) {
      this.state.you = this.matchInfo(this.state.data.you)
      pov.push(`You are ${this.appendPeriod(this.state.data.you)}`)
    }
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
   * Input Modifier
   * - Takes new command and refreshes context and HUD (if visible and enabled)
   * - Updates when valid command is entered into the prompt (ie, `/you John Smith`)
   * - Can clear state by executing the command without any arguments (ie, `/you`)
   * - Paragraph formatting is applied
   * - Scene break detection
   */
  inputModifier(text) {
    let modifiedText = this.entryHandler(text)

    // Check if no input (ie, prompt AI)
    if (!modifiedText) return modifiedText

    // Detection for multi-line commands, filter out double ups of newlines
    modifiedText = text.split("\n").map(l => this.commandHandler(l)).join("\n")

    // Cleanup for commands
    if (["\n", "\n\n"].includes(modifiedText)) modifiedText = ""

    // Paragraph formatting
    if (this.state.isFormatted) modifiedText = this.paragraphFormatterPlugin.inputModifier(modifiedText)

    return modifiedText
  }

  /*
   * Context Modifier
   * - Removes excess newlines so the AI keeps on track
   * - Takes existing set state and dynamically injects it into the context
   * - Is responsible for injecting custom World Info entries, including regex matching of keys where applicable
   * - Keeps track of the amount of modified context and ensures it does not exceed the 85% rule
   *   while injecting as much as possible
   * - Scene break detection
   */
  contextModifier(text) {
    if (this.state.isDisabled || !text) return text;

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
    const noteEntry = this.getValidEntry(`Author's note: ${this.state.context.notes}`, modifiedSize, originalSize)
    if (noteEntry) modifiedSize = noteEntry.modifiedSize

    // Build pov entry
    const povEntry = this.getValidEntry(this.state.context.pov, modifiedSize, originalSize, false)
    if (povEntry) modifiedSize = povEntry.modifiedSize

    // Build scene entry
    const sceneEntry = this.getValidEntry(this.state.context.scene, modifiedSize, originalSize)
    if (sceneEntry) modifiedSize = sceneEntry.modifiedSize

    // Build think entry
    const thinkEntry = this.getValidEntry(this.state.context.think, modifiedSize, originalSize)
    if (thinkEntry) modifiedSize = thinkEntry.modifiedSize

    // Build focus entry
    const focusEntry = this.getValidEntry(this.state.context.focus, modifiedSize, originalSize)
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
    const { injectedEntries, autoInjectedSize } = this.detectWorldInfo(reversedContext.join("\n"))
    const maxSize = info.maxChars - info.memoryLength - autoInjectedSize

    // Inject World Info into header
    const headerInject = this.injectWorldInfo(header, injectedEntries, modifiedSize, originalSize, true)
    header = headerInject.sentences

    // Inject World Info into story
    const sentencesInject = this.injectWorldInfo(sentences, injectedEntries, headerInject.modifiedSize, originalSize)
    sentences = sentencesInject.sentences

    // Setup tracking information
    this.state.track = injectedEntries.map(e => {
      const injectedEmojis = e.matches.filter(p => p !== SC_TRIGGER_MAIN).map(p => SC_LABEL[p]).join("")
      return `${e.label}${injectedEmojis ? " " + injectedEmojis : ""}`
    })

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

  /*
   * Output Modifier
   * - Handles paragraph formatting.
   */
  outputModifier(text) {
    let modifiedText = text

    // Paragraph formatting
    if (this.state.isFormatted) modifiedText = this.paragraphFormatterPlugin.outputModifier(modifiedText)

    return modifiedText
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
