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
  POV: "🕹️ ",
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
  PARENTS: "🧬 ",
  PROPERTY: "💰 ",
  OWNERS: "🙏 ",

  // Title Labels
  TITLE: "🏷️ ",
  MATCH: "🔍 ",
  CATEGORY: "🎭🗺️👑📦💡 ",
  DISP: "🤬😒😐😀🤩 ",
  TYPE: "🤝💞✊💍🥊 ",
  MOD: "👍👎💥 ",
  PRONOUN: "🎗️➰🔱 ",
  ENTRY: "🔖 ",
  SCOPE: "👋 ",

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
  UNKNOWN: "🔱",

  // Entry Category Icons
  CHARACTER: "🎭",
  LOCATION: "🗺️",
  FACTION: "👑",
  THING: "📦",
  OTHER: "💡",

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
  EMPTY: "❔ ",
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
  LABEL: "indianred",
  KEYS: "seagreen",
  MAIN: "steelblue",
  SEEN: "slategrey",
  HEARD: "slategrey",
  TOPIC: "slategrey",

  // Title Labels
  TITLE: "indianred",
  MATCH: "seagreen",
  SCOPE: "steelblue",
  PRONOUN: "slategrey",
  DISP: "slategrey",
  TYPE: "slategrey",
  MOD: "slategrey",
  CATEGORY: "slategrey",
  ENTRY: "slategrey"
}

// Control over page titles
const SC_UI_PAGE = { ENTRY: "Entry", RELATIONS: "Relationships", TITLE: "Relationship Title", SOURCE: "Relationship Source", TARGET: "Relationship Target" }

// Shortcut commands used to navigate the entry, family and contacts UI
const SC_SHORTCUT = { PREV: "<", NEXT: ">", PREV_PAGE: "<<", NEXT_PAGE: ">>", EXIT: "!", DELETE: "^", GOTO: "#", HINTS: "?" }

// Determines context placement by character count from the front of context (rounds to full sentences)
const SC_CONTEXT_PLACEMENT = { FOCUS: 150, THINK: 500, SCENE: 1000 }

// Determines the maximum amount of relationship context to inject (measured in character length)
const SC_REL_SIZE_LIMIT = 800

// Minimum distance weight to insert main entry and relationships
const SC_METRIC_DISTANCE_THRESHOLD = 0.6

// Determines plural noun to use to describe a relation between two entities
const SC_REL_JOIN_TEXT = { CHARACTER: "relationships", FACTION: "factions", LIKE: "likes", HATE: "hates", PROPERTY: "property", OWNERS: "owners" }

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
const SC_DATA = {
  LABEL: "label", TYPE: "type", PRONOUN: "pronoun", MAIN: "main", SEEN: "seen", HEARD: "heard", TOPIC: "topic",
  CONTACTS: "contacts", CHILDREN: "children", PARENTS: "parents", PROPERTY: "property", OWNERS: "owners"
}
const SC_SCOPE = { CONTACTS: "contacts", CHILDREN: "children", PARENTS: "parents", PROPERTY: "property",
  OWNERS: "owners", SIBLINGS: "siblings", GRANDPARENTS: "grandparents", GRANDCHILDREN: "grandchildren",
  PARENTS_SIBLINGS: "parents siblings", SIBLINGS_CHILDREN: "siblings children"
}
const SC_SCOPE_OPP = { CONTACTS: "contacts", CHILDREN: "parents", PARENTS: "children", PROPERTY: "owners", OWNERS: "property" }
const SC_SECTION = { FOCUS: "focus", THINK: "think", SCENE: "scene", POV: "pov", NOTES: "notes" }
const SC_CATEGORY = { CHARACTER: "character", FACTION: "faction", LOCATION: "location", THING: "thing", OTHER: "other" }
const SC_PRONOUN = { YOU: "you", HIM: "him", HER: "her", UNKNOWN: "unknown" }
const SC_RELATABLE = [ SC_CATEGORY.CHARACTER, SC_CATEGORY.FACTION ]

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

const SC_TITLE_KEYS = [ "scope" ]
const SC_TITLE_SOURCE_KEYS = [ "sourceCategory", "sourceDisp", "sourceType", "sourceMod", "sourcePronoun", "sourceEntry" ]
const SC_TITLE_TARGET_KEYS = [ "targetCategory", "targetDisp", "targetType", "targetMod", "targetPronoun", "targetEntry" ]

const SC_VALID_SCOPE = Object.values(SC_SCOPE)
const SC_VALID_PRONOUN = Object.values(SC_PRONOUN).filter(p => p !== SC_PRONOUN.YOU)
const SC_VALID_DISP = Object.values(SC_DISP).map(v => `${v}`)
const SC_VALID_TYPE = Object.values(SC_TYPE)
const SC_VALID_MOD = Object.values(SC_MOD)
const SC_VALID_CATEGORY = Object.values(SC_CATEGORY)


const SC_DISP_REV = Object.assign({}, ...Object.entries(SC_DISP).map(([a,b]) => ({ [`${b}`]: a })))
const SC_TYPE_REV = Object.assign({}, ...Object.entries(SC_TYPE).map(([a,b]) => ({ [b]: a })))
const SC_MOD_REV = Object.assign({}, ...Object.entries(SC_MOD).map(([a,b]) => ({ [b]: a })))
const SC_FLAG_DEFAULT = `${SC_DISP.NEUTRAL}`
const SC_TITLE_MAPPING_ENTRY = "#sc-titles"

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
  {
    title: "",
    keys: /.*/,
    scope: "",
    target: { pronoun: "", disp: "", type: "", mod: "", category: "", entry: "" },
    source: { pronoun: "", disp: "", type: "", mod: "", category: "", entry: "" }
  },
  {
    title: "mother",
    keys: /mother|m[uo]m(m[ya])?/,
    scope: SC_SCOPE.PARENTS,
    target: {
      pronoun: SC_PRONOUN.HER
    }
  },
  {
    title: "father",
    keys: /father|dad(dy|die)?|pa(pa)?/,
    scope: SC_SCOPE.PARENTS,
    target: {
      pronoun: SC_PRONOUN.HIM
    }
  },
  {
    title: "daughter",
    scope: SC_SCOPE.CHILDREN,
    target: {
      pronoun: SC_PRONOUN.HER
    }
  },
  {
    title: "son",
    scope: SC_SCOPE.CHILDREN,
    target: {
      pronoun: SC_PRONOUN.HIM
    }
  },
  {
    title: "sister",
    keys: /sis(ter)?/,
    scope: SC_SCOPE.SIBLINGS,
    target: {
      pronoun: SC_PRONOUN.HER
    }
  },
  {
    title: "brother",
    keys: /bro(ther)?/,
    scope: SC_SCOPE.SIBLINGS,
    target: {
      pronoun: SC_PRONOUN.HIM
    }
  },
  {
    title: "niece",
    scope: SC_SCOPE.SIBLINGS_CHILDREN,
    target: {
      pronoun: SC_PRONOUN.HER
    }
  },
  {
    title: "nephew",
    scope: SC_SCOPE.SIBLINGS_CHILDREN,
    target: {
      pronoun: SC_PRONOUN.HIM
    }
  },
  {
    title: "aunt",
    scope: SC_SCOPE.PARENTS_SIBLINGS,
    target: {
      pronoun: SC_PRONOUN.HER
    }
  },
  {
    title: "uncle",
    scope: SC_SCOPE.PARENTS_SIBLINGS,
    target: {
      pronoun: SC_PRONOUN.HIM
    }
  },
  {
    title: "grandmother",
    keys: /gran(dmother|dma|ny)/,
    scope: SC_SCOPE.GRANDPARENTS,
    target: {
      pronoun: SC_PRONOUN.HER
    }
  },
  {
    title: "grandfather",
    keys: /grand(father|pa|dad)/,
    scope: SC_SCOPE.GRANDPARENTS,
    target: {
      pronoun: SC_PRONOUN.HIM
    }
  },
  {
    title: "granddaughter",
    scope: SC_SCOPE.GRANDCHILDREN,
    target: {
      pronoun: SC_PRONOUN.HER
    }
  },
  {
    title: "grandson",
    scope: SC_SCOPE.GRANDCHILDREN,
    target: {
      pronoun: SC_PRONOUN.HIM
    }
  },
  {
    title: "wife",
    target: {
      pronoun: SC_PRONOUN.HER,
      type: SC_TYPE.MARRIED
    }
  },
  {
    title: "ex wife",
    target: {
      pronoun: SC_PRONOUN.HER,
      type: SC_TYPE.MARRIED,
      mod: SC_MOD.EX
    }
  },
  {
    title: "husband",
    target: {
      pronoun: SC_PRONOUN.HIM,
      type: SC_TYPE.MARRIED
    }
  },
  {
    title: "ex husband",
    target: {
      pronoun: SC_PRONOUN.HIM,
      type: SC_TYPE.MARRIED,
      mod: SC_MOD.EX
    }
  },
  {
    title: "lover",
    target: {
      type: SC_TYPE.LOVERS,
      disp: `-${SC_DISP.LOVE}`
    }
  },
  {
    title: "ex lover",
    target: {
      type: SC_TYPE.LOVERS,
      disp: `-${SC_DISP.LOVE}`,
      mod: SC_MOD.EX
    }
  },
  {
    title: "girlfriend",
    target: {
      pronoun: SC_PRONOUN.HER,
      type: SC_TYPE.LOVERS,
      disp: SC_DISP.LOVE
    }
  },
  {
    title: "ex girlfriend",
    target: {
      pronoun: SC_PRONOUN.HER,
      type: SC_TYPE.LOVERS,
      disp: SC_DISP.LOVE,
      mod: SC_MOD.EX
    }
  },
  {
    title: "boyfriend",
    target: {
      pronoun: SC_PRONOUN.HIM,
      type: SC_TYPE.LOVERS,
      disp: SC_DISP.LOVE
    }
  },
  {
    title: "ex boyfriend",
    target: {
      pronoun: SC_PRONOUN.HIM,
      type: SC_TYPE.LOVERS,
      disp: SC_DISP.LOVE,
      mod: SC_MOD.EX
    }
  },
  {
    title: "friend",
    target: {
      type: SC_TYPE.FRIENDS
    }
  },
  {
    title: "ex friend",
    target: {
      type: SC_TYPE.FRIENDS,
      mod: SC_MOD.EX
    }
  },
  {
    title: "enemy",
    target: {
      type: SC_TYPE.ENEMIES
    }
  },
  {
    title: "ally",
    target: {
      type: SC_TYPE.ALLIES
    }
  },
  {
    title: "slave",
    scope: SC_SCOPE.PROPERTY,
    target: {
      category: SC_CATEGORY.CHARACTER,
    },
    source: {
      category: SC_CATEGORY.CHARACTER
    }
  },
  {
    title: "master",
    scope: SC_SCOPE.OWNERS,
    target: {
      category: SC_CATEGORY.CHARACTER,
    },
    source: {
      category: SC_CATEGORY.CHARACTER
    }
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
  relationsCommands = ["relations", "r"]
  findCommands = ["find", "f"]
  titleCommands = ["title", "t"]
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
    this.creatorCommands = [...this.entryCommands, ...this.relationsCommands, ...this.titleCommands, ...this.findCommands]

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
      this.menuExit(false)
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
    this.loadedIcons = {}
    this.titleMapping = {}

    // Main loop over worldInfo creating new entry objects with padded data
    for (let i = 0, l = worldInfo.length; i < l; i++) {
      const info = worldInfo[i]

      // Add title mapping rules
      if (info.keys === SC_TITLE_MAPPING_ENTRY) {
        this.titleMapping = Object.assign({ idx: i, data: this.getJson(info.entry) || [] }, info)
        continue
      }

      // Get all entries
      const data = this.getEntryJson(info.entry)
      data.pronoun = data.pronoun || SC_PRONOUN.UNKNOWN
      data.type = data.type || ""
      const regex = this.getEntryRegex(info.keys)
      const pattern = this.getRegexPattern(regex)
      const entry = Object.assign({ idx: i, regex, pattern, data }, info)
      this.worldInfoByKeys[info.keys] = entry

      // Only proper entries
      if (!info.keys.startsWith("/") || !data.label) continue
      this.worldInfo.push(entry)
      this.worldInfoByLabel[data.label] = entry
      if (data.icon) this.loadedIcons[data.icon] = true
    }

    // If invalid title mapping data, reload from defaults
    if (!this.titleMapping.data) {
      const rules = SC_REL_MAPPING_RULES.map(rule => {
        if (rule.keys) rule.keys = rule.keys.toString()
        return rule
      })

      if (this.titleMapping.idx === undefined) addWorldEntry(SC_TITLE_MAPPING_ENTRY, JSON.stringify(rules))
      else updateWorldEntry(this.titleMapping.idx, SC_TITLE_MAPPING_ENTRY, JSON.stringify(rules))
      this.titleMapping.data = rules
    }

    for (let rule of this.titleMapping.data) {
      if (rule.icon) this.loadedIcons[rule.icon] = true
    }

    // Keep track of all icons so that we can clear display stats properly
    this.loadedIcons = Object.keys(this.loadedIcons)
  }

  getJson(text) {
    try { return JSON.parse(text) }
    catch (e) {}
  }

  getEntryJson(text) {
    let json = this.getJson(text)
    if (!json || typeof json !== 'object' || Array.isArray(json) || !json[SC_DATA.MAIN]) return {[SC_DATA.MAIN]: text}
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
    const string = regex instanceof RegExp ? regex.toString() : regex
    return string.split("/").slice(1, -1).join("/")
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
    const { LOVE, HATE, LIKE, DISLIKE } = SC_DISP
    const { MARRIED, LOVERS, FRIENDS } = SC_TYPE
    const { LESS, EX, MORE } = SC_MOD

    // Determine score based on relationship disposition
    const dispScore = [LOVE, HATE].includes(disp) ? 1 : ([LIKE, DISLIKE].includes(disp) ?  0.5 : 0.1)

    // Score based on relationship type
    let typeScore
    if ([MARRIED, LOVERS].includes(type)) typeScore = 0.8
    else if (type === FRIENDS) typeScore = 0.6
    else typeScore = 0.4

    if (mod === EX) typeScore /= 2.5
    else if (mod === LESS) typeScore /= 1.25
    else if (mod === MORE) typeScore *= 1.25

    return { disp: dispScore, type: typeScore }
  }

  getRelKeys(scope, data, within) {
    const text = data && (within ? data[within] : data[scope])
    if (!text) return []

    const entry = this.worldInfoByLabel[data.label]
    if (!entry) return []

    const labels = []
    return [...text.matchAll(SC_RE.REL_KEYS)]
      // Remove invalid keys
      .map(m => m.filter(k => !!k))
      // Get relationship object
      .map(m => this.getRelTemplate(scope, entry.data.label, m[1].split(":")[0].trim(), m.length >= 3 ? m[3] : SC_FLAG_DEFAULT))
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
    return `${rel.label}${rel.flag.text !== SC_FLAG_DEFAULT ? `:${rel.flag.text}` : ""}`
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

  getRelRule(text, validValues=[], implicitlyExcluded=[]) {
    const rule = text.split(",").reduce((result, value) => {
      value = value.trim()
      let scope = "included"
      if (value.startsWith("-")) {
        value = value.slice(1)
        scope = "excluded"
      }
      if (!validValues.length || validValues.includes(value)) result[scope].push(value)
      return result
    }, { included: [], excluded: [] })

    rule.excluded = implicitlyExcluded.reduce((result, value) => {
      if (!result.included.includes(value)) result.push(value)
      return result
    }, rule.excluded)

    if (rule.included.length || rule.excluded.length) return rule
  }

  getRelReverse(entry, target) {
    const regex = new RegExp(`${target}(:([^,]+))?`, "i")

    for (const scope of SC_REL_ALL_KEYS) {
      if (!entry.data[scope]) continue
      const match = entry.data[scope].match(regex)
      if (!match) continue
      const flag = this.getRelFlagByText(match[2] ? match[2] : SC_FLAG_DEFAULT)
      return this.getRelTemplate(scope, entry.data.label, target, flag)
    }
  }

  getRelMatches(rel, pronoun) {
    const target = this.worldInfoByLabel[rel.label]
    const data = { source: rel }

    if (target) data.target = this.getRelReverse(target, rel.source)

    return this.titleMapping.data.reduce((result, rule) => {
      if (!rule.title) return result

      let fieldRule = rule.scope && this.getRelRule(rule.scope, SC_VALID_SCOPE)
      if (!this.isValidRuleValue(fieldRule, rel.scope)) return result

      for (const i of Object.keys(data)) {
        if (!rule[i]) continue

        fieldRule = rule[i].category && this.getRelRule(rule[i].category, SC_VALID_CATEGORY)
        if (!this.isValidRuleValue(fieldRule, data[i].category)) return result

        fieldRule = rule[i].pronoun && this.getRelRule(rule[i].pronoun, SC_VALID_PRONOUN)
        if (!this.isValidRuleValue(fieldRule, data[i].pronoun)) return result

        fieldRule = rule[i].entry && this.getRelRule(rule[i].entry)
        if (!this.isValidRuleValue(fieldRule, data[i].source)) return result

        fieldRule = rule[i].disp && this.getRelRule(`${rule[i].disp}`, SC_VALID_DISP)
        if (!this.isValidRuleValue(fieldRule, `${data[i].flag.disp}`)) return result

        fieldRule = rule[i].type && this.getRelRule(rule[i].type, SC_VALID_TYPE)
        if (!this.isValidRuleValue(fieldRule, data[i].flag.type)) return result

        fieldRule = rule[i].mod && this.getRelRule(rule[i].mod, SC_VALID_MOD, [SC_MOD.EX])
        if (!this.isValidRuleValue(fieldRule, data[i].flag.mod)) return result
      }

      result.push({ pronoun, title: rule.title, pattern: `(${rule.keys ? this.getRegexPattern(rule.keys) : rule.title})` })
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

  getRelTemplate(scope, sourceLabel, targetLabel, flagText) {
    const { creator } = this.state
    let flag = typeof flagText === "object" ? flagText : this.getRelFlagByText(flagText)
    let target = this.worldInfoByLabel[targetLabel] && this.worldInfoByLabel[targetLabel].data
    let source = this.worldInfoByLabel[sourceLabel] && this.worldInfoByLabel[sourceLabel].data
    if (!target && creator.data) target = creator.data
    if (!SC_RELATABLE.includes(source.type)) flag = this.getRelFlagByText(SC_FLAG_DEFAULT)
    else if (target && !SC_RELATABLE.includes(target.type)) flag = this.getRelFlag(flag.disp)
    return {
      scope,
      label: targetLabel,
      source: sourceLabel,
      category: source.type,
      pronoun: source.pronoun,
      flag
    }
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

  isValidRuleValue(rule, value) {
    const isIncluded = !rule || !rule.included.length || rule.included.includes(value)
    const notExcluded = !rule || !rule.excluded.length || !rule.excluded.includes(value)
    return isIncluded && notExcluded
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
        targetKeys.push(this.getRelTemplate(revScope, targetEntry.data.label, entry.data.label, flag))

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

      cache.pronouns[`${lookupPronoun} ${relationship.title}`] = {
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
        result.push({
          score: node.score, source: branch.label, target: node.label, relations: relations,
          scope: node.rel.scope, flag: node.rel.flag, weights: node.weights
        })
        return result
      }, []))
    }, [])

    // Sort all relations by score desc
    context.relations.sort((a, b) => b.score - a.score)
  }

  mapRelationsTree() {
    const { context } = this.state

    const branches = context.relations.reduce((a, c) => a.includes(c.source) ? a : a.concat(c.source), [])

    let tree = {}, tmpTree
    for (const rel of context.relations) {
      // Check already tracked
      if (tree[rel.source]) {
        if (tree[rel.source][SC_REL_JOIN_TEXT.CHARACTER] && tree[rel.source][SC_REL_JOIN_TEXT.CHARACTER][rel.target]) continue
        if (tree[rel.source][SC_REL_JOIN_TEXT.FACTION] && tree[rel.source][SC_REL_JOIN_TEXT.FACTION][rel.target]) continue
      }

      // Ignore source entries that are not character or faction, or that don't have an entry
      const entry = this.worldInfoByLabel[rel.source]
      const target = this.worldInfoByLabel[rel.target]

      if (entry && target && SC_RELATABLE.includes(entry.data.type) && SC_RELATABLE.includes(target.data.type)) {
        // Add various relationship titles (one by one)
        let limitReach = false
        const titleCount = rel.relations.length

        if (titleCount) {
          for (let i = 0; i < titleCount; i++) {
            tmpTree = Object.assign({}, tree)

            if (target.data.type === SC_CATEGORY.FACTION) {
              if (!tmpTree[rel.source]) tmpTree[rel.source] = {}
              if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.FACTION]) tmpTree[rel.source][SC_REL_JOIN_TEXT.FACTION] = {}
              if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.FACTION][rel.target]) tmpTree[rel.source][SC_REL_JOIN_TEXT.FACTION][rel.target] = []
              tmpTree[rel.source][SC_REL_JOIN_TEXT.FACTION][rel.target].push(rel.relations[i])
            }
            else {
              if (!tmpTree[rel.source]) tmpTree[rel.source] = {}
              if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.CHARACTER]) tmpTree[rel.source][SC_REL_JOIN_TEXT.CHARACTER] = {}
              if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.CHARACTER][rel.target]) tmpTree[rel.source][SC_REL_JOIN_TEXT.CHARACTER][rel.target] = []
              tmpTree[rel.source][SC_REL_JOIN_TEXT.CHARACTER][rel.target].push(rel.relations[i])
            }

            if (!this.isValidTreeSize(tmpTree)) {
              limitReach = true
              break
            }
            tree = tmpTree
          }
        }

        if (limitReach) break
      }

      // Skip adding to like/dislike if relation is not a branch level entry
      if (rel.relations.length && !branches.includes(rel.target)) continue

      // Build tree of likes/dislikes
      tmpTree = Object.assign({}, tree)
      if (rel.flag.disp === SC_DISP.HATE) {
        if (!tmpTree[rel.source]) tmpTree[rel.source] = {}
        if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.HATE]) tmpTree[rel.source][SC_REL_JOIN_TEXT.HATE] = []
        tmpTree[rel.source][SC_REL_JOIN_TEXT.HATE].push(rel.target)
      }
      else if (rel.flag.disp === SC_DISP.LOVE) {
        if (!tmpTree[rel.source]) tmpTree[rel.source] = {}
        if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.LIKE]) tmpTree[rel.source][SC_REL_JOIN_TEXT.LIKE] = []
        tmpTree[rel.source][SC_REL_JOIN_TEXT.LIKE].push(rel.target)
      }
      if (!this.isValidTreeSize(tmpTree)) break
      tree = tmpTree

      // Build tree of property/owners
      tmpTree = Object.assign({}, tree)
      if (rel.scope === SC_SCOPE.PROPERTY) {
        if (!tmpTree[rel.source]) tmpTree[rel.source] = {}
        if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.PROPERTY]) tmpTree[rel.source][SC_REL_JOIN_TEXT.PROPERTY] = []
        tmpTree[rel.source][SC_REL_JOIN_TEXT.PROPERTY].push(rel.target)
      }
      else if (rel.scope === SC_SCOPE.OWNERS) {
        if (!tmpTree[rel.source]) tmpTree[rel.source] = {}
        if (!tmpTree[rel.source][SC_REL_JOIN_TEXT.OWNERS]) tmpTree[rel.source][SC_REL_JOIN_TEXT.OWNERS] = []
        tmpTree[rel.source][SC_REL_JOIN_TEXT.OWNERS].push(rel.target)
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
      result.push({ metric: Object.assign({}, metric, { type: SC_REL_JOIN_TEXT.CHARACTER }), text: relEntry })
      this.modifiedSize += relEntry.length
      item.types.push(SC_REL_JOIN_TEXT.CHARACTER)
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
    modifiedText = this.menuHandler(text)
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
        if (this.state.isDebug) this.displayDebug()
        else state.message = ""
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
  menuHandler(text) {
    const { creator, you } = this.state
    const modifiedText = text.slice(1)

    // Already processing input
    if (creator.step) {
      this.menuNavHandler(modifiedText)
      return ""
    }

    // Quick refresh key
    if (modifiedText === SC_SHORTCUT.EXIT) {
      this.parseContext()
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
      else {
        this.menuExit()
        return ""
      }
    }

    const existing = this.worldInfoByLabel[label]
    if (this.relationsCommands.includes(cmd) && !existing) {
      this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Entry with that label does not exist, try creating it with '/entry ${label}${icon ? `:${icon}` : ""}' before continuing.`, false)
      return ""
    }

    // Store current message away to restore once done
    creator.previousMessage = state.message
    creator.cmd = cmd

    // Do title menu init
    if (this.titleCommands.includes(cmd)) {
      this.setTitleSource(label)

      // Add/update icon
      this.menuHandleIcon(icon)

      // Setup page
      creator.page = SC_UI_PAGE.TITLE
      creator.currentPage = 1
      creator.totalPages = 3

      // Direct to correct menu
      this.menuMatchStep()
    }
    else {
      // Preload entry if found, otherwise setup default values
      this.setEntrySource(existing || label)

      // Add/update icon
      this.menuHandleIcon(icon)

      // Setup page
      creator.page = this.entryCommands.includes(cmd) ? SC_UI_PAGE.ENTRY : SC_UI_PAGE.RELATIONS
      creator.currentPage = 1
      creator.totalPages = 1

      // Direct to correct menu
      if (this.entryCommands.includes(cmd)) {
        if (!creator.data.type) this.menuCategoryStep()
        else this.menuKeysStep()
      }
      else {
        if (SC_RELATABLE.includes(creator.data.type)) this.menuContactsStep()
        else this.menuOwnersStep()
      }
    }

    return ""
  }

  menuHandleIcon(icon) {
    const { creator } = this.state
    if (icon === undefined) return
    if (creator.data.icon) this.removeStat(creator.data.icon)
    if (!icon) delete creator.data.icon
    else creator.data.icon = icon
    creator.hasChanged = true
  }

  menuCurrentStep() {
    const { creator } = this.state
    const handlerString = `menu${creator.step}Step`
    if (typeof this[handlerString] === 'function') this[handlerString]()
    else this.menuExit()
  }

  menuNavHandler(text) {
    const { creator } = this.state

    // Exit handling
    if (text === SC_SHORTCUT.EXIT) {
      if (creator.hasChanged) return this.menuConfirmStep()
      else return this.menuExit()
    }

    // Previous page (and next page since all menu's only have the 2 pages so far)
    else if (text === SC_SHORTCUT.PREV_PAGE || text === SC_SHORTCUT.NEXT_PAGE) {
      if ([SC_UI_PAGE.ENTRY, SC_UI_PAGE.RELATIONS].includes(creator.page)) {
        if (!creator.data) return this.menuCategoryStep()
        return this.menuCurrentStep()
      }

      else if (creator.page === SC_UI_PAGE.TITLE) {
        if (text === SC_SHORTCUT.PREV_PAGE) {
          creator.currentPage = 3
          creator.page = SC_UI_PAGE.TARGET
          this.menuTargetCategoryStep()
        }
        else {
          creator.currentPage = 2
          creator.page = SC_UI_PAGE.SOURCE
          this.menuSourceCategoryStep()
        }
      }

      else if (creator.page === SC_UI_PAGE.SOURCE) {
        if (text === SC_SHORTCUT.PREV_PAGE) {
          creator.currentPage = 1
          creator.page = SC_UI_PAGE.TITLE
          this.menuMatchStep()
        }
        else {
          creator.currentPage = 3
          creator.page = SC_UI_PAGE.TARGET
          this.menuTargetCategoryStep()
        }
      }

      else if (creator.page === SC_UI_PAGE.TARGET) {
        if (text === SC_SHORTCUT.PREV_PAGE) {
          creator.currentPage = 2
          creator.page = SC_UI_PAGE.SOURCE
          this.menuSourceCategoryStep()
        }
        else {
          creator.currentPage = 1
          creator.page = SC_UI_PAGE.TITLE
          this.menuMatchStep()
        }
      }
    }

    // Goto field
    else if (text.startsWith(SC_SHORTCUT.GOTO)) {
      const index = Number(text.slice(1))
      if (!(index > 0)) return this.menuCurrentStep()

      if (creator.page === SC_UI_PAGE.ENTRY) {
        if (!creator.data) return this.menuCategoryStep()
        const { type } = creator.data

        let keys
        if (type === SC_CATEGORY.CHARACTER) keys = SC_ENTRY_CHARACTER_KEYS
        else if (type === SC_CATEGORY.FACTION) keys = SC_ENTRY_FACTION_KEYS
        else if (type === SC_CATEGORY.LOCATION) keys = SC_ENTRY_LOCATION_KEYS
        else if (type === SC_CATEGORY.THING) keys = SC_ENTRY_THING_KEYS
        else keys = SC_ENTRY_OTHER_KEYS
        keys = ["keys", ...keys]

        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
      else if (creator.page === SC_UI_PAGE.RELATIONS) {
        if (!creator.data) return this.menuCategoryStep()
        const { type } = creator.data

        let keys
        if (type === SC_CATEGORY.CHARACTER) keys = SC_REL_CHARACTER_KEYS
        else if (type === SC_CATEGORY.FACTION) keys = SC_REL_FACTION_KEYS
        else if (type === SC_CATEGORY.LOCATION) keys = SC_REL_LOCATION_KEYS
        else if (type === SC_CATEGORY.THING) keys = SC_REL_THING_KEYS
        else keys = SC_REL_OTHER_KEYS

        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
      else {
        const keys = creator.page === SC_UI_PAGE.TITLE ? ["keys", ...SC_TITLE_KEYS] : (creator.page === SC_UI_PAGE.SOURCE ? SC_TITLE_SOURCE_KEYS : SC_TITLE_TARGET_KEYS)
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
    }

    // Hints toggling
    else if (text === SC_SHORTCUT.HINTS) {
      this.state.showHints = !this.state.showHints
      return this.menuCurrentStep()
    }

    // Dynamically execute function based on step
    else {
      const handlerString = `menu${creator.step}Handler`
      if (typeof this[handlerString] === 'function') this[handlerString](text)
      else this.menuExit()
    }
  }

  // noinspection JSUnusedGlobalSymbols
  menuLabelHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.PREV) return this.menuLabelStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuKeysStep()
    else if (text === SC_SHORTCUT.DELETE) return this.menuConfirmStep(true)

    let [label, icon] = text.split(",")[0].split(":").map(m => m.trim())
    if (!label) return this.menuLabelStep()

    if (label !== creator.data.label && this.worldInfoByLabel[label]) {
      return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Entry with that label already exists, try again: `)
    }

    // Validate label
    creator.data.label = label
    creator.hasChanged = true

    // Add/update icon
    if (creator.data.icon) this.removeStat(creator.data.icon)
    if (!icon) delete creator.data.icon
    else creator.data.icon = icon

    this.menuLabelStep()
  }

  menuLabelStep() {
    const { creator } = this.state
    creator.step = "Label"
    this.displayMenuHUD(`${SC_UI_ICON.LABEL} Enter the LABEL used to refer to this entry: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuCategoryHandler(text) {
    const {creator} = this.state
    const cmd = text.slice(0, 1).toUpperCase()

    // Must fill in this field
    if (creator.data.type) {
      if (text === SC_SHORTCUT.PREV) return this.menuLabelStep()
      else if (text === SC_SHORTCUT.NEXT) return this.menuKeysStep()
    }

    if (cmd === "C") this.setEntryJson(SC_DATA.TYPE, SC_CATEGORY.CHARACTER)
    else if (cmd === "F") this.setEntryJson(SC_DATA.TYPE, SC_CATEGORY.FACTION)
    else if (cmd === "L") this.setEntryJson(SC_DATA.TYPE, SC_CATEGORY.LOCATION)
    else if (cmd === "T") this.setEntryJson(SC_DATA.TYPE, SC_CATEGORY.THING)
    else if (cmd === "O") this.setEntryJson(SC_DATA.TYPE, SC_CATEGORY.OTHER)
    else return this.menuCategoryStep()

    this.menuKeysStep()
  }

  menuCategoryStep() {
    const { creator } = this.state
    creator.step = "Category"
    this.displayMenuHUD(`${SC_UI_ICON.CHARACTER}${SC_UI_ICON.FACTION}${SC_UI_ICON.LOCATION}${SC_UI_ICON.THING}${SC_UI_ICON.OTHER} Enter the CATEGORY for this entry: (c/f/l/t/o)`, true, false, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuKeysHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.PREV) return this.menuLabelStep()
    else if (text === SC_SHORTCUT.NEXT) {
      if (creator.source || creator.keys) return this.menuMainStep()
      else return this.menuKeysStep()
    }
    else if (text === SC_SHORTCUT.DELETE) {
      creator.keys = ""
      return this.menuKeysStep()
    }

    // Ensure valid regex if regex key
    const key = this.getEntryRegex(text)
    if (!key) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in keys, try again: `)

    // Detect conflicting/existing keys and display error
    const existing = this.worldInfoByKeys[key.toString()] || this.worldInfoByKeys[text]
    const sourceIdx = creator.source ? creator.source.idx : -1
    if (existing && existing.idx !== sourceIdx) {
      if (!creator.source) {
        existing.keys = key.toString()
        this.setEntrySource(existing)
      }
      else return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! World Info with that key already exists, try again: `)
    }

    // Update keys to regex format
    creator.keys = key.toString()
    if (creator.data[SC_DATA.MAIN]) creator.hasChanged = true
    this.menuKeysStep()
  }

  menuKeysStep() {
    const { creator } = this.state
    creator.step = "Keys"
    this.displayMenuHUD(`${SC_UI_ICON.KEYS} Enter the KEYS used to trigger entry injection:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuMainHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.PREV) return this.menuKeysStep()
    else if (text === SC_SHORTCUT.NEXT) {
      if (!creator.source && !creator.data[SC_DATA.MAIN]) return this.menuMainStep()
      else if (type === SC_CATEGORY.FACTION) return this.menuTopicStep()
      else return this.menuSeenStep()
    }

    this.setEntryJson(SC_DATA.MAIN, text)
    creator.data.pronoun = this.getPronoun(creator.data[SC_DATA.MAIN])
    creator.hasChanged = true
    return this.menuMainStep()
  }

  menuMainStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.MAIN)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.MAIN.toUpperCase()]} Enter MAIN content to inject when this entries keys are found:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSeenHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.PREV) return this.menuMainStep()
    else if (text === SC_SHORTCUT.NEXT) {
      if (type === SC_CATEGORY.LOCATION) return this.menuTopicStep()
      else if (type === SC_CATEGORY.THING) return this.menuTopicStep()
      else return this.menuHeardStep()
    }

    this.setEntryJson(SC_DATA.SEEN, text)
    creator.hasChanged = true
    this.menuSeenStep()
  }

  menuSeenStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.SEEN)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.SEEN.toUpperCase()]} Enter content to inject when this entry is SEEN (optional):`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuHeardHandler(text) {
    const { creator } = this.state
    if (text === SC_SHORTCUT.PREV) return this.menuSeenStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuTopicStep()
    this.setEntryJson(SC_DATA.HEARD, text)
    creator.hasChanged = true
    this.menuHeardStep()
  }

  menuHeardStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.HEARD)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.HEARD.toUpperCase()]} Enter content to inject when this entry is HEARD (optional):`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTopicHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.PREV) {
      if (type === SC_CATEGORY.FACTION) return this.menuMainStep()
      else if (type === SC_CATEGORY.LOCATION) return this.menuSeenStep()
      else if (type === SC_CATEGORY.THING) return this.menuSeenStep()
      return this.menuHeardStep()
    }
    else if (text !== SC_SHORTCUT.NEXT) {
      this.setEntryJson(SC_DATA.TOPIC, text)
      creator.hasChanged = true
    }

    this.menuTopicStep()
  }

  menuTopicStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.TOPIC)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.TOPIC.toUpperCase()]} Enter content to inject when this entry is the TOPIC of conversation (optional):`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuContactsHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.PREV) return this.menuContactsStep()
    else if (text === SC_SHORTCUT.NEXT) {
      if (type === SC_CATEGORY.FACTION) return this.menuPropertyStep()
      return this.menuChildrenStep()
    }
    else if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.CONTACTS]) {
      delete creator.data[SC_DATA.CONTACTS]
      return this.menuContactsStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.CONTACTS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.PARENTS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.CHILDREN)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.CONTACTS]
    else creator.data[SC_DATA.CONTACTS] = relText
    creator.hasChanged = true
    this.menuContactsStep()
  }

  menuContactsStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.CONTACTS)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.CONTACTS.toUpperCase()]} Enter comma separated list of CONTACTS (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuChildrenHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.PREV) return this.menuContactsStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuParentsStep()
    else if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.CHILDREN]) {
      delete creator.data[SC_DATA.CHILDREN]
      return this.menuChildrenStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.CHILDREN)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.PARENTS)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.CHILDREN]
    else creator.data[SC_DATA.CHILDREN] = relText
    creator.hasChanged = true
    this.menuChildrenStep()
  }

  menuChildrenStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.CHILDREN)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.CHILDREN.toUpperCase()]} Enter comma separated list of CHILDREN (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuParentsHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.PREV) return this.menuChildrenStep()
    else if (text === SC_SHORTCUT.NEXT) {
      if (type === SC_CATEGORY.LOCATION) return this.menuOwnersStep()
      else if (type === SC_CATEGORY.THING) return this.menuOwnersStep()
      else if (type === SC_CATEGORY.OTHER) return this.menuOwnersStep()
      return this.menuPropertyStep()
    }
    else if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.PARENTS]) {
      delete creator.data[SC_DATA.PARENTS]
      return this.menuParentsStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.PARENTS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.CHILDREN)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.PARENTS]
    else creator.data[SC_DATA.PARENTS] = relText
    creator.hasChanged = true
    this.menuParentsStep()
  }

  menuParentsStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.PARENTS)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.PARENTS.toUpperCase()]} Enter comma separated list of PARENTS (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuPropertyHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.PREV) {
      if (type === SC_CATEGORY.FACTION) return this.menuContactsStep()
      return this.menuParentsStep()
    }
    else if (text === SC_SHORTCUT.NEXT) return this.menuOwnersStep()
    else if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.PROPERTY]) {
      delete creator.data[SC_DATA.PROPERTY]
      return this.menuPropertyStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.PROPERTY)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.OWNERS)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.PROPERTY]
    else creator.data[SC_DATA.PROPERTY] = relText
    creator.hasChanged = true
    this.menuPropertyStep()
  }

  menuPropertyStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.PROPERTY)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.PROPERTY.toUpperCase()]} Enter comma separated list of PROPERTY (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuOwnersHandler(text) {
    const { creator } = this.state
    const { type } = creator.data

    if (text === SC_SHORTCUT.PREV) {
      if (type === SC_CATEGORY.LOCATION) return this.menuOwnersStep()
      else if (type === SC_CATEGORY.THING) return this.menuOwnersStep()
      else if (type === SC_CATEGORY.OTHER) return this.menuOwnersStep()
      return this.menuPropertyStep()
    }
    else if (text === SC_SHORTCUT.NEXT) return this.menuOwnersStep()
    else if (text === SC_SHORTCUT.DELETE && creator.data[SC_DATA.OWNERS]) {
      delete creator.data[SC_DATA.OWNERS]
      return this.menuOwnersStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.OWNERS)
    rel = this.excludeRelations(rel, creator.data, SC_DATA.PROPERTY)
    this.exclusiveRelations(rel, creator.data, SC_DATA.CONTACTS)
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.OWNERS]
    else creator.data[SC_DATA.OWNERS] = relText
    creator.hasChanged = true
    this.menuOwnersStep()
  }

  menuOwnersStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.OWNERS)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.OWNERS.toUpperCase()]} Enter comma separated list of OWNERS (optional):`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTitleHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.PREV) return this.menuTitleStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuMatchStep()
    else if (text === SC_SHORTCUT.DELETE) return this.menuConfirmStep(true)

    let [title, icon] = text.split(",")[0].split(":").map(m => m.trim())
    if (!title) return this.menuTitleStep()

    if (title !== creator.data.title && this.titleMapping.data.find(r => r.title === title)) {
      return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Title with that name already exists, try again: `)
    }

    // Validate label
    creator.data.title = title
    creator.hasChanged = true

    // Add/update icon
    if (creator.data.icon) this.removeStat(creator.data.icon)
    if (!icon) delete creator.data.icon
    else creator.data.icon = icon

    this.menuTitleStep()
  }

  menuTitleStep() {
    const { creator } = this.state
    creator.step = "Title"
    this.displayMenuHUD(`${SC_UI_ICON.TITLE} Enter the TITLE to display: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuMatchHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.PREV) return this.menuTitleStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuScopeStep()
    else if (text === SC_SHORTCUT.DELETE) {
      creator.data.keys = ""
      return this.menuMatchStep()
    }

    // Ensure valid regex if regex key
    const key = this.getEntryRegex(text)
    if (!key) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in match, try again: `)

    // Update keys to regex format
    creator.data.keys = key.toString()
    creator.hasChanged = true
    this.menuMatchStep()
  }

  menuMatchStep() {
    const { creator } = this.state
    creator.step = "Match"
    this.displayMenuHUD(`${SC_UI_ICON.MATCH} Enter the keys to MATCH when doing extended pronoun matching (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuScopeHandler(text) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.PREV) return this.menuMatchStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuScopeStep()
    else if (text === SC_SHORTCUT.DELETE) {
      delete creator.data.scope
      creator.hasChanged = true
      return this.menuScopeStep()
    }

    // Validate data
    const values = text.toLowerCase().split(",").map(i => i.trim()).reduce((a, c) => a.concat(SC_VALID_SCOPE.includes(c) ? [c] : []), [])
    if (!values.length) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid scope detected, options are: ${SC_VALID_SCOPE.join(", ")}`)

    // Update data
    creator.data.scope = values.join(", ")
    creator.hasChanged = true
    return this.menuScopeStep()
  }

  menuScopeStep() {
    const { creator } = this.state
    creator.step = "Scope"
    this.displayMenuHUD(`${SC_UI_ICON.SCOPE} Enter the SCOPE to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceCategoryHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuSourceCategoryStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuSourceDispStep()
    return this.setTitleJson(text, "source", "category", SC_VALID_CATEGORY)
  }

  menuSourceCategoryStep() {
    const { creator } = this.state
    creator.step = "SourceCategory"
    this.displayMenuHUD(`${SC_UI_ICON.CATEGORY} (Source Entry) Enter the CATEGORY to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceDispHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuSourceCategoryStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuSourceTypeStep()
    return this.setTitleJson(text, "source", "disp", SC_VALID_DISP)
  }

  menuSourceDispStep() {
    const { creator } = this.state
    creator.step = "SourceDisp"
    this.displayMenuHUD(`${SC_UI_ICON.DISP} (Source Entry) Enter the relationship DISPOSITION to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceTypeHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuSourceDispStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuSourceModStep()
    return this.setTitleJson(text, "source", "type", SC_VALID_TYPE)
  }

  menuSourceTypeStep() {
    const { creator } = this.state
    creator.step = "SourceType"
    this.displayMenuHUD(`${SC_UI_ICON.TYPE} (Source Entry) Enter the relationship TYPE to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceModHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuSourceTypeStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuSourcePronounStep()
    return this.setTitleJson(text, "source", "mod", SC_VALID_MOD)
  }

  menuSourceModStep() {
    const { creator } = this.state
    creator.step = "SourceMod"
    this.displayMenuHUD(`${SC_UI_ICON.MOD} (Source Entry) Enter the relationship MOD to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourcePronounHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuSourceModStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuSourceEntryStep()
    return this.setTitleJson(text, "source", "pronoun", SC_VALID_PRONOUN)
  }

  menuSourcePronounStep() {
    const { creator } = this.state
    creator.step = "SourcePronoun"
    this.displayMenuHUD(`${SC_UI_ICON.PRONOUN} (Source Entry) Enter the PRONOUN to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceEntryHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuSourcePronounStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuSourceEntryStep()
    return this.setTitleJson(text, "source", "entry")
  }

  menuSourceEntryStep() {
    const { creator } = this.state
    creator.step = "SourceEntry"
    this.displayMenuHUD(`${SC_UI_ICON.ENTRY} (Source Entry) Enter the entry LABELS to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetCategoryHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuTargetCategoryStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuTargetDispStep()
    return this.setTitleJson(text, "target", "category", SC_VALID_CATEGORY)
  }

  menuTargetCategoryStep() {
    const { creator } = this.state
    creator.step = "TargetCategory"
    this.displayMenuHUD(`${SC_UI_ICON.CATEGORY} (Target Entry) Enter the CATEGORY to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetDispHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuTargetCategoryStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuTargetTypeStep()
    return this.setTitleJson(text, "target", "disp", SC_VALID_DISP)
  }

  menuTargetDispStep() {
    const { creator } = this.state
    creator.step = "TargetDisp"
    this.displayMenuHUD(`${SC_UI_ICON.DISP} (Target Entry) Enter the relationship DISPOSITION to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetTypeHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuTargetDispStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuTargetModStep()
    return this.setTitleJson(text, "target", "type", SC_VALID_TYPE)
  }

  menuTargetTypeStep() {
    const { creator } = this.state
    creator.step = "TargetType"
    this.displayMenuHUD(`${SC_UI_ICON.TYPE} (Target Entry) Enter the relationship TYPE to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetModHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuTargetTypeStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuTargetPronounStep()
    return this.setTitleJson(text, "target", "mod", SC_VALID_MOD)
  }

  menuTargetModStep() {
    const { creator } = this.state
    creator.step = "TargetMod"
    this.displayMenuHUD(`${SC_UI_ICON.MOD} (Target Entry) Enter the relationship MOD to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetPronounHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuTargetModStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuTargetEntryStep()
    return this.setTitleJson(text, "target", "pronoun", SC_VALID_PRONOUN)
  }

  menuTargetPronounStep() {
    const { creator } = this.state
    creator.step = "TargetPronoun"
    this.displayMenuHUD(`${SC_UI_ICON.PRONOUN} (Target Entry) Enter the PRONOUN to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetEntryHandler(text) {
    if (text === SC_SHORTCUT.PREV) return this.menuTargetPronounStep()
    else if (text === SC_SHORTCUT.NEXT) return this.menuTargetEntryStep()
    return this.setTitleJson(text, "target", "entry")
  }

  menuTargetEntryStep() {
    const { creator } = this.state
    creator.step = "TargetEntry"
    this.displayMenuHUD(`${SC_UI_ICON.ENTRY} (Target Entry) Enter the entry LABELS to filter by (optional): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfirmHandler(text) {
    const { creator } = this.state

    if ([SC_SHORTCUT.PREV, SC_SHORTCUT.NEXT, SC_SHORTCUT.DELETE].includes(text)) return this.menuConfirmStep()

    // Exit without saving if anything other than "y" passed
    if (text.toLowerCase().startsWith("n")) return this.menuExit()
    if (!text.toLowerCase().startsWith("y")) return this.menuConfirmStep()

    if (this.titleCommands.includes(creator.cmd)) this.menuConfirmTitleHandler()
    else this.menuConfirmEntryHandler()
  }

  menuConfirmEntryHandler() {
    const { creator } = this.state
    const { data } = creator

    // Add missing data
    if (!data.pronoun) data.pronoun = this.getPronoun(data[SC_DATA.MAIN])

    // Lower for storage
    data.pronoun = data.pronoun.toLowerCase()
    data.type = data.type.toLowerCase()

    // Add new World Info
    if (!creator.remove) {
      const entry = JSON.stringify(data)
      if (!creator.source) addWorldEntry(creator.keys, entry)

      // Update existing World Info
      else updateWorldEntry(creator.source.idx, creator.keys, entry)
    }
    else if (creator.source) removeWorldEntry(creator.source.idx)

    // Confirmation message
    let successMessage = ""
    if (creator.source) {
      // Reload cached World Info
      this.loadWorldInfo()

      // Update preloaded info
      if (!this.state.you.id && this.state.data.you) this.state.you = this.getInfoMatch(this.state.data.you) || {}

      // Sync relationships and status
      if (!creator.remove) {
        this.syncEntry(this.worldInfoByKeys[creator.keys])
        this.loadWorldInfo()
      }

      // Confirmation message
      successMessage = `${SC_UI_ICON.SUCCESS} Entry '${creator.data.label}' was ${creator.remove ? "deleted" : (creator.source ? "updated" : "created")} successfully!`
    }

    // Reset everything back
    this.menuExit(false)

    // Update context
    this.parseContext()

    // Show message
    if (successMessage) this.messageOnce(successMessage)
  }

  menuConfirmTitleHandler() {
    const { creator } = this.state
    const { data } = creator

    // Perform update
    if (creator.source) this.titleMapping.data = this.titleMapping.data.filter(r => r.title !== creator.data.title)
    if (!creator.remove) this.titleMapping.data.push(data)
    updateWorldEntry(this.titleMapping.idx, SC_TITLE_MAPPING_ENTRY, JSON.stringify(this.titleMapping.data))

    // Confirmation message
    const successMessage = `${SC_UI_ICON.SUCCESS} Title '${creator.data.title}' was ${creator.remove ? "deleted" : (creator.source ? "updated" : "created")} successfully!`

    // Reset everything back
    this.menuExit(false)

    // Update context
    this.parseContext()

    // Show message
    this.messageOnce(successMessage)
  }

  menuConfirmStep(remove=false) {
    const { creator } = this.state
    creator.step = "Confirm"
    creator.remove = remove
    if (!remove) this.displayMenuHUD(`${SC_UI_ICON.CONFIRM} Do you want to save these changes? (y/n)`, false)
    else this.displayMenuHUD(`${SC_UI_ICON.WARNING} Are you sure you want to delete this entry? (y/n)`, false)
  }

  menuExit(update=true) {
    const { creator } = this.state
    if (creator.data && creator.data.icon) this.removeStat(creator.data.icon)
    state.message = creator.previousMessage
    this.state.creator = {}
    if (update) this.displayHUD()
  }

  displayMenuHUD(promptText, hints=true, relHints=false, entityHints=false) {
    const { creator } = this.state
    const { showHints } = this.state
    const output = []
    if (hints && showHints) {
      const paged = creator.totalPages > 1 ? `, '${SC_SHORTCUT.PREV_PAGE}' for prev page, '${SC_SHORTCUT.NEXT_PAGE}' for next page` : ""
      output.push(`Hint: Type '${SC_SHORTCUT.PREV}' for prev field, '${SC_SHORTCUT.NEXT}' for next field${paged}, '${SC_SHORTCUT.GOTO}' followed by a number for a specific field, '${SC_SHORTCUT.DELETE}' to delete, '${SC_SHORTCUT.EXIT}' to exit and '${SC_SHORTCUT.HINTS}' to toggle hints.${(relHints || entityHints) ? "" : "\n\n"}`)
      if (relHints) output.push(`You can type '${SC_SHORTCUT.DELETE}Ben, Lucy' to remove one or more individual items.\n`)
      if (entityHints) output.push(`You choose from '${SC_CATEGORY.CHARACTER.toLowerCase()}', '${SC_CATEGORY.FACTION.toLowerCase()}', '${SC_CATEGORY.LOCATION.toLowerCase()}', '${SC_CATEGORY.THING.toLowerCase()}' or '${SC_CATEGORY.OTHER.toLowerCase()}'.\n`)
    }
    output.push(`${promptText}`)
    state.message = output.join("\n")
    this.displayHUD()
  }

  setTitleSource(title) {
    const { creator } = this.state
    creator.source = this.titleMapping.data.find(r => r.title === title)
    creator.data = creator.source ? Object.assign({}, creator.source) : { title }
    if (!creator.data.keys) creator.data.keys = (new RegExp(title, "gi")).toString()
  }

  setEntrySource(source) {
    const { creator } = this.state
    if (typeof source === "object") {
      creator.source = source
      creator.keys = source.keys
      if (creator.data) creator.data = Object.assign({ label: creator.data.label }, source.data, { type: source.data.type || creator.data.type })
      else creator.data = Object.assign({ }, source.data)
      creator.data.pronoun = (creator.data.pronoun && creator.data.pronoun.toLowerCase()) || SC_PRONOUN.UNKNOWN
      creator.data.type = (creator.data.type && creator.data.type.toLowerCase()) || ""
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

  setTitleJson(text, section, field, validItems=[]) {
    const { creator } = this.state

    if (text === SC_SHORTCUT.DELETE) {
      delete creator.data[section][field]
      creator.hasChanged = true
      return this.menuCurrentStep()
    }

    // Validate data
    if (field === "type") text = text.toUpperCase()
    else if (field !== "entry") text = text.toLowerCase()
    const values = text.split(",").map(i => i.trim()).reduce((a, c) => a.concat((!validItems.length || validItems.includes(c.startsWith("-") ? c.slice(1) : c)) ? [c] : []), [])
    if (!values.length) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid ${field} detected, options are: ${validItems.join(", ")}`)

    // Update data
    if (!creator.data[section]) creator.data[section] = {}
    creator.data[section][field] = values.join(", ")
    creator.hasChanged = true
    return this.menuCurrentStep()
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
    const labels = Object.values(SC_UI_ICON).concat((creator.data && creator.data.icon) ? [creator.data.icon] : []).concat(this.loadedIcons)
    state.displayStats = state.displayStats.filter(s => !labels.includes((s.key || "").replace(SC_UI_ICON.SELECTED, "")))

    // Get correct stats to display
    let hudStats
    if (this.entryCommands.includes(creator.cmd)) hudStats = this.getEntryStats()
    else if (this.relationsCommands.includes(creator.cmd)) hudStats = this.getRelationsStats()
    else if (this.titleCommands.includes(creator.cmd)) hudStats = this.getTitleStats()
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
            const injectedEmojis = inj.types.filter(t => ![SC_DATA.MAIN, SC_REL_JOIN_TEXT.CHARACTER].includes(t)).map(t => SC_UI_ICON[`INJECTED_${t.toUpperCase()}`]).join("")
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
      if (type === SC_CATEGORY.CHARACTER && SC_ENTRY_CHARACTER_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.FACTION && SC_ENTRY_FACTION_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.LOCATION && SC_ENTRY_LOCATION_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.THING && SC_ENTRY_THING_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.OTHER && SC_ENTRY_OTHER_KEYS.includes(key)) validKey = true
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
      if (type === SC_CATEGORY.CHARACTER && SC_REL_CHARACTER_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.FACTION && SC_REL_FACTION_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.LOCATION && SC_REL_LOCATION_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.THING && SC_REL_THING_KEYS.includes(key)) validKey = true
      if (type === SC_CATEGORY.OTHER && SC_REL_OTHER_KEYS.includes(key)) validKey = true
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
        this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in '${creator.searchPattern}', try again:`)
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

  getTitleStats() {
    const { creator } = this.state
    let displayStats = []

    // Find references
    const track = this.worldInfo.reduce((result, entry) => {
      const text = (creator.data.source ? (creator.data.source.entry || "")  : "") + " " + (creator.data.target ? (creator.data.target.entry || "")  : "")
      if (text.includes(entry.data.label)) result.push(`${this.getEntryEmoji(entry)} ${entry.data.label}`)
      return result
    }, [])

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats([], track, []))

    // Display MATCH
    if (creator.page === SC_UI_PAGE.TITLE) displayStats.push({
      key: this.getSelectedLabel(SC_UI_ICON.MATCH), color: SC_UI_COLOR.MATCH,
      value: `${creator.data.keys || SC_UI_ICON.EMPTY}\n`
    })

    // Display all ENTRIES
    const keys = creator.page === SC_UI_PAGE.TITLE ? SC_TITLE_KEYS : (creator.page === SC_UI_PAGE.SOURCE ? SC_TITLE_SOURCE_KEYS : SC_TITLE_TARGET_KEYS)
    for (let key of keys) {
      const cleanKey = key.replace("source", "").replace("target", "").toLowerCase()

      let data
      if (key.startsWith("source") && creator.data.source) data = creator.data.source[cleanKey]
      else if (key.startsWith("target") && creator.data.target) data = creator.data.target[cleanKey]
      else data = creator.data[cleanKey]

      displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON[cleanKey.toUpperCase()]), color: SC_UI_COLOR[cleanKey.toUpperCase()],
        value: `${data || SC_UI_ICON.EMPTY}\n`
      })
    }

    return displayStats
  }

  getLabelTrackStats(track=[], extended=[], other=[], showLabel=true) {
    const { creator } = this.state
    const displayStats = []

    if (showLabel && creator.data && (creator.data.title || creator.data.label)) {
      const pageText = creator.page ? `${SC_UI_ICON.SEPARATOR} ${creator.page === SC_UI_PAGE.ENTRY && creator.data.type ? creator.data.type.toLowerCase() : creator.page}${creator.totalPages > 1 ? ` (${creator.currentPage}/${creator.totalPages})` : ""}` : ""
      const newline = `\n${SC_UI_ICON.BREAK}\n`

      if (creator.data.label) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.LABEL), color: SC_UI_COLOR.LABEL,
        value: `${creator.data.label}${pageText}${newline}`
      })

      else displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.TITLE), color: SC_UI_COLOR.TITLE,
        value: `${creator.data.title}${pageText}${newline}`
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
    const dispEmoji = SC_UI_ICON[SC_DISP_REV[rel.flag.disp]]
    const modEmoji = rel.flag.mod ? SC_UI_ICON[SC_MOD_REV[rel.flag.mod]] : ""
    const typeEmoji = rel.flag.type ? SC_UI_ICON[SC_TYPE_REV[rel.flag.type]] : ""
    return `${pronounEmoji} ${rel.label} [${dispEmoji}${typeEmoji}${modEmoji}]`
  }

  getTitleEmoji(rule) {
    return (rule && rule.icon) ? rule.icon : SC_UI_ICON.TITLE
  }

  getEntryEmoji(entry) {
    if (!entry) return SC_UI_ICON.EMPTY

    const { you } = this.state
    const { type, icon, pronoun } = entry.data

    if (you.id && you.id === entry.id) return SC_UI_ICON[SC_PRONOUN.YOU.toUpperCase()]
    if (icon) return icon
    if (type === SC_CATEGORY.CHARACTER) return SC_UI_ICON[pronoun.toUpperCase()]
    return SC_UI_ICON[type.toUpperCase() || "EMPTY"]
  }

  getSelectedLabel(label) {
    const { creator } = this.state
    const step = SC_UI_ICON[creator.step.replace(/^(source|target)/i, "").toUpperCase()]
    const icon = (!this.titleCommands.includes(creator.cmd) && label === SC_UI_ICON.LABEL) ? this.getEntryEmoji(creator) : (label === SC_UI_ICON.TITLE ? this.getTitleEmoji(creator.data) : label)
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
