// List of control commands
const controlList = ["debug", "enable", "disable", "show", "hide"] // Controls

// List of all valid commands
const commandList = controlList.concat([
  "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Story
  "you", "at", "with", "time", "desc", // Scene
  "focus" // Focus
])

// Command matching for prompt
const commandMatch = /^\n?\/(\w+)( .*)?$/

// Helper functions
const appendPeriod = (content) => !content.endsWith(".") ? content + "." : content
const removePeriod = (content) => content.endsWith(".") ? content.slice(0, -1) : content
const toTitleCase = (content) => content.charAt(0).toUpperCase() + content.slice(1)


/*
 * State Controller
 * - Takes new state <key, value> pair and refreshes context and HUD (if visible and enabled)
 * - Updates when valid command is entered into the prompt (ie, `/name John Smith`)
 * - Can clear state by executing the command without any arguments (ie, `/name`)
 */
const update = (key, value) => {
  if (!state.data) state.data = {}
  if (!state.context) state.context = {}

  // Detect for Controls, handle state and perform actions (ie, hide HUD)
  if (controlList.indexOf(key) !== -1) {
    if (key === "debug") state.isDebug = !state.isDebug
    else if (key === "enable" || key === "disable") state.isDisabled = (key === "disable")
    else if (key === "show" || key === "hide") state.isHidden = (key === "hide")
    if (state.isDebug) {
      state.message = "Enter something into the prompt to start debugging the context.."
      return
    }
    if (key === "hide" || key === "disable") {
      delete state.message
      return
    }
  } else {
    // If value passed assign it to the data store, otherwise delete it (ie, `/name`)
    if (value) state.data[key] = value.trim()
    else delete state.data[key]
  }

  // Story - Author's Notes, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
  const story = []
  delete state.context.story
  if (state.data.note) story.push(`Author's Note: ${appendPeriod(state.data.note)}`)
  if (state.data.title) story.push(`Title: ${appendPeriod(state.data.title)}`)
  if (state.data.author) story.push(`Author: ${appendPeriod(state.data.author)}`)
  if (state.data.genre) story.push(`Genre: ${appendPeriod(state.data.genre)}`)
  if (state.data.setting) story.push(`Setting: ${appendPeriod(state.data.setting)}`)
  if (state.data.theme) story.push(`Theme: ${appendPeriod(state.data.theme)}`)
  if (state.data.subject) story.push(`Subject: ${appendPeriod(state.data.subject)}`)
  if (state.data.style) story.push(`Writing Style: ${appendPeriod(state.data.style)}`)
  if (state.data.rating) story.push(`Rating: ${appendPeriod(state.data.rating)}`)
  if (story.length) state.context.story = story.join(" ")

  // Scene - Name, location, present company, time and scene description
  const scene = []
  delete state.context.scene
  if (state.data.you) scene.push(`You are ${appendPeriod(state.data.you)}`)
  if (state.data.at && state.data.with) scene.push(`You are at ${removePeriod(state.data.at)} with ${appendPeriod(state.data.with)}`)
  else if (state.data.at) scene.push(`You are at ${appendPeriod(state.data.at)}`)
  else if (state.data.with) scene.push(`You are with ${appendPeriod(state.data.with)}`)
  if (state.data.time) scene.push(`It is ${appendPeriod(state.data.time)}`)
  if (state.data.desc) scene.push(toTitleCase(appendPeriod(state.data.desc)))
  if (scene.length) state.context.scene = scene.join(" ")

  // Focus - This input is pushed to the front of context
  delete state.context.focus
  if (state.data.focus) state.context.focus = toTitleCase(appendPeriod(state.data.focus))

  // If debug return - HUD control is assumed by contextModifier
  if (state.isDebug) return

  // If disabled or hidden, delete HUD and return
  if (state.isDisabled || state.isHidden) {
    delete state.message;
    return
  }

  // Display HUD
  const hud = []
  if (state.context.story) hud.push(state.context.story)
  if (state.context.scene) hud.push(state.context.scene)
  if (state.context.focus) hud.push(state.context.focus)
  state.message = hud.join("\n")
}