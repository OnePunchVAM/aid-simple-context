/*
 * WorldInfo Tracking Plugin
 */
class WorldInfoTrackingPlugin {
  STAT_TEMPLATE = { key: "World Info", color: "goldenrod" }

  contextModifier(text) {
    const frontLines = (state.memory.frontMemory || "").split("\n")
    const lines = frontLines.concat(text.split("\n"))

    // Go through each world info entry and check to see
    // if it can be found within the context provided
    const injectedInfo = worldInfo.filter(info => {
      for (let line of lines) if (line === info.entry) return true
    })

    // Get the first key for each entry detected and display
    // Detect EWIJSON and display full key
    const trackedKeys = injectedInfo.map(i => i.keys.includes("#") ? i.keys : i.keys.split(",")[0].trim())
    this.displayStat(trackedKeys.join(", "))

    // Return untouched context
    return text
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
const trackingPlugin = new WorldInfoTrackingPlugin()


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  controlList = ["enable", "disable", "show", "hide", "reset", "debug"] // Plugin Controls
  commandList = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Story
    "you", "at", "with", "time", "desc", // Scene
    "focus" // Focus
  ]
  commandMatch = /^\n?\/(\w+)( .*)?$/

  constructor() {
    this.commandList = this.controlList.concat(this.commandList)
    // Setup plugin state/scope
    if (!state.simpleContext) {
      state.simpleContext = {
        isDebug: false,
        isHidden: false,
        isDisabled: false,
        shuffleContext: false,
        data: {},
        context: {}
      }
    }
    this.state = state.simpleContext
    if (!state.displayStats) state.displayStats = []
  }

  inputModifier(text) {
    // Check if no input (ie, prompt AI)
    if (!text) {
      this.state.shuffleContext = true
      return text
    }

    // Check if a command was inputted
    const match = this.commandMatch.exec(text)
    if (!match || match.length <= 1) return text

    // Check if the command was valid
    const cmd = match[1].toLowerCase()
    const data = match.length > 2 && match[2] ? match[2].trim() : ""
    if (!this.commandList.includes(cmd)) return text

    // Update state and HUD
    this.execCommand(cmd, data)
    return ""
  }

  contextModifier(text) {
    const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ""
    const context = info.memoryLength ? text.slice(info.memoryLength) : text
    const newContext = this.injectContext(context).slice(-(info.maxChars - info.memoryLength))
    return [contextMemory, newContext].join("")
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

  /*
   * Returns: false, if new modified context exceeds 85% limit.
   * Where:
   *   originalSize is the length of the original, unmodified text.
   *   entrySize is the length of the world entry being inserted.
   *   totalSize is the total modfied size so far.
   */
  validEntrySize(originalSize, entrySize, totalSize) {
    if (originalSize === 0) return false
    const modifiedPercent = (totalSize + entrySize) / originalSize
    return modifiedPercent < 0.84
  }

  /*
   * Input Handler
   * - Takes new state <key, value> pair and refreshes context and HUD (if visible and enabled)
   * - Updates when valid command is entered into the prompt (ie, `/name John Smith`)
   * - Can clear state by executing the command without any arguments (ie, `/name`)
   */
  execCommand(cmd, value) {
    // Detect for Controls, handle state and perform actions (ie, hide HUD)
    if (this.controlList.includes(cmd)) {
      if (cmd === "debug") this.state.isDebug = !this.state.isDebug
      else if (cmd === "enable" || cmd === "disable") this.state.isDisabled = (cmd === "disable")
      else if (cmd === "show" || cmd === "hide") this.state.isHidden = (cmd === "hide")
      if (this.isVisible() && this.state.isDebug) {
        state.message = "Enter something into the prompt to start debugging the context.."
        return
      }
      if (cmd === "hide" || cmd === "disable") {
        delete state.message
        return
      }
      if (cmd === "reset") this.state.data = {}
    } else {
      // If value passed assign it to the data store, otherwise delete it (ie, `/name`)
      if (value) this.state.data[cmd] = value.trim()
      else delete this.state.data[cmd]
    }

    // Story - Author's Notes, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
    const story = []
    delete this.state.context.story
    if (this.state.data.note) story.push(`Author's Note: ${this.appendPeriod(this.state.data.note)}`)
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
    if (this.state.data.you) {
      scene.push(`You are ${this.appendPeriod(this.state.data.you)}`)
      const you = worldInfo.find(info => info.keys.split(",").map(key => key.trim()).includes(this.state.data.you))
      if (you) this.state.you = you
    }
    if (this.state.data.at && this.state.data.with) scene.push(`You are at ${this.removePeriod(this.state.data.at)} with ${this.appendPeriod(this.state.data.with)}`)
    else if (this.state.data.at) scene.push(`You are at ${this.appendPeriod(this.state.data.at)}`)
    else if (this.state.data.with) scene.push(`You are with ${this.appendPeriod(this.state.data.with)}`)
    if (this.state.data.time) scene.push(`It is ${this.appendPeriod(this.state.data.time)}`)
    if (this.state.data.desc) scene.push(this.toTitleCase(this.appendPeriod(this.state.data.desc)))
    if (scene.length) this.state.context.scene = scene.join(" ")

    // Focus - This input is pushed to the front of context
    delete this.state.context.focus
    if (this.state.data.focus) this.state.context.focus = this.toTitleCase(this.appendPeriod(this.state.data.focus))

    // If debug return - HUD control is assumed by contextModifier
    if (this.state.isDebug) return

    // Display HUD
    if (this.isVisible()) {
      const hud = []
      if (this.state.context.story) hud.push(this.state.context.story)
      if (this.state.context.scene) hud.push(this.state.context.scene)
      if (this.state.context.focus) hud.push(this.state.context.focus)
      state.message = hud.join("\n")
    }
  }

  /*
   * Context Injector
   * - Takes existing set state and dynamically injects it into the context
   * - Is responsible for injecting custom World Info entries and tracking them in the HUD
   * - Keeps track of the amount of modified context and ensures it does not exceed the 85% rule
   *   while injecting as much as possible
   */
  injectContext(context) {
    if (this.state.isDisabled) return;

    let totalSize = 0
    const originalSize = context.length
    const combinedState = (this.state.context.story || "") + (this.state.context.scene || "") + (this.state.context.focus || "")
    const lines = context.split("\n").filter(line => !!line)

    // Insert focus
    if (this.state.context.focus) {
      const entry = `[ ${this.state.context.focus}]`
      if (this.validEntrySize(originalSize, entry.length, totalSize)) {
        if (lines.length <= 1 || this.state.shuffleContext) lines.push(entry)
        else lines.splice(-1, 0, entry)
        totalSize += entry.length
      }
    }

    // Build header
    const header = []
    const headerPos = this.state.shuffleContext ? 9 : 8

    // Build character and scene information
    if (this.state.context.scene) {
      const entry = `[ ${this.state.context.scene}]`
      if (this.validEntrySize(originalSize, entry.length, totalSize)) {
        header.push(entry)
        totalSize += entry.length
      }
    }

    // Build author's note
    if (this.state.context.story) {
      const entry = `[ ${this.state.context.story}]`
      if (this.validEntrySize(originalSize, entry.length, totalSize)) {
        header.push(entry)
        totalSize += entry.length
      }
    }

    // Load your character world info first
    if (this.state.you && !context.includes(this.state.you.entry) &&
      this.validEntrySize(originalSize, this.state.you.entry.length, totalSize)) {

      header.push(this.state.you.entry)
      totalSize += this.state.you.entry.length
    }

    // Build world info entries by matching keys to combinedState
    for (let info of worldInfo) {
      const keys = info.keys.split(",")
        .map(key => key.trim())
        .filter(key => (!this.state.data.you || key !== this.state.data.you))

      for (let key of keys) {
        // Already loaded
        if (context.includes(info.entry)) break
        // See if combinedState has matching key
        else if (combinedState.includes(key)) {
          if (this.validEntrySize(originalSize, info.entry.length, totalSize)) {
            header.push(info.entry)
            totalSize += info.entry.length
          }
          break
        }
      }
    }

    // Insert header
    if (lines.length <= headerPos) for (let line of header) lines.unshift(line)
    else {
      header.reverse()
      for (let line of header) lines.splice((headerPos * -1), 0, line)
    }

    // Recreate context
    const modifiedContext = lines.join("\n")

    // Debug override
    if (this.state.isDebug) state.message = modifiedContext

    return modifiedContext
  }
}
const simpleContext = new SimpleContextPlugin()