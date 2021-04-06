/*
 * Simple Context (v2.0.0-alpha)
 */

/* global info, state, worldInfo, addWorldEntry, updateWorldEntry, removeWorldEntry */


/*
 * START SECTION - Configuration
 *
 * Various configuration that can be set to change the look and feel of the script, along
 * with determining the shortcuts used to control the menus and the placement of injected
 * context blocks.
 *
 * This section is intended to be modified for user preference.
 */

// Preset information for first the first time a scenario is loaded
const SC_DEFAULT_DATA = {
  note: "",
  title: "",
  author: "",
  genre: "",
  setting: "",
  theme: "",
  subject: "",
  style: "",
  rating: "",
  you: "",
  at: "",
  nearby: "",
  scene: "",
  think: "",
  focus: ""
}

// Control over UI element visibility and placement (TRACK, NOTES, POV, SCENE, THINK, FOCUS)
const SC_UI_ARRANGEMENT = {
  MAXIMIZED: ["POV/TRACK", "NOTES", "SCENE", "THINK", "FOCUS"],
  MINIMIZED: ["TRACK", "THINK", "FOCUS"],
  HIDDEN: ["TRACK"]
}

// Control over UI icons and labels
const SC_UI_ICON = {
  // Tracking Labels
  TRACK_MAIN: "✔️ ",
  TRACK_OTHER: "⭕ ",
  TRACK_EXTENDED: "🔗 ",

  // Main HUD Labels
  TRACK: " ",
  POV: "🎭 ",
  NOTES: "✒️ ",
  SCENE: "🎬 ",
  THINK: "💭 ",
  FOCUS: "🧠 ",

  // Entity Labels
  LABEL: "🔖 ",
  KEYS: "🔍 ",
  MAIN: "📑 ",
  SEEN: "👁️ ",
  HEARD: "🔉 ",
  TOPIC: "💬 ",

  // Relationship Labels
  CONTACTS: "👋 ",
  CHILDREN: "🧸 ",
  PARENTS: "🤱 ",
  PROPERTY: "💰 ",
  OWNERS: "🙏 ",

  // Injected Icons
  INJECTED_SEEN: "👁️",
  INJECTED_HEARD: "🔉",
  INJECTED_TOPIC: "💬",

  // Relationship Disposition: 1-5
  HATE: "🤬",
  DISLIKE: "😒",
  NEUTRAL: "😐",
  LIKE: "😀",
  LOVE: "🤩",

  // Relationship Modifier: +-x
  MORE: "👍",
  LESS: "👎",
  EX: "💥",

  // Relationship Type: FLAME
  FRIENDS: "🤝",
  LOVERS: "💞",
  ALLIES: "✊",
  MARRIED: "💍",
  ENEMIES: "🥊",

  // Character Pronoun Icons
  YOU: "🕹️",
  HER: "🎗️",
  HIM: "➰",

  // Entity Type Icons
  CHARACTER: "🧬",
  LOCATION: "🗺️",
  FACTION: "👑",
  THING: "💎",
  OTHER: "❔",

  // Character can have relationships
  // Location has many areas, location has layout to traverse areas, each area is a WI, can have owner, can have faction ownership
  // Faction has many roles, each role is subordinate to a role above, top role is faction leader
  // Thing can have location/area, can have owner, can have faction ownership
  // Other generic entry

  // General Icons
  CONFIRM: "✔️",
  SUCCESS: "🎉",
  INFO: "💡",
  SEARCH: "🔍",
  WARNING: "⚠️",
  ERROR: "💥",
  SEPARATOR: "  ∙∙ ",
  SELECTED: "🔅 ",
  EMPTY: "❔",
  BREAK: "〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️"
}

// Control over UI colors
const SC_UI_COLOR = {
  // Tracking UI
  TRACK: "chocolate",
  TRACK_MAIN: "chocolate",
  TRACK_EXTENDED: "slategrey",
  TRACK_OTHER: "brown",

  // Story UI
  NOTES: "slategrey",
  POV: "dimgrey",
  SCENE: "steelblue",
  THINK: "seagreen",
  FOCUS: "indianred",

  // Relationship UI
  CONTACTS: "seagreen",
  CHILDREN: "steelblue",
  PARENTS: "steelblue",
  PROPERTY: "dimgrey",
  OWNERS: "dimgrey",

  // Entry UI,
  TYPE: "steelblue",
  LABEL: "indianred",
  KEYS: "seagreen",
  MAIN: "steelblue",
  SEEN: "slategrey",
  HEARD: "slategrey",
  TOPIC: "slategrey"
}

// Control over page titles
const SC_UI_PAGE = { ENTRY: "entry", RELATIONS: "relationships", STRUCTURE: "structure" }

// Shortcut commands used to navigate the entry, family and contacts UI
const SC_SHORTCUT = {
  BACK: "<", BACK_ALL: "<<", PREV_PAGE: "<<<", SKIP: ">", SKIP_ALL: ">>", NEXT_PAGE: ">>>",
  CANCEL: "!", DELETE: "^", NEW: "@", HINTS: "?"
}

// Determines context placement by character count from the front of context (rounds to full sentences)
const SC_CONTEXT_PLACEMENT = { FOCUS: 150, THINK: 500, SCENE: 1000 }

// Determines amount of relationship context to inject (measured in character length)
const SC_REL_SIZE_LIMIT = 800

// Minimum distance weight to insert main entry and relationships
const SC_METRIC_DISTANCE_THRESHOLD = 0.6

// Determines plural noun to use to describe a relation between two entities
const SC_REL_JOIN_TEXT = { PEOPLE: "relationships", LIKE: "likes", HATE: "hates" }

/*
 * END SECTION - Configuration
 */


/*
 * START SECTION - Hardcoded Settings - DO NOT EDIT THIS SECTION OR YOU WILL BREAK THE SCRIPT!
 *
 * DISPOSITION
 *  1 hate
 *  2 dislike
 *  3 neutral
 *  4 like
 *  5 love
 *
 * MODIFIER
 *  x ex
 *
 * TYPE
 *  F friends/extended family
 *  L lovers
 *  A allies
 *  M married
 *  E enemies
 *
 * [1-5][x][FLAME]
 *
 * eg: Jill [1] Jack [4F], Mary [2xL], John [3A]
 *
 */
const SC_SECTION = { FOCUS: "focus", THINK: "think", SCENE: "scene", POV: "pov", NOTES: "notes" }
const SC_ENTRY = { CHARACTER: "CHARACTER", FACTION: "FACTION", LOCATION: "LOCATION", THING: "THING", OTHER: "OTHER" }
const SC_PRONOUN = { YOU: "YOU", HIM: "HIM", HER: "HER", UNKNOWN: "UNKNOWN" }
const SC_DATA = {
  LABEL: "label", TYPE: "type", PRONOUN: "pronoun", MAIN: "main", SEEN: "seen", HEARD: "heard", TOPIC: "topic",
  CONTACTS: "contacts", CHILDREN: "children", PARENTS: "parents", PROPERTY: "property", OWNERS: "owners"
}
const SC_SCOPE = { CONTACTS: "contacts", CHILDREN: "children", PARENTS: "parents", PROPERTY: "property",
  OWNERS: "owners", SIBLINGS: "siblings", GRANDPARENTS: "grandparents", GRANDCHILDREN: "grandchildren",
  PARENTS_SIBLINGS: "parents_siblings", SIBLINGS_CHILDREN: "siblings_children"
}
const SC_SCOPE_OPP = { CONTACTS: "contacts", CHILDREN: "parents", PARENTS: "children", PROPERTY: "owners", OWNERS: "property" }

const SC_DISP = { HATE: 1, DISLIKE: 2, NEUTRAL: 3, LIKE: 4, LOVE: 5 }
const SC_TYPE = { FRIENDS: "F", LOVERS: "L", ALLIES: "A", MARRIED: "M", ENEMIES: "E" }
const SC_MOD = { LESS: "-", EX: "x", MORE: "+" }

const SC_ENTRY_ALL_KEYS = [ SC_DATA.MAIN, SC_DATA.SEEN, SC_DATA.HEARD, SC_DATA.TOPIC ]
const SC_ENTRY_CHARACTER_KEYS = [ SC_DATA.MAIN, SC_DATA.SEEN, SC_DATA.HEARD, SC_DATA.TOPIC ]
const SC_ENTRY_FACTION_KEYS = [ SC_DATA.MAIN, SC_DATA.TOPIC ]
const SC_ENTRY_LOCATION_KEYS = [ SC_DATA.MAIN, SC_DATA.SEEN, SC_DATA.TOPIC ]
const SC_ENTRY_THING_KEYS = [ SC_DATA.MAIN, SC_DATA.SEEN, SC_DATA.TOPIC ]
const SC_ENTRY_OTHER_KEYS = [ SC_DATA.MAIN, SC_DATA.SEEN, SC_DATA.HEARD, SC_DATA.TOPIC ]

const SC_REL_ALL_KEYS = [ SC_DATA.CONTACTS, SC_DATA.CHILDREN, SC_DATA.PARENTS, SC_DATA.PROPERTY, SC_DATA.OWNERS ]
const SC_REL_CHARACTER_KEYS = [ SC_DATA.CONTACTS, SC_DATA.CHILDREN, SC_DATA.PARENTS, SC_DATA.PROPERTY, SC_DATA.OWNERS ]
const SC_REL_FACTION_KEYS = [ SC_DATA.CONTACTS, SC_DATA.PROPERTY, SC_DATA.OWNERS ]
const SC_REL_LOCATION_KEYS = [ SC_DATA.OWNERS ]
const SC_REL_THING_KEYS = [ SC_DATA.OWNERS ]
const SC_REL_OTHER_KEYS = [ SC_DATA.OWNERS ]

const SC_REL_DISP_REV = Object.assign({}, ...Object.entries(SC_DISP).map(([a,b]) => ({ [`${b}`]: a })))
const SC_REL_TYPE_REV = Object.assign({}, ...Object.entries(SC_TYPE).map(([a,b]) => ({ [b]: a })))
const SC_REL_MOD_REV = Object.assign({}, ...Object.entries(SC_MOD).map(([a,b]) => ({ [b]: a })))
const SC_REL_FLAG_DEFAULT = `${SC_DISP.NEUTRAL}`

const SC_RE = {
  // Matches against the MAIN entry for automatic pronoun detection
  FEMALE: /(^|[^\w])(♀|female|woman|lady|girl|gal|chick|mum|mom|mother|daughter)([^\w]|$)/gi,
  MALE: /(^|[^\w])(♂|male|man|gentleman|boy|guy|lad|dude|dad|father|son)([^\w]|$)/gi,

  // Matches against sentences to detect whether to inject the SEEN entry
  LOOK_AHEAD: /describ|display|examin|expos|eye|frown|gaz|glanc|glar|glimps|imagin|leer|look|notic|observ|ogl|peek|see|smil|spot|star(e|ing)|view|vision|watch/gi,
  LOOK_BEHIND: /appear|body|describ|display|examin|expos|fac|hand|glimps|notic|observ|ogl|seen|spotted|sprawl|view|vision|watch|wear/gi,

  // Internally used regex for everything else
  INPUT_CMD: /^> You say "\/(\w+)\s?(.*)?"$|^> You \/(\w+)\s?(.*)?[.]$|^\/(\w+)\s?(.*)?$/,
  WI_REGEX_KEYS: /.?\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)|[^,]+/g,
  BROKEN_ENCLOSURE: /(")([^\w])(")|(')([^\w])(')|(\[)([^\w])(])|(\()([^\w])(\))|({)([^\w])(})|(<)([^\w])(>)/g,
  ENCLOSURE: /([^\w])("[^"]+")([^\w])|([^\w])('[^']+')([^\w])|([^\w])(\[[^]]+])([^\w])|([^\w])(\([^)]+\))([^\w])|([^\w])({[^}]+})([^\w])|([^\w])(<[^<]+>)([^\w])/g,
  SENTENCE: /([^!?.]+[!?.]+[\s]+?)|([^!?.]+[!?.]+$)|([^!?.]+$)/g,
  ESCAPE_REGEX: /[.*+?^${}()|[\]\\]/g,
  MISSING_FORMAT: /^[^\[({<].*[^\])}>]$/g,
  REL_KEYS: /([^,:]+)(:([1-5][FLAME]?[+\-x]?))|([^,]+)/gi,
  
  // Helper function for large patterns
  fromArray: (pattern, flags="g") => new RegExp(`${Array.isArray(pattern) ? pattern.join("|") : pattern}`, flags)
}
const SC_RE_STRINGS = {
  PLURAL: "(?:es|s|'s|e's)?",
  INFLECTED: "(?:ing|ed|ate|es|s|'s|e's)?",
  HER: "\\b(she|her(self|s)?)\\b",
  HIM: "\\b(he|him(self)?|his)\\b",
  YOU: "\\b(you(r|rself)?)\\b"
}
/*
 * END SECTION - Hardcoded Settings
 */


/*
 * START SECTION - Relationship Mapping Rules
 *
 * These rules determine which relationship titles get generated and mapped to entities found in context.
 * This section is intended to be modified for custom relationship dynamics.
 */
const SC_REL_MAPPING_RULES = [
  { title: "", match: "", source: "", target: "", scope: "", pronoun: "", disp: "", type: "", mod: ""},

  {
    title: "mother",
    match: /mother|m[uo]m(m[ya])?/,
    scope: SC_SCOPE.PARENTS,
    pronoun: SC_PRONOUN.HER
  },
  {
    title: "father",
    match: /father|dad(dy|die)?|pa(pa)?/,
    scope: SC_SCOPE.PARENTS,
    pronoun: SC_PRONOUN.HIM
  },
  {
    title: "daughter",
    scope: SC_SCOPE.CHILDREN,
    pronoun: SC_PRONOUN.HER
  },
  {
    title: "son",
    scope: SC_SCOPE.CHILDREN,
    pronoun: SC_PRONOUN.HIM
  },
  {
    title: "sister",
    match: /sis(ter)?/,
    scope: SC_SCOPE.SIBLINGS,
    pronoun: SC_PRONOUN.HER
  },
  {
    title: "brother",
    match: /bro(ther)?/,
    scope: SC_SCOPE.SIBLINGS,
    pronoun: SC_PRONOUN.HIM
  },
  {
    title: "niece",
    scope: SC_SCOPE.SIBLINGS_CHILDREN,
    pronoun: SC_PRONOUN.HER
  },
  {
    title: "nephew",
    scope: SC_SCOPE.SIBLINGS_CHILDREN,
    pronoun: SC_PRONOUN.HIM
  },
  {
    title: "aunt",
    scope: SC_SCOPE.PARENTS_SIBLINGS,
    pronoun: SC_PRONOUN.HER
  },
  {
    title: "uncle",
    scope: SC_SCOPE.PARENTS_SIBLINGS,
    pronoun: SC_PRONOUN.HIM
  },
  {
    title: "grandmother",
    match: /gran(dmother|dma|ny)/,
    scope: SC_SCOPE.GRANDPARENTS,
    pronoun: SC_PRONOUN.HER
  },
  {
    title: "grandfather",
    match: /grand(father|pa|dad)/,
    scope: SC_SCOPE.GRANDPARENTS,
    pronoun: SC_PRONOUN.HIM
  },
  {
    title: "granddaughter",
    scope: SC_SCOPE.GRANDCHILDREN,
    pronoun: SC_PRONOUN.HER
  },
  {
    title: "grandson",
    scope: SC_SCOPE.GRANDCHILDREN,
    pronoun: SC_PRONOUN.HIM
  },
  {
    title: "wife",
    pronoun: SC_PRONOUN.HER,
    type: SC_TYPE.MARRIED,
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "ex wife",
    pronoun: SC_PRONOUN.HER,
    type: SC_TYPE.MARRIED,
    mod: SC_MOD.EX
  },
  {
    title: "husband",
    pronoun: SC_PRONOUN.HIM,
    type: SC_TYPE.MARRIED,
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "ex husband",
    pronoun: SC_PRONOUN.HIM,
    type: SC_TYPE.MARRIED,
    mod: SC_MOD.EX
  },
  {
    title: "lover",
    type: SC_TYPE.LOVERS,
    disp: [SC_DISP.LIKE, SC_DISP.NEUTRAL, SC_DISP.DISLIKE, SC_DISP.HATE],
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "ex lover",
    type: SC_TYPE.LOVERS,
    disp: [SC_DISP.LIKE, SC_DISP.NEUTRAL, SC_DISP.DISLIKE, SC_DISP.HATE],
    mod: SC_MOD.EX
  },
  {
    title: "girlfriend",
    pronoun: SC_PRONOUN.HER,
    type: SC_TYPE.LOVERS,
    disp: SC_DISP.LOVE,
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "ex girlfriend",
    pronoun: SC_PRONOUN.HER,
    type: SC_TYPE.LOVERS,
    disp: SC_DISP.LOVE,
    mod: SC_MOD.EX
  },
  {
    title: "boyfriend",
    pronoun: SC_PRONOUN.HIM,
    type: SC_TYPE.LOVERS,
    disp: SC_DISP.LOVE,
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "ex boyfriend",
    pronoun: SC_PRONOUN.HIM,
    type: SC_TYPE.LOVERS,
    disp: SC_DISP.LOVE,
    mod: SC_MOD.EX
  },
  {
    title: "friend",
    type: SC_TYPE.FRIENDS,
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "ex friend",
    type: SC_TYPE.FRIENDS,
    mod: SC_MOD.EX
  },
  {
    title: "enemy",
    type: SC_TYPE.ENEMIES,
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "ally",
    type: SC_TYPE.ALLIES,
    mod: [SC_MOD.MORE, SC_MOD.LESS]
  },
  {
    title: "slave",
    source: SC_ENTRY.CHARACTER,
    target: SC_ENTRY.CHARACTER,
    scope: SC_SCOPE.PROPERTY
  },
  {
    title: "master",
    source: SC_ENTRY.CHARACTER,
    target: SC_ENTRY.CHARACTER,
    scope: SC_SCOPE.OWNERS
  },
]
/*
 * END SECTION - Relationship Mapping Rules
 */


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
  controlCommands = ["enable", "disable", "show", "hide", "min", "max", "spacing", "reset", "debug"] // Plugin Controls
  contextCommands = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Notes
    "you", "at", "nearby", // PoV
    "scene", // Scene
    "think", // Think
    "focus" // Focus
  ]
  entryCommands = ["entry", "e"]
  findCommands = ["find", "f"]
  youReplacements = [
    ["you is", "you are"],
    ["you was", "you were"],
    ["you has", "you have"],
    [/(^|[^.][.!?]\s+)you /g, "$1You "]
  ]
  memoryLength
  maxChars

  constructor() {
    // All state variables scoped to state.simpleContextPlugin
    // for compatibility with other plugins
    if (!state.simpleContextPlugin) state.simpleContextPlugin = {
      data: Object.assign({}, SC_DEFAULT_DATA || {}),
      sections: {},
      you: {},
      context: this.getContextTemplate(),
      creator: {},
      lastMessage: "",
      exitCreator: false,
      isDebug: false,
      isHidden: false,
      isDisabled: false,
      isMinimized: false,
      isSpaced: true,
      showHints: true
    }
    this.state = state.simpleContextPlugin

    // Create master lists of commands
    this.commands = [...this.controlCommands, ...this.contextCommands]
    this.creatorCommands = [...this.entryCommands, ...this.findCommands]

    // Setup external plugins
    this.paragraphFormatterPlugin = new ParagraphFormatterPlugin()

    // Initialize displayStats if not already done
    if (!state.displayStats) state.displayStats = []

    // Clear messages that are no longer required
    if (this.state.lastMessage && state.message) {
      state.message = state.message.replace(this.state.lastMessage, "")
      this.state.lastMessage = ""
    }
    
    // Tracking of modified context length to prevent 85% lockout
    this.originalSize = 0
    this.modifiedSize = 0

    // Check exit creator flag and do next turn exiting
    if (this.state.exitCreator) {
      this.entryExit(false)
      this.state.exitCreator = false
    }

    // Cache expanded world info
    this.loadWorldInfo()
  }

  loadWorldInfo() {
    // Various cached copies of world info entries for fast access
    this.worldInfo = []
    this.worldInfoByKeys = {}
    this.worldInfoByLabel = {}
    this.worldInfoByType = Object.keys(SC_ENTRY).reduce((a, c) => Object.assign(a, {[c]: []}), {})
    this.worldInfoIcons = {}
    
    // Main loop over worldInfo creating new entry objects with padded data
    for (let i = 0, l = worldInfo.length; i < l; i++) {
      const info = worldInfo[i]
      const data = this.getEntryJson(info.entry)
      data.pronoun = (data.pronoun && data.pronoun.toUpperCase()) || SC_PRONOUN.UNKNOWN
      data.type = (data.type && data.type.toUpperCase()) || ""
      const regex = this.getEntryRegex(info.keys)
      const pattern = this.getRegexPattern(regex)
      const entry = Object.assign({ idx: i, regex, pattern, data }, info)
      this.worldInfoByKeys[info.keys] = entry
      if (!info.keys.startsWith("/") || !data.label) continue
      this.worldInfo.push(entry)
      this.worldInfoByLabel[data.label] = entry
      if (data.type) this.worldInfoByType[data.type].push(entry)
      if (data.icon) this.worldInfoIcons[data.icon] = true
    }

    // Keep track of all icons so that we can clear display stats properly
    this.worldInfoIcons = Object.keys(this.worldInfoIcons)
  }

  getEntryJson(text) {
    let json
    try { json = JSON.parse(text) }
    catch (e) {}

    if (typeof json !== 'object' || Array.isArray(json) || !json[SC_DATA.MAIN]) {
      json = {}
      json[SC_DATA.MAIN] = text
    }

    return json
  }

  getEntryRegex(text) {
    let flags = "g"
    let brokenRegex = false
    let pattern = [...text.matchAll(SC_RE.WI_REGEX_KEYS)].map(match => {
      if (!match[1] && match[0].startsWith("/")) brokenRegex = true
      if (match[2]) flags = match[2].includes("g") ? match[2] : `g${match[2]}`
      return match[1] ? (match[1].includes("|") ? `(${match[1]})` : match[1]) : this.getEscapedRegex(match[0].trim())
    })
    if (brokenRegex) return
    return new RegExp(pattern.join("|"), flags)
  }

  getEscapedRegex(text) {
    return text.replace(SC_RE.ESCAPE_REGEX, '\\$&'); // $& means the whole matched string
  }

  getRegexPattern(regex) {
    return regex.toString().split("/").slice(1, -1).join("/")
  }

  getSentences(text) {
    // Add temporary space to each end of the string for matching start and end enclosures
    let modifiedText = ` ${text} `

    // Fix enclosures with less than 2 characters between them
    modifiedText = modifiedText.replace(SC_RE.BROKEN_ENCLOSURE, "$1$2@$3")

    // Insert all enclosures found into an array and replace existing text with a reference to it's index
    let enclosures = []
    modifiedText = modifiedText.replace(SC_RE.ENCLOSURE, (_, prefix, match, suffix) => {
      if (!prefix || !match || !suffix) return _
      enclosures.push(match)
      return `${prefix === "@" ? "" : prefix}{${enclosures.length - 1}}${suffix}`
    })

    // Remove temporary space at start and end
    modifiedText = modifiedText.slice(1, -1)

    // Split into sentences and insert enclosures to return
    let sentences = modifiedText.match(SC_RE.SENTENCE) || []
    return sentences.map(s => enclosures.reduce((a, c, i) => a.replace(`{${i}}`, c), s))
  }

  getInfoMatch(text) {
    // WARNING: Only use this sparingly!
    // Currently in use for entry lookup on the `/you Jack` command
    for (let i = 0, l = this.worldInfo.length; i < l; i++) {
      const entry = this.worldInfo[i]
      const matches = [...text.matchAll(entry.regex)]
      if (matches.length) return entry
    }
  }

  getPronoun(text) {
    if (!text) return SC_PRONOUN.UNKNOWN
    if (!text.includes(":")) text = text.split(".")[0]
    return text.match(SC_RE.FEMALE) ? SC_PRONOUN.HER : (text.match(SC_RE.MALE) ? SC_PRONOUN.HIM : SC_PRONOUN.UNKNOWN)
  }

  getWeight(score, goal) {
    return score !== 0 ? ((score <= goal ? score : goal) / goal) : 0
  }

  getRelFlag(disp, type="", mod="") {
    if (disp > 5 || disp < 1) disp = 3
    return this.getRelFlagByText(`${disp}${type || ""}${mod || ""}`)
  }

  getRelFlagByText(text) {
    text = text.toString().toUpperCase().slice(0, 3)
    if (text.length === 2 && text[1] === "x") text = text.slice(0, -1)
    const disp = Number(text[0])
    const type = text.length >= 2 ? text[1].toUpperCase() : ""
    const mod = text.length >= 3 ? text[2].toLowerCase() : ""
    return { disp, mod, type, text: `${disp}${type}${mod}` }
  }

  getRelFlagWeights(rel) {
    const { disp, type, mod } = rel.flag

    // Determine score based on relationship disposition
    const dispScore = [SC_DISP.LOVE, SC_DISP.HATE].includes(disp) ? 1 : ([SC_DISP.LIKE, SC_DISP.DISLIKE].includes(disp) ?  0.5 : 0.1)

    // Score based on relationship type
    let typeScore
    if ([SC_TYPE.MARRIED, SC_TYPE.LOVERS].includes(type)) typeScore = 0.8
    else if (type === SC_TYPE.FRIENDS) typeScore = 0.6
    else typeScore = 0.4

    if (mod === SC_MOD.EX) typeScore /= 2.5
    else if (mod === SC_MOD.LESS) typeScore /= 1.25
    else if (mod === SC_MOD.MORE) typeScore *= 1.25

    return { disp: dispScore, type: typeScore }
  }

  getRelKeys(scope, data, within) {
    const text = data && (within ? data[within] : data[scope])
    if (!text) return []

    const entry = this.worldInfoByLabel[data.label]

    const labels = []
    return [...text.matchAll(SC_RE.REL_KEYS)]
      // Remove invalid keys
      .map(m => m.filter(k => !!k))
      // Get relationship object
      .map(m => this.getRelTemplate(scope, entry.data.type, m[1].split(":")[0].trim(), m.length >= 3 ? m[3] : SC_REL_FLAG_DEFAULT))
      // Remove duplicates
      .reduce((result, rel) => {
        if (!labels.includes(rel.label)) {
          labels.push(rel.label)
          result.push(rel)
        }
        return result
      }, [])
  }

  getRelAllKeys(data) {
    return SC_REL_ALL_KEYS.reduce((result, scope) => result.concat(data[scope] ? this.getRelKeys(scope, data) : []), [])
  }

  getRelText(rel) {
    return `${rel.label}${rel.flag.text !== SC_REL_FLAG_DEFAULT ? `:${rel.flag.text}` : ""}`
  }

  getRelCombinedText(relationships) {
    return relationships.map(rel => this.getRelText(rel)).join(", ")
  }

  getRelExpKeys(data) {
    let relationships = this.getRelAllKeys(data)
    if (!relationships.length) return []

    // Get immediate family to cross reference
    const family = [
      ...this.getRelKeys(SC_DATA.CHILDREN, data),
      ...this.getRelKeys(SC_DATA.PARENTS, data)
    ].map(r => r.label)

    // Get expanded relationships, relationship flag with contact flag if found
    relationships = relationships.reduce((result, rel) => this.reduceRelations(result, rel, data, family), [])

    // Overwrite expanded relationship flag with contact flag if found
    return relationships.reduce((result, rel) => {
      if (rel.label === data.label) return result
      const existing = relationships.find(r => r.scope === SC_SCOPE.CONTACTS && r.label === rel.label)
      if (existing) rel.flag = existing.flag
      result.push(rel)
      return result
    }, [])
  }

  getRelAdjusted(text, data, scope) {
    if (!data) return []
    if (text.startsWith(SC_SHORTCUT.DELETE)) {
      const removeRel = this.getRelKeys(scope, {label: data.label, [scope]: text.slice(1)}).map(r => r.label)
      return this.getRelKeys(scope, data).filter(r => !removeRel.includes(r.label))
    }
    return this.getRelKeys(scope, { label: data.label, [scope]: data[scope] ? `${text}, ${data[scope]}` : text })
  }

  getRelMatches(rel, pronoun) {
    return SC_REL_MAPPING_RULES.reduce((result, rule) => {
      if (!rule.title) return result

      const ruleScope = rule.scope && (Array.isArray(rule.scope) ? (rule.scope.length && rule.scope) : [rule.scope])
      const rulePronoun = rule.pronoun && (Array.isArray(rule.pronoun) ? (rule.pronoun.length && rule.pronoun) : [rule.pronoun])
      const ruleDisp = rule.disp && (Array.isArray(rule.disp) ? (rule.disp.length && rule.disp) : [rule.disp])
      const ruleMod = rule.mod && (Array.isArray(rule.mod) ? (rule.mod.length && rule.mod) : [rule.mod])
      const ruleType = rule.type && (Array.isArray(rule.type) ? (rule.type.length && rule.type) : [rule.type])
      const ruleSource = rule.source && (Array.isArray(rule.source) ? (rule.source.length && rule.source) : [rule.source])
      const ruleTarget = rule.target && (Array.isArray(rule.target) ? (rule.target.length && rule.target) : [rule.target])

      if ((!ruleScope || ruleScope.includes(rel.scope)) && (!rulePronoun || rulePronoun.includes(rel.pronoun)) &&
        (!ruleDisp || ruleDisp.includes(rel.flag.disp)) && (!ruleMod || ruleMod.includes(rel.flag.mod)) &&
        (!ruleType || ruleType.includes(rel.flag.type)) && (!ruleSource || ruleSource.includes(rel.source)) &&
        (!ruleTarget || ruleTarget.includes(rel.target))) {

        result.push({ pronoun, title: rule.title, pattern: `(${rule.match ? this.getRegexPattern(rule.match) : rule.title})` })
      }

      return result
    }, [])
  }

  getRelMapping(entry) {
    return this.getRelExpKeys(entry.data).reduce((result, rel) => {
      if (!this.worldInfoByLabel[rel.label]) return result

      for (let match of this.getRelMatches(rel)) {
        const existing = result.find(m => m.title === match.title)
        const mapping = existing || Object.assign({ targets: [] }, match)
        mapping.targets.push(rel.label)
        if (!existing) result.push(mapping)
      }

      return result
    }, [])
  }

  getRelTemplate(scope, sourceType, label, flagText) {
    let flag = typeof flagText === "object" ? flagText : this.getRelFlagByText(flagText)
    const existing = this.worldInfoByLabel[label] && this.worldInfoByLabel[label].data
    if (existing && ![SC_ENTRY.CHARACTER, SC_ENTRY.FACTION].includes(existing.type)) {
      flag.type = ""
      if (flag.mod === SC_MOD.EX) flag.mod = ""
      flag = this.getRelFlag(flag.disp, flag.type, flag.mod)
    }
    return { label, source: sourceType, target: existing ? existing.type : SC_ENTRY.OTHER, scope, pronoun: existing ? existing.pronoun : SC_PRONOUN.UNKNOWN, flag }
  }

  getContextTemplate(text) {
    return {
      // Extrapolated matches and relationship data
      sizes: {}, metrics: [], candidates: [], relations: [], tree: {}, injected: [],
      // Grouped sentences by section
      header: [], sentences: [], history: [],
      // Original text stored for parsing outside of contextModifier
      text: text || ""
    }
  }

  getFormattedEntry(text, insertNewlineBefore=false, insertNewlineAfter=false, replaceYou=true) {
    if (!text) return

    // You replacement
    if (replaceYou) text = this.replaceYou(text)

    // Encapsulation of entry in brackets
    const match = text.match(SC_RE.MISSING_FORMAT)
    if (match) text = `<< ${this.toTitleCase(this.appendPeriod(text))}>>>>`

    // Final forms
    text = `${insertNewlineBefore ? "\n" : ""}${text}${insertNewlineAfter ? "\n" : ""}`

    return text
  }

  isValidEntrySize(text) {
    return (text && this.originalSize !== 0) ? (((this.modifiedSize + text.length) / this.originalSize) < 0.85) : false
  }

  isValidTreeSize(tree) {
    const relations = Object.keys(tree).reduce((a, c) => a.concat(JSON.stringify([{[c]: tree[c]}])), [])
    const text = `\n${relations.join("\n")}\n`
    return text.length <= SC_REL_SIZE_LIMIT && this.isValidEntrySize(text)
  }

  reduceRelations(result, rel, data, family=[]) {
    result.push(rel)
    const entry = this.worldInfoByLabel[rel.label]
    if (!entry || data.label === rel.label) return result

    // Grandparents/Siblings
    if (rel.scope === SC_SCOPE.PARENTS) {
      result = result.concat([
        ...this.getRelKeys(SC_SCOPE.GRANDPARENTS, entry.data),
        ...this.getRelKeys(SC_SCOPE.SIBLINGS, entry.data)
      ].reduce((result, rel) => this.reduceRelations(result, rel, data, family), []))
    }

    // Grandchildren
    else if (rel.scope === SC_SCOPE.CHILDREN) {
      result = result.concat(this.getRelKeys(SC_SCOPE.GRANDCHILDREN, entry.data, SC_DATA.CHILDREN)
        .reduce((result, rel) => this.reduceRelations(result, rel, data, family), []))
    }

    // Aunts/Uncles
    else if (rel.scope === SC_SCOPE.GRANDPARENTS) {
      result = result.concat(this.getRelKeys(SC_SCOPE.PARENTS_SIBLINGS, entry.data, SC_DATA.CHILDREN)
        .reduce((result, rel) => family.includes(rel.label) ? result : this.reduceRelations(result, rel, data, family), []))
    }

    // Nieces/Nephews
    else if (rel.scope === SC_SCOPE.SIBLINGS) {
      result = result.concat(this.getRelKeys(SC_SCOPE.SIBLINGS_CHILDREN, entry.data, SC_DATA.CHILDREN)
        .reduce((result, rel) => this.reduceRelations(result, rel, data, family), []))
    }

    return result
  }

  excludeRelations(relationships, data, scope) {
    if (!data[scope]) return relationships
    const targetRelLabels = this.getRelKeys(scope, data).map(r => r.label)
    return relationships.filter(r => !targetRelLabels.includes(r.label))
  }

  exclusiveRelations(relationships, data, scope) {
    if (!data[scope]) return false
    const relLabels = relationships.map(r => r.label)
    const targetRel = this.getRelKeys(scope, data).filter(r => !relLabels.includes(r.label))
    const targetText = this.getRelCombinedText(targetRel)
    if (data[scope] === targetText) return false
    data[scope] = targetText
    return true
  }

  syncEntry(entry) {
    // WARNING: Does full check of World Info. Only use this sparingly!
    // Currently used to get all World Info that references `entry`
    const processedLabels = []

    // Updated associations after an entries relations is changed
    for (let rel of this.getRelAllKeys(entry.data)) {
      const targetEntry = this.worldInfoByLabel[rel.label]
      if (!targetEntry) continue

      // Save for later
      processedLabels.push(targetEntry.data.label)

      // Determine the reverse scope of the relationship
      const revScope = SC_SCOPE_OPP[rel.scope.toUpperCase()]
      if (!targetEntry.data[revScope]) targetEntry.data[revScope] = ""

      // Attempt to find existing relationship
      let targetKeys = this.getRelKeys(revScope, targetEntry.data)
      const foundSelf = targetKeys.find(r => r.label === entry.data.label)

      // Reciprocal entry found, sync relationship flags
      if (foundSelf) {
        if (foundSelf.flag.mod === rel.flag.mod && foundSelf.flag.type === rel.flag.type) continue
        const mod = rel.flag.mod === SC_MOD.EX ? rel.flag.mod : (foundSelf.flag.mod === SC_MOD.EX ? "" : foundSelf.flag.mod)
        foundSelf.flag = this.getRelFlag(foundSelf.flag.disp, rel.flag.type, mod)
      }

      // No reciprocal entry found, create new entry
      else {
        const flag = this.getRelFlag(rel.flag.disp, rel.flag.type, rel.flag.mod === SC_MOD.EX ? rel.flag.mod : "")
        targetKeys.push(this.getRelTemplate(revScope, targetEntry.data.type, entry.data.label, flag))

        // Ensure entry label isn't in other scopes
        for (let scope of SC_REL_ALL_KEYS.filter(k => k !== revScope)) {
          this.exclusiveRelations([{label: entry.data.label}], targetEntry.data, scope)
        }
      }

      // Create final text, remove if empty and update World Info
      targetEntry.data[revScope] = this.getRelCombinedText(targetKeys)
      if (!targetEntry.data[revScope]) delete targetEntry.data[revScope]
      updateWorldEntry(targetEntry.idx, targetEntry.keys, JSON.stringify(targetEntry.data))
    }

    for (let i = 0, l = this.worldInfo.length; i < l; i++) {
      const checkEntry = this.worldInfo[i]
      if (checkEntry.id === entry.id || processedLabels.includes(checkEntry.data.label)) continue

      let update = false
      for (let scope of SC_REL_ALL_KEYS) {
        const rel = this.getRelKeys(scope, checkEntry.data)
        const modifiedRel = rel.filter(r => r.label !== entry.data.label && r.scope === scope)

        if (rel.length !== modifiedRel.length) {
          checkEntry.data[scope] = this.getRelCombinedText(modifiedRel)
          if (!checkEntry.data[scope]) delete checkEntry.data[scope]
          update = true
        }
      }

      if (update) {
        updateWorldEntry(checkEntry.idx, checkEntry.keys, JSON.stringify(checkEntry.data))
      }
    }
  }

  appendPeriod(content) {
    if (!content) return ""
    return !content.match(/[.!?]$/) ? content + "." : content
  }

  toTitleCase(content) {
    return content.charAt(0).toUpperCase() + content.slice(1)
  }

  replaceYou(text) {
    const { you } = this.state
    if (!you.id) return text

    // Match contents of /you and if found replace with the text "you"
    const youMatch = SC_RE.fromArray(`\\b${you.data.label}${SC_RE_STRINGS.PLURAL}\\b`, "gi")
    if (text.match(youMatch)) {
      text = text.replace(youMatch, "you")
      for (let [find, replace] of this.youReplacements) text = text.replace(find, replace)
    }

    return text
  }

  messageOnce(text) {
    if (!text.startsWith("\n")) text = `\n${text}`
    if (!state.message) state.message = ""
    state.message += text
    this.state.lastMessage = text
  }


  /*
   * CONTEXT MODIFIER
   * - Removes excess newlines so the AI keeps on track
   * - Takes existing set state and dynamically injects it into the context
   * - Is responsible for injecting custom World Info entries, including regex matching of keys where applicable
   * - Keeps track of the amount of modified context and ensures it does not exceed the 85% rule
   *   while injecting as much as possible
   * - Scene break detection
   */
  contextModifier(text) {
    if (this.state.isDisabled || !text) return text;
    this.parseContext(text)
    return this.getModifiedContext()
  }

  parseContext(context) {
    // Store new context if one was passed
    if (context) this.state.context.text = context

    // Split into sectioned sentences, inject custom context information (author's note, pov, scene, think, focus)
    this.splitContext()

    // Match world info found in context including dynamic expanded pronouns
    this.gatherMetrics()

    // Determine relationship tree of matched entries
    this.mapRelations()

    // Get relationship tree that respects limit and 85% context rule
    this.mapRelationsTree()

    // Determine injection candidates from metrics
    this.determineCandidates()

    // Inject all matched world info and relationship data (keeping within 85% cutoff)
    this.injectCandidates()

    // Truncate by full sentence to ensure context is within max length (info.maxChars - info.memoryLength)
    this.truncateContext()

    // Display HUD
    this.displayHUD()

    // Display debug output
    this.displayDebug()
  }

  splitContext() {
    const { sections } = this.state
    const { text } = this.state.context
    this.originalSize = text.length

    const context = info.memoryLength ? text.slice(info.memoryLength) : text
    const injectedItems = []
    let sceneBreak = false
    let charCount = 0

    // Split on scene break
    const split = this.getSentences(context).reduceRight((result, sentence) => {
      if (!sceneBreak && sentence.startsWith(this.sceneBreak)) {
        result.sentences.unshift(sentence.slice(this.sceneBreak.length))
        result.history.unshift(this.sceneBreak)
        sceneBreak = true
      }
      else if (sceneBreak) result.history.unshift(sentence)
      else result.sentences.unshift(sentence)
      return result
    }, this.getContextTemplate(text))

    // Build author's note entry
    const noteEntry = this.getFormattedEntry(sections.notes)
    if (this.isValidEntrySize(noteEntry)) {
      split.header.push(noteEntry)
      this.modifiedSize += noteEntry.length
    }

    // Build pov entry
    const povEntry = this.getFormattedEntry(sections.pov, true, true, false)
    if (this.isValidEntrySize(povEntry)) {
      split.header.push(povEntry)
      this.modifiedSize += povEntry.length
    }

    // Do sentence injections (scene, think, focus)
    split.sentences = split.sentences.reduceRight((result, sentence, idx) => {
      charCount += sentence.length
      result.unshift(sentence)

      // Determine whether to put newlines before or after injection
      const insertNewlineBefore = idx !== 0 ? !split.sentences[idx - 1].endsWith("\n") : false
      const insertNewlineAfter = !sentence.startsWith("\n")

      // Build focus entry
      if (charCount > SC_CONTEXT_PLACEMENT.FOCUS && !injectedItems.includes(SC_SECTION.FOCUS)) {
        injectedItems.push(SC_SECTION.FOCUS)
        const focusEntry = this.getFormattedEntry(sections.focus, insertNewlineBefore, insertNewlineAfter)
        if (this.isValidEntrySize(focusEntry)) {
          result.unshift(focusEntry)
          this.modifiedSize += noteEntry.length
        }
      }

      // Build think entry
      else if (charCount > SC_CONTEXT_PLACEMENT.THINK && !injectedItems.includes(SC_SECTION.THINK)) {
        injectedItems.push(SC_SECTION.THINK)
        const thinkEntry = this.getFormattedEntry(sections.think, insertNewlineBefore, insertNewlineAfter)
        if (this.isValidEntrySize(thinkEntry)) {
          result.unshift(thinkEntry)
          this.modifiedSize += noteEntry.length
        }
      }

      // Build scene entry
      else if (charCount > SC_CONTEXT_PLACEMENT.SCENE && !injectedItems.includes(SC_SECTION.SCENE)) {
        injectedItems.push(SC_SECTION.SCENE)
        const sceneEntry = this.getFormattedEntry(sections.scene, insertNewlineBefore, insertNewlineAfter)
        if (this.isValidEntrySize(sceneEntry)) {
          result.unshift(sceneEntry)
          this.modifiedSize += noteEntry.length
        }
      }

      return result
    }, [])

    this.state.context = split
  }

  gatherMetrics() {
    // WARNING: Only use this sparingly!
    // Currently used to parse all the context for world info matches
    const { context } = this.state
    const cache = { pronouns: {}, relationships: {}, parsed: {}, entries: [], history: [] }

    // Cache only world entries that are applicable
    for (let i = 0, l = this.worldInfo.length; i < l; i++) {
      const entry = this.worldInfo[i]
      const text = [...context.header, ...context.sentences].join("")
      const regex = SC_RE.fromArray(`\\b${entry.pattern}${SC_RE_STRINGS.PLURAL}\\b`, entry.regex.flags)
      const matches = [...text.matchAll(regex)]
      if (matches) cache.entries.push([entry, regex])
    }

    context.metrics = context.header.reduceRight((result, sentence, idx) => {
      return this.reduceMetrics(result, sentence, idx, context.header.length, "header", cache)
    }, context.metrics)

    context.metrics = context.sentences.reduce((result, sentence, idx) => {
      return this.reduceMetrics(result, sentence, idx, context.sentences.length, "sentences", cache)
    }, context.metrics)

    // Score metrics
    for (const metric of context.metrics) {
      const weights = Object.values(metric.weights)
      metric.score = weights.reduce((a, i) => a + i) / weights.length
    }

    // Sort by score desc, sentenceIdx desc,
    context.metrics.sort((a, b) => b.score - a.score || b.sentenceIdx - a.sentenceIdx)
  }

  reduceMetrics(metrics, sentence, idx, total, section, cache) {
    const metricTemplate = {
      type: SC_DATA.MAIN, section, sentence, sentenceIdx: idx, entryLabel: "", matchText: "", pattern: "",
      weights: { distance: this.getWeight(idx + 1, total), strength: 1 }
    }

    // Iterate through cached entries for main keys matching
    for (const [entry, mainRegex] of cache.entries) {
      // Match against world info keys
      const mainMatches = [...sentence.matchAll(mainRegex)]

      // Main match found
      if (mainMatches.length) {
        const metric = Object.assign({}, metricTemplate, {
          entryLabel: entry.data.label, matchText: mainMatches[0][0], pattern: this.getRegexPattern(mainRegex)
        })
        metrics.push(metric)
        if (this.state.you.id !== entry.id) cache.history.unshift(entry)
        this.matchMetrics(metrics, metric, entry, entry.regex)
        this.cachePronouns(metric, entry, cache)
      }
    }

    // Match all cached pronouns
    for (const pronoun of Object.keys(cache.pronouns)) {
      const { regex, metric } = cache.pronouns[pronoun]

      // Determine which entry to use
      const targets = metric.entryLabel.split("|")
      const existing = cache.history.find(e => targets.includes(e.data.label))
      const target = existing ? existing.data.label : targets[0]

      // Do expanded matching on pronoun
      const expMetric = Object.assign({}, metric, {
        section, sentence, sentenceIdx: idx, entryLabel: target,
        weights: { distance: this.getWeight(idx + 1, total), strength: metric.weights.strength }
      })
      this.matchMetrics(metrics, expMetric, this.worldInfoByLabel[target], regex, true)
    }

    // Match new pronouns
    const expMetrics = []
    for (const pronoun of Object.keys(cache.pronouns)) {
      const { regex, metric } = cache.pronouns[pronoun]

      // Determine which entry to use
      const targets = metric.entryLabel.split("|")
      const existing = cache.history.find(e => targets.includes(e.data.label))
      const target = existing ? existing.data.label : targets[0]

      // Skip YOU, HIS and HER top level pronouns
      if (!pronoun.includes("_")) continue

      // Skip if already parsed
      const parsedKey = `${pronoun}:${section}:${idx}:${target}`
      if (cache.parsed[parsedKey]) continue
      else cache.parsed[parsedKey] = true

      // Detect expanded pronoun in context
      const expMatches = [...sentence.matchAll(regex)]
      if (!expMatches.length) continue

      // Create new metric based on match
      const expMetric = Object.assign({}, metric, {
        section, sentence, sentenceIdx: idx, entryLabel: target, matchText: expMatches[0][0],
        weights: { distance: this.getWeight(idx + 1, total), strength: 0.2 }
      })
      metrics.push(expMetric)
      expMetrics.push(expMetric)
    }

    // Get new pronouns before continuing
    for (const expMetric of expMetrics) {
      this.cachePronouns(expMetric, this.worldInfoByLabel[expMetric.entryLabel], cache)
    }

    return metrics
  }

  matchMetrics(metrics, metric, entry, regex, pronounLookup=false) {
    // Get structured entry object, only perform matching if entry key's found
    const pattern = this.getRegexPattern(regex)
    const injPattern = pronounLookup ? pattern : `\\b(${pattern})${SC_RE_STRINGS.PLURAL}\\b`

    // combination of match and specific lookup regex, ie (glance|look|observe).*(pattern)
    if (entry.data[SC_DATA.SEEN]) {
      const lookAhead = this.getRegexPattern(SC_RE.LOOK_AHEAD)
      const lookBehind = this.getRegexPattern(SC_RE.LOOK_BEHIND)
      const expRegex = SC_RE.fromArray([
        `\\b(${lookAhead})${SC_RE_STRINGS.INFLECTED}\\b.*${injPattern}`,
        `${injPattern}.*\\b(${lookBehind})${SC_RE_STRINGS.INFLECTED}\\b`
      ], regex.flags)

      const match = metric.sentence.match(expRegex)
      if (match) {
        const expMetric = {
          type: SC_DATA.SEEN, matchText: match[0], pattern: this.getRegexPattern(expRegex),
          weights: { distance: metric.weights.distance, strength: 0.4 }
        }
        metrics.push(Object.assign({}, metric, expMetric))
      }
    }

    // determine if match is owner of quotations, ie ".*".*(pattern)  or  (pattern).*".*"
    if (entry.data[SC_DATA.HEARD]) {
      const expRegex = SC_RE.fromArray([
        `(?<=[^\\w])(\".*\"|'.*')(?=[^\\w]).*${injPattern}`,
        `${injPattern}.*(?<=[^\\w])(\".*\"|'.*')(?=[^\\w])`
      ], regex.flags)

      const match = metric.sentence.match(expRegex)
      if (match) {
        const expMetric = {
          type: SC_DATA.HEARD, matchText: match[0], pattern: this.getRegexPattern(expRegex),
          weights: { distance: metric.weights.distance, strength: 0.4 }
        }
        metrics.push(Object.assign({}, metric, expMetric))
      }
    }

    // match within quotations, ".*(pattern).*"
    // do NOT do pronoun lookups on this
    if (!pronounLookup && entry.data[SC_DATA.TOPIC]) {
      const expRegex = SC_RE.fromArray([
        `(?<=[^\\w])".*${injPattern}.*"(?=[^\\w])`,
        `(?<=[^\\w])'.*${injPattern}.*'(?=[^\\w])`
      ], regex.flags)

      const match = metric.sentence.match(expRegex)
      if (match) {
        const expMetric = {
          type: SC_DATA.TOPIC, matchText: match[0], pattern: this.getRegexPattern(expRegex),
          weights: { distance: metric.weights.distance, strength: 0.4 }
        }
        metrics.push(Object.assign({}, metric, expMetric))
      }
    }
  }

  cachePronouns(metric, entry, cache) {
    const { you } = this.state
    const { pronoun, label } = entry.data

    // Get cached relationship data
    if (!cache.relationships[label]) cache.relationships[label] = this.getRelMapping(entry)
    const relationships = cache.relationships[label]

    // Determine pronoun type
    let lookupPattern, lookupPronoun
    if (you.id === entry.id) {
      lookupPattern = "your"
      lookupPronoun = SC_PRONOUN.YOU
    }
    else {
      if (pronoun === SC_PRONOUN.UNKNOWN) return
      lookupPattern = `${pronoun === SC_PRONOUN.HER ? "her" : "his"}`
      lookupPronoun = pronoun
    }

    // Add base pronoun
    const regex = new RegExp(SC_RE_STRINGS[lookupPronoun], "gi")
    cache.pronouns[lookupPronoun] = { regex, metric: Object.assign({}, metric, { pattern: SC_RE_STRINGS[lookupPronoun] }) }

    // Add relationship pronoun extensions
    for (let relationship of relationships) {
      const pattern = `\\b${lookupPattern}\\b.*\\b(${relationship.pattern})${SC_RE_STRINGS.PLURAL}\\b`
      const regex = new RegExp(pattern, "gi")
      const target = relationship.targets.join("|")

      cache.pronouns[`${lookupPronoun}_${relationship.title.toUpperCase()}`] = {
        regex, metric: Object.assign({}, metric, { pattern, entryLabel: target })
      }
    }
  }

  mapRelations() {
    const { context } = this.state
    const degreesGoal = 4
    const topLabels = []

    // Get all top level metrics with a unique entryLabel
    const firstPass = context.metrics.reduce((result, metric) => {
      const existing = result.find(b => b.entry.data.label === metric.entryLabel)
      const item = existing || { scores: [] }
      item.scores.push(metric.score)
      if (!existing) {
        topLabels.push(metric.entryLabel)
        item.entry = this.worldInfoByLabel[metric.entryLabel]
        result.push(item)
      }
      return result
    }, [])

    // Prepare branch nodes and weighting
    const secondPass = firstPass.reduce((result, branch) => {
      const { data } = branch.entry
      const { label, pronoun } = data

      // Get total score for weighting
      const metricsWeight = branch.scores.reduce((a, c) => a + c, 0) / branch.scores.length

      // Otherwise add it to the list for consideration
      return result.concat({
        label, pronoun, weights: { metrics: metricsWeight },
        nodes: this.getRelExpKeys(data).reduce((result, rel) => {
          const entry = this.worldInfoByLabel[rel.label]
          if (entry) result.push({
            label: rel.label, pronoun: entry.data.pronoun, rel,
            weights: Object.assign({ metrics: (metricsWeight / (topLabels.includes(rel.label) ? 1 : 2)) }, this.getRelFlagWeights(rel))
          })
          return result
        }, [])
      })
    }, [])

    // Cross match top level keys to figure out degrees of separation (how many people know the same people)
    const degrees = secondPass.reduce((result, branch) => {
      if (!result[branch.label]) result[branch.label] = 0
      result[branch.label] += 1
      for (let node of branch.nodes) {
        if (!result[node.label]) result[node.label] = 0
        result[node.label] += 1
      }
      return result
    }, {})

    // Update total weights to account for degrees of separation, calculate total score
    const thirdPass = secondPass.map(branch => {
      branch.weights.degrees = this.getWeight(degrees[branch.label], degreesGoal)
      let weight = Object.values(branch.weights)
      branch.score = weight.reduce((a, i) => a + i) / weight.length
      for (let node of branch.nodes) {
        node.weights.degrees = this.getWeight(degrees[node.label], degreesGoal)
        weight = Object.values(node.weights)
        node.score = weight.reduce((a, i) => a + i) / weight.length
      }
      return branch
    }, [])

    // Create master list
    context.relations = thirdPass.reduce((result, branch) => {
      return result.concat(branch.nodes.reduce((result, node) => {
        const relations = this.getRelMatches(node.rel, branch.pronoun).map(r => r.title)
        result.push({ score: node.score, source: branch.label, target: node.label, relations: relations, flag: node.rel.flag, weights: node.weights })
        return result
      }, []))
    }, [])

    // Sort all relations by score desc
    context.relations.sort((a, b) => b.score - a.score)
  }

  mapRelationsTree() {
    const { context } = this.state

    const branches = context.relations.reduce((a, c) => a.includes(c.source) ? a : a.concat(c.source), [])

    const bound = {}
    let tree = {}, tmpTree
    for (const rel of context.relations) {

      // Ignore source entries with UNKNOWN pronouns
      const entry = this.worldInfoByLabel[rel.source]
      if (entry.data.pronoun === SC_PRONOUN.UNKNOWN) continue

      // Create base entry for branch
      if (!tree[rel.source]) {
        tmpTree = Object.assign({}, tree)
        tmpTree[rel.source] = {[SC_REL_JOIN_TEXT.PEOPLE]: {}}
        if (!this.isValidTreeSize(tmpTree)) break
        tree = tmpTree
      }

      // Check already tracked
      if (tree[rel.source][SC_REL_JOIN_TEXT.PEOPLE][rel.target]) continue

      // Do not include reciprocal relationships
      if ((bound[rel.target] || []).includes(rel.source)) continue

      // Track reciprocal
      if (!bound[rel.source]) bound[rel.source] = []
      bound[rel.source].push(rel.target)

      // Add various relationship titles (one by one)
      let limitReach = false
      const titleCount = rel.relations.length
      for (let i = 0; i < titleCount; i++) {
        tmpTree = Object.assign({}, tree)
        if (i === 0) tmpTree[rel.source][SC_REL_JOIN_TEXT.PEOPLE][rel.target] = []
        tmpTree[rel.source][SC_REL_JOIN_TEXT.PEOPLE][rel.target].push(rel.relations[i])
        if (!this.isValidTreeSize(tmpTree)) {
          limitReach = true
          break
        }
        tree = tmpTree
      }
      if (limitReach) break

      // Skip adding to like/dislike if relation is not a branch level entry
      if (titleCount && !branches.includes(rel.target)) continue

      // Build tree of likes/dislikes
      tmpTree = Object.assign({}, tree)
      if (rel.flag.disp === SC_DISP.HATE) {
        if (!tree[rel.source][SC_REL_JOIN_TEXT.HATE]) tree[rel.source][SC_REL_JOIN_TEXT.HATE] = []
        tmpTree[rel.source][SC_REL_JOIN_TEXT.HATE].push(rel.target)
      }
      else if ([SC_DISP.LIKE, SC_DISP.LOVE].includes(rel.flag.disp)) {
        if (!tree[rel.source][SC_REL_JOIN_TEXT.LIKE]) tree[rel.source][SC_REL_JOIN_TEXT.LIKE] = []
        tmpTree[rel.source][SC_REL_JOIN_TEXT.LIKE].push(rel.target)
      }
      if (!this.isValidTreeSize(tmpTree)) break
      tree = tmpTree
    }

    context.tree = tree
  }

  determineCandidates() {
    const { context } = this.state

    // Pick out main entries for initial injection
    const split = context.metrics.reduce((result, metric) => {
      if (metric.type === SC_DATA.MAIN) result.main.push(metric)
      else result.other.push(metric)
      return result
    }, { main: [], other: [] })

    // Sort main entries by sentenceIdx asc, score desc
    split.main.sort((a, b) => a.sentenceIdx - b.sentenceIdx || b.score - a.score)
    // Bubble all entries that meets distance threshold to top
    split.main.sort((a, b) => b.weights.distance < SC_METRIC_DISTANCE_THRESHOLD ? -1 : 1)

    // Split main entries
    split.main = split.main.reduce((result, metric) => {
      result[metric.section].push(metric)
      return result
    }, { header: [], sentences: [] })

    // Determine candidates for entry injection
    const injectedIndexes = {}
    context.candidates = split.main.sentences.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), [])
    context.candidates = split.main.header.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), context.candidates)
    context.candidates = split.other.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), context.candidates)
  }

  reduceCandidates(result, metric, idx, injectedIndexes) {
    const { context } = this.state

    const entry = this.worldInfoByLabel[metric.entryLabel]
    if (!injectedIndexes[metric.sentenceIdx]) injectedIndexes[metric.sentenceIdx] = []
    const candidateList = injectedIndexes[metric.sentenceIdx]
    const lastEntryText = candidateList.length ? candidateList[candidateList.length - 1] : (metric.sentenceIdx ? context[metric.section][metric.sentenceIdx - 1] : "")

    // Track injected items and skip if already done
    const existing = context.injected.find(i => i.label === metric.entryLabel)
    const item = existing || { label: metric.entryLabel, types: [] }
    if (item.types.includes(metric.type)) return result
    item.types.push(metric.type)

    // Determine whether to put newlines before or after injection
    const insertNewlineBefore = !lastEntryText.endsWith("\n")
    const insertNewlineAfter = !metric.sentence.startsWith("\n")
    const injectEntry = this.getFormattedEntry(entry.data[metric.type], insertNewlineBefore, insertNewlineAfter)

    // Return if unable to inject
    if (!this.isValidEntrySize(injectEntry)) return result
    result.push({ metric, text: injectEntry })
    this.modifiedSize += injectEntry.length
    candidateList.push(injectEntry)
    if (!existing) context.injected.push(item)

    // Inject relationships when MAIN entry is inserted
    if (metric.type !== SC_DATA.MAIN || !context.tree[metric.entryLabel]) return result
    const relText = JSON.stringify([{[metric.entryLabel]: context.tree[metric.entryLabel]}])
    const relEntry = this.getFormattedEntry(relText, !insertNewlineAfter, insertNewlineAfter)
    if (this.isValidEntrySize(relEntry)) {
      result.push({ metric: Object.assign({}, metric, { type: SC_REL_JOIN_TEXT.PEOPLE }), text: relEntry })
      this.modifiedSize += relEntry.length
      item.types.push(SC_REL_JOIN_TEXT.PEOPLE)
    }

    return result
  }

  injectCandidates() {
    this.injectSection("header")
    this.injectSection("sentences")

    // Add sizes to context object for debugging
    const { sizes } = this.state.context
    sizes.modified = this.modifiedSize
    sizes.original = this.originalSize
  }

  injectSection(section) {
    const { context } = this.state
    const sectionCandidates = context.candidates.filter(m => m.metric.section === section)

    context[section] = context[section].reduce((result, sentence, idx) => {
      const candidates = sectionCandidates.filter(m => m.metric.sentenceIdx === idx)
      result = result.concat(candidates.map(c => c.text))
      result.push(sentence)
      return result
    }, [])
  }

  truncateContext() {
    const { context } = this.state

    let charCount = 0
    let cutoffReached = false
    const headerSize = context.header.join("").length
    const maxSize = info.maxChars - info.memoryLength

    // Sentence reducer
    const reduceSentences = (result, sentence) => {
      if (cutoffReached) return result
      if ((charCount + sentence.length + headerSize) >= maxSize) {
        cutoffReached = true
        return result
      }
      charCount += sentence.length
      result.unshift(sentence)
      return result
    }

    // Reduce sentences and history to be within maxSize
    context.sentences = context.sentences.reduceRight(reduceSentences, [])
    context.history = cutoffReached ? [] : context.history.reduceRight(reduceSentences, [])
  }

  getModifiedContext() {
    const { history, header, sentences, text } = this.state.context
    const contextMemory = (text && info.memoryLength) ? text.slice(0, info.memoryLength) : ""
    const finalContext = [...history, ...header, ...sentences].join("")
      .replace(/([\n]{2,})/g, "\n")
      // .split("\n").filter(l => !!l).join("\n")
    return contextMemory + finalContext
  }


  /*
   * INPUT MODIFIER
   * - Takes new command and refreshes context and HUD (if visible and enabled)
   * - Updates when valid command is entered into the prompt (ie, `/you John Smith`)
   * - Can clear state by executing the command without any arguments (ie, `/you`)
   * - Paragraph formatting is applied
   * - Scene break detection
   */
  inputModifier(text) {
    let modifiedText = text

    // Check if no input (ie, prompt AI)
    if (!modifiedText) return modifiedText

    // Handle entry and relationship menus
    modifiedText = this.entryHandler(text)
    if (!modifiedText) return modifiedText

    // Detection for multi-line commands, filter out double ups of newlines
    modifiedText = text.split("\n").map(l => this.commandHandler(l)).join("\n")

    // Cleanup for commands
    if (["\n", "\n\n"].includes(modifiedText)) modifiedText = ""

    // Paragraph formatting
    if (this.state.isSpaced) modifiedText = this.paragraphFormatterPlugin.inputModifier(modifiedText)

    return modifiedText
  }

  /*
   * Input Modifier: Default Command Handler
   * - Handles all passed commands such as `/scene`, `/you` etc
   */
  commandHandler(text) {
    const { data, sections } = this.state

    // Check if a command was inputted
    let match = SC_RE.INPUT_CMD.exec(text)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Check if the command was valid
    const cmd = match[1].toLowerCase()
    const params = match.length > 2 && match[2] ? match[2].trim() : undefined
    if (!this.commands.includes(cmd)) return text

    // Detect for Controls, handle state and perform actions (ie, hide HUD)
    if (this.controlCommands.includes(cmd)) {
      if (cmd === "debug") {
        this.state.isDebug = !this.state.isDebug
        state.message = this.state.isDebug ? "Enter something into the prompt to start debugging the context.." : ""
      }
      else if (cmd === "enable" || cmd === "disable") this.state.isDisabled = (cmd === "disable")
      else if (cmd === "show" || cmd === "hide") this.state.isHidden = (cmd === "hide")
      else if (cmd === "min" || cmd === "max") this.state.isMinimized = (cmd === "min")
      else if (cmd === "spacing") this.state.isSpaced = !this.state.isSpaced
      else if (cmd === "reset") {
        this.state.sections = {}
        this.state.data = {}
        this.state.you = {}
      }
      this.displayHUD()
      return ""
    } else {
      // If value passed assign it to the data store, otherwise delete it
      if (params) {
        data[cmd] = params
        if (cmd === "you") this.state.you = this.getInfoMatch(data.you) || {}
      }
      else {
        delete data[cmd]
        if (cmd === "you") this.state.you = {}
      }
    }

    // Notes - Author's Note, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
    // Placed at the very end of context.
    const notes = []
    delete sections.notes
    if (data.note) notes.push(`Author's note: ${this.appendPeriod(data.note)}`)
    if (data.title) notes.push(`Title: ${this.appendPeriod(data.title)}`)
    if (data.author) notes.push(`Author: ${this.appendPeriod(data.author)}`)
    if (data.genre) notes.push(`Genre: ${this.appendPeriod(data.genre)}`)
    if (data.setting) notes.push(`Setting: ${this.appendPeriod(data.setting)}`)
    if (data.theme) notes.push(`Theme: ${this.appendPeriod(data.theme)}`)
    if (data.subject) notes.push(`Subject: ${this.appendPeriod(data.subject)}`)
    if (data.style) notes.push(`Writing Style: ${this.appendPeriod(data.style)}`)
    if (data.rating) notes.push(`Rating: ${this.appendPeriod(data.rating)}`)
    if (notes.length) sections.notes = notes.join(" ")

    // POV - Name, location and present company
    // Placed directly under Author's Notes
    const pov = []
    delete sections.pov
    if (data.you) pov.push(`You are ${this.appendPeriod(data.you)}`)
    if (data.at) pov.push(`You are at ${this.appendPeriod(data.at)}`)
    if (data.nearby) pov.push(`Nearby ${this.appendPeriod(data.nearby)}`)
    if (pov.length) sections.pov = pov.join(" ")

    // Scene - Used to provide the premise for generated context
    // Placed 1000 characters from the front of context
    delete sections.scene
    if (data.scene) sections.scene = this.replaceYou(this.toTitleCase(this.appendPeriod(data.scene)))

    // Think - Use to nudge a story in a certain direction
    // Placed 550 characters from the front of context
    delete sections.think
    if (data.think) sections.think = this.replaceYou(this.toTitleCase(this.appendPeriod(data.think)))

    // Focus - Use to force a narrative or story direction
    // Placed 150 characters from the front of context
    delete sections.focus
    if (data.focus) sections.focus = this.replaceYou(this.toTitleCase(this.appendPeriod(data.focus)))

    // Update context
    this.parseContext()

    return ""
  }

  /*
   * Input Modifier: Entry and Relationship Command Handler
   * - Used for updating and creating new entries/relationships
   */
  entryHandler(text) {
    const { creator, you } = this.state
    const modifiedText = text.slice(1)

    // Already processing input
    if (creator.step) {
      // Previous page
      if (modifiedText === SC_SHORTCUT.PREV_PAGE) {
        if (creator.page === SC_UI_PAGE.ENTRY || !creator.data) return ""
        creator.currentPage = 1
        creator.page = SC_UI_PAGE.ENTRY
        this.entryKeysStep()
      }

      // Next page
      else if (modifiedText === SC_SHORTCUT.NEXT_PAGE) {
        if (creator.page !== SC_UI_PAGE.ENTRY || !creator.data) return ""
        creator.currentPage = 2
        creator.page = SC_UI_PAGE.RELATIONS

        const { type } = creator.data
        if (type === SC_ENTRY.CHARACTER) this.entryContactsStep()
        else if (type === SC_ENTRY.FACTION) this.entryContactsStep()
        else if (type === SC_ENTRY.LOCATION) this.entryOwnersStep()
        else if (type === SC_ENTRY.THING) this.entryOwnersStep()
        else if (type === SC_ENTRY.OTHER) this.entryOwnersStep()
      }

      // Hints toggling
      else if (modifiedText === SC_SHORTCUT.HINTS) {
        this.state.showHints = !this.state.showHints
        const handlerString = `entry${creator.step}Step`
        if (typeof this[handlerString] === 'function') this[handlerString]()
        else this.entryExit()
      }

      // Dynamically execute function based on step
      else {
        const handlerString = `entry${creator.step}Handler`
        if (modifiedText === SC_SHORTCUT.CANCEL) this.entryExit()
        else if (typeof this[handlerString] === 'function') this[handlerString](modifiedText)
        else this.entryExit()
      }

      return ""
    }

    // Quick refresh key
    if (modifiedText === SC_SHORTCUT.CANCEL) {
      this.displayHUD()
      return ""
    }

    // Quick check to return early if possible
    if (!modifiedText.startsWith("/") || modifiedText.includes("\n")) return text

    // Match a command
    let match = SC_RE.INPUT_CMD.exec(modifiedText)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Ensure correct command is passed, grab label if applicable
    let cmd = match[1].toLowerCase()
    if (!this.creatorCommands.includes(cmd)) return text

    // Do find/search and display
    if (this.findCommands.includes(cmd)) {
      creator.cmd = cmd
      creator.searchPattern = match.length >= 3 ? match[2] : ".*"
      this.state.exitCreator = true
      this.displayHUD()
      this.state.creator = {}
      return ""
    }

    // Label and icon matching for most commands
    let [label, icon] = match.length >= 3 ? match[2].split(",")[0].split(":").map(m => m.trim()) : ["you"]
    label = label && label.trim()
    icon = icon && icon.trim()

    // Shortcuts for "/e you"
    if (!label || label.toLowerCase() === "you") {
      if (you.id) label = you.data.label
      else return ""
    }

    // Setup index and preload entry if found
    this.setEntrySource(this.worldInfoByLabel[label] || label)

    // Add/update icon
    if (icon !== undefined) {
      if (creator.data.icon) this.removeStat(creator.data.icon)
      if (!icon) delete creator.data.icon
      else creator.data.icon = icon
    }

    // Store current message away to restore once done
    creator.previousMessage = state.message
    if (creator.data.type) this.setEntryPage()

    // Direct to correct menu
    creator.cmd = cmd
    if (!creator.data.type) this.entryTypeStep()
    else if (!creator.keys) this.entryKeysStep()
    else this.entryMainStep()
    return ""
  }

  // noinspection JSUnusedGlobalSymbols
  entryLabelHandler(text) {
    const { creator } = this.state
    if (text === SC_SHORTCUT.BACK_ALL || text === SC_SHORTCUT.BACK) return this.entryLabelStep()
    if (text === SC_SHORTCUT.SKIP_ALL) {
      if (creator.source || this.isEntryValid()) return this.entryConfirmStep()
      else return this.entryLabelStep()
    }
    if (text !== SC_SHORTCUT.SKIP) {
      let [label, icon] = text.split(",")[0].split(":").map(m => m.trim())
      if (label !== creator.data.label && this.worldInfoByLabel[label]) {
        return this.displayEntryHUD(`${SC_UI_ICON.ERROR} ERROR! Entry with that label already exists, try again: `)
      }
      if (label) creator.data.label = label
      // Add/update icon
      if (icon !== undefined) {
        if (creator.data.icon) this.removeStat(creator.data.icon)
        if (!icon) delete creator.data.icon
        else creator.data.icon = icon
      }
    }
    this.entryKeysStep()
  }

  entryLabelStep() {
    const { creator } = this.state
    creator.step = "Label"
    this.displayEntryHUD(`${SC_UI_ICON.LABEL} Enter the LABEL used to refer to this entry: `)
  }

  // noinspection JSUnusedGlobalSymbols
  entryTypeHandler(text) {
    const {creator} = this.state
    const cmd = text.slice(0, 1).toUpperCase()

    // Must fill in this field
    if (creator.data.type) {
      if (text === SC_SHORTCUT.BACK_ALL || text === SC_SHORTCUT.BACK) return this.entryLabelStep()
      else if (text === SC_SHORTCUT.SKIP_ALL) {
        if (this.isEntryValid()) return this.entryConfirmStep()
        else return this.entryKeysStep()
      }
      else if (text === SC_SHORTCUT.SKIP) return this.entryKeysStep()
    }
    else if (cmd === "C") this.setEntryJson(SC_DATA.TYPE, SC_ENTRY.CHARACTER)
    else if (cmd === "F") this.setEntryJson(SC_DATA.TYPE, SC_ENTRY.FACTION)
    else if (cmd === "L") this.setEntryJson(SC_DATA.TYPE, SC_ENTRY.LOCATION)
    else if (cmd === "T") this.setEntryJson(SC_DATA.TYPE, SC_ENTRY.THING)
    else if (cmd === "O") this.setEntryJson(SC_DATA.TYPE, SC_ENTRY.OTHER)
    else return this.entryTypeStep()

    this.setEntryPage()
    this.entryKeysStep()
  }

  entryTypeStep() {
    const { creator } = this.state
    creator.step = "Type"
    this.displayEntryHUD(`${SC_UI_ICON.CHARACTER}${SC_UI_ICON.FACTION}${SC_UI_ICON.LOCATION}${SC_UI_ICON.THING}${SC_UI_ICON.OTHER} Specify what TYPE of entry this is: (c/f/l/t/o)`, true, false, true)
  }

  // noinspection JSUnusedGlobalSymbols
  entryKeysHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryLabelStep()
    if (text === SC_SHORTCUT.SKIP_ALL) {
      if (creator.source || this.isEntryValid()) return this.entryConfirmStep()
      else return this.entryKeysStep()
    }
    if (text === SC_SHORTCUT.BACK) return this.entryLabelStep()
    if (text === SC_SHORTCUT.SKIP) {
      if (creator.source || creator.keys) return this.entryMainStep()
      else return this.entryKeysStep()
    }

    // Ensure valid regex if regex key
    const key = this.getEntryRegex(text)
    if (!key) return this.displayEntryHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in keys, try again: `)

    // Detect conflicting/existing keys and display error
    const existing = this.worldInfoByKeys[key.toString()] || this.worldInfoByKeys[text]
    const sourceIdx = creator.source ? creator.source.idx : -1
    if (existing && existing.idx !== sourceIdx) {
      if (!creator.source) {
        existing.keys = key.toString()
        this.setEntrySource(existing)
        return this.entryMainStep()
      }
      else return this.displayEntryHUD(`${SC_UI_ICON.ERROR} ERROR! World Info with that key already exists, try again: `)
    }

    // Update keys to regex format
    creator.keys = key.toString()

    // Otherwise proceed to entry input
    this.entryMainStep()
  }

  entryKeysStep() {
    const { creator } = this.state
    creator.step = "Keys"
    this.displayEntryHUD(`${SC_UI_ICON.KEYS} Enter the KEYS used to trigger entry injection:`)
  }

  // noinspection JSUnusedGlobalSymbols
  entryMainHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryLabelStep()
    else if (text === SC_SHORTCUT.SKIP_ALL) {
      if (creator.source || this.isEntryValid()) return this.entryConfirmStep()
      else return this.entryMainStep()
    }
    else if (text === SC_SHORTCUT.BACK) return this.entryKeysStep()
    else if (text === SC_SHORTCUT.SKIP) {
      if (!creator.source && !creator.data[SC_DATA.MAIN]) return this.entryMainStep()
    }
    else {
      this.setEntryJson(SC_DATA.MAIN, text)
      creator.data.pronoun = this.getPronoun(creator.data[SC_DATA.MAIN])
    }

    if (type === SC_ENTRY.FACTION) return this.entryTopicStep()
    else return this.entrySeenStep()
  }

  entryMainStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.MAIN)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.MAIN.toUpperCase()]} Enter MAIN content to inject when this entries keys are found:`)
  }

  // noinspection JSUnusedGlobalSymbols
  entrySeenHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryLabelStep()
    else if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    else if (text === SC_SHORTCUT.BACK) return this.entryMainStep()
    else if (text !== SC_SHORTCUT.SKIP) this.setEntryJson(SC_DATA.SEEN, text)

    if (type === SC_ENTRY.LOCATION) return this.entryTopicStep()
    else if (type === SC_ENTRY.THING) return this.entryTopicStep()
    else return this.entryHeardStep()
  }

  entrySeenStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.SEEN)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.SEEN.toUpperCase()]} Enter content to inject when this entry is SEEN (optional):`)
  }

  // noinspection JSUnusedGlobalSymbols
  entryHeardHandler(text) {
    if (text === SC_SHORTCUT.BACK_ALL) return this.entryLabelStep()
    else if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    else if (text === SC_SHORTCUT.BACK) return this.entrySeenStep()
    else if (text !== SC_SHORTCUT.SKIP) this.setEntryJson(SC_DATA.HEARD, text)
    this.entryTopicStep()
  }

  entryHeardStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.HEARD)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.HEARD.toUpperCase()]} Enter content to inject when this entry is HEARD (optional):`)
  }

  // noinspection JSUnusedGlobalSymbols
  entryTopicHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryLabelStep()
    if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.BACK) {
      if (type === SC_ENTRY.FACTION) return this.entryMainStep()
      else if (type === SC_ENTRY.LOCATION) return this.entrySeenStep()
      else if (type === SC_ENTRY.THING) return this.entrySeenStep()
      return this.entryHeardStep()
    }
    if (text !== SC_SHORTCUT.SKIP) this.setEntryJson(SC_DATA.TOPIC, text)

    this.entryConfirmStep()
  }

  entryTopicStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.TOPIC)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.TOPIC.toUpperCase()]} Enter content to inject when this entry is the TOPIC of conversation (optional):`)
  }

  // noinspection JSUnusedGlobalSymbols
  entryContactsHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryContactsStep()
    if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.BACK) return this.entryContactsStep()
    if (text === SC_SHORTCUT.SKIP) {
      if (type === SC_ENTRY.FACTION) return this.entryPropertyStep()
      return this.entryChildrenStep()
    }
    if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.CONTACTS]) {
      delete creator.data[SC_DATA.CONTACTS]
      return this.entryContactsStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.CONTACTS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.PARENTS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.CHILDREN)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.CONTACTS]
    else creator.data[SC_DATA.CONTACTS] = relText
    this.entryContactsStep()
  }

  entryContactsStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.CONTACTS)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.CONTACTS.toUpperCase()]} Enter comma separated list of CONTACTS (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  entryChildrenHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryContactsStep()
    if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.BACK) return this.entryContactsStep()
    if (text === SC_SHORTCUT.SKIP) return this.entryParentsStep()
    if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.CHILDREN]) {
      delete creator.data[SC_DATA.CHILDREN]
      return this.entryChildrenStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.CHILDREN)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.PARENTS)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.CHILDREN]
    else creator.data[SC_DATA.CHILDREN] = relText
    this.entryChildrenStep()
  }

  entryChildrenStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.CHILDREN)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.CHILDREN.toUpperCase()]} Enter comma separated list of CHILDREN (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  entryParentsHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryContactsStep()
    if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.BACK) return this.entryChildrenStep()
    if (text === SC_SHORTCUT.SKIP) {
      if (type === SC_ENTRY.LOCATION) return this.entryOwnersStep()
      else if (type === SC_ENTRY.THING) return this.entryOwnersStep()
      else if (type === SC_ENTRY.OTHER) return this.entryOwnersStep()
      return this.entryPropertyStep()
    }
    if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.PARENTS]) {
      delete creator.data[SC_DATA.PARENTS]
      return this.entryParentsStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.PARENTS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.CHILDREN)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.PARENTS]
    else creator.data[SC_DATA.PARENTS] = relText
    this.entryParentsStep()
  }

  entryParentsStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.PARENTS)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.PARENTS.toUpperCase()]} Enter comma separated list of PARENTS (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  entryPropertyHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) return this.entryContactsStep()
    if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.BACK) {
      if (type === SC_ENTRY.FACTION) return this.entryContactsStep()
      return this.entryParentsStep()
    }
    if (text === SC_SHORTCUT.SKIP) return this.entryOwnersStep()
    if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.PROPERTY]) {
      delete creator.data[SC_DATA.PROPERTY]
      return this.entryPropertyStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.PROPERTY)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.OWNERS)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.PROPERTY]
    else creator.data[SC_DATA.PROPERTY] = relText
    this.entryPropertyStep()
  }

  entryPropertyStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.PROPERTY)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.PROPERTY.toUpperCase()]} Enter comma separated list of PROPERTY (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  entryOwnersHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) {
      if (type === SC_ENTRY.LOCATION) return this.entryOwnersStep()
      else if (type === SC_ENTRY.THING) return this.entryOwnersStep()
      else if (type === SC_ENTRY.OTHER) return this.entryOwnersStep()
      return this.entryContactsStep()
    }
    if (text === SC_SHORTCUT.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.BACK) {
      if (type === SC_ENTRY.LOCATION) return this.entryOwnersStep()
      else if (type === SC_ENTRY.THING) return this.entryOwnersStep()
      else if (type === SC_ENTRY.OTHER) return this.entryOwnersStep()
      return this.entryPropertyStep()
    }
    if (text === SC_SHORTCUT.SKIP) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.OWNERS]) {
      delete creator.data[SC_DATA.OWNERS]
      return this.entryOwnersStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.OWNERS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.PROPERTY)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.OWNERS]
    else creator.data[SC_DATA.OWNERS] = relText
    this.entryOwnersStep()
  }

  entryOwnersStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.OWNERS)
    this.displayEntryHUD(`${SC_UI_ICON[SC_DATA.OWNERS.toUpperCase()]} Enter comma separated list of OWNERS (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  entryConfirmHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.BACK_ALL) {
      if (creator.page === SC_UI_PAGE.ENTRY) return this.entryKeysStep()
      else if (creator.page === SC_UI_PAGE.RELATIONS) {
        if (type === SC_ENTRY.LOCATION) return this.entryOwnersStep()
        else if (type === SC_ENTRY.THING) return this.entryOwnersStep()
        else if (type === SC_ENTRY.OTHER) return this.entryOwnersStep()
        return this.entryContactsStep()
      }
    }
    if ([SC_SHORTCUT.SKIP, SC_SHORTCUT.SKIP_ALL, SC_SHORTCUT.DELETE].includes(text)) return this.entryConfirmStep()
    if (text === SC_SHORTCUT.BACK) {
      if (creator.page === SC_UI_PAGE.ENTRY) return this.entryTopicStep()
      else if (creator.page === SC_UI_PAGE.RELATIONS) return this.entryOwnersStep()
    }

    // Exit without saving if anything other than "y" passed
    if (text.toLowerCase().startsWith("n")) return this.entryExit()
    if (!text.toLowerCase().startsWith("y")) return this.entryConfirmStep()

    // Add missing data
    const { data } = creator
    if (!data.pronoun) data.pronoun = this.getPronoun(data[SC_DATA.MAIN])

    // Lower for storage
    data.pronoun = data.pronoun.toLowerCase()
    data.type = data.type.toLowerCase()

    // Add new World Info
    const entry = JSON.stringify(data)
    if (!creator.source) addWorldEntry(creator.keys, entry)

    // Update existing World Info
    else updateWorldEntry(creator.source.idx, creator.keys, entry)

    // Confirmation message
    const successMessage = `${SC_UI_ICON.SUCCESS} Entry '${creator.data.label}' was ${creator.source ? "updated" : "created"} successfully!`

    // Reload cached World Info
    this.loadWorldInfo()

    // Update preloaded info
    if (!this.state.you.id && this.state.data.you) this.state.you = this.getInfoMatch(this.state.data.you) || {}

    // Sync relationships and status
    this.syncEntry(this.worldInfoByKeys[creator.keys])
    this.loadWorldInfo()

    // Reset everything back
    this.entryExit(false)

    // Update context
    this.parseContext()

    // Show message
    this.messageOnce(successMessage)
  }

  entryConfirmStep() {
    const { creator } = this.state
    creator.step = "Confirm"
    this.displayEntryHUD(`${SC_UI_ICON.CONFIRM} Do you want to save these changes? (y/n)`, false)
  }

  entryExit(update=true) {
    const { creator } = this.state
    if (creator.data && creator.data.icon) this.removeStat(creator.data.icon)
    state.message = creator.previousMessage
    this.state.creator = {}
    if (update) this.displayHUD()
  }

  displayEntryHUD(promptText, hints=true, relHints=false, entityHints=false) {
    const { showHints } = this.state
    const output = []
    if (hints && showHints) {
      output.push(`Hint: Type '${SC_SHORTCUT.BACK_ALL}' to go to start, '${SC_SHORTCUT.BACK}' to go back, '${SC_SHORTCUT.SKIP}' to skip, '${SC_SHORTCUT.SKIP_ALL}' to skip all, '${SC_SHORTCUT.DELETE}' to delete, '${SC_SHORTCUT.CANCEL}' to cancel and '${SC_SHORTCUT.HINTS}' to toggle hints. You can navigate pages by typing '${SC_SHORTCUT.PREV_PAGE}' or '${SC_SHORTCUT.NEXT_PAGE}'.${(relHints || entityHints) ? "" : "\n\n"}`)
      if (relHints) output.push(`You can type '${SC_SHORTCUT.DELETE}Ben, Lucy' to remove one or more individual items.\n`)
      if (entityHints) output.push(`You choose from '${SC_ENTRY.CHARACTER.toLowerCase()}', '${SC_ENTRY.FACTION.toLowerCase()}', '${SC_ENTRY.LOCATION.toLowerCase()}', '${SC_ENTRY.THING.toLowerCase()}' or '${SC_ENTRY.OTHER.toLowerCase()}'.\n`)
    }
    output.push(`${promptText}`)
    state.message = output.join("\n")
    this.displayHUD()
  }

  setEntryPage() {
    const { creator } = this.state
    creator.page = SC_UI_PAGE.ENTRY
    creator.currentPage = 1
    creator.totalPages = 2
  }

  setEntrySource(source) {
    const { creator } = this.state
    if (typeof source === "object") {
      creator.source = source
      creator.keys = source.keys
      if (creator.data) creator.data = Object.assign({ label: creator.data.label }, source.data, { type: source.data.type || creator.data.type })
      else creator.data = Object.assign({ }, source.data)
      creator.data.pronoun = (creator.data.pronoun && creator.data.pronoun.toUpperCase()) || SC_PRONOUN.UNKNOWN
      creator.data.type = (creator.data.type && creator.data.type.toUpperCase()) || ""
    }
    else {
      creator.data = { label: source, type: "", pronoun: SC_PRONOUN.UNKNOWN, [SC_DATA.MAIN]: "" }
      const keys = (new RegExp(source, "g")).toString()
      if (!this.worldInfoByKeys[keys]) creator.keys = keys
    }
  }

  setEntryJson(key, text) {
    const { data } = this.state.creator
    if (data[key] && text === SC_SHORTCUT.DELETE) delete data[key]
    else data[key] = text
  }

  isEntryValid() {
    const { creator } = this.state
    return creator.data[SC_DATA.MAIN] && creator.keys && creator.data.type
  }


  /*
   * OUTPUT MODIFIER
   * - Handles paragraph formatting.
   */
  outputModifier(text) {
    let modifiedText = text

    // Paragraph formatting
    if (this.state.isSpaced) modifiedText = this.paragraphFormatterPlugin.outputModifier(modifiedText)

    return modifiedText
  }


  /*
   * UI Rendering
   */
  displayHUD() {
    const { creator } = this.state

    // Clear out Simple Context stats, keep stats from other scripts for compatibility
    const labels = Object.values(SC_UI_ICON).concat((creator.data && creator.data.icon) ? [creator.data.icon] : []).concat(this.worldInfoIcons)
    state.displayStats = state.displayStats.filter(s => !labels.includes((s.key || "").replace(SC_UI_ICON.SELECTED, "")))

    // Get correct stats to display
    let hudStats
    if (creator.page === SC_UI_PAGE.ENTRY) hudStats = this.getEntryStats()
    else if (creator.page === SC_UI_PAGE.RELATIONS) hudStats = this.getRelationsStats()
    else if (this.findCommands.includes(creator.cmd)) hudStats = this.getFindStats()
    else hudStats = this.getInfoStats()

    // Add newline at end for spacing
    if (hudStats.length) hudStats[hudStats.length - 1].value = hudStats[hudStats.length - 1].value + "\n"

    // Display stats
    state.displayStats = [...hudStats, ...state.displayStats]
  }

  getInfoStats() {
    const { context, sections, isDisabled, isHidden, isMinimized } = this.state
    const { injected } = context

    const displayStats = []
    if (isDisabled) return displayStats

    // Display relevant HUD elements
    const contextKeys = isHidden ? SC_UI_ARRANGEMENT.HIDDEN : (isMinimized ? SC_UI_ARRANGEMENT.MINIMIZED : SC_UI_ARRANGEMENT.MAXIMIZED)

    for (let keys of contextKeys) {
      keys = keys.toUpperCase().split("/")
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        const newline = i === (l - 1) ? "\n" : " "

        if (key === "TRACK") {
          // Setup tracking information
          const track = injected.map(inj => {
            const entry = this.worldInfoByLabel[inj.label]
            const injectedEmojis = inj.types.filter(t => ![SC_DATA.MAIN, SC_REL_JOIN_TEXT.PEOPLE].includes(t)).map(t => SC_UI_ICON[`INJECTED_${t.toUpperCase()}`]).join("")
            return `${this.getEntryEmoji(entry)} ${entry.data.label}${injectedEmojis ? ` [${injectedEmojis}]` : ""}`
          })

          // Display World Info injected into context
          if (track.length) displayStats.push({
            key: SC_UI_ICON.TRACK, color: SC_UI_COLOR.TRACK,
            value: `${track.join(SC_UI_ICON.SEPARATOR)}${!SC_UI_ICON.TRACK.trim() ? " :" : ""}${newline}`
          })
        }

        else if (sections[key.toLowerCase()]) displayStats.push({
          key: SC_UI_ICON[key], color: SC_UI_COLOR[key],
          value: `${sections[key.toLowerCase()]}${newline}`
        })
      }
    }

    return displayStats
  }

  getEntryStats() {
    const { creator } = this.state
    const { type } = creator.data
    let displayStats = []

    // Get combined text to search for references
    const text = SC_ENTRY_ALL_KEYS.reduce((result, key) => {
      const data = creator.data[key]
      if (data) result += `${result ? " " : ""}${data}`
      return result
    }, "")

    // Find references
    const track = this.worldInfo.reduce((result, entry) => {
      if (entry.data.label === creator.data.label) return result
      if (text.match(entry.regex)) result.push(`${this.getEntryEmoji(entry)} ${entry.data.label}`)
      return result
    }, [])

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats([], track, []))

    // Only show type and label if on first step
    if (!creator.data.type) return displayStats

    // Display KEYS
    displayStats.push({
      key: this.getSelectedLabel(SC_UI_ICON.KEYS), color: SC_UI_COLOR.KEYS,
      value: `${creator.keys || SC_UI_ICON.EMPTY}\n`
    })

    // Display all ENTRIES
    for (let key of SC_ENTRY_ALL_KEYS) {
      let validKey = false
      if (type === SC_ENTRY.CHARACTER && SC_ENTRY_CHARACTER_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.FACTION && SC_ENTRY_FACTION_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.LOCATION && SC_ENTRY_LOCATION_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.THING && SC_ENTRY_THING_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.OTHER && SC_ENTRY_OTHER_KEYS.includes(key)) validKey = true
      if (validKey) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON[key.toUpperCase()]), color: SC_UI_COLOR[key.toUpperCase()],
        value: `${creator.data[key] || SC_UI_ICON.EMPTY}\n`
      })
    }

    return displayStats
  }

  getRelationsStats() {
    const { creator } = this.state
    const { type } = creator.data
    const scopesExtended = [SC_SCOPE.SIBLINGS, SC_SCOPE.GRANDPARENTS, SC_SCOPE.GRANDCHILDREN, SC_SCOPE.PARENTS_SIBLINGS, SC_SCOPE.SIBLINGS_CHILDREN]
    let displayStats = []

    // Scan each rel entry for matching labels in index
    const relationships = this.getRelExpKeys(creator.data)

    const trackOther = relationships
      .filter(r => !this.worldInfoByLabel[r.label])
      .map(r => this.getRelationshipLabel(r))

    const trackExtendedRel = relationships.filter(r => !!this.worldInfoByLabel[r.label] && scopesExtended.includes(r.scope))
    const trackExtendedLabels = trackExtendedRel.map(r => r.label)
    const trackExtended = trackExtendedRel.map(r => this.getRelationshipLabel(r))

    const track = relationships
      .filter(r => !!this.worldInfoByLabel[r.label] && SC_REL_ALL_KEYS.includes(r.scope) && !trackExtendedLabels.includes(r.label))
      .map(r => this.getRelationshipLabel(r))

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats(track, trackExtended, trackOther))

    // Display all ENTRIES
    for (let key of SC_REL_ALL_KEYS) {
      let validKey = false
      if (type === SC_ENTRY.CHARACTER && SC_REL_CHARACTER_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.FACTION && SC_REL_FACTION_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.LOCATION && SC_REL_LOCATION_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.THING && SC_REL_THING_KEYS.includes(key)) validKey = true
      if (type === SC_ENTRY.OTHER && SC_REL_OTHER_KEYS.includes(key)) validKey = true
      if (validKey) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON[key.toUpperCase()]), color: SC_UI_COLOR[key.toUpperCase()],
        value: `${creator.data[key] || SC_UI_ICON.EMPTY}\n`
      })
    }

    return displayStats
  }

  getFindStats() {
    const { creator } = this.state
    let displayStats = []

    // Setup search
    let searchRegex
    if (creator.searchPattern !== ".*") {
      try { searchRegex = new RegExp(creator.searchPattern, "i") }
      catch (e) {
        this.messageOnce(`${SC_UI_ICON.ERROR} Invalid regex detected in '${creator.searchPattern}', try again:`)
        return this.getInfoStats()
      }
    }

    // Find references
    const track = this.worldInfo.reduce((result, entry) => {
      if (creator.searchPattern !== ".*" && !entry.entry.match(searchRegex)) return result
      return result.concat([`${this.getEntryEmoji(entry)} ${entry.data.label}`])
    }, [])

    this.messageOnce(`${SC_UI_ICON.SEARCH} Found ${track.length} ${track.length === 1 ? "entry" : "entries"} matching the pattern: ${creator.searchPattern}`)
    if (!track.length) return this.getInfoStats()

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats(track, [], [], false))

    return displayStats
  }

  getLabelTrackStats(track=[], extended=[], other=[], showLabel=true) {
    const { creator } = this.state
    const displayStats = []

    if (showLabel && creator.data && creator.data.label) {
      const pageText = creator.page ? `${SC_UI_ICON.SEPARATOR} ${this.toTitleCase(creator.page === SC_UI_PAGE.ENTRY ? creator.data.type.toLowerCase() : creator.page)}${creator.totalPages > 1 ? ` (${creator.currentPage}/${creator.totalPages})` : ""}` : ""
      const newline = `\n${SC_UI_ICON.BREAK}\n`
      displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.LABEL), color: SC_UI_COLOR.LABEL,
        value: `${creator.data.label}${pageText}${newline}`
      })
    }

    // Display tracked recognised entries
    if (track.length) {
      const newline = (showLabel && !extended.length && !other.length) ? `\n${SC_UI_ICON.BREAK}\n` : (showLabel ? "\n" : "")
      displayStats.push({
        key: SC_UI_ICON.TRACK_MAIN, color: SC_UI_COLOR.TRACK_MAIN,
        value: `${track.join(SC_UI_ICON.SEPARATOR)}${newline}`
      })
    }

    // Display tracked unrecognised entries
    if (other.length) {
      const newline = (showLabel && !extended.length) ? `\n${SC_UI_ICON.BREAK}\n` : (showLabel ? "\n" : "")
      displayStats.push({
        key: SC_UI_ICON.TRACK_OTHER, color: SC_UI_COLOR.TRACK_OTHER,
        value: `${other.join(SC_UI_ICON.SEPARATOR)}${newline}`
      })
    }

    // Display tracked extended family entries
    if (extended.length) {
      const newline = showLabel ? `\n${SC_UI_ICON.BREAK}\n` : (showLabel ? "\n" : "")
      displayStats.push({
        key: SC_UI_ICON.TRACK_EXTENDED, color: SC_UI_COLOR.TRACK_EXTENDED,
        value: `${extended.join(SC_UI_ICON.SEPARATOR)}${newline}`
      })
    }

    return displayStats
  }

  getRelationshipLabel(rel) {
    const pronounEmoji = this.getEntryEmoji(this.worldInfoByLabel[rel.label])
    const dispEmoji = SC_UI_ICON[SC_REL_DISP_REV[rel.flag.disp]]
    const modEmoji = rel.flag.mod ? SC_UI_ICON[SC_REL_MOD_REV[rel.flag.mod]] : ""
    const typeEmoji = rel.flag.type ? SC_UI_ICON[SC_REL_TYPE_REV[rel.flag.type]] : ""
    return `${pronounEmoji} ${rel.label} [${dispEmoji}${typeEmoji}${modEmoji}]`
  }

  getEntryEmoji(entry) {
    if (!entry) return SC_UI_ICON.OTHER

    const { you } = this.state
    const { type, icon, pronoun } = entry.data

    if (you.id && you.id === entry.id) return SC_UI_ICON[SC_PRONOUN.YOU]
    if (icon) return icon
    if (type === SC_ENTRY.CHARACTER) return SC_UI_ICON[(pronoun === SC_PRONOUN.UNKNOWN) ? SC_ENTRY.CHARACTER : pronoun]
    return SC_UI_ICON[type || "OTHER"]
  }

  getSelectedLabel(label) {
    const { creator } = this.state
    const step = SC_UI_ICON[creator.step.toUpperCase()]
    const icon = label === SC_UI_ICON.LABEL ? this.getEntryEmoji(creator) : label
    return step === label ? `${SC_UI_ICON.SELECTED}${icon}` : icon
  }

  removeStat(key) {
    state.displayStats = state.displayStats.filter(s => key !== (s.key || "").replace(SC_UI_ICON.SELECTED, ""))
  }

  displayDebug() {
    const { isDebug, context, creator } = this.state

    // Output to AID Script Diagnostics
    console.log(context)

    if (!isDebug) return

    // Don't hijack state.message while doing creating/updating a World Info entry
    if (creator.step) return

    // Output context to state.message with numbered lines
    let debugLines = this.getModifiedContext().split("\n")
    debugLines.reverse()
    debugLines = debugLines.map((l, i) => "(" + (i < 9 ? "0" : "") + `${i + 1}) ${l}`)
    debugLines.reverse()
    state.message = debugLines.join("\n")
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
