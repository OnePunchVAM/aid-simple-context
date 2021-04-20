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

// Shortcut commands used to navigate the various menu UI
const SC_UI_SHORTCUT = { PREV: "<", NEXT: ">", PREV_PAGE: "<<", NEXT_PAGE: ">>", EXIT: "!", DELETE: "^", GOTO: "#", HINTS: "?" }

// Control over UI icons and labels
const SC_UI_ICON = {
  // Tracking Labels
  TRACK: " ",
  TRACK_MAIN: "✔️ ",
  TRACK_OTHER: "⭕ ",
  TRACK_EXTENDED: "🔗 ",

  // Find Labels
  FIND_SCENES: "🎬 ",
  FIND_ENTRIES: "🎭 ",
  FIND_TITLES: "🏷️ ",

  // Main HUD Labels
  HUD_POV: "🕹️ ",
  HUD_SCENE: "🎬 ",
  HUD_THINK: "💭 ",
  HUD_FOCUS: "🧠 ",

  // Config Labels
  CONFIG: "⚙️ ",
  CONFIG_SPACING: "Paragraph Spacing Enabled",
  CONFIG_SIGNPOSTS: "Signposts Enabled",
  CONFIG_PROSE_CONVERT: "Convert Prose to Futureman",
  CONFIG_HUD_MAXIMIZED: "HUD Maximized",
  CONFIG_HUD_MINIMIZED: "HUD Minimized",
  CONFIG_REL_SIZE_LIMIT: "Relations Size Limit",
  CONFIG_ENTRY_INSERT_DISTANCE: "Entry Insert Distance",
  CONFIG_SIGNPOSTS_DISTANCE: "Signposts Distance",
  CONFIG_SIGNPOSTS_INITIAL_DISTANCE: "Signposts Initial Distance",
  CONFIG_DEAD_TEXT: "Dead Text",
  CONFIG_SCENE_BREAK: "Scene Break Text",

  // Entry Labels
  LABEL: "🔖 ",
  TRIGGER: "🔍 ",
  MAIN: "📑 ",
  SEEN: "👁️ ",
  HEARD: "🔉 ",
  TOPIC: "💬 ",

  // Relationship Labels

  AREAS: "🗺️ ",
  THINGS: "📦",
  COMPONENTS: "⚙️ ",
  CONTACTS: "👋 ",
  PARENTS: "🧬 ",
  CHILDREN: "🧸 ",
  PROPERTY: "💰 ",
  OWNERS: "🙏 ",

  // Title Labels
  TITLE: "🏷️ ",
  MATCH: "🔍 ",
  SCOPE: "🧑‍🤝‍🧑 ",
  CATEGORY: "🎭 ",
  DISP: "🤩 ",
  TYPE: "🥊 ",
  MOD: "💥 ",
  PRONOUN: "🔱 ",
  STATUS: "💀 ",
  ENTRY: "📌 ",

  // Scene Labels
  PROMPT: "📝 ",

  // Notes Labels
  NOTES: "✒️ ",
  NOTE_TEXT: "📚 ",
  NOTE: "📓 ",
  RATING: "📕 ",
  STYLE: "📙 ",
  GENRE: "📒 ",
  SETTING: "📗 ",
  THEME: "📘 ",
  SUBJECT: "📔 ",

  // Title options
  CATEGORY_OPTIONS: "🎭🗺️📦👑💡 ",
  DISP_OPTIONS: "🤬😒😐😀🤩 ",
  TYPE_OPTIONS: "🤝💞✊💍🥊 ",
  MOD_OPTIONS: "👍👎💥 ",
  STATUS_OPTIONS: "❤️💀🧟 ",
  PRONOUN_OPTIONS: "🎗️➰🔱 ",

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

  // Extended Relationships
  SIBLINGS: "(s) ",
  SIBLINGS_CHILDREN: "(sc) ",
  PARENTS_SIBLINGS: "(ps) ",
  GRANDPARENTS: "(gp) ",
  GRANDCHILDREN: "(gc) ",

  // Character Pronoun Icons
  YOU: "🕹️",
  HER: "🎗️",
  HIM: "➰",
  UNKNOWN: "🔱",

  // Entry Category Icons
  CHARACTER: "🎭",
  LOCATION: "🗺️",
  THING: "📦",
  FACTION: "👑",
  OTHER: "💡",
  SCENE: "🎬",

  // Character can have relationships
  // Location has many areas, location has layout to traverse areas, each area is a WI, can have owner, can have faction ownership
  // Faction has many roles, each role is subordinate to a role above, top role is faction leader
  // Thing can have location/area, can have owner, can have faction ownership
  // Other generic entry

  // General Icons
  ON: "✔️",
  OFF: "❌",
  CONFIRM: "✔️",
  SUCCESS: "🎉",
  INFO: "💡",
  SEARCH: "🔍",
  WARNING: "⚠️",
  ERROR: "💥",
  SEPARATOR: "  ∙∙ ",
  SELECTED: "🔅 ",
  EMPTY: "❔ ",
  MEASURE: "📏",
  TOGGLE: "🔲",
  TEXT: "✒️",
  BREAK: "〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️"
}

// Control over UI colors
const SC_UI_COLOR = {
  // Tracking UI
  TRACK: "chocolate",
  TRACK_MAIN: "chocolate",
  TRACK_EXTENDED: "dimgrey",
  TRACK_OTHER: "brown",

  // Find UI
  FIND_SCENES: "indianred",
  FIND_ENTRIES: "chocolate",
  FIND_TITLES: "dimgrey",

  // Story UI
  HUD_POV: "slategrey",
  HUD_SCENE: "steelblue",
  HUD_THINK: "seagreen",
  HUD_FOCUS: "indianred",

  // Config UI
  CONFIG: "indianred",
  CONFIG_SPACING: "seagreen",
  CONFIG_SIGNPOSTS: "seagreen",
  CONFIG_PROSE_CONVERT: "seagreen",
  CONFIG_HUD_MAXIMIZED: "steelblue",
  CONFIG_HUD_MINIMIZED: "steelblue",
  CONFIG_REL_SIZE_LIMIT: "slategrey",
  CONFIG_ENTRY_INSERT_DISTANCE: "slategrey",
  CONFIG_SIGNPOSTS_DISTANCE: "slategrey",
  CONFIG_SIGNPOSTS_INITIAL_DISTANCE: "slategrey",
  CONFIG_DEAD_TEXT: "dimgrey",
  CONFIG_SCENE_BREAK: "dimgrey",

  // Entry UI,
  LABEL: "indianred",
  TRIGGER: "seagreen",
  MAIN: "steelblue",
  SEEN: "slategrey",
  HEARD: "slategrey",
  TOPIC: "slategrey",

  // Relationship UI
  CONTACTS: "seagreen",
  COMPONENTS: "steelblue",
  AREAS: "steelblue",
  THINGS: "slategrey",
  CHILDREN: "steelblue",
  PARENTS: "steelblue",
  PROPERTY: "slategrey",
  OWNERS: "slategrey",

  // Title Labels
  TITLE: "indianred",
  MATCH: "seagreen",
  CATEGORY: "steelblue",
  DISP: "steelblue",
  TYPE: "steelblue",
  MOD: "steelblue",
  STATUS: "steelblue",
  PRONOUN: "steelblue",
  ENTRY: "steelblue",
  SCOPE: "slategrey",

  // Scene UI
  YOU: "seagreen",
  PROMPT: "slategrey",

  // Notes UI
  NOTES: "indianred",
  NOTE_TEXT: "slategrey",
  NOTE: "seagreen",
  RATING: "steelblue",
  STYLE: "steelblue",
  GENRE: "slategrey",
  SETTING: "slategrey",
  THEME: "dimgrey",
  SUBJECT: "dimgrey"
}

// Control over page titles
const SC_UI_PAGE = {
  CONFIG: "Configuration",
  SCENE: "Scene",
  SCENE_EDITOR: "Editor's Note",
  SCENE_AUTHOR: "Author's Note",
  NOTES_EDITOR: "Editor's Note",
  NOTES_AUTHOR: "Author's Note",
  ENTRY: "Entry",
  ENTRY_RELATIONS: "Relations",
  TITLE_TARGET: "Title ∙∙ Target Entry",
  TITLE_SOURCE: "Title ∙∙ Source Entry"
}

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
 * [1-5][FLAME][-+x]
 *
 * eg: Jill:1 Jack:4F, Mary:2Lx, John:3A+
 *
 */
const SC_HUD = { TRACK: "track", POV: "pov", SCENE: "scene" }
const SC_DATA = {
  // General
  LABEL: "label", TRIGGER: "trigger", REL: "rel",
  // Scene
  YOU: "you", PROMPT: "prompt", EDITOR: "editor", AUTHOR: "author",
  // Title
  TARGET: "target", SOURCE: "source",
  // Entry
  CATEGORY: "category", STATUS: "status", PRONOUN: "pronoun", MAIN: "main", SEEN: "seen", HEARD: "heard", TOPIC: "topic",
  // Relationships
  CONTACTS: "contacts", AREAS: "areas", THINGS: "things", COMPONENTS: "components", CHILDREN: "children", PARENTS: "parents", PROPERTY: "property", OWNERS: "owners",
  // Config
  CONFIG_SPACING: "spacing",
  CONFIG_SIGNPOSTS: "signposts",
  CONFIG_PROSE_CONVERT: "prose_convert",
  CONFIG_SIGNPOSTS_DISTANCE: "signposts_distance",
  CONFIG_SIGNPOSTS_INITIAL_DISTANCE: "signposts_initial_distance",
  CONFIG_REL_SIZE_LIMIT: "rel_size_limit",
  CONFIG_ENTRY_INSERT_DISTANCE: "entry_insert_distance",
  CONFIG_SCENE_BREAK: "scene_break",
  CONFIG_DEAD_TEXT: "dead_text",
  CONFIG_HUD_MAXIMIZED: "hud_maximized",
  CONFIG_HUD_MINIMIZED: "hud_minimized"
}
const SC_SCOPE = {
  CONTACTS: SC_DATA.CONTACTS, AREAS: SC_DATA.AREAS, THINGS: SC_DATA.THINGS, COMPONENTS: SC_DATA.COMPONENTS, CHILDREN: SC_DATA.CHILDREN, PARENTS: SC_DATA.PARENTS, PROPERTY: SC_DATA.PROPERTY, OWNERS: SC_DATA.OWNERS,
  SIBLINGS: "siblings", GRANDPARENTS: "grandparents", GRANDCHILDREN: "grandchildren", PARENTS_SIBLINGS: "parents siblings", SIBLINGS_CHILDREN: "siblings children"
}
const SC_SCOPE_OPP = { CONTACTS: SC_SCOPE.CONTACTS, CHILDREN: SC_SCOPE.PARENTS, PARENTS: SC_SCOPE.CHILDREN, PROPERTY: SC_SCOPE.OWNERS, OWNERS: SC_SCOPE.PROPERTY }
const SC_CATEGORY = { CHARACTER: "character", LOCATION: "location", THING: "thing", FACTION: "faction", OTHER: "other" }
const SC_STATUS = { ALIVE: "alive", DEAD: "dead", UNDEAD: "undead" }
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

const SC_REL_ALL_KEYS = [ SC_DATA.CONTACTS, SC_DATA.PARENTS, SC_DATA.CHILDREN, SC_DATA.AREAS, SC_DATA.THINGS, SC_DATA.COMPONENTS, SC_DATA.PROPERTY, SC_DATA.OWNERS ]
const SC_REL_CHARACTER_KEYS = [ SC_DATA.CONTACTS, SC_DATA.PARENTS, SC_DATA.CHILDREN, SC_DATA.PROPERTY, SC_DATA.OWNERS ]
const SC_REL_FACTION_KEYS = [ SC_DATA.CONTACTS, SC_DATA.PROPERTY, SC_DATA.OWNERS ]
const SC_REL_LOCATION_KEYS = [ SC_DATA.AREAS, SC_DATA.THINGS, SC_DATA.OWNERS ]
const SC_REL_THING_KEYS = [ SC_DATA.COMPONENTS, SC_DATA.OWNERS ]
const SC_REL_OTHER_KEYS = [ SC_DATA.OWNERS ]

const SC_TITLE_KEYS = [ "targetCategory", "targetDisp", "targetType", "targetMod", "targetStatus", "targetPronoun", "targetEntry", "scope" ]
const SC_TITLE_SOURCE_KEYS = [ "sourceCategory", "sourceDisp", "sourceType", "sourceMod", "sourceStatus", "sourcePronoun", "sourceEntry" ]

const SC_SCENE_PROMPT_KEYS = [ "sceneMain", "scenePrompt", "sceneYou" ]
const SC_SCENE_EDITORS_NOTE_KEYS = [ "editorNote", "editorRating", "editorStyle", "editorGenre", "editorSetting", "editorTheme", "editorSubject" ]
const SC_SCENE_AUTHORS_NOTE_KEYS = [ "authorNote", "authorRating", "authorStyle", "authorGenre", "authorSetting", "authorTheme", "authorSubject" ]
const SC_SCENE_NOTES_ALL_KEYS = [ ...SC_SCENE_EDITORS_NOTE_KEYS, ...SC_SCENE_AUTHORS_NOTE_KEYS ]

const SC_CONFIG_KEYS = [ "config_spacing", "config_signposts", "config_prose_convert", "config_hud_maximized", "config_hud_minimized", "config_rel_size_limit", "config_entry_insert_distance", "config_signposts_distance", "config_signposts_initial_distance", "config_dead_text", "config_scene_break" ]

const SC_VALID_SCOPE = Object.values(SC_SCOPE)
const SC_VALID_STATUS = Object.values(SC_STATUS)
const SC_VALID_PRONOUN = Object.values(SC_PRONOUN).filter(p => p !== SC_PRONOUN.YOU)
const SC_VALID_DISP = Object.values(SC_DISP).map(v => `${v}`)
const SC_VALID_TYPE = Object.values(SC_TYPE)
const SC_VALID_MOD = Object.values(SC_MOD)
const SC_VALID_CATEGORY = Object.values(SC_CATEGORY)
const SC_VALID_HUD = Object.values(SC_HUD)

const SC_SCOPE_REV = Object.assign({}, ...Object.entries(SC_SCOPE).map(([a,b]) => ({ [`${b}`]: a })))
const SC_DISP_REV = Object.assign({}, ...Object.entries(SC_DISP).map(([a,b]) => ({ [`${b}`]: a })))
const SC_TYPE_REV = Object.assign({}, ...Object.entries(SC_TYPE).map(([a,b]) => ({ [b]: a })))
const SC_MOD_REV = Object.assign({}, ...Object.entries(SC_MOD).map(([a,b]) => ({ [b]: a })))
const SC_FLAG_DEFAULT = `${SC_DISP.NEUTRAL}`

const SC_FEATHERLITE = "•"
const SC_SIGNPOST = "<<●>>>>"
const SC_SIGNPOST_BUFFER = 6

const SC_WI_SIZE = 500
const SC_WI_CONFIG = "#sc:config"
const SC_WI_REGEX = "#sc:regex"
const SC_WI_NOTES = "#sc:notes"
const SC_WI_ENTRY = "#entry:"
const SC_WI_TITLE = "#title:"
const SC_WI_SCENE = "#scene:"

const SC_DEFAULT_CONFIG = {
  [SC_DATA.CONFIG_SPACING]: 1,
  [SC_DATA.CONFIG_SIGNPOSTS]: 1,
  [SC_DATA.CONFIG_PROSE_CONVERT]: 1,
  [SC_DATA.CONFIG_HUD_MAXIMIZED]: "pov/scene, track",
  [SC_DATA.CONFIG_HUD_MINIMIZED]: "track",
  [SC_DATA.CONFIG_REL_SIZE_LIMIT]: 800,
  [SC_DATA.CONFIG_ENTRY_INSERT_DISTANCE]: 0.6,
  [SC_DATA.CONFIG_SIGNPOSTS_DISTANCE]: 300,
  [SC_DATA.CONFIG_SIGNPOSTS_INITIAL_DISTANCE]: 50,
  [SC_DATA.CONFIG_SCENE_BREAK]: "〰️",
  [SC_DATA.CONFIG_DEAD_TEXT]: "(dead)"
}
const SC_DEFAULT_TITLES = [{"title":"mother","trigger":"/mother|m[uo]m(m[ya])?/","scope":"parents","target":{"category":"character","pronoun":"her"},"source":{"category":"character"}},{"title":"father","trigger":"/father|dad(dy|die)?|pa(pa)?/","scope":"parents","target":{"category":"character","pronoun":"him"},"source":{"category":"character"}},{"title":"daughter","trigger":"/daughter/","scope":"children","target":{"category":"character","pronoun":"her"},"source":{"category":"character"}},{"title":"son","trigger":"/son/","scope":"children","target":{"category":"character","pronoun":"him"},"source":{"category":"character"}},{"title":"sister","trigger":"/sis(ter)?/","scope":"siblings","target":{"category":"character","pronoun":"her"},"source":{"category":"character"}},{"title":"brother","trigger":"/bro(ther)?/","scope":"siblings","target":{"category":"character","pronoun":"him"},"source":{"category":"character"}},{"title":"niece","trigger":"/niece/","scope":"siblings children","target":{"category":"character","pronoun":"her"},"source":{"category":"character"}},{"title":"nephew","trigger":"/nephew/","scope":"siblings children","target":{"category":"character","pronoun":"him"},"source":{"category":"character"}},{"title":"aunt","trigger":"/aunt/","scope":"parents siblings","target":{"category":"character","pronoun":"her"},"source":{"category":"character"}},{"title":"uncle","trigger":"/uncle/","scope":"parents siblings","target":{"category":"character","pronoun":"him"},"source":{"category":"character"}},{"title":"grandmother","trigger":"/gran(dmother|dma|ny)/","scope":"grandparents","target":{"category":"character","pronoun":"her"},"source":{"category":"character"}},{"title":"grandfather","trigger":"/grand(father|pa|dad)/","scope":"grandparents","target":{"category":"character","pronoun":"him"},"source":{"category":"character"}},{"title":"granddaughter","trigger":"/granddaughter/","scope":"grandchildren","target":{"category":"character","pronoun":"her"},"source":{"category":"character"}},{"title":"grandson","trigger":"/grandson/","scope":"grandchildren","target":{"category":"character","pronoun":"him"},"source":{"category":"character"}},{"title":"wife","trigger":"/wife/","target":{"category":"character","pronoun":"her","type":"M"},"source":{"category":"character"}},{"title":"ex wife","trigger":"/ex wife/","target":{"category":"character","pronoun":"her","type":"M","mod":"x"},"source":{"category":"character"}},{"title":"husband","trigger":"/husband/","target":{"category":"character","pronoun":"him","type":"M"},"source":{"category":"character"}},{"title":"ex husband","trigger":"/ex husband/","target":{"category":"character","pronoun":"him","type":"M","mod":"x"},"source":{"category":"character"}},{"title":"friend","trigger":"/friend/","target":{"category":"character, faction","type":"F","mod":"-+"},"source":{"category":"character, faction"}},{"title":"best friend","trigger":"/best friend|bff|bestie/","target":{"category":"character, faction","type":"F","mod":"+"},"source":{"category":"character, faction"}},{"title":"lover","trigger":"/lover/","target":{"category":"character","type":"L"},"source":{"category":"character"}},{"title":"ally","trigger":"/ally/","target":{"category":"character, faction","type":"A"},"source":{"category":"character, faction"}},{"title":"spouse","trigger":"/spouse/","target":{"category":"character","type":"M"},"source":{"category":"character"}},{"title":"enemy","trigger":"/enemy/","target":{"category":"character, faction","type":"E"},"source":{"category":"character, faction"}},{"title":"master","trigger":"/master/","scope":"owners","target":{"category":"character"},"source":{"category":"character"}},{"title":"slave","trigger":"/slave/","scope":"property","target":{"category":"character"},"source":{"category":"character"}},{"title":"has","target":{"category":"location, thing"},"source":{"category":"location, thing"}},{"title":"owned by","scope":"owners","target":{"category":"character, faction"},"source":{"category":"location, thing"}},{"title":"leader of","target":{"category":"faction","type":"M","mod":"+"},"source":{"category":"character"}},{"title":"led by","target":{"category":"character"},"source":{"category":"faction","type":"M","mod":"+"}},{"title":"member of","target":{"category":"faction","type":"M","mod":"-+"},"source":{"category":"character"}},{"title":"member","target":{"category":"character"},"source":{"category":"faction","type":"M","mod":"-+"}},{"title":"likes","source":{"category":"character","disp":5}},{"title":"hates","source":{"category":"character","disp":1}}]
const SC_DEFAULT_REGEX = {
  YOU: "you(r|rself)?",
  HER: "she|her(self|s)?",
  HIM: "he|him(self)?|his",
  FEMALE: "♀|female|woman|lady|girl|gal|chick|wife|mother|m[uo]m(m[ya])?|daughter|aunt|gran(dmother|dma|ny)|queen|princess|duchess|countess|baroness|empress|maiden|witch",
  MALE: "♂|male|man|gentleman|boy|guy|lord|lad|dude|husband|father|dad(dy|die)?|pa(pa)?|son|uncle|grand(father|pa|dad)|king|prince|duke|count|baron|emperor|wizard",
  DEAD: "dead|deceased|departed|died|expired|killed|lamented|perished|slain|slaughtered",
  UNDEAD: "banshee|draugr|dullahan|ghost|ghoul|grim reaper|jiangshi|lich|mummy|phantom|poltergeist|revenant|shadow person|skeleton|spectre|undead|vampire|vrykolakas|wight|wraith|zombie",
  LOOK_AHEAD: "describ(e)?|display|examin(e)?|expos(e)?|glimps(e)?|imagin(e)?|notic(e)?|observ(e)?|ogl(e)?|peek|see|spot(t)?|view|watch",
  LOOK_AHEAD_ACTION: "frown|gaz(e)?|glanc(e)?|glar(e)?|leer|look|smil(e)?|star(e[ds]?|ing)",
  LOOK_BEHIND: "appears|arrives|comes out|emerges|looms|materializes",
  LOOK_BEHIND_ACTION: "checked|displayed|examined|exposed|glimpsed|inspected|noticed|observed|regarded|scanned|scrutinized|seen|spotted|sprawl(ed|ing)|viewed|watched|wearing",
  USELESS_WORDS: "a|about|above|across|after|again|against|all|along|am|amid|among|an|and|any|are|around|as|at|be|because|been|before|being|below|between|both|but|by|can|circa|did|do|does|doing|don|down|during|each|fairly|few|for|from|further|had|has|have|having|hence|here|hereby|how|i|if|in|including|into|is|it|its|itself|just|less|like|maybe|me|minus|more|most|my|myself|near|next|no|nor|not|now|of|off|on|once|only|onto|or|other|our|ours|ourselves|out|over|own|per|perhaps|plus|re|regarding|respecting|s|same|sans|save|should|since|so|some|such|t|than|that|the|their|theirs|them|themselves|then|thence|there|thereby|therein|thereof|thereto|these|they|this|those|through|throughout|to|too|toward|towards|under|unlike|until|unto|up|upon|usually|very|was|we|were|what|whatever|when|whence|where|wherein|which|while|who|whom|why|will|with|within|you|your|yours|yourself|yourselves",
  INFLECTED: "(?:ing|ed)?",
  PLURAL: "(?:es|s|'s|e's)?",
}

const SC_RE = {
  INPUT_CMD: /^> You say "\/([\w!]+)\s?(.*)?"$|^> You \/([\w!]+)\s?(.*)?[.]$|^\/([\w!]+)\s?(.*)?$/,
  QUICK_CREATE_CMD: /^([@#$%^])([^:]+)(:[^:]+)?(:[^:]+)?(:[^:]+)?(:[^:]+)?/,
  WI_REGEX_KEYS: /.?\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)|[^,]+/g,
  BROKEN_ENCLOSURE: /(")([^\w])(")|(')([^\w])(')|(\[)([^\w])(])|(\()([^\w])(\))|({)([^\w])(})|(<)([^\w])(>)/g,
  ENCLOSURE: /([^\w])("[^"]+")([^\w])|([^\w])('[^']+')([^\w])|([^\w])(\[[^]]+])([^\w])|([^\w])(\([^)]+\))([^\w])|([^\w])({[^}]+})([^\w])|([^\w])(<[^<]+>)([^\w])/g,
  SENTENCE: /([^!?.]+[!?.]+[\s]+?)|([^!?.]+[!?.]+$)|([^!?.]+$)/g,
  ESCAPE_REGEX: /[.*+?^${}()|[\]\\]/g,
  DETECT_FORMAT: /^[●\[{<]|[\]}>]$/g,
  REL_KEYS: /([^,:]+)(:([1-5][FLAME]?[+\-x]?))|([^,]+)/gi,
  fromArray: (pattern, flags="g") => new RegExp(`${Array.isArray(pattern) ? pattern.join("|") : pattern}`, flags)
}
/*
 * END SECTION - Hardcoded Settings
 */


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  // Plugin control commands
  systemCommands = ["enable", "disable", "show", "hide", "min", "max", "debug"]

  // Plugin configuration
  configCommands = ["config"]

  // Global editor's note and author's note
  notesCommands = ["notes"]

  // Find scenes, entries and titles
  findCommands = ["find", "f"]

  // Create/Edit scenes, entries, relationships and titles
  sceneCommands = ["scene", "s"]
  entryCommands = ["entry", "e"]
  relationsCommands = ["rel", "r"]
  titleCommands = ["title", "t"]

  // Change scene and pov
  loadCommands = ["load", "load!"]
  povCommands = ["you"]

  constructor() {
    // All state variables scoped to state.simpleContextPlugin
    // for compatibility with other plugins
    if (!state.simpleContextPlugin) state.simpleContextPlugin = {
      you: "",
      at: "",
      scene: "",
      sections: {},
      creator: {},
      context: this.getContextTemplate(),
      info: { maxChars: 0, memoryLength: 0 },
      lastMessage: "",
      exitCreator: false,
      isDebug: false,
      isHidden: false,
      isDisabled: false,
      isMinimized: false,
      showHints: true
    }
    this.state = state.simpleContextPlugin
    this.queue = []
    this.addQueue = []
    this.removeQueue = []
  }

  initialize() {
    // Create master lists of commands
    this.controlCommands = [
      ...this.systemCommands,
      ...this.povCommands,
      ...this.loadCommands
    ]
    this.creatorCommands = [
      ...this.configCommands,
      ...this.notesCommands,
      ...this.sceneCommands,
      ...this.entryCommands,
      ...this.relationsCommands,
      ...this.titleCommands,
      ...this.findCommands
    ]

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

  finalize(text) {
    // Leave early if no WI changes
    const requiresProcessing = this.removeQueue.length || this.addQueue.length
    if (!requiresProcessing) return text

    // Process world info changes
    this.removeQueue = this.removeQueue.sort((a, b) => b - a)
    for (const idx of this.removeQueue) removeWorldEntry(idx)
    for (const [keys, entry] of this.addQueue) addWorldEntry(keys, entry)

    // Reset queues
    this.removeQueue = []
    this.addQueue = []

    // Load new changes
    this.loadWorldInfo()
    this.parseContext()
    return text
  }

  loadWorldInfo() {
    // Various cached copies of world info entries for fast access
    this.worldInfo = {}
    this.entries = {}
    this.entriesList = []
    this.titles = {}
    this.titlesList = []
    this.scenes = {}
    this.scenesList = []

    // Other configuration data saved to world info
    this.config = {}
    this.regex = {}
    this.notes = {}
    this.icons = {}

    // Main loop over worldInfo creating new entry objects with padded data
    for (let i = 0, l = worldInfo.length; i < l; i++) {
      const info = worldInfo[i]
      const entry = this.mergeWorldInfo(info, i)

      // Add system config mapping
      if (info.keys === SC_WI_CONFIG) this.config = entry

      // Add regex text mapping
      else if (info.keys === SC_WI_REGEX) this.regex = entry

      // Add notes text mapping
      else if (info.keys === SC_WI_NOTES) this.notes = entry

      // Add to main pool
      this.worldInfo[info.keys] = entry
    }

    // Secondary loop that pads with missing information
    let foundTitle = false
    for (const entry of Object.values(this.worldInfo)) {
      // Cache regex
      if (entry.data.trigger) {
        entry.regex = this.getEntryRegex(entry.data.trigger)
        entry.pattern = this.getRegexPattern(entry.regex)
      }

      // Merge prompts
      const promptFields = Object.keys(entry.data).filter(f => f.startsWith(SC_DATA.PROMPT))
      if (promptFields.length) {
        promptFields.sort()
        for (const field of promptFields) {
          if (!entry.data[SC_DATA.PROMPT]) entry.data[SC_DATA.PROMPT] = ""
          entry.data[SC_DATA.PROMPT] += entry.data[field]
          delete entry.data[field]
        }
      }

      // Create entry lists
      if (entry.keys.startsWith(SC_WI_ENTRY)) {
        this.entries[entry.data.label] = entry
        this.entriesList.push(entry)
        if (entry.data.icon) this.icons[entry.data.icon] = true
      }

      // Create scene lists
      else if (entry.keys.startsWith(SC_WI_SCENE)) {
        this.scenes[entry.data.label] = entry
        this.scenesList.push(entry)
        if (entry.data.icon) this.icons[entry.data.icon] = true
      }

      // Create title lists
      else if (entry.keys.startsWith(SC_WI_TITLE)) {
        foundTitle = true
        this.titles[entry.data.title] = entry
        this.titlesList.push(entry)
        if (entry.data.icon) this.icons[entry.data.icon] = true
      }
    }

    // If no config loaded, reload from defaults
    let finalize = false
    if (!this.config.data) {
      this.config.keys = SC_WI_CONFIG
      this.config.data = Object.assign({}, SC_DEFAULT_CONFIG)
      this.saveWorldInfo(this.config, true)
    }

    // Ensure all config is loaded
    else {
      for (const key of Object.keys(SC_DEFAULT_CONFIG)) {
        if (this.config.data[key] === undefined) this.config.data[key] = SC_DEFAULT_CONFIG[key]
      }
    }

    // If invalid regex mapping data, reload from defaults
    if (!this.regex.data) {
      this.regex.keys = SC_WI_REGEX
      this.regex.data = Object.assign({}, SC_DEFAULT_REGEX)
      this.saveWorldInfo(this.regex, true)
    }

    // Ensure all regex is loaded
    else {
      for (const key of Object.keys(SC_DEFAULT_REGEX)) {
        if (!this.regex.data[key]) this.regex.data[key] = SC_DEFAULT_REGEX[key]
      }
    }

    // If invalid title mapping data, reload from defaults
    if (!foundTitle) {
      const rules = SC_DEFAULT_TITLES.reduce((result, rule) => {
        if (rule.trigger) rule.trigger = rule.trigger.toString()
        if (rule.title) result.push(rule)
        return result
      }, [])

      for (const rule of rules) {
        this.saveWorldInfo({ keys: `${SC_WI_TITLE}${rule.title}`, data: rule }, true)
        finalize = true
      }
    }

    // Keep track of all icons so that we can clear display stats properly
    this.icons = Object.keys(this.icons)
  }

  mergeWorldInfo(info, idx) {
    const existing = this.worldInfo[info.keys]
    const merged = Object.assign(existing || { idx: [] }, info)
    const data = this.getJson(info.entry)
    if (this.isObject(data)) merged.data = this.deepMerge(merged.data || {}, data)
    else if (Array.isArray(data)) merged.data = (merged.data && merged.data.length) ? merged.data.concat(data) : data
    else merged.data = Object.assign(merged.data || {}, {[SC_DATA.MAIN]: info.entry})
    merged.entry = JSON.stringify(merged.data)
    merged.idx.push(idx)
    return merged
  }

  saveWorldInfo(entry, force=false) {
    // Don't do the same entry twice!
    if (!force && this.queue.includes(entry.data.label)) return
    this.queue.push(entry.data.label)

    // Remove old entries
    this.removeWorldInfo(entry)

    // Handle array data
    if (Array.isArray(entry.data)) {
      let chunk = []
      for (const item of entry.data) {
        const test = JSON.stringify([...chunk, item])
        if (test.length > SC_WI_SIZE) {
          this.addQueue.push([entry.keys, JSON.stringify(chunk)])
          chunk = []
        }
        chunk.push(item)
      }
      this.addQueue.push([entry.keys, JSON.stringify(chunk)])
    }

    // Handle object data
    else {
      let promptText
      let chunk = {}
      for (const key of Object.keys(entry.data)) {
        const value = entry.data[key]
        if (key === SC_DATA.PROMPT) {
          promptText = value
          continue
        }
        const test = JSON.stringify(Object.assign({}, chunk, { [key]: value }))
        if (test.length > SC_WI_SIZE) {
          this.addQueue.push([entry.keys, JSON.stringify(chunk)])
          chunk = {}
        }
        chunk[key] = value
      }
      this.addQueue.push([entry.keys, JSON.stringify(chunk)])

      // Handle prompt separation
      if (!promptText) return
      const sentences = this.getSentences(promptText)
      const maxSize = SC_WI_SIZE - SC_DATA.PROMPT.length - 8
      let prompt = 1
      let charCount = 0

      const prompts = sentences.reduce((result, sentence) => {
        charCount += sentence.length
        if (charCount >= maxSize) {
          prompt += 1
          charCount = 0
        }
        const field = `${SC_DATA.PROMPT}${prompt}`
        if (!result[field]) result[field] = []
        result[field].push(sentence)
        return result
      }, {})

      for (const field of Object.keys(prompts)) {
        if (!prompts[field].length) break
        this.addQueue.push([entry.keys, JSON.stringify({[field]: prompts[field].join("")})])
      }
    }
  }

  removeWorldInfo(entry) {
    if (entry.idx) for (const idx of entry.idx) this.removeQueue.push(idx)
    entry.idx = []
  }

  convertWorldInfo(category, regex, dryRun=true, keepOriginals=true) {
    const conversions = []

    // Only process if world info keys match convert pattern
    for (let idx = 0, l = worldInfo.length; idx < l; idx++) {
      const info = worldInfo[idx]
      if (info.keys.startsWith("#") || !info.keys.match(regex)) continue

      // Skip entries that already have a SC2 equiv
      const label = info.keys.split(",")[0].trim()
      const convertedKey = `${SC_WI_ENTRY}${label}`
      if (this.entries[convertedKey]) continue
      conversions.push(info.keys)

      if (!dryRun) {
        const trigger = this.getEntryRegex(info.keys).toString()
        const status = this.getStatus(info.entry)
        const pronoun = this.getPronoun(info.entry)
        const main = info.entry
        this.saveWorldInfo({ keys: convertedKey, data: { label, category, trigger, status, pronoun, main } })
        if (!keepOriginals) this.removeWorldInfo({ idx: [idx] })
      }
    }

    return conversions
  }

  syncEntry(entry) {
    // Updated associations after an entries relations is changed
    for (let rel of this.getRelAllKeys(entry.data)) {
      const targetEntry = this.entries[rel.label]
      if (!targetEntry) continue

      // Determine the reverse scope of the relationship
      const revScope = SC_SCOPE_OPP[rel.scope.toUpperCase()]
      if (!revScope) continue
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
        const flag = this.getRelFlag(SC_DISP.NEUTRAL, rel.flag.type, rel.flag.mod === SC_MOD.EX ? rel.flag.mod : "")
        targetKeys.push(this.getRelTemplate(revScope, targetEntry.data.label, entry.data.label, flag))

        // Ensure entry label isn't in other scopes
        for (let scope of SC_REL_ALL_KEYS.filter(k => k !== revScope)) {
          this.exclusiveRelations([{label: entry.data.label}], targetEntry.data, scope)
        }
      }

      // Create final text, remove if empty and update World Info
      targetEntry.data[revScope] = this.getRelCombinedText(targetKeys)
      if (!targetEntry.data[revScope]) delete targetEntry.data[revScope]
      this.saveWorldInfo(targetEntry)
    }
  }

  getJson(text) {
    try { return JSON.parse(text) }
    catch (e) {}
  }

  getEntryRegex(text, wrapOr=true) {
    let flags = "g"
    let brokenRegex = false
    let pattern = [...text.matchAll(SC_RE.WI_REGEX_KEYS)].map(match => {
      if (!match[1] && match[0].startsWith("/")) brokenRegex = true
      if (match[2]) flags = match[2].includes("g") ? match[2] : `g${match[2]}`
      return match[1] ? (wrapOr && match[1].includes("|") ? `(${match[1]})` : match[1]) : this.getEscapedRegex(match[0].trim())
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
    for (let i = 0, l = this.entriesList.length; i < l; i++) {
      const entry = this.entriesList[i]
      if (!entry.regex) continue
      const matches = [...text.matchAll(entry.regex)]
      if (matches.length) return entry
    }
  }

  getPronoun(text) {
    if (!text) return SC_PRONOUN.UNKNOWN
    if (!text.includes(":")) text = text.split(".")[0]
    if (text.match(new RegExp(`\\b(${this.regex.data.FEMALE})\\b`, "gi"))) return SC_PRONOUN.HER
    if (text.match(new RegExp(`\\b(${this.regex.data.MALE})\\b`, "gi"))) return SC_PRONOUN.HIM
    return SC_PRONOUN.UNKNOWN
  }

  getStatus(text) {
    if (!text) return SC_STATUS.ALIVE
    if (!text.includes(":")) text = text.split(".")[0]
    if (text.match(new RegExp(`\\b(${this.regex.data.UNDEAD})\\b`, "gi"))) return SC_STATUS.UNDEAD
    if (text.match(new RegExp(`\\b(${this.regex.data.DEAD})\\b`, "gi"))) return SC_STATUS.DEAD
    return SC_STATUS.ALIVE
  }

  getWeight(score, goal) {
    return score !== 0 ? ((score <= goal ? score : goal) / goal) : 0
  }

  getPlural(word, amount) {
    if (amount !== undefined && amount === 1) return word

    const plural = {
      '(quiz)$': "$1zes",
      '^(ox)$': "$1en",
      '([m|l])ouse$': "$1ice",
      '(matr|vert|ind)ix|ex$': "$1ices",
      '(x|ch|ss|sh)$': "$1es",
      '([^aeiouy]|qu)y$': "$1ies",
      '(hive)$': "$1s",
      '(?:([^f])fe|([lr])f)$': "$1$2ves",
      '(shea|lea|loa|thie)f$': "$1ves",
      'sis$': "ses",
      '([ti])um$': "$1a",
      '(tomat|potat|ech|her|vet)o$': "$1oes",
      '(bu)s$': "$1ses",
      '(alias)$': "$1es",
      '(octop)us$': "$1i",
      '(ax|test)is$': "$1es",
      '(us)$': "$1es",
      '([^s]+)$': "$1s"
    }

    const irregular = {
      'move': 'moves',
      'foot': 'feet',
      'goose': 'geese',
      'sex': 'sexes',
      'child': 'children',
      'man': 'men',
      'tooth': 'teeth',
      'person': 'people'
    }

    const uncountable = ['sheep',
      'fish',
      'deer',
      'moose',
      'series',
      'species',
      'money',
      'rice',
      'information',
      'equipment',
      'bison',
      'cod',
      'offspring',
      'pike',
      'salmon',
      'shrimp',
      'swine',
      'trout',
      'aircraft',
      'hovercraft',
      'spacecraft',
      'sugar',
      'tuna',
      'you',
      'wood'
    ]

    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(word.toLowerCase()) >= 0) {
      return word
    }

    // check for irregular forms
    for (const w in irregular) {
      const pattern = new RegExp(`${w}$`, 'i')
      const replace = irregular[w]
      if (pattern.test(word)) {
        return word.replace(pattern, replace)
      }
    }

    // check for matches using regular expressions
    for (const reg in plural) {
      const pattern = new RegExp(reg, 'i')
      if (pattern.test(word)) {
        return word.replace(pattern, plural[reg])
      }
    }

    return word
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

    const entry = this.entries[data.label]
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

  getRelAdjusted(text, data, scope, categories=[]) {
    if (!data) return []

    // Handle deletion
    if (text.startsWith(SC_UI_SHORTCUT.DELETE)) {
      const removeRel = this.getRelKeys(scope, {label: data.label, [scope]: text.slice(1)}).map(r => r.label)
      return this.getRelKeys(scope, data).filter(r => !removeRel.includes(r.label))
    }

    // Get relationships
    const adjusted = this.getRelKeys(scope, { label: data.label, [scope]: data[scope] ? `${text}, ${data[scope]}` : text })

    // Filter by category
    if (categories.length) return adjusted.filter(rel => {
      const target = this.entries[rel.label]
      if (!target || categories.includes(target.data.category)) return true
    })

    return adjusted
  }

  getRelRule(text, validValues=[], implicitlyExcluded=[]) {
    const rule = (text || "").split(",").reduce((result, value) => {
      value = value.trim()
      let scope = "included"
      if (value.startsWith("-") && value.length > 1) {
        value = value.slice(1)
        scope = "excluded"
      }
      if (!validValues.length || validValues.includes(value)) result[scope].push(value)
      return result
    }, { included: [], excluded: [] })

    rule.excluded = implicitlyExcluded.reduce((result, value) => {
      if (!rule.included.includes(value)) result.push(value)
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
    const target = this.entries[rel.label]
    const data = { source: rel }
    const reverse = this.getRelTemplate(rel.scope, rel.label, rel.source, this.getRelFlagByText(SC_FLAG_DEFAULT))

    // Attempt to get reverse mapping of relationship
    if (target) {
      data.target = this.getRelReverse(target, rel.source)
      if (!data.target) data.target = reverse
    }
    else data.target = reverse

    return this.titlesList.reduce((result, entry) => {
      const rule = entry.data
      if (!rule.title) return result

      // Return early if target required to match rule but none found
      if (rule.target && !data.target) return result

      // Match relationship scope
      let fieldRule = rule.scope && this.getRelRule(rule.scope, SC_VALID_SCOPE)
      if (!this.isValidRuleValue(fieldRule, rel.scope)) return result

      // Loop through rule set returning if any rule doesn't match
      for (const i of Object.keys(data)) {
        if (!rule[i] || !data[i]) continue

        // Match entry category
        fieldRule = rule[i].category && this.getRelRule(rule[i].category, SC_VALID_CATEGORY)
        if (!this.isValidRuleValue(fieldRule, data[i].category)) return result

        // Match entry status
        fieldRule = rule[i].status && this.getRelRule(rule[i].status, SC_VALID_STATUS)
        if (!this.isValidRuleValue(fieldRule, data[i].status)) return result

        // Match entry pronoun
        fieldRule = rule[i].pronoun && this.getRelRule(rule[i].pronoun, SC_VALID_PRONOUN)
        if (!this.isValidRuleValue(fieldRule, data[i].pronoun)) return result

        // Match entry label
        fieldRule = rule[i].entry && this.getRelRule(rule[i].entry)
        if (!this.isValidRuleValue(fieldRule, data[i].source)) return result

        // Match relationship disposition
        fieldRule = rule[i].disp && this.getRelRule(`${rule[i].disp}`, SC_VALID_DISP)
        if (!this.isValidRuleValue(fieldRule, `${data[i].flag.disp}`)) return result

        // Match relationship type
        fieldRule = rule[i].type && this.getRelRule(rule[i].type, SC_VALID_TYPE)
        if (!this.isValidRuleValue(fieldRule, data[i].flag.type)) return result

        // Match relationship modifier
        fieldRule = this.getRelRule(rule[i].mod, SC_VALID_MOD, [SC_MOD.EX])
        if (!this.isValidRuleValue(fieldRule, data[i].flag.mod)) return result
      }

      result.push({ pronoun, title: rule.title, pattern: rule.trigger && `(${this.getRegexPattern(rule.trigger)})` })
      return result
    }, [])
  }

  getRelMapping(entry, categories=[]) {
    return this.getRelExpKeys(entry.data).reduce((result, rel) => {
      const target = this.entries[rel.label]
      if (!target || (categories.length && !categories.includes(target.data.category))) return result

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
    let target = this.entries[targetLabel] && this.entries[targetLabel].data
    let source = this.entries[sourceLabel] && this.entries[sourceLabel].data
    if (!target && creator.data) target = creator.data
    if (source && !SC_RELATABLE.includes(source.category)) flag = this.getRelFlag(SC_DISP.NEUTRAL)
    else if (target && !SC_RELATABLE.includes(target.category)) flag = this.getRelFlag(flag.disp)

    // Default category for non-entries
    let category
    if (source) category = source.category
    else if ([SC_SCOPE.CHILDREN, SC_SCOPE.PARENTS, SC_SCOPE.OWNERS].includes(scope)) category = SC_CATEGORY.CHARACTER
    else if (scope === SC_DATA.AREAS) category = SC_CATEGORY.LOCATION
    else if ([SC_DATA.COMPONENTS, SC_DATA.THINGS].includes(scope)) category = SC_CATEGORY.THING

    return {
      scope,
      label: targetLabel,
      source: sourceLabel,
      category,
      pronoun: (source && source.pronoun) || SC_PRONOUN.UNKNOWN,
      status: source && source.status,
      flag
    }
  }

  getContextTemplate(text) {
    return {
      // Extrapolated matches and relationship data
      sizes: {}, metrics: [], relations: [], tree: {}, candidates: [], injected: [], pronouns: [],
      // Grouped sentences by section
      header: [], sentences: [], history: [],
      // Original text stored for parsing outside of contextModifier
      text: text || "", finalContext: ""
    }
  }

  getFormattedEntry(text, insertNewlineBefore=false, insertNewlineAfter=false, replaceYou=true) {
    if (!text) return

    // You replacement
    if (replaceYou) text = this.replaceYou(text)

    // Encapsulation of entry in brackets
    const match = [...text.matchAll(SC_RE.DETECT_FORMAT)]
    if (!match.length) text = text.split("\n").map(line => {
      // if (this.getConfig(SC_DATA.CONFIG_PROSE_CONVERT)) line = line
      //   .replace(new RegExp(`\\b(${this.regex.data.USELESS_WORDS})\\b`, "gi"), "")
      //   .replace(/\?|!| \./g, ".")
      //   .replace(/ +/g, " ")
      return `<< ${this.toTitleCase(this.appendPeriod(line.trim()))}>>>>`
    }).join("\n")

    // Final forms
    text = `${insertNewlineBefore ? "\n" : ""}${text}${insertNewlineAfter ? "\n" : ""}`

    return text
  }

  getNotes(section, notesData) {
    const { scene } = this.state

    if (notesData && !notesData[section]) return ""
    const data = (notesData && notesData[section]) || (scene && this.scenes[scene] && this.scenes[scene].data[section]) || (this.notes.data && this.notes.data[section])
    if (!data) return ""

    const notes = []
    if (data.hasOwnProperty("note")) notes.push(`${section === SC_DATA.EDITOR ? "Editor's note" : "Author's note"}: ${this.toTitleCase(this.appendPeriod(data.note))}`)
    if (data.hasOwnProperty("genre")) notes.push(`Genre: ${this.appendPeriod(data.genre)}`)
    if (data.hasOwnProperty("setting")) notes.push(`Setting: ${this.appendPeriod(data.setting)}`)
    if (data.hasOwnProperty("theme")) notes.push(`Theme: ${this.appendPeriod(data.theme)}`)
    if (data.hasOwnProperty("subject")) notes.push(`Subject: ${this.appendPeriod(data.subject)}`)
    if (data.hasOwnProperty("style")) notes.push(`Writing Style: ${this.appendPeriod(data.style)}`)
    if (data.hasOwnProperty("rating")) notes.push(`Rating: ${this.appendPeriod(data.rating)}`)
    return notes.join(" ")
  }

  getConfig(section) {
    const data = this.config.data[section]
    return data === undefined ? SC_DEFAULT_CONFIG[section] : data
  }

  getCategoryKeys(category) {
    if (category === SC_CATEGORY.CHARACTER) return SC_ENTRY_CHARACTER_KEYS
    else if (category === SC_CATEGORY.LOCATION) return SC_ENTRY_LOCATION_KEYS
    else if (category === SC_CATEGORY.THING) return SC_ENTRY_THING_KEYS
    else if (category === SC_CATEGORY.FACTION) return SC_ENTRY_FACTION_KEYS
    else return SC_ENTRY_OTHER_KEYS
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
    return text.length <= this.getConfig(SC_DATA.CONFIG_REL_SIZE_LIMIT) && this.isValidEntrySize(text)
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  deepMerge(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (source.hasOwnProperty(key) && this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  reduceRelations(result, rel, data, family=[]) {
    result.push(rel)
    const entry = this.entries[rel.label]
    if (!entry || data.label === rel.label) return result

    // Grandparents/Siblings
    if (rel.scope === SC_SCOPE.PARENTS) {
      result = result.concat([
        ...this.getRelKeys(SC_SCOPE.GRANDPARENTS, entry.data, SC_DATA.PARENTS),
        ...this.getRelKeys(SC_SCOPE.SIBLINGS, entry.data, SC_DATA.CHILDREN)
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

  appendPeriod(content) {
    if (!content) return ""
    return !content.match(/[.!?]$/) ? content + "." : content
  }

  toTitleCase(content) {
    return content.charAt(0).toUpperCase() + content.slice(1)
  }

  replaceYou(text) {
    const you = this.entries[this.state.you]
    if (!you) return text

    // Various text replacements to fix perspective change
    const youReplacements = [
      ["you is", "you are"],
      ["you was", "you were"],
      ["you has", "you have"],
      [/(^|[^.][.!?]\s+)you /g, "$1You "]
    ]

    // Match contents of /you and if found replace with the text "you"
    const youMatch = new RegExp(`\\b${you.data.label}${this.regex.data.PLURAL}\\b`, "gi")
    if (text.match(youMatch)) {
      text = text.replace(youMatch, "you")
      for (let [find, replace] of youReplacements) text = text.replace(find, replace)
    }

    return text
  }

  messageOnce(text) {
    if (!text.startsWith("\n")) text = `\n${text}`
    if (!state.message) state.message = ""
    state.message += text
    this.state.lastMessage += text
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
    this.state.info = info
    this.initialize()
    this.parseContext(text)
    return this.finalize(this.state.context.finalContext)
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

    // Inject signposts
    this.injectSignposts()

    // Truncate by full sentence to ensure context is within max length (info.maxChars - info.memoryLength)
    this.truncateContext()

    // Create final context to be passed back to processor
    this.buildFinalContext()

    // Display HUD
    this.displayHUD()

    // Display debug output
    this.displayDebug()
  }

  splitContext() {
    const { sections, info } = this.state
    const { text } = this.state.context
    const signpost = `${SC_SIGNPOST}\n`
    const sceneBreakText = this.getConfig(SC_DATA.CONFIG_SCENE_BREAK)
    const sceneBreakRegex = new RegExp(`${sceneBreakText}.*${sceneBreakText}\\n|\\n${sceneBreakText}.*${sceneBreakText}`)
    let sceneBreak = false

    // Set the original context length for later calculation
    this.originalSize = text.length

    // Setup and clean context
    const context = (info.memoryLength ? text.slice(info.memoryLength) : text)
      .replace(/([\n]{2,})/g, "\n")
      .split("\n").filter(l => !!l).join("\n")

    // Account for signpost usage
    if (this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) {
      this.modifiedSize += (Math.ceil(text.length / this.getConfig(SC_DATA.CONFIG_SIGNPOSTS_DISTANCE)) + SC_SIGNPOST_BUFFER) * signpost.length
    }

    // Split on scene break
    const split = this.getSentences(context).reduceRight((result, sentence, idx) => {
      if (!sceneBreak && sentence.includes(sceneBreakText)) {
        result.sentences.unshift(sentence.replace(sceneBreakRegex, ""))
        if (idx !== 0) result.history.unshift(`\n${SC_SIGNPOST}\n`)
        sceneBreak = true
      }
      else if (sceneBreak) {
        if (sentence.includes(sceneBreakText)) result.history.unshift(sentence.replace(sceneBreakRegex, ""))
        else result.history.unshift(sentence)
      }
      else result.sentences.unshift(sentence)
      return result
    }, this.getContextTemplate(text))

    // Build author's note entry
    const editorEntry = this.getFormattedEntry(this.getNotes(SC_DATA.EDITOR), false, true, false)
    if (this.isValidEntrySize(editorEntry)) this.modifiedSize += editorEntry.length

    // Build author's note entry
    const authorEntry = this.getFormattedEntry(this.getNotes(SC_DATA.AUTHOR), false, true, false)
    if (this.isValidEntrySize(authorEntry)) this.modifiedSize += authorEntry.length

    // Add notes items
    if (editorEntry || authorEntry) {
      if (editorEntry) split.header.push(editorEntry)
      if (authorEntry) split.header.push(authorEntry)
      if (this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) split.header.push(`${SC_SIGNPOST}\n`)
    }

    // Build pov entry
    const povEntry = this.getFormattedEntry(sections.pov, false, true, false)
    if (this.isValidEntrySize(povEntry)) {
      split.header.push(povEntry)
      if (this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) split.header.push(`${SC_SIGNPOST}\n`)
      this.modifiedSize += povEntry.length
    }

    // Build scene entry
    const sceneEntry = this.getFormattedEntry(sections.scene, false, true, false)
    if (this.isValidEntrySize(sceneEntry)) {
      split.header.push(`${sceneEntry}${SC_SIGNPOST}\n`)
      this.modifiedSize += sceneEntry.length
    }

    this.state.context = split
  }

  gatherMetrics() {
    // WARNING: Only use this sparingly!
    // Currently used to parse all the context for world info matches
    const { context } = this.state
    const cache = { pronouns: {}, relationships: {}, parsed: {}, entries: [], history: [] }

    // Cache only world entries that are applicable
    for (let i = 0, l = this.entriesList.length; i < l; i++) {
      const entry = this.entriesList[i]
      if (!entry.regex) continue

      const text = [...context.header, ...context.sentences].join("")
      const regex = new RegExp(`\\b${entry.pattern}${this.regex.data.PLURAL}\\b`, entry.regex.flags)
      const matches = [...text.matchAll(regex)]
      if (matches.length) cache.entries.push([entry, regex])
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

    context.pronouns = cache.pronouns

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
        metrics.push(Object.assign({}, metric, { type: SC_DATA.REL }))
        if (this.state.you !== entry.data.label) cache.history.unshift(entry)
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
        section, sentence, sentenceIdx: idx, entryLabel: target, pronoun,
        weights: { distance: this.getWeight(idx + 1, total), strength: metric.weights.strength }
      })
      this.matchMetrics(metrics, expMetric, this.entries[target], regex, true)
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
      if (!pronoun.includes(" ")) continue

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
      this.cachePronouns(expMetric, this.entries[expMetric.entryLabel], cache)
    }

    return metrics
  }

  matchMetrics(metrics, metric, entry, regex, pronounLookup=false) {
    // Get structured entry object, only perform matching if entry key's found
    const { data: RE } = this.regex
    const pattern = this.getRegexPattern(regex)
    const injPattern = pronounLookup ? pattern : `\\b(${pattern})${this.regex.data.PLURAL}\\b`
    const keys = this.getCategoryKeys(entry.category)

    // combination of match and specific lookup regex, ie (glance|look|observe).*(pattern)
    if (keys.includes(SC_DATA.SEEN)) {
      const expRegex = SC_RE.fromArray([
        `\\b(${RE.LOOK_AHEAD})${RE.INFLECTED}${RE.PLURAL}\\b.*${injPattern}`,
        `\\b(${RE.LOOK_AHEAD_ACTION})${RE.INFLECTED}${RE.PLURAL}\\b.*\\bat\\b.*${injPattern}`,
        `${injPattern}.*\\b(${RE.LOOK_BEHIND})\\b`,
        `${injPattern}.*\\bis\\b.*\\b(${RE.LOOK_BEHIND_ACTION})\\b`
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
    if (keys.includes(SC_DATA.HEARD)) {
      const expRegex = SC_RE.fromArray([
        `(\".*\"|'.*')(?=[^\\w]).*${injPattern}`,
        `${injPattern}.*(?=[^\\w])(\".*\"|'.*')`
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
    if (keys.includes(SC_DATA.TOPIC) && !pronounLookup) {
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

    // Determine pronoun type
    let lookupPattern, lookupPronoun
    if (you === entry.data.label) {
      lookupPattern = "your"
      lookupPronoun = SC_PRONOUN.YOU
    }
    else {
      if (pronoun === SC_PRONOUN.UNKNOWN) return
      lookupPattern = `${pronoun === SC_PRONOUN.HER ? "her" : "his"}`
      lookupPronoun = pronoun
    }

    // Add base pronoun
    const pattern = `\\b(${this.regex.data[lookupPronoun.toUpperCase()]})\\b`
    const regex = new RegExp(pattern, "gi")
    cache.pronouns[lookupPronoun] = { regex, metric: Object.assign({}, metric, { pattern }) }

    // Get cached relationship data
    if (!cache.relationships[label]) cache.relationships[label] = this.getRelMapping(entry, [SC_CATEGORY.CHARACTER])
    const relationships = cache.relationships[label]

    // Add relationship pronoun extensions for type character
    for (let relationship of relationships) {
      if (!relationship.pattern) continue

      const pattern = `\\b${lookupPattern}\\b.*\\b(${relationship.pattern})${this.regex.data.PLURAL}\\b`
      const regex = new RegExp(pattern, "gi")
      const target = relationship.targets.join("|")

      cache.pronouns[`${lookupPattern} ${relationship.title}`] = {
        regex, metric: Object.assign({}, metric, { pattern, entryLabel: target })
      }
    }
  }

  mapRelations() {
    const { context } = this.state
    const degreesGoal = 10
    const topLabels = []

    // Get all top level metrics with a unique entryLabel
    const firstPass = context.metrics.reduce((result, metric) => {
      const existing = result.find(b => b.label === metric.entryLabel)
      const item = existing || { scores: [] }
      item.scores.push(metric.score)
      if (!existing) {
        topLabels.push(metric.entryLabel)
        item.label = metric.entryLabel
        item.entry = this.entries[metric.entryLabel]
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
          const pronoun = (this.entries[rel.label] && this.entries[rel.label].data.pronoun) || SC_PRONOUN.UNKNOWN
          const weights = Object.assign({ metrics: (metricsWeight / (topLabels.includes(rel.label) ? 1 : 2)) }, this.getRelFlagWeights(rel))
          result.push({ label: rel.label, pronoun, rel, weights })
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
    let tree = {}, tmpTree

    // Add various relationship titles one by one
    for (const rel of context.relations) {
      const source = this.entries[rel.source]
      const target = this.entries[rel.target]
      const deadText = this.getConfig(SC_DATA.CONFIG_DEAD_TEXT)
      const sourceLabel = `${rel.source}${deadText && source && source.data.status === SC_STATUS.DEAD ? " " + deadText : ""}`
      const targetLabel = `${rel.target}${deadText && target && target.data.status === SC_STATUS.DEAD ? " " + deadText : ""}`

      for (const title of rel.relations) {
        tmpTree = this.mapRelationsFacet(tree, sourceLabel, title, targetLabel)
        if (!this.isValidTreeSize(tmpTree)) break
        tree = tmpTree
      }
    }

    // Clean up tree (remove ending array's if only 1 item)
    for (const source of Object.keys(tree)) {
      const sourceNode = tree[source]
      for (const join of Object.keys(sourceNode)) {
        const joinNode = sourceNode[join]
        if (Array.isArray(joinNode)) {
          if (joinNode.length === 1) sourceNode[join] = joinNode[0]
          else {
            const pluralJoin = this.getPlural(join, joinNode.length)
            sourceNode[pluralJoin] = [...joinNode]
            if (pluralJoin !== join) delete tree[source][join]
          }
        }
      }
    }

    context.tree = tree
  }

  mapRelationsFacet(tree, source, join, value) {
    const tmpTree = Object.assign({}, tree)
    if (!tmpTree[source]) tmpTree[source] = {}
    if (!tmpTree[source][join]) tmpTree[source][join] = []
    if (value) tmpTree[source][join].push(value)
    return tmpTree
  }

  determineCandidates() {
    const { context } = this.state

    // Pick out main entries for initial injection
    const split = context.metrics.reduce((result, metric) => {
      if (metric.type === SC_DATA.MAIN) result.main.push(metric)
      else if (metric.type === SC_DATA.REL) result.rel.push(metric)
      else result.other.push(metric)
      return result
    }, { main: [], rel: [], other: [] })

    // Sort main/rel entries by sentenceIdx asc, score desc
    split.main.sort((a, b) => a.sentenceIdx - b.sentenceIdx || b.score - a.score)

    // Bubble all entries that meets distance threshold to top
    split.main.sort((a, b) => b.weights.distance < this.getConfig(SC_DATA.CONFIG_ENTRY_INSERT_DISTANCE) ? -1 : 1)

    // Split entries
    split.main = split.main.reduce((result, metric) => {
      result[metric.section].push(metric)
      return result
    }, { header: [], sentences: [] })

    // Determine candidates for entry injection
    const injectedIndexes = {}
    context.candidates = split.main.sentences.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), [])
    context.candidates = split.main.header.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), context.candidates)
    context.candidates = split.rel.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), context.candidates)
    context.candidates = split.other.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), context.candidates)
  }

  reduceCandidates(result, metric, idx, injectedIndexes) {
    const { context } = this.state

    const entry = this.entries[metric.entryLabel]
    if (!injectedIndexes[metric.sentenceIdx]) injectedIndexes[metric.sentenceIdx] = []
    const candidateList = injectedIndexes[metric.sentenceIdx]
    const lastEntryText = candidateList.length ? candidateList[candidateList.length - 1] : (metric.sentenceIdx ? context[metric.section][metric.sentenceIdx - 1] : "")

    // Track injected items and skip if already done
    const existing = context.injected.find(i => i.label === metric.entryLabel)
    const item = existing || { label: metric.entryLabel, types: [] }
    const relTree = context.tree[metric.entryLabel] || context.tree[[metric.entryLabel, this.getConfig(SC_DATA.CONFIG_DEAD_TEXT)].join(" ")]
    if (item.types.includes(metric.type) || (metric.type !== SC_DATA.REL && !entry.data[metric.type]) || (metric.type === SC_DATA.REL && !relTree)) return result
    item.types.push(metric.type)

    // Determine whether to put newlines before or after injection
    const insertNewlineBefore = !lastEntryText.endsWith("\n")
    const insertNewlineAfter = !metric.sentence.startsWith("\n")
    const entryText = metric.type === SC_DATA.REL ? JSON.stringify([{[metric.entryLabel]: relTree}]) : entry.data[metric.type]
    const injectEntry = this.getFormattedEntry(entryText, insertNewlineBefore, insertNewlineAfter)
    const validEntry = this.isValidEntrySize(injectEntry)

    // Return if unable to inject
    if (!validEntry) return result

    // Add to candidates list
    result.push({ metric, text: injectEntry })
    this.modifiedSize += injectEntry.length
    candidateList.push(injectEntry)
    if (!existing) context.injected.push(item)
    return result
  }

  injectCandidates() {
    this.injectSection("header", true)
    this.injectSection("sentences")

    // Add sizes to context object for debugging
    const { context, info } = this.state
    const { sizes } = context
    sizes.modified = this.modifiedSize
    sizes.original = this.originalSize
    sizes.maxChars = info.maxChars
    sizes.memoryLength = info.memoryLength
  }

  injectSection(section, reverse=false) {
    const { context } = this.state
    const sectionCandidates = context.candidates.filter(m => m.metric.section === section)

    context[section] = context[section].reduce((result, sentence, idx) => {
      const candidates = sectionCandidates.filter(m => m.metric.sentenceIdx === idx)
      if (reverse) result.push(sentence)
      result = result.concat(candidates.map(c => c.text))
      if (!reverse) result.push(sentence)
      return result
    }, [])
  }

  injectSignposts() {
    const { context } = this.state
    if (!this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) return

    // Insert signposts
    let data = { charCount: 0, section: "sentences", signpostDistance: this.getConfig(SC_DATA.CONFIG_SIGNPOSTS_INITIAL_DISTANCE) }
    context.sentences = context.sentences.reduceRight((a, c, i) => this.reduceSignposts(a, c, i, data), [])
    data = { charCount: 0, section: "history", signpostDistance: this.getConfig(SC_DATA.CONFIG_SIGNPOSTS_DISTANCE) }
    context.history = context.history.reduceRight((a, c, i) => this.reduceSignposts(a, c, i, data), [])
    data = { charCount: 0, section: "header", signpostDistance: this.getConfig(SC_DATA.CONFIG_SIGNPOSTS_DISTANCE) }
    context.header = context.header.reduceRight((a, c, i) => this.reduceSignposts(a, c, i, data), [])
  }

  reduceSignposts(result, sentence, idx, data) {
    const { context } = this.state
    data.charCount += sentence.length
    result.unshift(sentence)

    const newlineBefore = idx !== 0 ? !context[data.section][idx - 1].endsWith("\n") : false
    const newlineAfter = !sentence.startsWith("\n")
    const signpost = this.getFormattedEntry(SC_SIGNPOST, newlineBefore, newlineAfter, false)

    if ((data.charCount + (idx !== 0 ? context[data.section][idx - 1].length : 0)) >= data.signpostDistance) {
      data.charCount = 0
      data.signpostDistance = this.getConfig(SC_DATA.CONFIG_SIGNPOSTS_DISTANCE)
      result.unshift(signpost)
    }

    return result
  }

  truncateContext() {
    const { context, info } = this.state

    let charCount = 0
    let cutoffReached = false
    const maxSize = info.maxChars - info.memoryLength - context.header.join("").length

    // Sentence reducer
    const reduceSentences = (result, sentence) => {
      if (cutoffReached) return result
      if ((charCount + sentence.length) >= maxSize) {
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

  buildFinalContext() {
    const { context, info } = this.state
    const { history, header, sentences, text } = context

    // Restore memory, clean context
    const contextMemory = (text && info.memoryLength) ? text.slice(0, info.memoryLength) : ""
    const rebuiltContext = [...history, ...header, ...sentences].join("")

    // Reassemble and clean final context string
    context.finalContext = ((contextMemory && this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) ? `${contextMemory}${SC_SIGNPOST}\n${rebuiltContext}` : contextMemory + rebuiltContext)
      .replace(/([\n]{2,})/g, "\n")
      .split("\n").filter(l => !!l).join("\n")

    // Signpost cleanup
    if (this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) {
      context.finalContext = context.finalContext.replace(new RegExp(`${SC_SIGNPOST}\n${SC_SIGNPOST}`, "g"), SC_SIGNPOST)
    }
  }

  getFormattedParagraphs(text) {
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

    // Add whitespace to end if not there
    modifiedText = modifiedText.replace(/(?<=[!?.])$/g, " ")

    return modifiedText
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
    if (this.state.isDisabled && !text.startsWith("\n/enable")) return text
    this.initialize()

    let modifiedText = text

    // Check if no input (ie, prompt AI)
    if (!modifiedText) return this.finalize(modifiedText)

    // Handle entry and relationship menus
    modifiedText = this.menuHandler(modifiedText)
    if (!modifiedText) return this.finalize(modifiedText)

    // Handle quick create character
    modifiedText = this.quickCreateHandler(modifiedText)
    if (!modifiedText) return this.finalize(modifiedText)

    // Detection for multi-line commands, filter out double ups of newlines
    modifiedText = text.split("\n").map(l => this.commandHandler(l)).join("\n")

    // Cleanup for commands
    if (["\n", "\n\n"].includes(modifiedText)) modifiedText = ""

    // Paragraph formatting
    if (this.getConfig(SC_DATA.CONFIG_SPACING)) modifiedText = this.getFormattedParagraphs(modifiedText)

    return this.finalize(modifiedText)
  }

  /*
   * Input Modifier: Default Command Handler
   * - Handles all passed commands such as `/scene`, `/you` etc
   */
  commandHandler(text) {
    // Check if a command was inputted
    let match = SC_RE.INPUT_CMD.exec(text)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text

    // Check if the command was valid
    const cmd = match[1].toLowerCase()
    const params = match.length > 2 && match[2] && match[2].trim()
    if (!this.controlCommands.includes(cmd)) return text

    // Detect for Controls, handle state and perform actions (ie, hide HUD)
    if (this.systemCommands.includes(cmd)) {
      if (cmd === "debug") {
        this.state.isDebug = !this.state.isDebug
        if (this.state.isDebug) this.displayDebug()
        else state.message = ""
      }
      else if (cmd === "enable" || cmd === "disable") this.state.isDisabled = (cmd === "disable")
      else if (cmd === "show" || cmd === "hide") this.state.isHidden = (cmd === "hide")
      else if (cmd === "min" || cmd === "max") this.state.isMinimized = (cmd === "min")
      this.displayHUD()
      return ""
    }

    // Loading pov and scene commands
    else if (this.povCommands.includes(cmd)) return this.loadPov(params)
    else if (this.loadCommands.includes(cmd)) return this.loadScene(params, !cmd.endsWith("!"))
  }

  loadPov(name, reload=true) {
    const { sections } = this.state

    if (name) {
      sections.pov = `You are ${this.appendPeriod(name)}`
      const you = this.getInfoMatch(name)
      if (you) this.state.you = you.data.label
    }
    else {
      delete sections.pov
      this.state.you = ""
    }

    if (reload) this.parseContext()
    return ""
  }

  loadScene(label, showPrompt=true) {
    const { sections } = this.state

    // Clear loaded scene
    if (!label) {
      delete sections.scene
      this.state.scene = ""
      this.parseContext()
      return ""
    }

    // Validate scene exists
    const scene = this.scenes[label]
    if (!scene) {
      this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Scene with that label does not exist, try creating it with '/scene ${label}' before continuing.`, false)
      return ""
    }
    this.state.scene = label

    // Transition to new scene
    delete sections.scene
    if (scene.data[SC_DATA.YOU]) this.loadPov(scene.data[SC_DATA.YOU], false)
    if (scene.data[SC_DATA.MAIN]) sections.scene = scene.data[SC_DATA.MAIN]
    this.parseContext()

    // Scene break
    const sceneBreak = this.getConfig(SC_DATA.CONFIG_SCENE_BREAK)
    let sceneBreakEmoji = this.getEmoji(scene, "")
    if (sceneBreakEmoji) sceneBreakEmoji += " "
    const sceneBreakText = `${sceneBreak} ${sceneBreakEmoji}${scene.data.label} ${sceneBreak}`
    if (showPrompt) return `${sceneBreakText}\n` + (scene.data[SC_DATA.PROMPT] ? scene.data[SC_DATA.PROMPT] : "")
    return ""
  }

  quickCreateHandler(text) {
    const modifiedText = text.slice(1)

    // Quick check to return early if possible
    if (!["@", "#", "$", "%", "^"].includes(modifiedText[0]) || modifiedText.includes("\n")) return text

    // Match a command
    let match = SC_RE.QUICK_CREATE_CMD.exec(modifiedText)
    if (match) match = match.filter(v => !!v)
    if (!match || match.length < 2) return text
    match = match.map(m => (m.startsWith(":") ? m.slice(1) : m).trim())
    match.shift()

    // Category matching
    let category = match.shift()
    if (category === "@") category = SC_CATEGORY.CHARACTER
    else if (category === "#") category = SC_CATEGORY.LOCATION
    else if (category === "$") category = SC_CATEGORY.THING
    else if (category === "%") category = SC_CATEGORY.FACTION
    else if (category === "^") category = SC_CATEGORY.OTHER

    // Conversion command
    const label = match.shift()
    if (label.toLowerCase().startsWith("convert")) {
      if (match.length === 0) {
        if (label.includes(" ")) this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Unrecognised conversion command, try '@convert: .*' instead!`, false)
        else this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Pattern must be specified to convert entries!`, false)
        return ""
      }
      const pattern = match.shift()
      const regex = this.getEntryRegex(pattern, false)
      if (!regex) {
        this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in conversion pattern, try again!`, false)
        return ""
      }
      const conversions = this.convertWorldInfo(category, regex, !label.toLowerCase().startsWith("convert!"), !label.toLowerCase().startsWith("convert!!"))
      const convType = label.toLowerCase().startsWith("convert!!") ? "OVERWRITE" : (label.toLowerCase().startsWith("convert!") ? "ADD ONLY" : "DRY RUN")
      this.messageOnce(`${SC_UI_ICON[category.toUpperCase()]} [${convType}] Successfully converted ${conversions.length} entries!\n${conversions.join(", ")}`, false)
      return ""
    }

    // Ensure doesn't already exist
    if (this.entries[label]) {
      this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Entry with that label already exists, try editing it with '/entry ${label}'.`, false)
      return ""
    }

    // Clean up matches
    match = match.map(m => this.appendPeriod(m))

    // Setup data
    let main, seen, heard, topic
    if (category === SC_CATEGORY.CHARACTER) [main, seen, heard, topic] = match
    else if (category === SC_CATEGORY.LOCATION) [main, seen, topic] = match
    else if (category === SC_CATEGORY.THING) [main, seen, topic] = match
    else if (category === SC_CATEGORY.FACTION) [main, topic] = match
    else if (category === SC_CATEGORY.OTHER) [main, seen, heard, topic] = match

    // Create label sentences
    if (main) main = `${label} ${main}`
    if (seen) seen = `${label} ${seen}`
    if (heard) heard = `${label} ${heard}`
    if (topic) topic = `${label} ${topic}`

    // Setup trigger and do pronoun matching
    const trigger = this.getEntryRegex(label).toString()
    const pronoun = this.getPronoun(main)
    const status = category === SC_CATEGORY.CHARACTER && this.getStatus(main)

    // Add missing data
    this.saveWorldInfo({
      keys: `${SC_WI_ENTRY}${label}`,
      data: { label, trigger, category, status, pronoun, main, seen, heard, topic }
    })

    // Update context
    this.parseContext()

    // Show message
    this.messageOnce(`${SC_UI_ICON.SUCCESS} ${this.toTitleCase(category)} '${label}' was created successfully!`)
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
    if (modifiedText === SC_UI_SHORTCUT.EXIT) {
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
      return ""
    }

    // Label and icon matching for most commands
    let [label, icon] = match.length >= 3 ? match[2].split(":").map(m => m.trim()) : []
    label = label && label.trim()
    icon = icon && icon.trim()

    // Store current message away to restore once done
    creator.previousMessage = state.message
    creator.cmd = cmd
    creator.originalLabel = label

    // Do title menu init
    if (this.configCommands.includes(cmd)) {
      creator.data = Object.assign({}, this.config.data || {})

      // Setup page
      creator.page = SC_UI_PAGE.CONFIG
      creator.currentPage = 1
      creator.totalPages = 1

      // Direct to correct menu
      this.menuConfigSpacingStep()
    }

    // Do global notes menu init
    else if (this.notesCommands.includes(cmd)) {
      creator.data = Object.assign({}, this.notes.data || {})

      // Setup page
      creator.page = SC_UI_PAGE.NOTES_EDITOR
      creator.currentPage = 1
      creator.totalPages = 2

      // Direct to correct menu
      this.menuEditorNoteStep()
    }

    // Do title menu init
    else if (this.titleCommands.includes(cmd)) {
      if (!label) return this.menuExit()

      // Preload title if found, otherwise setup defaults
      this.setTitleSource(this.titles[label] || label)

      // Add/update icon
      this.menuHandleIcon(icon)

      // Setup page
      creator.page = SC_UI_PAGE.TITLE_TARGET
      creator.currentPage = 1
      creator.totalPages = 2

      // Direct to correct menu
      this.menuTargetCategoryStep()
    }

    // Do scene menu init
    else if (this.sceneCommands.includes(cmd)) {
      if (!label) {
        if (this.state.scene) label = this.state.scene
        else return this.menuExit()
      }

      // Preload entry if found, otherwise setup default values
      this.setSceneSource(this.scenes[label] || label)

      // Add/update icon
      this.menuHandleIcon(icon)

      // Setup page
      creator.page = SC_UI_PAGE.SCENE
      creator.currentPage = 1
      creator.totalPages = 3

      // Direct to correct menu
      this.menuSceneMainStep()
    }

    // Entry/relations menu init
    else {
      const isEntry = this.entryCommands.includes(cmd)

      // Shortcuts for "/e you"
      let existing
      if (!label || label.toLowerCase() === "you") {
        if (you) {
          label = you
          existing = this.entries[label]
        }
        else return this.menuExit()
      }
      else {
        existing = this.entries[label]
        if (!isEntry && !existing) {
          this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Entry with that label does not exist, try creating it with '/entry ${label}${icon ? `:${icon}` : ""}' before continuing.`, false)
          return this.menuExit()
        }
      }

      // Preload entry if found, otherwise setup default values
      this.setEntrySource(existing || label)

      // Add/update icon
      this.menuHandleIcon(icon)

      // Setup page
      creator.page = isEntry ? SC_UI_PAGE.ENTRY : SC_UI_PAGE.ENTRY_RELATIONS
      creator.currentPage = isEntry ? 1 : 2
      creator.totalPages = (isEntry && !creator.source) ? 1 : 2

      // Direct to correct menu
      if (isEntry) this.menuEntryFirstStep()
      else this.menuRelationsFirstStep()
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
    const handlerString = `menu${creator.step.split("_").map(t => this.toTitleCase(t)).join("")}Step`
    if (typeof this[handlerString] === 'function') this[handlerString]()
    else this.menuExit()
  }

  menuEntryFirstStep() {
    const { creator } = this.state
    if (!creator.data.category) this.menuCategoryStep()
    else this.menuMainStep()
  }

  menuRelationsFirstStep() {
    const { creator } = this.state
    if (!creator.data.category) this.menuCategoryStep()
    else if (SC_RELATABLE.includes(creator.data.category)) this.menuContactsStep()
    else if (creator.data.category === SC_CATEGORY.LOCATION) this.menuAreasStep()
    else if (creator.data.category === SC_CATEGORY.THING) this.menuComponentsStep()
    else this.menuOwnersStep()
  }

  menuNavHandler(text) {
    const { creator } = this.state

    const isNextPage = text === SC_UI_SHORTCUT.NEXT_PAGE
    const isPrevPage = text === SC_UI_SHORTCUT.PREV_PAGE

    // Exit handling
    if (text === SC_UI_SHORTCUT.EXIT) {
      if (creator.hasChanged) return this.menuConfirmStep()
      else return this.menuExit()
    }

    // Previous page (and next page since all menu's only have the 2 pages so far)
    else if (isNextPage || isPrevPage) {
      if (creator.page === SC_UI_PAGE.CONFIG) {
        creator.currentPage = 1
        creator.page = SC_UI_PAGE.CONFIG
        this.menuConfigSpacingStep()
      }

      else if (creator.page === SC_UI_PAGE.ENTRY) {
        if (!creator.data) return this.menuCategoryStep()
        if (!creator.source) return this.menuCurrentStep()
        creator.currentPage = 2
        creator.page = SC_UI_PAGE.ENTRY_RELATIONS
        this.menuRelationsFirstStep()
      }

      else if (creator.page === SC_UI_PAGE.ENTRY_RELATIONS) {
        creator.currentPage = 1
        creator.page = SC_UI_PAGE.ENTRY
        this.menuEntryFirstStep()
      }

      else if (creator.page === SC_UI_PAGE.TITLE_TARGET) {
        creator.currentPage = 2
        creator.page = SC_UI_PAGE.TITLE_SOURCE
        this.menuSourceCategoryStep()
      }

      else if (creator.page === SC_UI_PAGE.TITLE_SOURCE) {
        creator.currentPage = 1
        creator.page = SC_UI_PAGE.TITLE_TARGET
        this.menuTargetCategoryStep()
      }

      else if (creator.page === SC_UI_PAGE.SCENE) {
        creator.currentPage = isPrevPage ? 3 : 2
        creator.page = isPrevPage ? SC_UI_PAGE.SCENE_AUTHOR : SC_UI_PAGE.SCENE_EDITOR
        if (isPrevPage) this.menuAuthorNoteStep()
        else this.menuEditorNoteStep()
      }

      else if (creator.page === SC_UI_PAGE.SCENE_EDITOR) {
        creator.currentPage = isPrevPage ? 1 : 3
        creator.page = isPrevPage ? SC_UI_PAGE.SCENE : SC_UI_PAGE.SCENE_AUTHOR
        if (isPrevPage) this.menuSceneMainStep()
        else this.menuAuthorNoteStep()
      }

      else if (creator.page === SC_UI_PAGE.SCENE_AUTHOR) {
        creator.currentPage = isPrevPage ? 2 : 1
        creator.page = isPrevPage ? SC_UI_PAGE.SCENE_EDITOR : SC_UI_PAGE.SCENE
        if (isPrevPage) this.menuEditorNoteStep()
        else this.menuSceneMainStep()
      }

      else if (creator.page === SC_UI_PAGE.NOTES_EDITOR) {
        creator.currentPage = 2
        creator.page = SC_UI_PAGE.SCENE_AUTHOR
        this.menuAuthorNoteStep()
      }

      else if (creator.page === SC_UI_PAGE.NOTES_AUTHOR) {
        creator.currentPage = 1
        creator.page = SC_UI_PAGE.SCENE_EDITOR
        this.menuEditorNoteStep()
      }
    }

    // Goto field
    else if (text.startsWith(SC_UI_SHORTCUT.GOTO)) {
      const index = Number(text.slice(1))
      if (index === 0 && [SC_UI_PAGE.ENTRY, SC_UI_PAGE.SCENE, SC_UI_PAGE.TITLE_TARGET, SC_UI_PAGE.TITLE_SOURCE].includes(creator.page)) {
        if ([SC_UI_PAGE.TITLE_TARGET, SC_UI_PAGE.TITLE_SOURCE].includes(creator.page)) return this.menuTitleStep()
        else return this.menuLabelStep()
      }
      if (!(index > 0)) return this.menuCurrentStep()

      if (creator.page === SC_UI_PAGE.CONFIG) {
        const keys = SC_CONFIG_KEYS
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = keys[index - 1]
        return this.menuCurrentStep()
      }
      else if (creator.page === SC_UI_PAGE.ENTRY) {
        if (!creator.data) return this.menuCategoryStep()
        const { category } = creator.data
        const keys = this.getCategoryKeys(category)
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
      else if (creator.page === SC_UI_PAGE.ENTRY_RELATIONS) {
        if (!creator.data) return this.menuCategoryStep()
        const { category } = creator.data

        let keys
        if (category === SC_CATEGORY.CHARACTER) keys = SC_REL_CHARACTER_KEYS
        else if (category === SC_CATEGORY.FACTION) keys = SC_REL_FACTION_KEYS
        else if (category === SC_CATEGORY.LOCATION) keys = SC_REL_LOCATION_KEYS
        else if (category === SC_CATEGORY.THING) keys = SC_REL_THING_KEYS
        else keys = SC_REL_OTHER_KEYS

        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
      else if ([SC_UI_PAGE.TITLE_TARGET, SC_UI_PAGE.TITLE_SOURCE].includes(creator.page)) {
        const keys = creator.page === SC_UI_PAGE.TITLE_TARGET ? SC_TITLE_KEYS : SC_TITLE_SOURCE_KEYS
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
      else if ([SC_UI_PAGE.SCENE].includes(creator.page)) {
        const keys = SC_SCENE_PROMPT_KEYS
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
      else {
        const keys = creator.page === SC_UI_PAGE.SCENE_EDITOR ? SC_SCENE_EDITORS_NOTE_KEYS : SC_SCENE_AUTHORS_NOTE_KEYS
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
    }

    // Hints toggling
    else if (text === SC_UI_SHORTCUT.HINTS) {
      this.state.showHints = !this.state.showHints
      return this.menuCurrentStep()
    }

    // Dynamically execute function based on step
    else {
      const handlerString = `menu${creator.step.split("_").map(t => this.toTitleCase(t)).join("")}Handler`
      if (typeof this[handlerString] === 'function') this[handlerString](text)
      else this.menuExit()
    }
  }


  /*
   * CONFIG MENUS
   */

  // noinspection JSUnusedGlobalSymbols
  menuConfigSpacingHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigSpacingStep()
    if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.CONFIG_SPACING, text.toLowerCase().startsWith("n") ? 0 : 1)
    this.menuConfigSignpostsStep()
  }

  menuConfigSpacingStep() {
    const { creator } = this.state
    creator.step = "config_spacing"
    this.displayMenuHUD(`${SC_UI_ICON.TOGGLE} Enable paragraph spacing? (y/n) `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigSignpostsHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigSpacingStep()
    if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.CONFIG_SIGNPOSTS, text.toLowerCase().startsWith("n") ? 0 : 1)
    this.menuConfigProseConvertStep()
  }

  menuConfigSignpostsStep() {
    const { creator } = this.state
    creator.step = "config_signposts"
    this.displayMenuHUD(`${SC_UI_ICON.TOGGLE} Enable signposts? (y/n) `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigProseConvertHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigSignpostsStep()
    if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.CONFIG_PROSE_CONVERT, text.toLowerCase().startsWith("n") ? 0 : 1)
    this.menuConfigHudMaximizedStep()
  }

  menuConfigProseConvertStep() {
    const { creator } = this.state
    creator.step = "config_prose_convert"
    this.displayMenuHUD(`${SC_UI_ICON.TOGGLE} Convert prose to futureman? (y/n) `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigHudMaximizedHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigProseConvertStep()
    if (text === SC_UI_SHORTCUT.NEXT || this.setEntryJson(SC_DATA.CONFIG_HUD_MAXIMIZED, text, false, SC_VALID_HUD)) return this.menuConfigHudMinimizedStep()
  }

  menuConfigHudMaximizedStep() {
    const { creator } = this.state
    creator.step = "config_hud_maximized"
    this.displayMenuHUD(`${SC_UI_ICON.TEXT} Enter the HUD arrangement: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigHudMinimizedHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigHudMaximizedStep()
    if (text === SC_UI_SHORTCUT.NEXT || this.setEntryJson(SC_DATA.CONFIG_HUD_MINIMIZED, text, false, SC_VALID_HUD)) return this.menuConfigRelSizeLimitStep()
  }

  menuConfigHudMinimizedStep() {
    const { creator } = this.state
    creator.step = "config_hud_minimized"
    this.displayMenuHUD(`${SC_UI_ICON.TEXT} Enter the HUD arrangement: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigRelSizeLimitHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigHudMinimizedStep()
    if (text !== SC_UI_SHORTCUT.NEXT && !isNaN(Number(text))) this.setEntryJson(SC_DATA.CONFIG_REL_SIZE_LIMIT, text)
    this.menuConfigEntryInsertDistanceStep()
  }

  menuConfigRelSizeLimitStep() {
    const { creator } = this.state
    creator.step = "config_rel_size_limit"
    this.displayMenuHUD(`${SC_UI_ICON.MEASURE} Determines the maximum amount of relationship context to inject (measured in characters): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigEntryInsertDistanceHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigRelSizeLimitStep()
    const amount = Number(text)
    if (text !== SC_UI_SHORTCUT.NEXT && !isNaN(amount) && amount <= 1 && amount >= 0) this.setEntryJson(SC_DATA.CONFIG_ENTRY_INSERT_DISTANCE, text)
    this.menuConfigSignpostsDistanceStep()
  }

  menuConfigEntryInsertDistanceStep() {
    const { creator } = this.state
    creator.step = "config_entry_insert_distance"
    this.displayMenuHUD(`${SC_UI_ICON.MEASURE} Minimum distance to insert main entry and relationships (measured in percentage from front of context): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigSignpostsDistanceHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigEntryInsertDistanceStep()
    if (text !== SC_UI_SHORTCUT.NEXT && !isNaN(Number(text))) this.setEntryJson(SC_DATA.CONFIG_SIGNPOSTS_DISTANCE, text)
    this.menuConfigSignpostsInitialDistanceStep()
  }

  menuConfigSignpostsDistanceStep() {
    const { creator } = this.state
    creator.step = "config_signposts_distance"
    this.displayMenuHUD(`${SC_UI_ICON.MEASURE} Signpost spacing (measured in characters, rounded to whole sentences): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigSignpostsInitialDistanceHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigSignpostsDistanceStep()
    if (text !== SC_UI_SHORTCUT.NEXT && !isNaN(Number(text))) this.setEntryJson(SC_DATA.CONFIG_SIGNPOSTS_INITIAL_DISTANCE, text)
    this.menuConfigDeadTextStep()
  }

  menuConfigSignpostsInitialDistanceStep() {
    const { creator } = this.state
    creator.step = "config_signposts_initial_distance"
    this.displayMenuHUD(`${SC_UI_ICON.MEASURE} Signpost initial spacing (measured in characters, rounded to whole sentences): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigDeadTextHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigSignpostsInitialDistanceStep()
    if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.CONFIG_DEAD_TEXT, text)
    this.menuConfigSceneBreakStep()
  }

  menuConfigDeadTextStep() {
    const { creator } = this.state
    creator.step = "config_dead_text"
    this.displayMenuHUD(`${SC_UI_ICON.TEXT} Enter the text append to a relation title when dead: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigSceneBreakHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigDeadTextStep()
    if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.CONFIG_SCENE_BREAK, text)
    this.menuConfigSceneBreakStep()
  }

  menuConfigSceneBreakStep() {
    const { creator } = this.state
    creator.step = "config_scene_break"
    this.displayMenuHUD(`${SC_UI_ICON.TEXT} Enter the text to use to signify a scene break: `)
  }


  /*
   * ENTRY/RELATIONSHIP MENUS
   */

  // noinspection JSUnusedGlobalSymbols
  menuCategoryHandler(text) {
    const cmd = text.slice(0, 1).toUpperCase()
    if (cmd === "C") this.setEntryJson(SC_DATA.CATEGORY, SC_CATEGORY.CHARACTER)
    else if (cmd === "L") this.setEntryJson(SC_DATA.CATEGORY, SC_CATEGORY.LOCATION)
    else if (cmd === "F") this.setEntryJson(SC_DATA.CATEGORY, SC_CATEGORY.FACTION)
    else if (cmd === "T") this.setEntryJson(SC_DATA.CATEGORY, SC_CATEGORY.THING)
    else if (cmd === "O") this.setEntryJson(SC_DATA.CATEGORY, SC_CATEGORY.OTHER)
    else return this.menuCategoryStep()
    this.menuMainStep()
  }

  menuCategoryStep() {
    const { creator } = this.state
    creator.step = "Category"
    this.displayMenuHUD(`${SC_UI_ICON.CATEGORY_OPTIONS} Enter the CATEGORY for this entry: (c/l/t/f/o)`, true, false, SC_VALID_CATEGORY)
  }

  // noinspection JSUnusedGlobalSymbols
  menuLabelHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuLabelStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuTriggerStep()
    else if (text === SC_UI_SHORTCUT.DELETE) return this.menuConfirmStep(true)

    let [label, icon] = text.split(",")[0].split(":").map(m => m.trim())
    if (!label) return this.menuLabelStep()

    if (label !== creator.originalLabel && label !== creator.data.label && this.entries[label]) {
      return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Entry with that label already exists, try again!`)
    }

    creator.keys = `${SC_WI_ENTRY}${label}`
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
  menuTriggerHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuLabelStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuMainStep()

    // Ensure valid regex
    const trigger = this.getEntryRegex(text, false)
    if (!trigger) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in keys, try again!`)
    if (creator.data[SC_DATA.TRIGGER] && text === SC_UI_SHORTCUT.DELETE) delete creator.data[SC_DATA.TRIGGER]
    else this.setEntryJson(SC_DATA.TRIGGER, trigger.toString())
    return this.menuTriggerStep()
  }

  menuTriggerStep() {
    const { creator } = this.state
    creator.step = "Trigger"
    this.displayMenuHUD(`${SC_UI_ICON.TRIGGER} Enter the KEYS used to trigger entry injection:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuMainHandler(text) {
    const { creator } = this.state
    const { category } = creator.data

    if (text === SC_UI_SHORTCUT.PREV) return this.menuTriggerStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      this.setEntryJson(SC_DATA.MAIN, text)
      creator.data.pronoun = this.getPronoun(creator.data[SC_DATA.MAIN])
      if (category === SC_CATEGORY.CHARACTER) creator.data.status = this.getStatus(creator.data[SC_DATA.MAIN])
    }

    if (category === SC_CATEGORY.FACTION) return this.menuTopicStep()
    else return this.menuSeenStep()
  }

  menuMainStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.MAIN)
    this.displayMenuHUD(`${SC_UI_ICON.MAIN} Enter MAIN content to inject when this entries keys are found:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSeenHandler(text) {
    const { creator } = this.state
    const { category } = creator.data

    if (text === SC_UI_SHORTCUT.PREV) return this.menuMainStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.SEEN, text)

    if (category === SC_CATEGORY.LOCATION) this.menuTopicStep()
    else if (category === SC_CATEGORY.THING) this.menuTopicStep()
    else this.menuHeardStep()
  }

  menuSeenStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.SEEN)
    this.displayMenuHUD(`${SC_UI_ICON.SEEN} Enter content to inject when this entry is SEEN:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuHeardHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSeenStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.HEARD, text)
    this.menuTopicStep()
  }

  menuHeardStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.HEARD)
    this.displayMenuHUD(`${SC_UI_ICON.HEARD} Enter content to inject when this entry is HEARD:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTopicHandler(text) {
    const { creator } = this.state
    const { category } = creator.data

    if (text === SC_UI_SHORTCUT.PREV) {
      if (category === SC_CATEGORY.FACTION) return this.menuMainStep()
      else if (category === SC_CATEGORY.LOCATION) return this.menuSeenStep()
      else if (category === SC_CATEGORY.THING) return this.menuSeenStep()
      return this.menuHeardStep()
    }
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.TOPIC, text)

    this.menuTopicStep()
  }

  menuTopicStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.TOPIC)
    this.displayMenuHUD(`${SC_UI_ICON.TOPIC} Enter content to inject when this entry is the TOPIC of conversation:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuContactsHandler(text) {
    const { creator } = this.state
    const { category } = creator.data

    if (text === SC_UI_SHORTCUT.PREV) return this.menuContactsStep()
    else if (text === SC_UI_SHORTCUT.NEXT) {
      if (category === SC_CATEGORY.FACTION) return this.menuPropertyStep()
      else return this.menuParentsStep()
    }
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.CONTACTS]) {
        delete creator.data[SC_DATA.CONTACTS]
        creator.hasChanged = true
      }
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
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.CONTACTS.toUpperCase()]} Enter comma separated list of CONTACTS:`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAreasHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuAreasStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuThingsStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.AREAS]) {
        delete creator.data[SC_DATA.AREAS]
        creator.hasChanged = true
      }
      return this.menuAreasStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.AREAS, [SC_CATEGORY.LOCATION])
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.AREAS]
    else creator.data[SC_DATA.AREAS] = relText
    creator.hasChanged = true
    this.menuAreasStep()
  }

  menuAreasStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.AREAS)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.AREAS.toUpperCase()]} Enter comma separated list of AREAS:`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuThingsHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuAreasStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuOwnersStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.THINGS]) {
        delete creator.data[SC_DATA.THINGS]
        creator.hasChanged = true
      }
      return this.menuThingsStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.THINGS, [SC_CATEGORY.THING])
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.THINGS]
    else creator.data[SC_DATA.THINGS] = relText
    creator.hasChanged = true
    this.menuThingsStep()
  }

  menuThingsStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.THINGS)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.THINGS.toUpperCase()]} Enter comma separated list of THINGS:`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuComponentsHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuComponentsStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuOwnersStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.COMPONENTS]) {
        delete creator.data[SC_DATA.COMPONENTS]
        creator.hasChanged = true
      }
      return this.menuComponentsStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.COMPONENTS, [SC_CATEGORY.THING])
    const relText = this.getRelCombinedText(rel)
    if (!relText) delete creator.data[SC_DATA.COMPONENTS]
    else creator.data[SC_DATA.COMPONENTS] = relText
    creator.hasChanged = true
    this.menuComponentsStep()
  }

  menuComponentsStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.COMPONENTS)
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.COMPONENTS.toUpperCase()]} Enter comma separated list of COMPONENTS:`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuParentsHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuContactsStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuChildrenStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.PARENTS]) {
        delete creator.data[SC_DATA.PARENTS]
        creator.hasChanged = true
      }
      return this.menuParentsStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.PARENTS, [SC_CATEGORY.CHARACTER])
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
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.PARENTS.toUpperCase()]} Enter comma separated list of PARENTS:`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuChildrenHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuParentsStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuPropertyStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.CHILDREN]) {
        delete creator.data[SC_DATA.CHILDREN]
        creator.hasChanged = true
      }
      return this.menuChildrenStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.CHILDREN, [SC_CATEGORY.CHARACTER])
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
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.CHILDREN.toUpperCase()]} Enter comma separated list of CHILDREN:`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuPropertyHandler(text) {
    const { creator } = this.state
    const { category } = creator.data

    if (text === SC_UI_SHORTCUT.PREV) {
      if (category === SC_CATEGORY.FACTION) return this.menuContactsStep()
      else return this.menuChildrenStep()
    }
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuOwnersStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.PROPERTY]) {
        delete creator.data[SC_DATA.PROPERTY]
        creator.hasChanged = true
      }
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
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.PROPERTY.toUpperCase()]} Enter comma separated list of PROPERTY:`, true, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuOwnersHandler(text) {
    const { creator } = this.state
    const { category } = creator.data

    if (text === SC_UI_SHORTCUT.PREV) {
      if (SC_RELATABLE.includes(category)) return this.menuPropertyStep()
      else if (category === SC_CATEGORY.LOCATION) return this.menuThingsStep()
      else if (category === SC_CATEGORY.THING) return this.menuComponentsStep()
      else return this.menuOwnersStep()
    }
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuOwnersStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
      if (creator.data[SC_DATA.OWNERS]) {
        delete creator.data[SC_DATA.OWNERS]
        creator.hasChanged = true
      }
      return this.menuOwnersStep()
    }

    let rel = this.getRelAdjusted(text, creator.data, SC_DATA.OWNERS, SC_RELATABLE)
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
    this.displayMenuHUD(`${SC_UI_ICON[SC_DATA.OWNERS.toUpperCase()]} Enter comma separated list of OWNERS:`, true, true)
  }


  /*
   * TITLE MENUS
   */

  // noinspection JSUnusedGlobalSymbols
  menuTitleHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuTitleStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuMatchStep()
    else if (text === SC_UI_SHORTCUT.DELETE) return this.menuConfirmStep(true)

    let [title, icon] = text.split(",")[0].split(":").map(m => m.trim())
    if (!title) return this.menuTitleStep()

    if (title !== creator.originalLabel && title !== creator.data.title && this.titles[title]) {
      return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Title with that name already exists, try again!`)
    }

    creator.keys = `${SC_WI_TITLE}${title}`
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

    if (text === SC_UI_SHORTCUT.PREV) return this.menuTitleStep()
    else if (text === SC_UI_SHORTCUT.NEXT) {
      if (creator.page === SC_UI_PAGE.TITLE_TARGET) return this.menuTargetCategoryStep()
      else return this.menuSourceCategoryStep()
    }
    else if (text === SC_UI_SHORTCUT.DELETE) {
      creator.data.trigger = (new RegExp(creator.data.title)).toString()
      return this.menuMatchStep()
    }

    // Ensure valid regex if regex key
    const key = this.getEntryRegex(text, false)
    if (!key) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in match, try again!`)

    // Update keys to regex format
    creator.data.trigger = key.toString()
    creator.hasChanged = true
    this.menuMatchStep()
  }

  menuMatchStep() {
    const { creator } = this.state
    creator.step = "Match"
    this.displayMenuHUD(`${SC_UI_ICON.MATCH} Enter the keys to MATCH when doing extended pronoun matching: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetCategoryHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuMatchStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.TARGET, "category", SC_VALID_CATEGORY)) this.menuTargetDispStep()
    }
    else this.menuTargetDispStep()
  }

  menuTargetCategoryStep() {
    const { creator } = this.state
    creator.step = "TargetCategory"
    this.displayMenuHUD(`${SC_UI_ICON.CATEGORY_OPTIONS} (Target) Enter the CATEGORIES to filter by: `, true, false, SC_VALID_CATEGORY)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetDispHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuTargetCategoryStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.TARGET, "disp", SC_VALID_DISP)) this.menuTargetTypeStep()
    }
    else this.menuTargetTypeStep()
  }

  menuTargetDispStep() {
    const { creator } = this.state
    creator.step = "TargetDisp"
    this.displayMenuHUD(`${SC_UI_ICON.DISP_OPTIONS} (Target) Enter the relationship DISPOSITIONS to filter by: `, true, false, SC_VALID_DISP)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetTypeHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuTargetDispStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.TARGET, "type", SC_VALID_TYPE)) this.menuTargetModStep()
    }
    else this.menuTargetModStep()
  }

  menuTargetTypeStep() {
    const { creator } = this.state
    creator.step = "TargetType"
    this.displayMenuHUD(`${SC_UI_ICON.TYPE_OPTIONS} (Target) Enter the relationship TYPES to filter by: `, true, false, SC_VALID_TYPE)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetModHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuTargetTypeStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.TARGET, "mod", SC_VALID_MOD)) this.menuTargetStatusStep()
    }
    else this.menuTargetStatusStep()
  }

  menuTargetModStep() {
    const { creator } = this.state
    creator.step = "TargetMod"
    this.displayMenuHUD(`${SC_UI_ICON.MOD_OPTIONS} (Target) Enter the relationship MODIFIERS to filter by: `, true, false, SC_VALID_MOD)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetStatusHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuTargetModStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.TARGET, "status", SC_VALID_STATUS)) this.menuTargetPronounStep()
    }
    else this.menuTargetPronounStep()
  }

  menuTargetStatusStep() {
    const { creator } = this.state
    creator.step = "TargetStatus"
    this.displayMenuHUD(`${SC_UI_ICON.STATUS_OPTIONS} (Target) Enter the STATUS to filter by: `, true, false, SC_VALID_STATUS)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetPronounHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuTargetStatusStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.TARGET, "pronoun", SC_VALID_PRONOUN)) this.menuTargetEntryStep()
    }
    else this.menuTargetEntryStep()
  }

  menuTargetPronounStep() {
    const { creator } = this.state
    creator.step = "TargetPronoun"
    this.displayMenuHUD(`${SC_UI_ICON.PRONOUN_OPTIONS} (Target) Enter the PRONOUNS to filter by: `, true, false, SC_VALID_PRONOUN)
  }

  // noinspection JSUnusedGlobalSymbols
  menuTargetEntryHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuTargetPronounStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.TARGET, "entry")) this.menuScopeStep()
    }
    else this.menuScopeStep()
  }

  menuTargetEntryStep() {
    const { creator } = this.state
    creator.step = "TargetEntry"
    this.displayMenuHUD(`${SC_UI_ICON.ENTRY} (Target) Enter the entry LABELS to filter by: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuScopeHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuTargetEntryStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuScopeStep()
    else if (text === SC_UI_SHORTCUT.DELETE) {
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
    this.displayMenuHUD(`${SC_UI_ICON.SCOPE} (Target) Enter the SCOPES to filter by: `, true, false, SC_VALID_SCOPE)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceCategoryHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuMatchStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.SOURCE, "category", SC_VALID_CATEGORY)) this.menuSourceDispStep()
    }
    else this.menuSourceDispStep()
  }

  menuSourceCategoryStep() {
    const { creator } = this.state
    creator.step = "SourceCategory"
    this.displayMenuHUD(`${SC_UI_ICON.CATEGORY_OPTIONS} (Source) Enter the CATEGORIES to filter by: `, true, false, SC_VALID_CATEGORY)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceDispHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSourceCategoryStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.SOURCE, "disp", SC_VALID_DISP)) this.menuSourceTypeStep()
    }
    else this.menuSourceTypeStep()
  }

  menuSourceDispStep() {
    const { creator } = this.state
    creator.step = "SourceDisp"
    this.displayMenuHUD(`${SC_UI_ICON.DISP_OPTIONS} (Source) Enter the relationship DISPOSITIONS to filter by: `, true, false, SC_VALID_DISP)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceTypeHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSourceDispStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.SOURCE, "type", SC_VALID_TYPE)) this.menuSourceModStep()
    }
    else this.menuSourceModStep()
  }

  menuSourceTypeStep() {
    const { creator } = this.state
    creator.step = "SourceType"
    this.displayMenuHUD(`${SC_UI_ICON.TYPE_OPTIONS} (Source) Enter the relationship TYPES to filter by: `, true, false, SC_VALID_TYPE)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceModHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSourceTypeStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.SOURCE, "mod", SC_VALID_MOD)) this.menuSourceStatusStep()
    }
    else this.menuSourceStatusStep()
  }

  menuSourceModStep() {
    const { creator } = this.state
    creator.step = "SourceMod"
    this.displayMenuHUD(`${SC_UI_ICON.MOD_OPTIONS} (Source) Enter the relationship MODS to filter by: `, true, false, SC_VALID_MOD)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceStatusHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSourceModStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.SOURCE, "status", SC_VALID_STATUS)) this.menuSourcePronounStep()
    }
    else this.menuSourcePronounStep()
  }

  menuSourceStatusStep() {
    const { creator } = this.state
    creator.step = "SourceStatus"
    this.displayMenuHUD(`${SC_UI_ICON.STATUS_OPTIONS} (Source) Enter the STATUS to filter by: `, true, false, SC_VALID_STATUS)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourcePronounHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSourceStatusStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) {
      if (this.setTitleJson(text, SC_DATA.SOURCE, "pronoun", SC_VALID_PRONOUN)) this.menuSourceEntryStep()
    }
    else this.menuSourceEntryStep()
  }

  menuSourcePronounStep() {
    const { creator } = this.state
    creator.step = "SourcePronoun"
    this.displayMenuHUD(`${SC_UI_ICON.PRONOUN_OPTIONS} (Source) Enter the PRONOUNS to filter by: `, true, false, SC_VALID_PRONOUN)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSourceEntryHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSourcePronounStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setTitleJson(text, SC_DATA.SOURCE, "entry")
    this.menuSourceEntryStep()
  }

  menuSourceEntryStep() {
    const { creator } = this.state
    creator.step = "SourceEntry"
    this.displayMenuHUD(`${SC_UI_ICON.ENTRY} (Source) Enter the entry LABELS to filter by: `)
  }


  /*
   * SCENE MENUS
   */

  // noinspection JSUnusedGlobalSymbols
  menuSceneLabelHandler(text) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.PREV) return this.menuSceneLabelStep()
    else if (text === SC_UI_SHORTCUT.NEXT) return this.menuSceneMainStep()
    else if (text === SC_UI_SHORTCUT.DELETE) return this.menuConfirmStep(true)

    let [label, icon] = text.split(",")[0].split(":").map(m => m.trim())
    if (!label) return this.menuSceneLabelStep()

    if (label !== creator.originalLabel && label !== creator.data.label && this.scenes[label]) {
      return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Scene with that name already exists, try again!`)
    }

    creator.keys = `${SC_WI_SCENE}${label}`
    creator.data.label = label
    creator.hasChanged = true

    // Add/update icon
    if (creator.data.icon) this.removeStat(creator.data.icon)
    if (!icon) delete creator.data.icon
    else creator.data.icon = icon

    this.menuSceneLabelStep()
  }

  menuSceneLabelStep() {
    const { creator } = this.state
    creator.step = "SceneLabel"
    this.displayMenuHUD(`${SC_UI_ICON.LABEL} Enter the LABEL used to refer to this scene: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSceneMainHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSceneLabelStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.MAIN, text)
    this.menuScenePromptStep()
  }

  menuSceneMainStep() {
    const { creator } = this.state
    creator.step = "SceneMain"
    this.displayMenuHUD(`${SC_UI_ICON.MAIN} Enter MAIN content to inject when this scene is loaded:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuScenePromptHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuSceneMainStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.PROMPT, text, true)
    this.menuSceneYouStep()
  }

  menuScenePromptStep() {
    const { creator } = this.state
    creator.step = "ScenePrompt"
    this.displayMenuHUD(`${SC_UI_ICON.PROMPT} Enter PROMPT text to output when starting the scene:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSceneYouHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuScenePromptStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.YOU, text)
    this.menuSceneYouStep()
  }

  menuSceneYouStep() {
    const { creator } = this.state
    creator.step = "SceneYou"
    this.displayMenuHUD(`${SC_UI_ICON.YOU}  Enter the NAME of the main character: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuEditorNoteHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuEditorNoteStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.EDITOR, "note")
    return this.menuEditorRatingStep()
  }

  menuEditorNoteStep() {
    const { creator } = this.state
    creator.step = "EditorNote"
    this.displayMenuHUD(`${SC_UI_ICON.NOTE} (Editor) Enter the NOTE to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuEditorRatingHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuEditorNoteStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.EDITOR, "rating")
    return this.menuEditorStyleStep()
  }

  menuEditorRatingStep() {
    const { creator } = this.state
    creator.step = "EditorRating"
    this.displayMenuHUD(`${SC_UI_ICON.RATING} (Editor) Enter the RATING to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuEditorStyleHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuEditorRatingStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.EDITOR, "style")
    return this.menuEditorGenreStep()
  }

  menuEditorStyleStep() {
    const { creator } = this.state
    creator.step = "EditorStyle"
    this.displayMenuHUD(`${SC_UI_ICON.STYLE} (Editor) Enter the STYLE to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuEditorGenreHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuEditorStyleStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.EDITOR, "genre")
    return this.menuEditorSettingStep()
  }

  menuEditorGenreStep() {
    const { creator } = this.state
    creator.step = "EditorGenre"
    this.displayMenuHUD(`${SC_UI_ICON.GENRE} (Editor) Enter the GENRE to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuEditorSettingHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuEditorGenreStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.EDITOR, "setting")
    return this.menuEditorThemeStep()
  }

  menuEditorSettingStep() {
    const { creator } = this.state
    creator.step = "EditorSetting"
    this.displayMenuHUD(`${SC_UI_ICON.SETTING} (Editor) Enter the SETTING to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuEditorThemeHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuEditorSettingStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.EDITOR, "theme")
    return this.menuEditorSubjectStep()
  }

  menuEditorThemeStep() {
    const { creator } = this.state
    creator.step = "EditorTheme"
    this.displayMenuHUD(`${SC_UI_ICON.THEME} (Editor) Enter the THEME to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuEditorSubjectHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuEditorThemeStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.EDITOR, "subject")
    return this.menuEditorSubjectStep()
  }

  menuEditorSubjectStep() {
    const { creator } = this.state
    creator.step = "EditorSubject"
    this.displayMenuHUD(`${SC_UI_ICON.SUBJECT} (Editor) Enter the SUBJECT to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAuthorNoteHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuAuthorNoteStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.AUTHOR, "note")
    return this.menuAuthorRatingStep()
  }

  menuAuthorNoteStep() {
    const { creator } = this.state
    creator.step = "AuthorNote"
    this.displayMenuHUD(`${SC_UI_ICON.NOTE} (Author) Enter the NOTE to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAuthorRatingHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuAuthorNoteStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.AUTHOR, "rating")
    return this.menuAuthorStyleStep()
  }

  menuAuthorRatingStep() {
    const { creator } = this.state
    creator.step = "AuthorRating"
    this.displayMenuHUD(`${SC_UI_ICON.RATING} (Author) Enter the RATING to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAuthorStyleHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuAuthorRatingStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.AUTHOR, "style")
    return this.menuAuthorGenreStep()
  }

  menuAuthorStyleStep() {
    const { creator } = this.state
    creator.step = "AuthorStyle"
    this.displayMenuHUD(`${SC_UI_ICON.STYLE} (Author) Enter the STYLE to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAuthorGenreHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuAuthorStyleStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.AUTHOR, "genre")
    return this.menuAuthorSettingStep()
  }

  menuAuthorGenreStep() {
    const { creator } = this.state
    creator.step = "AuthorGenre"
    this.displayMenuHUD(`${SC_UI_ICON.GENRE} (Author) Enter the GENRE to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAuthorSettingHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuAuthorGenreStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.AUTHOR, "setting")
    return this.menuAuthorThemeStep()
  }

  menuAuthorSettingStep() {
    const { creator } = this.state
    creator.step = "AuthorSetting"
    this.displayMenuHUD(`${SC_UI_ICON.SETTING} (Author) Enter the SETTING to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAuthorThemeHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuAuthorSettingStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.AUTHOR, "theme")
    return this.menuAuthorSubjectStep()
  }

  menuAuthorThemeStep() {
    const { creator } = this.state
    creator.step = "AuthorTheme"
    this.displayMenuHUD(`${SC_UI_ICON.THEME} (Author) Enter the THEME to insert: `, true)
  }

  // noinspection JSUnusedGlobalSymbols
  menuAuthorSubjectHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuAuthorThemeStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setNotesJson(text, SC_DATA.AUTHOR, "subject")
    return this.menuAuthorSubjectStep()
  }

  menuAuthorSubjectStep() {
    const { creator } = this.state
    creator.step = "AuthorSubject"
    this.displayMenuHUD(`${SC_UI_ICON.SUBJECT} (Author) Enter the SUBJECT to insert: `, true)
  }


  /*
   * CONFIRMATION MENUS
   */

  // noinspection JSUnusedGlobalSymbols
  menuConfirmHandler(text) {
    const { creator } = this.state

    if ([SC_UI_SHORTCUT.PREV, SC_UI_SHORTCUT.NEXT, SC_UI_SHORTCUT.DELETE].includes(text)) return this.menuConfirmStep()

    // Exit without saving if anything other than "y" passed
    if (text.toLowerCase().startsWith("n")) return this.menuExit()
    if (!text.toLowerCase().startsWith("y")) return this.menuConfirmStep()

    if (this.configCommands.includes(creator.cmd)) this.menuConfirmConfigHandler()
    else if (this.titleCommands.includes(creator.cmd)) this.menuConfirmTitleHandler()
    else if (this.sceneCommands.includes(creator.cmd)) this.menuConfirmSceneHandler()
    else if (this.notesCommands.includes(creator.cmd)) this.menuConfirmNotesHandler()
    else this.menuConfirmEntryHandler()
  }

  menuConfirmConfigHandler() {
    const { creator } = this.state

    // Save data
    this.config.data = creator.data
    if (!this.config.keys) this.config.keys = SC_WI_CONFIG
    this.saveWorldInfo(this.config)

    // Confirmation message
    const successMessage = `${SC_UI_ICON.SUCCESS} Config saved!`

    // Reset everything back
    this.menuExit(false)

    // Update context
    this.parseContext()

    // Show message
    this.messageOnce(successMessage)
  }

  menuConfirmNotesHandler() {
    const { creator } = this.state

    // Save data
    this.notes.data = creator.data
    if (!this.notes.keys) this.notes.keys = SC_WI_NOTES
    this.saveWorldInfo(this.notes)

    // Confirmation message
    const successMessage = `${SC_UI_ICON.SUCCESS} Notes saved!`

    // Reset everything back
    this.menuExit(false)

    // Update context
    this.parseContext()

    // Show message
    this.messageOnce(successMessage)
  }

  menuConfirmSceneHandler() {
    const { creator, sections, scene } = this.state

    // Add new World Info
    if (!creator.remove) {
      if (creator.source && creator.source.keys !== creator.keys) {
        this.removeWorldInfo(creator.source)
        delete creator.source
      }
      this.saveWorldInfo({ idx: (creator.source && creator.source.idx) ? creator.source.idx : [], keys: creator.keys, data: creator.data })
    }
    else if (creator.source) this.removeWorldInfo(creator.source)

    // Confirmation message
    const successMessage = `${SC_UI_ICON.SUCCESS} Scene '${creator.data.label}' was ${creator.remove ? "deleted" : (creator.source ? "updated" : "created")} successfully!`

    // Update section if currently selected
    if (scene === creator.data.label && creator.data[SC_DATA.MAIN]) sections.scene = creator.data[SC_DATA.MAIN]

    // Reset everything back
    this.menuExit(false)

    // Update context
    this.parseContext()

    // Show message
    this.messageOnce(successMessage)
  }

  menuConfirmEntryHandler() {
    const { creator } = this.state
    const { data } = creator
    const { category } = creator.data

    // Add missing data
    if (!data.pronoun) data.pronoun = this.getPronoun(data[SC_DATA.MAIN])
    if (category === SC_CATEGORY.CHARACTER && !data.status) data.status = this.getStatus(data[SC_DATA.MAIN])

    // Lower for storage
    data.pronoun = data.pronoun.toLowerCase()
    data.category = data.category.toLowerCase()
    if (data.status) data.status = data.status.toLowerCase()

    // Add new World Info
    if (!creator.remove) {
      if (creator.source && creator.source.keys !== creator.keys) {
        this.removeWorldInfo(creator.source)
        delete creator.source
      }
      this.saveWorldInfo({ idx: (creator.source && creator.source.idx) ? creator.source.idx : [], keys: creator.keys, data: creator.data })
    }
    else if (creator.source) this.removeWorldInfo(creator.source)

    // Sync relationships and status
    if (creator.source && !creator.conversion) {
      if (!creator.remove) this.syncEntry(creator)
      else this.syncEntry(creator.source, true)
    }

    // Confirmation message
    const successMessage = `${SC_UI_ICON.SUCCESS} Entry '${creator.data.label}' was ${creator.remove ? "deleted" : (creator.source ? "updated" : "created")} successfully!`

    // Reset everything back
    this.menuExit(false)

    // Update context
    this.parseContext()

    // Show message
    if (successMessage) this.messageOnce(successMessage)
  }

  menuConfirmTitleHandler() {
    const { creator } = this.state

    // Add new World Info
    if (!creator.remove) {
      if (creator.source && creator.source.keys !== creator.keys) {
        this.removeWorldInfo(creator.source)
        delete creator.source
      }
      this.saveWorldInfo({ idx: (creator.source && creator.source.idx) ? creator.source.idx : [], keys: creator.keys, data: creator.data })
    }
    else if (creator.source) this.removeWorldInfo(creator.source)

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
    else this.displayMenuHUD(`${SC_UI_ICON.WARNING} Warning! Are you sure you want to delete this entry? (y/n)`, false)
  }

  menuExit(update=true) {
    const { creator } = this.state
    if (creator.data && creator.data.icon) this.removeStat(creator.data.icon)
    state.message = creator.previousMessage
    this.state.creator = {}
    if (update) this.displayHUD()
    return ""
  }

  displayMenuHUD(promptText, hints=true, relHints=false, validInputs=[]) {
    const { creator } = this.state
    const { showHints } = this.state
    const output = []
    if (hints && showHints) {
      const paged = creator.totalPages > 1 ? `${SC_UI_SHORTCUT.PREV_PAGE} and ${SC_UI_SHORTCUT.NEXT_PAGE} to navigate pages, ` : ""
      output.push(`Hints: Type ${paged}${SC_UI_SHORTCUT.PREV} and ${SC_UI_SHORTCUT.NEXT} to navigate fields, ${SC_UI_SHORTCUT.GOTO} followed by a number for a specific field, ${SC_UI_SHORTCUT.DELETE} to delete, ${SC_UI_SHORTCUT.EXIT} to exit and ${SC_UI_SHORTCUT.HINTS} to toggle hints.${(relHints || validInputs.length) ? "" : "\n\n"}`)
      if (relHints) output.push(`Extra: You can type '${SC_UI_SHORTCUT.DELETE}entry1, entry2' to remove one or more individual items.${validInputs.length ? "" : "\n"}`)
    }
    if (validInputs.length) {
      const lastInput = validInputs.pop()
      output.push(`Choices: ${validInputs.join(", ")} or ${lastInput}.\n`)
    }
    output.push(`${promptText}`)
    state.message = output.join("\n")
    this.displayHUD()
  }

  setTitleSource(source) {
    const { creator } = this.state

    if (typeof source === "object") {
      creator.source = source
      creator.keys = source.keys
      creator.data = Object.assign({}, creator.source.data)
    }
    else {
      creator.keys = `${SC_WI_TITLE}${source}`
      creator.data = { title: source, trigger: (new RegExp(source)).toString() }
    }
  }

  setSceneSource(source) {
    const { creator } = this.state

    if (typeof source === "object") {
      creator.source = source
      creator.keys = source.keys
      creator.data = Object.assign({}, creator.source.data)
    }
    else {
      creator.keys = `${SC_WI_SCENE}${source}`
      creator.data = { label: source, category: "scene" }
    }
  }

  setEntrySource(source) {
    const { creator } = this.state

    if (typeof source === "object") {
      creator.source = source
      creator.keys = creator.conversion ? `${SC_WI_ENTRY}${source.keys.split(",")[0].trim()}` : source.keys
      if (creator.data) creator.data = Object.assign({ label: creator.data.label }, source.data, { category: source.data.category || creator.data.category })
      else creator.data = Object.assign({ }, source.data, creator.conversion ? { label: source.keys.split(",")[0].trim(), pronoun: this.getPronoun(source.entry), status: this.getStatus(source.entry) } : source.data)
      creator.data.trigger = creator.conversion ? this.getEntryRegex(source.keys).toString() : creator.data.trigger
      creator.data.status = (creator.data.status && creator.data.status.toLowerCase()) || SC_STATUS.ALIVE
      creator.data.pronoun = (creator.data.pronoun && creator.data.pronoun.toLowerCase()) || SC_PRONOUN.UNKNOWN
      creator.data.category = (creator.data.category && creator.data.category.toLowerCase()) || ""
    }

    else {
      if (this.worldInfo[source]) {
        creator.conversion = true
        return this.setEntrySource(this.worldInfo[source])
      }
      creator.data = { label: source, trigger: this.getEntryRegex(source).toString(), category: "", pronoun: SC_PRONOUN.UNKNOWN }
      const keys = `${SC_WI_ENTRY}${source}`
      if (!this.worldInfo[keys]) creator.keys = keys
    }
  }

  setEntryJson(key, text, ignoreSize=false, validItems=[]) {
    const { creator } = this.state

    if (validItems.length) {
      const values = text.toLowerCase().split(",").map(i => i.trim()).reduce((a, c) => a.concat(validItems.includes(c) ? [c] : []), [])
      if (!values.length) {
        this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid ${key} detected, options are: ${validItems.join(", ")}`)
        return false
      }
    }

    if (creator.data[key] && text === SC_UI_SHORTCUT.DELETE) delete creator.data[key]
    else if (ignoreSize || JSON.stringify({[key]: text}).length <= SC_WI_SIZE) creator.data[key] = typeof text === "string" ? text.replace(/^\*/, SC_FEATHERLITE) : text
    else {
      this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Length of field '${key}' exceeds maximum allowed! Please reduce text size and try again.`)
      return false
    }

    creator.hasChanged = true
    return true
  }

  setTitleJson(text, section, field, validItems=[]) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.DELETE) {
      delete creator.data[section][field]
      creator.hasChanged = true
      return true
    }

    // Validate data
    if (field === "type") text = text.toUpperCase()
    else if (field !== "entry") text = text.toLowerCase()
    const values = text.split(",").map(i => i.trim()).reduce((a, c) => a.concat((!validItems.length || validItems.includes(c.startsWith("-") && c.length > 1 ? c.slice(1) : c)) ? [c] : []), [])
    if (!values.length) {
      this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid ${field} detected, options are: ${validItems.join(", ")}`)
      return false
    }

    // Update data
    if (!creator.data[section]) creator.data[section] = {}
    creator.data[section][field] = values.join(", ")
    creator.hasChanged = true
    return true
  }

  setNotesJson(text, section, field) {
    const { creator } = this.state

    if (text === SC_UI_SHORTCUT.DELETE) {
      delete creator.data[section][field]
      creator.hasChanged = true
      return
    }

    if (!creator.data[section]) creator.data[section] = {}
    creator.data[section][field] = text
    creator.hasChanged = true
  }


  /*
   * OUTPUT MODIFIER
   * - Handles paragraph formatting.
   */
  outputModifier(text) {
    if (this.state.isDisabled || !text) return text
    this.initialize()

    let modifiedText = text
    if (this.getConfig(SC_DATA.CONFIG_SPACING)) modifiedText = this.getFormattedParagraphs(modifiedText)
    return this.finalize(modifiedText)
  }


  /*
   * UI Rendering
   */
  displayHUD() {
    const { creator, isHidden } = this.state

    // Clear out Simple Context stats, keep stats from other scripts for compatibility
    const labels = Object.values(SC_UI_ICON).concat((creator.data && creator.data.icon) ? [creator.data.icon] : []).concat(this.icons)
    state.displayStats = state.displayStats.filter(s => !labels.includes((s.key || "").replace(SC_UI_ICON.SELECTED, "")))

    // Get correct stats to display
    let hudStats = []
    if (creator.page === SC_UI_PAGE.ENTRY) hudStats = this.getEntryStats()
    else if (creator.page === SC_UI_PAGE.ENTRY_RELATIONS) hudStats = this.getRelationsStats()
    else if (creator.page === SC_UI_PAGE.SCENE) hudStats = this.getSceneStats()
    else if ([SC_UI_PAGE.SCENE_EDITOR, SC_UI_PAGE.SCENE_AUTHOR].includes(creator.page)) hudStats = this.getNotesStats()
    else if (this.configCommands.includes(creator.cmd)) hudStats = this.getConfigStats()
    else if (this.titleCommands.includes(creator.cmd)) hudStats = this.getTitleStats()
    else if (this.findCommands.includes(creator.cmd)) hudStats = this.getFindStats()
    else if (!isHidden) hudStats = this.getInfoStats()

    // Return if no stats to display
    if (!hudStats.length) return

    // Add newline at end for spacing
    hudStats[hudStats.length - 1].value = hudStats[hudStats.length - 1].value + "\n"

    // Display stats
    state.displayStats = [...hudStats, ...state.displayStats]
  }

  getInfoStats() {
    const { context, sections, isDisabled, isMinimized } = this.state
    const { injected } = context

    const displayStats = []
    if (isDisabled) return displayStats

    // Display relevant HUD elements
    const contextKeys = isMinimized ? this.getConfig(SC_DATA.CONFIG_HUD_MINIMIZED) : this.getConfig(SC_DATA.CONFIG_HUD_MAXIMIZED)

    for (let keys of contextKeys.split(",").map(k => k.trim())) {
      keys = keys.toUpperCase().split("/").filter(k => k.toUpperCase() === "TRACK" || sections[k.toLowerCase()])

      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i].toUpperCase()
        const newline = i === (l - 1) ? "\n" : " "

        if (key === "TRACK") {
          // Setup tracking information
          const track = injected.map(inj => {
            const entry = this.entries[inj.label]
            const injectedEmojis = inj.types.filter(t => ![SC_DATA.MAIN, SC_DATA.REL].includes(t)).map(t => SC_UI_ICON[`INJECTED_${t.toUpperCase()}`]).join("")
            return `${this.getEmoji(entry)} ${entry.data.label}${injectedEmojis ? ` [${injectedEmojis}]` : ""}`
          })

          // Display World Info injected into context
          if (track.length) displayStats.push({
            key: SC_UI_ICON.TRACK, color: SC_UI_COLOR.TRACK,
            value: `${track.join(SC_UI_ICON.SEPARATOR)}${!SC_UI_ICON.TRACK.trim() ? " :" : ""}${newline}`
          })
        }

        else if (sections[key.toLowerCase()]) {
          displayStats.push({
            key: SC_UI_ICON[`HUD_${key}`], color: SC_UI_COLOR[`HUD_${key}`],
            value: `${sections[key.toLowerCase()]}${newline}`
          })
        }
      }
    }

    return displayStats
  }

  getConfigStats() {
    const { creator } = this.state
    let displayStats = []

    // Get combined text to search for references
    const text = SC_CONFIG_KEYS.reduce((a, c) => a.concat(creator.data[c] ? ` ${creator.data[c]}` : ""), "")

    // Find references
    const track = this.getReferences(text)

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats([], track))

    // Display all ENTRIES
    displayStats = displayStats.concat(this.getConfigFieldStats(SC_CONFIG_KEYS))

    return displayStats
  }

  getConfigFieldStats(keys) {
    const { creator } = this.state
    let displayStats = []

    for (const key of keys) {
      let value = creator.data[key.replace("config_", "")]
      value = value === 1 ? SC_UI_ICON.ON : (value === 0 ? SC_UI_ICON.OFF : value)
      displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON[key.toUpperCase()]), color: SC_UI_COLOR[key.toUpperCase()],
        value: `${value || SC_UI_ICON.EMPTY}\n`
      })
    }

    return displayStats
  }

  getEntryStats() {
    const { creator } = this.state
    const { category } = creator.data
    let displayStats = []

    // Get combined text to search for references
    const text = SC_ENTRY_ALL_KEYS.reduce((a, c) => a.concat(creator.data[c] ? ` ${creator.data[c]}` : ""), "")

    // Find references
    const track = this.getReferences(text)

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats([], track))

    // Only show type and label if on first step
    if (!creator.data.category) return displayStats

    // Display all ENTRIES
    for (let key of SC_ENTRY_ALL_KEYS) {
      let validKey = false
      if (category === SC_CATEGORY.CHARACTER && SC_ENTRY_CHARACTER_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.FACTION && SC_ENTRY_FACTION_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.LOCATION && SC_ENTRY_LOCATION_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.THING && SC_ENTRY_THING_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.OTHER && SC_ENTRY_OTHER_KEYS.includes(key)) validKey = true
      if (validKey) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON[key.toUpperCase()]), color: SC_UI_COLOR[key.toUpperCase()],
        value: `${creator.data[key] || SC_UI_ICON.EMPTY}\n`
      })
    }

    return displayStats
  }

  getRelationsStats() {
    const { creator } = this.state
    const { category } = creator.data
    const scopesExtended = [SC_SCOPE.SIBLINGS, SC_SCOPE.GRANDPARENTS, SC_SCOPE.GRANDCHILDREN, SC_SCOPE.PARENTS_SIBLINGS, SC_SCOPE.SIBLINGS_CHILDREN]
    let displayStats = []

    // Scan each rel entry for matching labels in index
    const relationships = this.getRelExpKeys(creator.data)

    const trackOther = relationships
      .filter(r => !this.entries[r.label])
      .map(r => this.getRelationshipLabel(r))

    const trackExtendedRel = relationships.filter(r => !!this.entries[r.label] && scopesExtended.includes(r.scope))
    const trackExtendedLabels = trackExtendedRel.map(r => r.label)
    const trackExtended = trackExtendedRel.map(r => this.getRelationshipLabel(r, SC_UI_ICON[SC_SCOPE_REV[r.scope]]))

    const track = relationships
      .filter(r => !!this.entries[r.label] && SC_REL_ALL_KEYS.includes(r.scope) && !trackExtendedLabels.includes(r.label))
      .map(r => this.getRelationshipLabel(r))

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats(track, trackExtended, trackOther))

    // Display all ENTRIES
    for (let key of SC_REL_ALL_KEYS) {
      let validKey = false
      if (category === SC_CATEGORY.CHARACTER && SC_REL_CHARACTER_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.FACTION && SC_REL_FACTION_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.LOCATION && SC_REL_LOCATION_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.THING && SC_REL_THING_KEYS.includes(key)) validKey = true
      if (category === SC_CATEGORY.OTHER && SC_REL_OTHER_KEYS.includes(key)) validKey = true
      if (validKey) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON[key.toUpperCase()]), color: SC_UI_COLOR[key.toUpperCase()],
        value: `${creator.data[key] || SC_UI_ICON.EMPTY}\n`
      })
    }

    return displayStats
  }

  getSceneStats() {
    const { creator } = this.state
    let displayStats = []

    // Get combined text to search for references
    const keys = SC_SCENE_PROMPT_KEYS.map(k => k.replace("scene", "").toLowerCase())
    const text = keys.reduce((a, c) => a.concat(creator.data[c] ? ` ${creator.data[c]}` : ""), "")

    // Find references
    const track = this.getReferences(text)

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats(track))

    // Display all ENTRIES
    for (let key of keys) {
      displayStats.push({
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
        this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in '${creator.searchPattern}', try again!`)
        return this.getInfoStats()
      }
    }

    // Find scenes
    const trackScenes = this.scenesList.reduce((result, scene) => {
      if (searchRegex && !scene.entry.match(searchRegex)) return result
      return result.concat([`${this.getEmoji(scene, "")} ${scene.data.label}`])
    }, [])

    // Find entries
    const trackEntries = this.entriesList.reduce((result, entry) => {
      if (searchRegex && !entry.entry.match(searchRegex)) return result
      return result.concat([`${this.getEmoji(entry)} ${entry.data.label}`])
    }, [])

    // Find titles
    const trackTitles = this.titlesList.reduce((result, rule) => {
      if (!rule.data.title || (searchRegex && !(JSON.stringify(rule.data)).match(searchRegex))) return result
      return result.concat([`${this.getEmoji(rule, "")}${rule.data.title}`])
    }, [])

    // Sorting
    trackScenes.sort()
    trackEntries.sort()
    trackTitles.sort()

    if (!trackScenes.length && !trackEntries.length && !trackTitles.length) {
      this.messageOnce(`${SC_UI_ICON.SEARCH} Nothing found matching the pattern: ${creator.searchPattern}`)
      return this.getInfoStats()
    }

    // Display scenes
    if (trackScenes.length) displayStats.push({
      key: SC_UI_ICON.FIND_SCENES, color: SC_UI_COLOR.FIND_SCENES,
      value: `${trackScenes.join(SC_UI_ICON.SEPARATOR)}\n`
    })

    // Display entries
    if (trackEntries.length) displayStats.push({
      key: SC_UI_ICON.FIND_ENTRIES, color: SC_UI_COLOR.FIND_ENTRIES,
      value: `${trackEntries.join(SC_UI_ICON.SEPARATOR)}\n`
    })

    // Display titles
    if (trackTitles.length) displayStats.push({
      key: SC_UI_ICON.FIND_TITLES, color: SC_UI_COLOR.FIND_TITLES,
      value: `${trackTitles.join(", ")}\n`
    })

    this.messageOnce(`${SC_UI_ICON.SEARCH} Found ${trackScenes.length} ${trackScenes.length === 1 ? "scene" : "scenes"}, ${trackEntries.length} ${trackEntries.length === 1 ? "entry" : "entries"} and ${trackTitles.length} ${trackTitles.length === 1 ? "title" : "titles"} matching the pattern: ${creator.searchPattern}`)

    return displayStats
  }

  getTitleStats() {
    const { creator } = this.state
    let displayStats = []

    // Find references
    const entryLabels = [
      ...((creator.data[SC_DATA.SOURCE] && creator.data[SC_DATA.SOURCE].entry) ? creator.data[SC_DATA.SOURCE].entry.split(", ") : []),
      ...((creator.data[SC_DATA.TARGET] && creator.data[SC_DATA.TARGET].entry) ? creator.data[SC_DATA.TARGET].entry.split(", ") : [])
    ]
    const track = this.entriesList.reduce((a, c) => a.concat(entryLabels.includes(c.data.label) ? `${this.getEmoji(c)} ${c.data.label}` : []), [])

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats([], track))

    // Display all ENTRIES SC_TITLE_TARGET_KEYS
    const keys = creator.page === SC_UI_PAGE.TITLE_TARGET ? SC_TITLE_KEYS : SC_TITLE_SOURCE_KEYS
    displayStats = displayStats.concat(this.getTitleFieldStats(keys))

    return displayStats
  }

  getTitleFieldStats(keys) {
    const { creator } = this.state
    let displayStats = []

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

  getNotesStats() {
    const { creator } = this.state
    let displayStats = []

    // Get combined text to search for references
    const text = SC_SCENE_NOTES_ALL_KEYS.reduce((result, key) => {
      return result.concat([SC_DATA.EDITOR, SC_DATA.AUTHOR].reduce((result, section) => {
        const data = creator.data[section] && creator.data[section][key.replace(section, "").toLowerCase()]
        if (data) result += ` ${data}`
        return result
      }, ""))
    }, "")

    // Find references
    const track = this.getReferences(text)

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats(track))

    // Show generated text
    const notesText = this.getNotes(creator.page === SC_UI_PAGE.SCENE_EDITOR ? SC_DATA.EDITOR : SC_DATA.AUTHOR, creator.data)
    if (notesText) displayStats.push({
      key: SC_UI_ICON.NOTE_TEXT, color: SC_UI_COLOR.NOTE_TEXT,
      value: `${notesText}\n${SC_UI_ICON.BREAK}\n`
    })

    // Display all fields
    const keys = creator.page === SC_UI_PAGE.SCENE_EDITOR ? SC_SCENE_EDITORS_NOTE_KEYS : SC_SCENE_AUTHORS_NOTE_KEYS
    displayStats = displayStats.concat(this.getNotesFieldStats(keys))

    return displayStats
  }

  getNotesFieldStats(keys) {
    const { creator } = this.state
    let displayStats = []

    for (let key of keys) {
      const cleanKey = key.replace(SC_DATA.EDITOR, "").replace(SC_DATA.AUTHOR, "").toLowerCase()

      let data
      if (key.startsWith(SC_DATA.EDITOR) && creator.data[SC_DATA.EDITOR]) data = creator.data[SC_DATA.EDITOR][cleanKey]
      else if (key.startsWith(SC_DATA.AUTHOR) && creator.data[SC_DATA.AUTHOR]) data = creator.data[SC_DATA.AUTHOR][cleanKey]
      else data = creator.data[cleanKey]

      displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON[cleanKey.toUpperCase()]), color: SC_UI_COLOR[cleanKey.toUpperCase()],
        value: `${data || SC_UI_ICON.EMPTY}\n`
      })
    }

    return displayStats
  }

  getLabelTrackStats(track=[], extended=[], other=[]) {
    const { creator } = this.state
    const displayStats = []
    const isSingleton = this.configCommands.includes(creator.cmd) || this.notesCommands.includes(creator.cmd)
    const validCommands = [
      ...this.configCommands,
      ...this.notesCommands,
      ...this.sceneCommands
    ]

    if (creator.data) {
      const status = !isSingleton && !creator.source ? "New " : ""
      const pagination = creator.totalPages > 1 ? ` (${creator.currentPage}/${creator.totalPages})` : ""
      const label = creator.page === SC_UI_PAGE.ENTRY && creator.data.category ? this.toTitleCase(creator.data.category.toLowerCase()) : (creator.source ? creator.page.replace("Title ∙∙ ", "") : creator.page)
      const pageText = creator.page ? `${isSingleton ? "" : SC_UI_ICON.SEPARATOR}${status}${label}${pagination}` : ""
      const newline = (validCommands.includes(creator.cmd) || creator.page === SC_UI_PAGE.ENTRY_RELATIONS) ? `\n${SC_UI_ICON.BREAK}\n` : "\n"

      if (creator.data.label) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.LABEL), color: SC_UI_COLOR.LABEL,
        value: `${creator.data.label}${pageText}${newline}`
      })

      else if (creator.data.title) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.TITLE), color: SC_UI_COLOR.TITLE,
        value: `${creator.data.title}${pageText}${newline}`
      })

      else if (this.configCommands.includes(creator.cmd)) displayStats.push({
        key: SC_UI_ICON.CONFIG, color: SC_UI_COLOR.CONFIG,
        value: `${pageText}${newline}`
      })

      else displayStats.push({
        key: SC_UI_ICON.NOTES, color: SC_UI_COLOR.NOTES,
        value: `${pageText}${newline}`
      })
    }

    // Display MATCH
    if ([SC_UI_PAGE.TITLE_TARGET, SC_UI_PAGE.TITLE_SOURCE].includes(creator.page)) {
      displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.MATCH), color: SC_UI_COLOR.MATCH,
        value: `${creator.data[SC_DATA.TRIGGER] || SC_UI_ICON.EMPTY}\n${SC_UI_ICON.BREAK}\n`
      })
    }

    if (creator.page === SC_UI_PAGE.ENTRY && !creator.data.category) return displayStats

    // Display TRIGGER
    if (creator.page === SC_UI_PAGE.ENTRY) {
      displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.TRIGGER), color: SC_UI_COLOR.TRIGGER,
        value: `${creator.data[SC_DATA.TRIGGER] || SC_UI_ICON.EMPTY}\n${SC_UI_ICON.BREAK}\n`
      })
    }

    // Display tracked recognised entries
    if (track.length) {
      const newline = (!extended.length && !other.length) ? `\n${SC_UI_ICON.BREAK}\n` : "\n"
      displayStats.push({
        key: SC_UI_ICON.TRACK_MAIN, color: SC_UI_COLOR.TRACK_MAIN,
        value: `${track.join(SC_UI_ICON.SEPARATOR)}${newline}`
      })
    }

    // Display tracked unrecognised entries
    if (other.length) {
      const newline = !extended.length ? `\n${SC_UI_ICON.BREAK}\n` : "\n"
      displayStats.push({
        key: SC_UI_ICON.TRACK_OTHER, color: SC_UI_COLOR.TRACK_OTHER,
        value: `${other.join(SC_UI_ICON.SEPARATOR)}${newline}`
      })
    }

    // Display tracked extended family entries
    if (extended.length) {
      const newline = `\n${SC_UI_ICON.BREAK}\n`
      displayStats.push({
        key: SC_UI_ICON.TRACK_EXTENDED, color: SC_UI_COLOR.TRACK_EXTENDED,
        value: `${extended.join(SC_UI_ICON.SEPARATOR)}${newline}`
      })
    }

    return displayStats
  }

  getRelationshipLabel(rel, extended="") {
    const pronounEmoji = this.getEmoji(this.entries[rel.label])
    const dispEmoji = SC_RELATABLE.includes(rel.category) ? SC_UI_ICON[SC_DISP_REV[rel.flag.disp]] : ""
    const modEmoji = rel.flag.mod ? SC_UI_ICON[SC_MOD_REV[rel.flag.mod]] : ""
    const typeEmoji = rel.flag.type ? SC_UI_ICON[SC_TYPE_REV[rel.flag.type]] : ""
    const flag = (dispEmoji || typeEmoji || modEmoji) ? `[${dispEmoji}${typeEmoji}${modEmoji}]` : ""
    return `${pronounEmoji} ${rel.label} ${extended}${flag}`
  }

  getEmoji(entry, fallback=SC_UI_ICON.EMPTY) {
    if (!entry) return fallback

    const { you } = this.state
    const { category, icon, pronoun } = entry.data

    if (you === entry.data.label) return SC_UI_ICON[SC_PRONOUN.YOU.toUpperCase()]
    if (icon) return icon
    if (fallback === "") return fallback

    if (category === SC_CATEGORY.CHARACTER) return SC_UI_ICON[pronoun.toUpperCase()]
    return SC_UI_ICON[category && category.toUpperCase()] || fallback
  }

  getSelectedLabel(label) {
    const { creator } = this.state
    const step = SC_UI_ICON[creator.step.replace(/^(source|target|editor|author|scene)/i, "").toUpperCase()]
    const icon = [SC_UI_ICON.LABEL, SC_UI_ICON.TITLE].includes(label) ? this.getEmoji(creator, label) : label
    return step === label ? `${SC_UI_ICON.SELECTED}${icon}` : icon
  }

  getReferences(text) {
    const { creator } = this.state

    return this.entriesList.reduce((result, entry) => {
      if ([creator.data.label, creator.originalLabel].includes(entry.data.label)) return result
      if (entry.regex && text.match(entry.regex)) result.push(`${this.getEmoji(entry)} ${entry.data.label}`)
      return result
    }, [])
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
    let debugLines = context.finalContext.split("\n")
    debugLines.reverse()
    debugLines = debugLines.map((l, i) => "(" + (i < 9 ? "0" : "") + `${i + 1}) ${l}`)
    debugLines.reverse()
    state.message = debugLines.join("\n")
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
