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
const SC_UI_SHORTCUT = { PREV: "<", NEXT: ">", PREV_PAGE: "<<", NEXT_PAGE: ">>", EXIT: "!", DELETE: "^", GOTO: "#", HINTS: "?", SAVE_EXIT: "y!", EXIT_NO_SAVE: "n!" }

// Control over UI icons and labels
const SC_UI_ICON = {
  // Main HUD Labels
  HUD_POV: "🕹️ ",
  HUD_NOTES: "✒️ ",
  HUD_BANNED: "❌ ",

  // Tracking Labels
  TRACK: " ",
  TRACK_MAIN: "✔️ ",
  TRACK_OTHER: "⭕ ",
  TRACK_EXTENDED: "🔗 ",

  // Find Labels
  FIND_SCENES: "🎬 ",
  FIND_ENTRIES: "🎭 ",
  FIND_TITLES: "🏷️ ",

  // Scene Labels
  PROMPT: "📝 ",
  NOTES: "✒️ ",
  ASPECT: "🧩️ ",

  // Entry Labels
  LABEL: "🔖 ",
  TRIGGER: "🔍 ",
  MAIN: "📑 ",
  SEEN: "👁️ ",
  HEARD: "🔉 ",
  TOPIC: "💬 ",
  CATEGORY_OPTIONS: "🎭🗺️📦👑💡 ",

  // Injected Icons
  INJECTED_SEEN: "👁️",
  INJECTED_HEARD: "🔉",
  INJECTED_TOPIC: "💬",

  // Character Pronoun Icons
  YOU: "🕹️",
  HER: "🎗️",
  HIM: "➰",
  UNKNOWN: "🔱",

  // Character Status Icons
  ALIVE: "❤️",
  DEAD: "💀",
  UNDEAD: "🧟",

  // Entry Category Icons
  CHARACTER: "🎭",
  LOCATION: "🗺️",
  THING: "📦",
  FACTION: "👑",
  OTHER: "💡",
  SCENE: "🎬",

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
  BREAK: "〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️",

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
}

// Control over UI colors
const SC_UI_COLOR = {
  // HUD UI
  HUD_NOTES: "seagreen",
  HUD_POV: "dimgrey",
  HUD_BANNED: "indianred",

  // Tracking UI
  TRACK: "chocolate",
  TRACK_MAIN: "chocolate",
  TRACK_EXTENDED: "dimgrey",
  TRACK_OTHER: "brown",

  // Find UI
  FIND_SCENES: "indianred",
  FIND_ENTRIES: "chocolate",
  FIND_TITLES: "dimgrey",

  // Scene UI
  YOU: "seagreen",
  PROMPT: "slategrey",
  NOTES: "indianred",

  // Entry UI,
  LABEL: "indianred",
  TRIGGER: "seagreen",
  MAIN: "steelblue",
  SEEN: "slategrey",
  HEARD: "slategrey",
  TOPIC: "slategrey",

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
  CONFIG_SCENE_BREAK: "dimgrey"
}

// Control over page titles
const SC_UI_PAGE = {
  CONFIG: "Configuration",
  NOTES: "Currently Active Notes",
  SCENE: "Scene",
  SCENE_NOTES: "Scene Notes",
  ENTRY: "Entry",
  ENTRY_ASPECTS: "Aspects",
  ENTRY_NOTES: "Notes"
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
const SC_DATA = {
  // General
  LABEL: "label", TRIGGER: "trigger",
  // Scene
  YOU: "you", PROMPT: "prompt", NOTES: "notes", ASPECTS: "aspects",
  // Title
  TARGET: "target", SOURCE: "source",
  // Entry
  CATEGORY: "category", STATUS: "status", PRONOUN: "pronoun", MAIN: "main", SEEN: "seen", HEARD: "heard", TOPIC: "topic",
  // Relationships
  CONTACTS: "contacts", AREAS: "areas", EXITS: "exits", THINGS: "things", COMPONENTS: "components", CHILDREN: "children", PARENTS: "parents", PROPERTY: "property", OWNERS: "owners",
  // Config
  CONFIG_SPACING: "spacing",
  CONFIG_SIGNPOSTS: "signposts",
  CONFIG_PROSE_CONVERT: "prose_convert",
  CONFIG_SIGNPOSTS_DISTANCE: "signposts_distance",
  CONFIG_SIGNPOSTS_INITIAL_DISTANCE: "signposts_initial_distance",
  CONFIG_REL_SIZE_LIMIT: "rel_size_limit",
  CONFIG_SCENE_BREAK: "scene_break",
  CONFIG_DEAD_TEXT: "dead_text",
  CONFIG_HUD_MAXIMIZED: "hud_maximized",
  CONFIG_HUD_MINIMIZED: "hud_minimized"
}
const SC_SCOPE = {
  CONTACTS: SC_DATA.CONTACTS, AREAS: SC_DATA.AREAS, EXITS: SC_DATA.EXITS, THINGS: SC_DATA.THINGS, COMPONENTS: SC_DATA.COMPONENTS, CHILDREN: SC_DATA.CHILDREN, PARENTS: SC_DATA.PARENTS, PROPERTY: SC_DATA.PROPERTY, OWNERS: SC_DATA.OWNERS,
  SIBLINGS: "siblings", GRANDPARENTS: "grandparents", GRANDCHILDREN: "grandchildren", PARENTS_SIBLINGS: "parents siblings", SIBLINGS_CHILDREN: "siblings children"
}
const SC_CATEGORY = { CHARACTER: "character", LOCATION: "location", THING: "thing", FACTION: "faction", OTHER: "other" }
const SC_CATEGORY_CMD = {"@": SC_CATEGORY.CHARACTER, "#": SC_CATEGORY.LOCATION, "$": SC_CATEGORY.THING, "%": SC_CATEGORY.FACTION, "^": SC_CATEGORY.OTHER}
const SC_STATUS = { ALIVE: "alive", DEAD: "dead", UNDEAD: "undead" }
const SC_PRONOUN = { YOU: "you", HIM: "him", HER: "her", UNKNOWN: "unknown" }
const SC_RELATABLE = [ SC_CATEGORY.CHARACTER, SC_CATEGORY.FACTION, SC_CATEGORY.OTHER ]
const SC_NOTE_TYPES = { SCENE: "scene", ENTRY: "entry", CUSTOM: "custom", ASPECT: "aspect" }

const SC_DISP = { HATE: 1, DISLIKE: 2, NEUTRAL: 3, LIKE: 4, LOVE: 5 }
const SC_TYPE = { FRIENDS: "F", LOVERS: "L", ALLIES: "A", MARRIED: "M", ENEMIES: "E" }
const SC_MOD = { LESS: "-", EX: "x", MORE: "+" }

const SC_ENTRY_ALL_KEYS = [ SC_DATA.MAIN, SC_DATA.SEEN, SC_DATA.HEARD, SC_DATA.TOPIC ]
const SC_REL_ALL_KEYS = [ SC_DATA.AREAS, SC_DATA.EXITS, SC_DATA.THINGS, SC_DATA.COMPONENTS, SC_DATA.CONTACTS, SC_DATA.PARENTS, SC_DATA.CHILDREN, SC_DATA.PROPERTY, SC_DATA.OWNERS ]
const SC_SCENE_PROMPT_KEYS = [ "scenePrompt", "sceneYou" ]
const SC_CONFIG_KEYS = [ "config_spacing", "config_signposts", "config_prose_convert", "config_hud_maximized", "config_hud_minimized", "config_rel_size_limit", "config_signposts_distance", "config_signposts_initial_distance", "config_dead_text", "config_scene_break" ]

const SC_VALID_SCOPE = Object.values(SC_SCOPE)
const SC_VALID_STATUS = Object.values(SC_STATUS)
const SC_VALID_PRONOUN = Object.values(SC_PRONOUN).filter(p => p !== SC_PRONOUN.YOU)
const SC_VALID_DISP = Object.values(SC_DISP).map(v => `${v}`)
const SC_VALID_TYPE = Object.values(SC_TYPE)
const SC_VALID_MOD = Object.values(SC_MOD)
const SC_VALID_CATEGORY = Object.values(SC_CATEGORY)

const SC_FLAG_DEFAULT = `${SC_DISP.NEUTRAL}`

const SC_FEATHERLITE = "•"
const SC_SIGNPOST = "<<●>>>>"
const SC_SIGNPOST_BUFFER = 6

const SC_WI_SIZE = 500
const SC_WI_CONFIG = "#sc:config"
const SC_WI_REGEX = "#sc:regex"
const SC_WI_ENTRY = "#entry:"
const SC_WI_TITLE = "#title:"
const SC_WI_SCENE = "#scene:"

const SC_DEFAULT_CONFIG = {
  [SC_DATA.CONFIG_SPACING]: 1,
  [SC_DATA.CONFIG_SIGNPOSTS]: 1,
  [SC_DATA.CONFIG_PROSE_CONVERT]: 0,
  [SC_DATA.CONFIG_HUD_MAXIMIZED]: "pov/track/banned, notes",
  [SC_DATA.CONFIG_HUD_MINIMIZED]: "track/banned",
  [SC_DATA.CONFIG_REL_SIZE_LIMIT]: 800,
  [SC_DATA.CONFIG_ENTRY_INSERT_DISTANCE]: 0.6,
  [SC_DATA.CONFIG_SIGNPOSTS_DISTANCE]: 300,
  [SC_DATA.CONFIG_SIGNPOSTS_INITIAL_DISTANCE]: 50,
  [SC_DATA.CONFIG_SCENE_BREAK]: "〰️",
  [SC_DATA.CONFIG_DEAD_TEXT]: "(dead)"
}
const SC_DEFAULT_TITLES = [{"title":"mother","trigger":"/mother|m[uo]m(m[ya])?/"},{"title":"father","trigger":"/father|dad(dy|die)?|pa(pa)?/"},{"title":"sister","trigger":"/sis(ter)?/"},{"title":"brother","trigger":"/bro(ther)?/"},{"title":"grandmother","trigger":"/gran(dmother|dma|ny)/"},{"title":"grandfather","trigger":"/grand(father|pa|dad)/"},{"title":"best friend","trigger":"/best friend|bff|bestie/"}]
const SC_DEFAULT_REGEX = {
  YOU: "you(r|rself)?",
  HER: "she|her(self|s)?",
  HIM: "he|him(self)?|his",
  FEMALE: "♀|female|woman|lady|girl|gal|chick|wife|mother|m[uo]m(m[ya])?|daughter|aunt|gran(dmother|dma|ny)|queen|princess|duchess|countess|baroness|empress|maiden|witch",
  MALE: "♂|male|man|gentleman|boy|guy|lord|lad|dude|husband|father|dad(dy|die)?|pa(pa)?|son|uncle|grand(father|pa|dad)|king|prince|duke|count|baron|emperor|wizard",
  DEAD: "dead|deceased|departed|died|expired|killed|lamented|perished|slain|slaughtered",
  UNDEAD: "banshee|draugr|dullahan|ghost|ghoul|grim reaper|jiangshi|lich|mummy|phantom|poltergeist|revenant|shadow person|skeleton|spectre|undead|vampire|vrykolakas|wight|wraith|zombie",
  SEEN_AHEAD: "describ(e)?|display|examin(e)?|expos(e)?|glimps(e)?|imagin(e)?|notic(e)?|observ(e)?|ogl(e)?|peek|see|spot(t)?|view|watch",
  SEEN_AHEAD_ACTION: "frown|gaz(e)?|glanc(e)?|glar(e)?|leer|look|smil(e)?|star(e[ds]?|ing)",
  SEEN_BEHIND: "appears|arrives|comes out|emerges|looms|materializes",
  SEEN_BEHIND_ACTION: "checked|displayed|examined|exposed|glimpsed|inspected|noticed|observed|regarded|scanned|scrutinized|seen|spotted|sprawl(ed|ing)|viewed|watched|wearing",
  HEARD_AHEAD: "accent|amplification|babbl(e)?|bang|beep|bleep|buzz|chord|clank|clatter|crash|crunch|cry|decibels|din|dron(e)?|echo|fizz|grumbl(e)?|hiss|hubbub|hum(m)?|intonation|jangl(e)?|jingl(e)?|loudness|modulation|murmur|music|mutter|noise|note|pitch|purr|racket|report|resonance|reverberat(ion)?|ringing|row|rumbl(e)?|softness|sonance|sonancy|sonority|sonorousness|sound|splash|squeak|static|swish|tenor|thud|tinkl(e)?|tone|undertone|utterance|vibration|voice|volume|whi(r|z)|whisper",
  HEARD_BEHIND: "accent|babbl|bang|beep|bleep|buzz|clank|clatter|crash|crunch|cry|dron|echo|fizz|grumbl|hiss|hubbub|hum(m)?|intonation|jangl(e)?|jingl(e)?|loudness|modulation|murmur|music|mutter|noise|pitch|purr|racket|resonance|reverberat|ringing|rumbl|sonance|sonancy|sonority|sonorousness|sound|splash|squeak|swish|tenor|thud|tinkl|tone|undertone|utterance|voice|volume|whi(r|z)|whisper",
  STOP_WORDS: "'ll|'ve|a|able|about|above|abst|accordance|according|accordingly|across|act|actually|added|adj|affected|affecting|affects|after|afterwards|again|against|ah|all|almost|alone|along|already|also|although|always|am|among|amongst|an|and|announce|another|any|anybody|anyhow|anymore|anyone|anything|anyway|anyways|anywhere|apparently|approximately|are|aren|arent|arise|around|as|aside|ask|asking|at|auth|available|away|awfully|b|back|be|became|because|become|becomes|becoming|been|before|beforehand|begin|beginning|beginnings|begins|behind|being|believe|below|beside|besides|between|beyond|biol|both|brief|briefly|but|by|c|ca|came|can|can't|cannot|cause|causes|certain|certainly|co|com|come|comes|contain|containing|contains|could|couldnt|d|date|did|didn't|different|do|does|doesn't|doing|don't|done|down|downwards|due|during|e|each|ed|edu|effect|eg|eight|eighty|either|else|elsewhere|end|ending|enough|especially|et|et-al|etc|even|ever|every|everybody|everyone|everything|everywhere|ex|except|f|far|few|ff|fifth|first|five|fix|followed|following|follows|for|former|formerly|forth|found|four|from|further|furthermore|g|gave|get|gets|getting|give|given|gives|giving|go|goes|gone|got|gotten|h|had|happens|hardly|has|hasn't|have|haven't|having|he|hed|hence|her|here|hereafter|hereby|herein|heres|hereupon|hers|herself|hes|hi|hid|him|himself|his|hither|home|how|howbeit|however|hundred|i|i'll|i've|id|ie|if|im|immediate|immediately|importance|important|in|inc|indeed|index|information|instead|into|invention|inward|is|isn't|it|it'll|itd|its|itself|j|just|k|keep\tkeeps|kept|kg|km|know|known|knows|l|largely|last|lately|later|latter|latterly|least|less|lest|let|lets|like|liked|likely|line|little|look|looking|looks|ltd|m|made|mainly|make|makes|many|may|maybe|me|mean|means|meantime|meanwhile|merely|mg|might|million|miss|ml|more|moreover|most|mostly|mr|mrs|much|mug|must|my|myself|n|na|name|namely|nay|nd|near|nearly|necessarily|necessary|need|needs|neither|never|nevertheless|new|next|nine|ninety|no|nobody|non|none|nonetheless|noone|nor|normally|nos|not|noted|nothing|now|nowhere|o|obtain|obtained|obviously|of|off|often|oh|ok|okay|old|omitted|on|once|one|ones|only|onto|or|ord|other|others|otherwise|ought|our|ours|ourselves|out|outside|over|overall|owing|own|p|page|pages|part|particular|particularly|past|per|perhaps|placed|please|plus|poorly|possible|possibly|potentially|pp|predominantly|present|previously|primarily|probably|promptly|proud|provides|put|q|que|quickly|quite|qv|r|ran|rather|rd|re|readily|really|recent|recently|ref|refs|regarding|regardless|regards|related|relatively|research|respectively|resulted|resulting|results|right|run|s|said|same|saw|say|saying|says|sec|section|see|seeing|seem|seemed|seeming|seems|seen|self|selves|sent|seven|several|shall|she|she'll|shed|shes|should|shouldn't|show|showed|shown|showns|shows|significant|significantly|similar|similarly|since|six|slightly|so|some|somebody|somehow|someone|somethan|something|sometime|sometimes|somewhat|somewhere|soon|sorry|specifically|specified|specify|specifying|still|stop|strongly|sub|substantially|successfully|such|sufficiently|suggest|sup|sure\tt|take|taken|taking|tell|tends|th|than|thank|thanks|thanx|that|that'll|that've|thats|the|their|theirs|them|themselves|then|thence|there|there'll|there've|thereafter|thereby|thered|therefore|therein|thereof|therere|theres|thereto|thereupon|these|they|they'll|they've|theyd|theyre|think|this|those|thou|though|thoughh|thousand|throug|through|throughout|thru|thus|til|tip|to|together|too|took|toward|towards|tried|tries|truly|try|trying|ts|twice|two|u|un|under|unfortunately|unless|unlike|unlikely|until|unto|up|upon|ups|us|use|used|useful|usefully|usefulness|uses|using|usually|v|value|various|very|via|viz|vol|vols|vs|w|want|wants|was|wasnt|way|we|we'll|we've|wed|welcome|went|were|werent|what|what'll|whatever|whats|when|whence|whenever|where|whereafter|whereas|whereby|wherein|wheres|whereupon|wherever|whether|which|while|whim|whither|who|who'll|whod|whoever|whole|whom|whomever|whos|whose|why|widely|willing|wish|with|within|without|wont|words|world|would|wouldnt|www|x|y|yes|yet|z|zero",
  INFLECTED: "(?:ing|ed)?",
  PLURAL: "(?:es|s|'s|e's)?",
}
const SC_DEFAULT_NOTE_POS = 200

const SC_OCCURRENCE_DEAD = 0.1
const SC_OCCURRENCE_MAX = 8
const SC_WEIGHTS = {
  CATEGORY: {
    CHARACTER: 1,
    FACTION: 0.8,
    LOCATION: 0.6,
    THING: 0.4,
    OTHER: 0.2
  },
  STRENGTH: {
    ASPECTS: 1,
    MAIN: 0.8,
    SEEN: 0.8,
    HEARD: 0.8,
    TOPIC: 0.6,
    MAIN_NOTE: 0.8,
    SEEN_NOTE: 0.8,
    HEARD_NOTE: 0.8,
    TOPIC_NOTE: 0.6
  },
  QUALITY: {
    DIRECT: 1,
    PRONOUN: 0.5,
    EXPANDED_PRONOUN: 1
  }
}

const SC_RE = {
  INPUT_CMD: /^> You say "\/([\w!]+)\s?(.*)?"$|^> You \/([\w!]+)\s?(.*)?[.]$|^\/([\w!]+)\s?(.*)?$/,
  QUICK_CREATE_CMD: /^([@#$%^])([^:]+)(:[^:]+)?(:[^:]+)?(:[^:]+)?(:[^:]+)?/,
  QUICK_UPDATE_CMD: /^([@#$%^])([^+=]+)([+=])([^:]+):([^:]+)/,
  QUICK_NOTE_CMD: /^[+]+([^!:#]+)(#(-?\d+)(?:\s+)?)?(!)?(:(?:\s+)?([\s\S]+))?/,
  QUICK_ENTRY_NOTE_CMD: /^(📑|👁️|🔉|💬|[msht]|main|seen|heard|topic)?(?:\s+)?([+]+)([^!:#]+)(#(-?\d+)(?:\s+)?)?(!)?(:(?:\s+)?([\s\S]+))?/i,
  WI_REGEX_KEYS: /.?\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)|[^,]+/g,
  BROKEN_ENCLOSURE: /(")([^\w])(")|(')([^\w])(')|(\[)([^\w])(])|(\()([^\w])(\))|({)([^\w])(})|(<)([^\w])(>)/g,
  ENCLOSURE: /([^\w])("[^"]+")([^\w])|([^\w])('[^']+')([^\w])|([^\w])(\[[^]]+])([^\w])|([^\w])(\([^)]+\))([^\w])|([^\w])({[^}]+})([^\w])|([^\w])(<[^<]+>)([^\w])/g,
  SENTENCE: /([^!?.]+[!?.]+[\s]+?)|([^!?.]+[!?.]+$)|([^!?.]+$)/g,
  ESCAPE_REGEX: /[.*+?^${}()|[\]\\]/g,
  DETECT_FORMAT: /^[•\[{<]|[\]}>]$/g,
  REL_KEYS: /([^,:]+)(:([1-5][FLAME]?[+\-x]?))|([^,]+)/gi
}
/*
 * END SECTION - Hardcoded Settings
 */


/*
 * Simple Context Cache
 */
const getCache = () => { try { return simpleContextCache } catch { return { regex: {} } } }
const simpleContextCache = getCache()


/*
 * Simple Context Plugin
 */
class SimpleContextPlugin {
  // Plugin control commands
  systemCommands = ["enable", "disable", "show", "hide", "min", "max", "debug"]

  // Plugin configuration
  configCommands = ["config"]

  // Global notes
  notesCommands = ["notes", "n"]

  // Find scenes, entries and titles
  findCommands = ["find", "f"]

  // Create/Edit scenes, entries, relationships and titles
  sceneCommands = ["scene", "s"]
  entryCommands = ["entry", "e"]
  aspectsCommands = ["aspects", "a"]

  // Entry status commands
  killCommands = ["kill", "k"]
  reviveCommands = ["revive"]

  // Change scene and pov
  loadCommands = ["load", "l", "load!", "l!"]
  povCommands = ["you", "y"]

  // Ban entries from injection
  banCommands = ["ban", "b"]

  // Command to fix bugged displayStats
  flushCommands = ["flush", "flush!"]

  // Upgrade entries between SC2 versions
  updateCommands = ["update", "update!"]

  constructor() {
    // All state variables scoped to state.simpleContextPlugin
    // for compatibility with other plugins
    if (!state.simpleContextPlugin) this.reloadPlugin()
    this.state = state.simpleContextPlugin
    this.queue = []
    this.addQueue = []
    this.removeQueue = []
    this.cache = simpleContextCache
  }

  reloadPlugin() {
    state.simpleContextPlugin = {
      you: "",
      scene: "",
      sections: {},
      creator: {},
      banned: [],
      notes: {},
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
  }

  initialize() {
    // Create master lists of commands
    this.controlCommands = [
      ...this.systemCommands,
      ...this.povCommands,
      ...this.loadCommands,
      ...this.banCommands,
      ...this.killCommands,
      ...this.reviveCommands,
      ...this.flushCommands,
      ...this.updateCommands
    ]
    this.creatorCommands = [
      ...this.configCommands,
      ...this.notesCommands,
      ...this.sceneCommands,
      ...this.entryCommands,
      ...this.aspectsCommands,
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
    this.icons = {}

    // Main loop over worldInfo creating new entry objects with padded data
    for (let i = 0, l = worldInfo.length; i < l; i++) {
      const info = worldInfo[i]
      const entry = this.mergeWorldInfo(info, i)

      // Add system config mapping
      if (info.keys === SC_WI_CONFIG) this.config = entry

      // Add regex text mapping
      else if (info.keys === SC_WI_REGEX) this.regex = entry

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

      // Merge aspects
      const aspectsFields = Object.keys(entry.data).filter(f => f.startsWith(SC_DATA.ASPECTS))
      if (aspectsFields.length) {
        aspectsFields.sort()
        for (const field of aspectsFields) {
          if (!entry.data[SC_DATA.ASPECTS]) entry.data[SC_DATA.ASPECTS] = []
          entry.data[SC_DATA.ASPECTS] = entry.data[SC_DATA.ASPECTS].concat(entry.data[field])
          if (field !== SC_DATA.ASPECTS) delete entry.data[field]
        }
      }

      // Merge notes
      const notesFields = Object.keys(entry.data).filter(f => f.startsWith(SC_DATA.NOTES))
      if (notesFields.length) {
        notesFields.sort()
        for (const field of notesFields) {
          if (!entry.data[SC_DATA.NOTES]) entry.data[SC_DATA.NOTES] = []
          entry.data[SC_DATA.NOTES] = entry.data[SC_DATA.NOTES].concat(entry.data[field])
          if (field !== SC_DATA.NOTES) delete entry.data[field]
        }
      }

      // Merge prompts
      const promptFields = Object.keys(entry.data).filter(f => f.startsWith(SC_DATA.PROMPT))
      if (promptFields.length) {
        promptFields.sort()
        for (const field of promptFields) {
          if (!entry.data[SC_DATA.PROMPT]) entry.data[SC_DATA.PROMPT] = ""
          entry.data[SC_DATA.PROMPT] += entry.data[field]
          if (field !== SC_DATA.PROMPT) delete entry.data[field]
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
    for (const note of Object.values(this.state.notes)) this.icons[this.getNoteDisplayLabel(note)] = true
    const { creator } = this.state
    if (creator.data) {
      for (const type of [SC_DATA.NOTES, SC_DATA.ASPECTS]) {
        if (creator.data[type]) for (const note of creator.data[type]) this.icons[this.getNoteDisplayLabel(note)] = true
      }
    }
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
      let notesArray
      let aspectsArray
      let chunk = {}
      for (const key of Object.keys(entry.data)) {
        const value = entry.data[key]
        if (key === SC_DATA.ASPECTS) {
          aspectsArray = value
          continue
        }
        if (key === SC_DATA.NOTES) {
          notesArray = value
          continue
        }
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

      // Handle aspects separation
      if (aspectsArray) {
        const maxSize = SC_WI_SIZE - SC_DATA.ASPECTS.length - 8
        let chunk = 1
        let charCount = 0

        const aspects = aspectsArray.reduce((result, aspect) => {
          charCount += JSON.stringify(aspect).length + 1
          if (charCount >= maxSize) {
            chunk += 1
            charCount = 0
          }
          const field = `${SC_DATA.ASPECTS}${chunk}`
          if (!result[field]) result[field] = []
          result[field].push(aspect)
          return result
        }, {})

        for (const field of Object.keys(aspects)) {
          if (!aspects[field].length) break
          this.addQueue.push([entry.keys, JSON.stringify({[field]: aspects[field]})])
        }
      }

      // Handle notes separation
      if (notesArray) {
        const maxSize = SC_WI_SIZE - SC_DATA.NOTES.length - 8
        let chunk = 1
        let charCount = 0

        const notes = notesArray.reduce((result, note) => {
          charCount += JSON.stringify(note).length + 1
          if (charCount >= maxSize) {
            chunk += 1
            charCount = 0
          }
          const field = `${SC_DATA.NOTES}${chunk}`
          if (!result[field]) result[field] = []
          result[field].push(note)
          return result
        }, {})

        for (const field of Object.keys(notes)) {
          if (!notes[field].length) break
          this.addQueue.push([entry.keys, JSON.stringify({[field]: notes[field]})])
        }
      }

      // Handle prompt separation
      if (promptText) {
        const sentences = this.getSentences(promptText)
        const maxSize = SC_WI_SIZE - SC_DATA.PROMPT.length - 8
        let chunk = 1
        let charCount = 0

        const prompts = sentences.reduce((result, sentence) => {
          charCount += sentence.length
          if (charCount >= maxSize) {
            chunk += 1
            charCount = 0
          }
          const field = `${SC_DATA.PROMPT}${chunk}`
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

  updatePlugin(dryrun=true) {
    // Handle upgrading entries
    for (const entry of this.entriesList) {
      let hasChanged = false

      const existing = entry.data[SC_DATA.ASPECTS]
      const aspects = existing || []
      if (!existing) {
        entry.data[SC_DATA.ASPECTS] = aspects
        hasChanged = true
      }

      // Map relationships to aspects
      for (const rel of this._getRelMapping(entry)) {
        if (aspects.find(a => a.title === rel.title)) continue
        const text = rel.targets.map(t => `${t}${this.entries[t] && [SC_CATEGORY.CHARACTER, SC_CATEGORY.FACTION].includes(this.entries[t].data.category) ? ` <${rel.title}>` : ""}`).join(", ")
        aspects.push({ type: SC_NOTE_TYPES.ASPECT, label: rel.title, pos: 0, text, follow: true })
        hasChanged = true
      }

      // Map MAIN, SEEN, HEARD and TOPIC to entry notes
      const oldFields = ["main", "seen", "heard", "topic"]
      for (const oldField of oldFields) {
        if (!entry.data[oldField]) continue
        this.addNote(entry, oldField, 0, entry.data[oldField], SC_NOTE_TYPES.ENTRY, false, false, oldField)
        delete entry.data[oldField]
        hasChanged = true
      }

      // Wipe old fields
      const oldRelFields = ["contacts", "areas", "exits", "things", "components", "children", "parents", "property", "owners", "editor", "author"]
      for (const oldField of oldRelFields) {
        if (!entry.data[oldField]) continue
        delete entry.data[oldField]
        hasChanged = true
      }

      const aspectsMsg = aspects.length ? `added '${aspects.map(a => a.label).join(", ")}'` : ""
      const dryrunMsg = dryrun ? " [DRYRUN]" : ""
      this.messageOnce(`${SC_UI_ICON.SUCCESS}${dryrunMsg} Updated '${entry.data.label}' ${aspectsMsg}`)
      if (hasChanged && !dryrun) this.saveWorldInfo(entry)
    }

    // Delete titles
    if (!dryrun) for (const title of this.titlesList) this.removeWorldInfo(title)
  }

  createEntryCommand(params) {
    params.shift()

    // Quick commands for adding
    params = params.map(m => (m.startsWith(":") ? m.slice(1) : m).trim())

    // Determine category from cmd
    const category = SC_CATEGORY_CMD[params.shift()]

    // Conversion command
    const label = params.shift()
    if (label.toLowerCase().startsWith("convert")) {
      if (params.length === 0) {
        if (label.includes(" ")) this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Unrecognised conversion command, try '@convert: .*' instead!`, false)
        else this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Pattern must be specified to convert entries!`, false)
        return ""
      }
      const pattern = params.shift()
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

    // Setup data
    const [main, seen, heard, topic] = params.map(p => `${label} ${p}`)

    // Setup trigger and do pronoun params
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

  updateEntryCommand(params) {
    params.shift()

    // Quick commands for adding
    params = params.map(m => (m.startsWith(":") ? m.slice(1) : m.trim()))

    // Determine category from cmd
    let [cmd, label, mod, field, text] = params
    const category = SC_CATEGORY_CMD[cmd]
    const append = mod === "+"

    // Check entry exists
    const entry = this.entries[label]
    if (!entry || entry.data.category !== category) {
      this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Entry with that label does not exist, try creating it with '${cmd}${label}' first!`, false)
      return ""
    }

    // Check valid field
    const keys = SC_ENTRY_ALL_KEYS
    const idx = Number(field) ? Number(field) - 1 : keys.indexOf(field)
    if (idx <= -1 || idx >= keys.length) {
      this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Invalid field selected!`, false)
      return ""
    }

    // Replace/update entry
    if (append) entry.data[keys[idx]] = (entry.data[keys[idx]] || "") + text.toString()
    else entry.data[keys[idx]] = text.toString().replace(/^\*|\n\*/g, SC_FEATHERLITE)
    this.saveWorldInfo(entry)

    // Update context
    this.parseContext()

    // Show message
    this.messageOnce(`${SC_UI_ICON.SUCCESS} ${this.toTitleCase(category)} '${label}->${keys[idx]}' was updated to: ${entry.data[keys[idx]]}`)
    return ""
  }

  getJson(text) {
    try { return JSON.parse(text) }
    catch (e) {}
  }

  getRegex(patterns, flags) {
    patterns = Array.isArray(patterns) ? patterns : [patterns]
    const pattern = patterns.join("|")
    const id = `/${pattern}/${flags}`
    if (!this.cache[id]) this.cache[id] = new RegExp(pattern, flags)
    return this.cache[id]
  }

  getEntryRegex(text, wrapOr=true, insensitive=false) {
    let flags = "g" + (insensitive ? "i" : "")
    let brokenRegex = false
    let pattern = [...text.matchAll(SC_RE.WI_REGEX_KEYS)].map(match => {
      if (!match[1] && match[0].startsWith("/")) brokenRegex = true
      if (match[2]) flags = match[2].includes("g") ? match[2] : `g${match[2]}`
      return match[1] ? (wrapOr && match[1].includes("|") ? `(${match[1]})` : match[1]) : this.getEscapedRegex(match[0].trim())
    })
    if (brokenRegex) return
    return this.getRegex(pattern, flags)
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
      if (text.match(entry.regex)) return entry
    }
  }

  getPronoun(text) {
    if (!text) return SC_PRONOUN.UNKNOWN
    if (!text.includes(":")) text = text.split(".")[0]
    if (text.match(this.getRegex(`\\b(${this.regex.data.FEMALE})\\b`, "gi"))) return SC_PRONOUN.HER
    if (text.match(this.getRegex(`\\b(${this.regex.data.MALE})\\b`, "gi"))) return SC_PRONOUN.HIM
    return SC_PRONOUN.UNKNOWN
  }

  getStatus(text) {
    if (!text) return SC_STATUS.ALIVE
    if (!text.includes(":")) text = text.split(".")[0]
    if (text.match(this.getRegex(`\\b(${this.regex.data.UNDEAD})\\b`, "gi"))) return SC_STATUS.UNDEAD
    if (text.match(this.getRegex(`\\b(${this.regex.data.DEAD})\\b`, "gi"))) return SC_STATUS.DEAD
    return SC_STATUS.ALIVE
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
      const pattern = this.getRegex(`${w}$`, 'i')
      const replace = irregular[w]
      if (pattern.test(word)) {
        return word.replace(pattern, replace)
      }
    }

    // check for matches using regular expressions
    for (const reg in plural) {
      const pattern = this.getRegex(reg, 'i')
      if (pattern.test(word)) {
        return word.replace(pattern, plural[reg])
      }
    }

    return word
  }

  getWeight(score, goal) {
    return score !== 0 ? ((score <= goal ? score : goal) / goal) : 0
  }

  getContextTemplate(text) {
    return {
      // Context limit detection and benchmarks
      capped: false, sizes: {}, start: new Date().getTime(), benchmarks: [],
      // Extrapolated matches and relationship data
      metrics: [], relations: [], tree: {}, candidates: [], injected: [], pronouns: [],
      // Grouped sentences by section
      header: [], sentences: [], history: [], ranges: [],
      // Original text stored for parsing outside of contextModifier
      text: text || (this.state && this.state.context.text) || "", final: ""
    }
  }

  getFormattedEntry(text, insertNewlineBefore=false, insertNewlineAfter=false, replaceYou=true) {
    if (!text) return

    // You replacement
    if (replaceYou) text = this.replaceYou(text)

    // Encapsulation of entry in brackets
    const match = text.match(SC_RE.DETECT_FORMAT)
    if (!match) text = text.split("\n").map(line => {
      if (replaceYou && this.getConfig(SC_DATA.CONFIG_PROSE_CONVERT)) line = line
        .replace(this.getRegex(`\\b(${this.regex.data.STOP_WORDS})\\b`, "gi"), "")
        .replace(/[!?.]+/g, ".")
        .replace(/ +/g, " ").trim()
        .replace(/\.$/g, "")
      return `<< ${this.toTitleCase(line.trim())}>>>>`
    }).join("\n")

    // Final forms
    text = `${insertNewlineBefore ? "\n" : ""}${text}${insertNewlineAfter ? "\n" : ""}`

    return text
  }

  getNotesBySection(entry, section) {
    if (!entry.data.notes) return []
    return entry.data.notes.filter(n => n.section === section)
  }

  getAspectReciprocal(aspect) {
    const titleRule = this.titles[aspect.reciprocal]
    return {
      title: aspect.reciprocal,
      pattern: (titleRule && titleRule.data.trigger) ? this.getRegexPattern(titleRule.data.trigger) : this.getEscapedRegex(aspect.reciprocal),
      restricted: aspect.restricted,
      source: aspect.target,
      target: aspect.source,
      exists: true,
      inject: false,
      reciprocal: aspect.title
    }
  }

  getAspectTargets(text) {
    return text.split(",").reduce((result, rawTarget) => {
      const [cleanTarget, reciprocal] = rawTarget.split("<").map(i => i.split(">")[0].trim())
      const inject = cleanTarget.endsWith("!")
      const target = inject ? cleanTarget.slice(0, -1).trim() : cleanTarget
      const exists = !!this.entries[target]
      return result.concat([{ target, exists, inject: exists && inject, reciprocal: exists && reciprocal }])
    }, [])
  }

  getAspects(entry) {
    return (entry.data[SC_DATA.ASPECTS] || []).reduce((result, data) => {
      const titleRule = this.titles[data.label]
      const pattern = (titleRule && titleRule.data.trigger) ? this.getRegexPattern(titleRule.data.trigger) : this.getEscapedRegex(data.label)
      const restricted = !data.follow
      const aspect = { title: data.label, pattern, restricted, source: entry.data.label }
      return result.concat(this.getAspectTargets(data.text).map(target => Object.assign({}, aspect, target)))
    }, [])
  }

  setAspects(entry, aspects) {
    entry.data[SC_DATA.ASPECTS] = aspects.reduce((result, aspect) => {
      const existing = result.find(n => n.label === aspect.title)
      const note = existing || { type: SC_NOTE_TYPES.ASPECT, label: aspect.title, pos: 0, text: "", follow: !aspect.restricted }
      if (note.text !== "") note.text += ", "
      const reciprocalText = aspect.reciprocal ? ` <${aspect.reciprocal}>` : ""
      note.text += `${aspect.target}${aspect.inject ? "!" : ""}${reciprocalText}`
      if (!existing) result.push(note)
      return result
    }, [])
  }

  getConfig(section) {
    const data = this.config.data[section]
    return data === undefined ? SC_DEFAULT_CONFIG[section] : data
  }

  isValidRuleValue(rule, value) {
    const isIncluded = !rule || !rule.included.length || rule.included.includes(value)
    const notExcluded = !rule || !rule.excluded.length || !rule.excluded.includes(value)
    return isIncluded && notExcluded
  }

  isValidEntrySize(text) {
    const isValid = (text && this.originalSize !== 0) ? (((this.modifiedSize + text.length) / this.originalSize) < 0.85) : false
    if (!isValid) this.state.context.capped = true
    return isValid
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
    const youMatch = this.getRegex(`\\b${you.data.label}${this.regex.data.PLURAL}\\b`, "gi")
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
   * MODDING FUNCTIONS
   */

  quickCommand(modifiedText) {
    // Quick check to return early if possible
    if (!["@", "#", "$", "%", "^", "+"].includes(modifiedText[0]) || (modifiedText[0] !== "+" && modifiedText.includes("\n"))) return text

    // Match a note update/create command
    let match = modifiedText.match(SC_RE.QUICK_NOTE_CMD)
    if (match && match.length === 7) {
      const label = (match[1] || "").toString().trim()
      const pos = Number(match[3])
      const toggle = (match[4] || "") === "!"
      const text = (match[6] || "").toString()
      const status = this.addNote(null, label, pos, text, SC_NOTE_TYPES.CUSTOM, toggle, match[0].startsWith("++"))
      if (status === "error") this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! A note with that label does not exist, try creating it with ':${match[1]}:Your note.' first!`, false)
      else {
        this.parseContext()
        this.messageOnce(`${SC_UI_ICON.SUCCESS} Note '${match[1]}' was successfully ${status}!`)
        return ""
      }
    }

    // Match a update command
    match = SC_RE.QUICK_UPDATE_CMD.exec(modifiedText)
    if (match) match = match.filter(v => !!v)
    if (match && match.length === 6) return this.updateEntryCommand(match)

    // Match a create command
    match = SC_RE.QUICK_CREATE_CMD.exec(modifiedText)
    if (match) match = match.filter(v => !!v)
    if (match && match.length > 1) return this.createEntryCommand(match)

    return text
  }

  addNote(entry, label, pos, text, type=SC_NOTE_TYPES.CUSTOM, hidden=false, autoLabel=false, section=null) {
    // Get notes
    const notes = !entry ? this.state.notes : (entry.data[type === SC_NOTE_TYPES.ASPECT ? SC_DATA.ASPECTS : SC_DATA.NOTES] || []).reduce((result, note) => {
        result[note.label] = note
        return result
    }, {})

    // Get data from command
    const restrict = label.endsWith("*")
    label = label.split("*")[0]
    const existing = notes[label]

    // Invalid command
    if (!label || (!existing && pos === undefined && !text && !hidden && !section && !restrict)) return "error"

    // Format some values
    if (type === SC_NOTE_TYPES.ENTRY && section) {
      if (section === SC_UI_ICON.MAIN.trim() || section.toLowerCase().startsWith("m")) section = SC_DATA.MAIN
      else if (section === SC_UI_ICON.SEEN.trim() || section.toLowerCase().startsWith("s")) section = SC_DATA.SEEN
      else if (section === SC_UI_ICON.HEARD.trim() || section.toLowerCase().startsWith("h")) section = SC_DATA.HEARD
      else if (section === SC_UI_ICON.TOPIC.trim() || section.toLowerCase().startsWith("t")) section = SC_DATA.TOPIC
    }

    let status
    if (existing) {
      // Delete note
      if (!pos && !text && !section && !hidden && !restrict) {
        this.removeStat(this.getNoteDisplayLabel(existing))
        delete notes[label]
        status = "removed"
      }

      // Update note
      else {
        existing.type = type
        if (!isNaN(pos)) existing.pos = pos
        if (type !== SC_NOTE_TYPES.ASPECT) {
          if (text) existing.text = autoLabel ? `${label} ${text}` : text
          if (section) existing.section = section
          if (!isNaN(pos) || text || section) existing.visible = !hidden
          else if (hidden) existing.visible = !existing.visible
        }
        else {
          if (text) {
            const [cleanTarget, reciprocal] = text.split("<").map(i => i.split(">")[0].trim())
            existing.text = `${cleanTarget}${reciprocal ? ` <${reciprocal}>` : ""}`
          }
          if (!isNaN(pos) || text) existing.follow = !restrict
          else if (restrict) existing.follow = !existing.follow
        }
        status = "updated"
      }
    }

    // Create note
    else {
      const isEntry = [SC_NOTE_TYPES.ENTRY, SC_NOTE_TYPES.ASPECT].includes(type)
      const defaultPos = isEntry ? 0 : SC_DEFAULT_NOTE_POS

      const [cleanTarget, reciprocal] = text.split("<").map(i => i.split(">")[0].trim())
      const targets = type !== SC_NOTE_TYPES.ASPECT ? (autoLabel ? `${label} ${text}` : text) : `${cleanTarget}${reciprocal ? ` <${reciprocal}>` : ""}`

      notes[label] = { type, label, pos: pos || defaultPos, text: targets }
      if (section || type === SC_NOTE_TYPES.ENTRY) notes[label].section = section || SC_DATA.MAIN
      if (!isEntry) notes[label].visible = !hidden
      else notes[label].follow = !restrict
      status = "created"
    }

    if (entry) entry.data[type === SC_NOTE_TYPES.ASPECT ? SC_DATA.ASPECTS : SC_DATA.NOTES] = Object.values(notes)
    return status
  }

  loadPov(povText, reload=true) {
    const { sections } = this.state

    if (povText) {
      sections.pov = `You are ${povText}`
      const you = this.getInfoMatch(povText)
      if (you) this.state.you = you.data.label
    }
    else {
      delete sections.pov
      this.state.you = ""
    }

    if (reload) this.parseContext()
  }

  loadScene(scenesText, showPrompt=true) {
    // Clear loaded scene
    if (!scenesText) {
      this.state.scene = ""
      this.clearSceneNotes()
      this.parseContext()
      return ""
    }

    // Load multiple scenes
    let prompt = ""
    let doneFirst = false
    for (const label of scenesText.split(",").map(l => l.trim())) {
      // Validate scene exists
      const scene = this.scenes[label]
      if (!scene) {
        this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Scene with that label does not exist, try creating it with '/scene ${label}' before continuing.`, false)
        return ""
      }
      this.state.scene = label

      // Transition to new scene
      if (scene.data[SC_DATA.YOU]) this.loadPov(scene.data[SC_DATA.YOU], false)
      if (!doneFirst) this.clearSceneNotes()
      if (scene.data[SC_DATA.NOTES]) for (const note of scene.data[SC_DATA.NOTES]) this.state.notes[note.label] = note

      // Scene break
      if (showPrompt) {
        const sceneBreak = this.getConfig(SC_DATA.CONFIG_SCENE_BREAK)
        let sceneBreakEmoji = this.getEmoji(scene, "")
        if (sceneBreakEmoji) sceneBreakEmoji += " "
        const sceneBreakText = doneFirst ? "" : `${sceneBreak} ${sceneBreakEmoji}${scene.data.label} ${sceneBreak}\n`
        prompt += `${sceneBreakText}` + (scene.data[SC_DATA.PROMPT] ? scene.data[SC_DATA.PROMPT] : (doneFirst ? "" : "\n"))
      }
      doneFirst = true
    }

    // Parse context for new notes
    this.parseContext()

    return prompt
  }

  clearSceneNotes() {
    this.state.notes = Object.values(this.state.notes).reduce((result, note) => {
      if (note.type === SC_NOTE_TYPES.CUSTOM) result[note.label] = note
      return result
    }, {})
  }

  banEntry(entriesText) {
    this.state.banned = !entriesText ? [] : [...new Set([
      ...(this.state.banned || []),
      ...entriesText.split(",").map(l => l.trim()).filter(l => this.entries[l])
    ])]

    const { banned, sections } = this.state
    if (banned.length) sections.banned = banned.join(", ")
    else delete sections.banned

    this.parseContext()
  }

  setEntryStatus(entriesText, status=SC_STATUS.DEAD) {
    const entries = entriesText.split(",").map(l => l.trim())
      .reduce((a, c) => a.concat(this.entries[c] && SC_RELATABLE.includes(this.entries[c].data.category) ? [this.entries[c]] : []), [])

    for (const entry of entries) {
      entry.data.status = status
      this.saveWorldInfo(entry)
    }

    this.parseContext()
    this.messageOnce(`${SC_UI_ICON[status.toUpperCase()]} Entry '' is ${status.toUpperCase()}!`)
  }

  syncAspects(source) {
    // WARNING: Does full check of World Info. Only use this sparingly!
    // Currently used to sync all aspects on the 'source' provided
    const sourceAspects = this.getAspects(source).filter(a => !!a.reciprocal)

    for (let i = 0, l = this.entriesList.length; i < l; i++) {
      const target = this.entriesList[i]
      if (target.data.label === source.data.label) continue
      const _sourceAspects = sourceAspects.filter(a => a.target === target.data.label)
      const sourceTitles = _sourceAspects.map(a => a.title)
      const targetAspects = this.getAspects(target)
      const _targetAspects = targetAspects.filter(a => a.target === source.data.label)

      // Flag for updating
      let update

      // Clear out invalid
      for (const aspect of _targetAspects) {
        if (!aspect.reciprocal || sourceTitles.includes(aspect.reciprocal)) continue
        const idx = targetAspects.findIndex(a => a.target === aspect.target && a.title === aspect.title)
        targetAspects.splice(idx, 1)
        update = true
      }

      // Create/update reciprocal aspect
      for (const aspect of _sourceAspects) {
        const exists = _targetAspects.find(a => a.title === aspect.reciprocal)
        if (exists) {
          if (exists.reciprocal === aspect.title) continue
          exists.reciprocal = aspect.title
        }
        else targetAspects.push(this.getAspectReciprocal(aspect))
        update = true
      }

      // Only save entries that have been updated
      if (update) {
        this.setAspects(target, targetAspects)
        this.saveWorldInfo(target)
      }
    }
  }


  /*
   * DEPRECATED!
   * @todo: remove after everyone upgrades
   */
  _getRelFlag(disp, type="", mod="") {
    if (disp > 5 || disp < 1) disp = 3
    return this._getRelFlagByText(`${disp}${type || ""}${mod || ""}`)
  }

  _getRelFlagByText(text) {
    text = text.toString().toUpperCase().slice(0, 3)
    if (text.length === 2 && text[1] === "x") text = text.slice(0, -1)
    const disp = Number(text[0])
    const type = text.length >= 2 ? text[1].toUpperCase() : ""
    const mod = text.length >= 3 ? text[2].toLowerCase() : ""
    return { disp, mod, type, text: `${disp}${type}${mod}` }
  }

  _getRelKeys(scope, data, within) {
    const text = data && (within ? data[within] : data[scope])
    if (!text) return []

    const entry = this.entries[data.label]
    if (!entry) return []

    const labels = []
    return [...text.matchAll(SC_RE.REL_KEYS)]
      // Remove invalid keys
      .map(m => m.filter(k => !!k))
      // Get relationship object
      .map(m => this._getRelTemplate(scope, entry.data.label, m[1].split(":")[0].trim(), m.length >= 3 ? m[3] : SC_FLAG_DEFAULT))
      // Remove duplicates
      .reduce((result, rel) => {
        if (!labels.includes(rel.label)) {
          labels.push(rel.label)
          result.push(rel)
        }
        return result
      }, [])
  }

  _getRelAllKeys(data) {
    return SC_REL_ALL_KEYS.reduce((result, scope) => result.concat(data[scope] ? this._getRelKeys(scope, data) : []), [])
  }

  _getRelExpKeys(data) {
    let relationships = this._getRelAllKeys(data)
    if (!relationships.length) return []

    // Get immediate family to cross reference
    const family = [
      ...this._getRelKeys(SC_DATA.CHILDREN, data),
      ...this._getRelKeys(SC_DATA.PARENTS, data)
    ].map(r => r.label)

    // Get expanded relationships, relationship flag with contact flag if found
    relationships = relationships.reduce((result, rel) => this._reduceRelations(result, rel, data, family), [])

    // Overwrite expanded relationship flag with contact flag if found
    return relationships.reduce((result, rel) => {
      if (rel.label === data.label) return result
      const existing = relationships.find(r => r.scope === SC_SCOPE.CONTACTS && r.label === rel.label)
      if (existing) rel.flag = existing.flag
      result.push(rel)
      return result
    }, [])
  }

  _getRelRule(text, validValues=[], implicitlyExcluded=[]) {
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

  _getRelReverse(entry, target) {
    const regex = this.getRegex(`${target}(:([^,]+))?`, "i")

    for (const scope of SC_REL_ALL_KEYS) {
      if (!entry.data[scope]) continue
      const match = entry.data[scope].match(regex)
      if (!match) continue
      const flag = this._getRelFlagByText(match[2] ? match[2] : SC_FLAG_DEFAULT)
      return this._getRelTemplate(scope, entry.data.label, target, flag)
    }
  }

  _getRelMatches(rel, pronoun) {
    const target = this.entries[rel.label]
    const data = { source: rel }
    const reverse = this._getRelTemplate(rel.scope, rel.label, rel.source, this._getRelFlagByText(SC_FLAG_DEFAULT))

    // Attempt to get reverse mapping of relationship
    if (target) {
      data.target = this._getRelReverse(target, rel.source)
      if (!data.target) data.target = reverse
    }
    else data.target = reverse

    return this.titlesList.reduce((result, entry) => {
      const rule = entry.data
      if (!rule.title) return result

      // Return early if target required to match rule but none found
      if (rule.target && !data.target) return result

      // Match relationship scope
      let fieldRule = rule.scope && this._getRelRule(rule.scope, SC_VALID_SCOPE)
      if (!this.isValidRuleValue(fieldRule, rel.scope)) return result

      // Loop through rule set returning if any rule doesn't match
      for (const i of Object.keys(data)) {
        if (!rule[i] || !data[i]) continue

        // Match entry category
        fieldRule = rule[i].category && this._getRelRule(rule[i].category, SC_VALID_CATEGORY)
        if (!this.isValidRuleValue(fieldRule, data[i].category)) return result

        // Match entry status
        fieldRule = rule[i].status && this._getRelRule(rule[i].status, SC_VALID_STATUS)
        if (!this.isValidRuleValue(fieldRule, data[i].status)) return result

        // Match entry pronoun
        fieldRule = rule[i].pronoun && this._getRelRule(rule[i].pronoun, SC_VALID_PRONOUN)
        if (!this.isValidRuleValue(fieldRule, data[i].pronoun)) return result

        // Match entry label
        fieldRule = rule[i].entry && this._getRelRule(rule[i].entry)
        if (!this.isValidRuleValue(fieldRule, data[i].source)) return result

        // Match relationship disposition
        fieldRule = rule[i].disp && this._getRelRule(`${rule[i].disp}`, SC_VALID_DISP)
        if (!this.isValidRuleValue(fieldRule, `${data[i].flag.disp}`)) return result

        // Match relationship type
        fieldRule = rule[i].type && this._getRelRule(rule[i].type, SC_VALID_TYPE)
        if (!this.isValidRuleValue(fieldRule, data[i].flag.type)) return result

        // Match relationship modifier
        fieldRule = this._getRelRule(rule[i].mod, SC_VALID_MOD, [SC_MOD.EX])
        if (!this.isValidRuleValue(fieldRule, data[i].flag.mod)) return result
      }

      result.push({ pronoun, title: rule.title, pattern: rule.trigger && `(${this.getRegexPattern(rule.trigger)})` })
      return result
    }, [])
  }

  _getRelMapping(entry, categories=[]) {
    return this._getRelExpKeys(entry.data).reduce((result, rel) => {
      const target = this.entries[rel.label]
      if (!target || (categories.length && !categories.includes(target.data.category))) return result

      for (let match of this._getRelMatches(rel)) {
        const existing = result.find(m => m.title === match.title)
        const mapping = existing || Object.assign({ targets: [] }, match)
        mapping.targets.push(rel.label)
        if (!existing) result.push(mapping)
      }

      return result
    }, [])
  }

  _getRelTemplate(scope, sourceLabel, targetLabel, flagText) {
    const { creator } = this.state
    let flag = typeof flagText === "object" ? flagText : this._getRelFlagByText(flagText)
    let target = this.entries[targetLabel] && this.entries[targetLabel].data
    let source = this.entries[sourceLabel] && this.entries[sourceLabel].data
    if (!target && creator.data) target = creator.data
    if (source && !SC_RELATABLE.includes(source.category)) flag = this._getRelFlag(SC_DISP.NEUTRAL)
    else if (target && !SC_RELATABLE.includes(target.category)) flag = this._getRelFlag(flag.disp)

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

  _reduceRelations(result, rel, data, family=[]) {
    result.push(rel)
    const entry = this.entries[rel.label]
    if (!entry || data.label === rel.label) return result

    // Grandparents/Siblings
    if (rel.scope === SC_SCOPE.PARENTS) {
      result = result.concat([
        ...this._getRelKeys(SC_SCOPE.GRANDPARENTS, entry.data, SC_DATA.PARENTS),
        ...this._getRelKeys(SC_SCOPE.SIBLINGS, entry.data, SC_DATA.CHILDREN)
      ].reduce((result, rel) => this._reduceRelations(result, rel, data, family), []))
    }

    // Grandchildren
    else if (rel.scope === SC_SCOPE.CHILDREN) {
      result = result.concat(this._getRelKeys(SC_SCOPE.GRANDCHILDREN, entry.data, SC_DATA.CHILDREN)
        .reduce((result, rel) => this._reduceRelations(result, rel, data, family), []))
    }

    // Aunts/Uncles
    else if (rel.scope === SC_SCOPE.GRANDPARENTS) {
      result = result.concat(this._getRelKeys(SC_SCOPE.PARENTS_SIBLINGS, entry.data, SC_DATA.CHILDREN)
        .reduce((result, rel) => family.includes(rel.label) ? result : this._reduceRelations(result, rel, data, family), []))
    }

    // Nieces/Nephews
    else if (rel.scope === SC_SCOPE.SIBLINGS) {
      result = result.concat(this._getRelKeys(SC_SCOPE.SIBLINGS_CHILDREN, entry.data, SC_DATA.CHILDREN)
        .reduce((result, rel) => this._reduceRelations(result, rel, data, family), []))
    }

    return result
  }
  /*
   * DEPRECATED!
   */


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
    return this.finalize(this.state.context.final)
  }

  benchmark(label) {
    const { context } = this.state
    const time = (new Date().getTime() - context.start)
    context.benchmarks.push({ label, time })
    return time
  }

  parseContext(context) {
    // Store new context if one was passed
    this.state.context = this.getContextTemplate(context)

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
    const sceneBreakRegex = this.getRegex(`${sceneBreakText}.*${sceneBreakText}\\n|\\n${sceneBreakText}.*${sceneBreakText}`)
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
      // Check for scene break
      if (!sceneBreak && sentence.includes(sceneBreakText)) {
        result.sentences.unshift(sentence.replace(sceneBreakRegex, ""))
        if (idx !== 0) result.history.unshift(`\n${SC_SIGNPOST}\n`)
        sceneBreak = true
      }

      // Scene break has occurred, throw everything into history
      else if (sceneBreak) {
        if (sentence.includes(sceneBreakText)) result.history.unshift(sentence.replace(sceneBreakRegex, ""))
        else result.history.unshift(sentence)
      }

      // Add to sentences list and map idx to character count
      else result.sentences.unshift(sentence)
      return result
    }, this.state.context)

    // Build out index to sentence range mapping
    let charCount = 0
    split.ranges = split.sentences.reduce((result, sentence, idx) => {
      result.unshift({ idx, min: charCount, max: charCount + sentence.length })
      charCount += sentence.length
      return result
    }, [])

    // Build pov entry
    const povEntry = this.getFormattedEntry(sections.pov, false, true, false)
    if (this.isValidEntrySize(povEntry)) {
      split.header.push(povEntry)
      this.modifiedSize += povEntry.length
    }

    // Split and sort notes entries into header and sentences
    let notes = Object.values(this.state.notes)
    notes.sort((a, b) => b.pos - a.pos)
    notes = notes.reduce((result, note) => {
      if (note.pos < 0) result.header.push(note)
      else result.sentences.push(note)
      return result
    }, { header: [], sentences: [] })

    // Build notes entries
    for (const note of notes.header) {
      const noteEntry = this.getFormattedEntry(note.text, false, true, false)
      if (this.isValidEntrySize(noteEntry)) {
        split.header.push(noteEntry)
        this.modifiedSize += noteEntry.length
      }
    }

    // Do notes injections
    charCount = 0
    let note = notes.sentences.pop()
    split.sentences = split.sentences.reduceRight((result, sentence, idx) => {
      charCount += sentence.length
      result.unshift(sentence)
      if (!note) return result

      // Determine whether to put newlines before or after injection
      const newlineBefore = idx !== 0 ? !split.sentences[idx - 1].endsWith("\n") : false
      const newlineAfter = !sentence.startsWith("\n")

      // Build note entry
      const nextSentenceSize = charCount + (idx !== 0 ? split.sentences[idx - 1].length : 0)
      while (note && nextSentenceSize >= note.pos) {
        const noteEntry = this.getFormattedEntry(note.text, newlineBefore, newlineAfter)
        if (this.isValidEntrySize(noteEntry)) {
          result.unshift(noteEntry)
          this.modifiedSize += noteEntry.length
        }
        note = notes.sentences.pop()
      }

      return result
    }, [])

    this.state.context = split
    this.benchmark("splitContext")
  }

  gatherMetrics() {
    // WARNING: Only use this sparingly!
    // Currently used to parse all the context for world info matches
    const { context, banned } = this.state
    const cache = { pronouns: {}, relationships: {}, parsed: {}, entries: [], history: [] }

    // Cache only world entries that are applicable
    const text = [...context.header, ...context.sentences].join("")
    for (let i = 0, l = this.entriesList.length; i < l; i++) {
      const entry = this.entriesList[i]
      if (!entry.regex || banned.includes(entry.data.label)) continue
      const regex = this.getRegex(`\\b${entry.pattern}${this.regex.data.PLURAL}\\b`, entry.regex.flags)
      if (text.match(regex)) cache.entries.push([entry, regex])
    }

    context.metrics = context.sentences.reduce((result, sentence, idx) => {
      return this.reduceMetrics(result, sentence, idx, context.sentences.length, "sentences", cache)
    }, context.header.reduceRight((result, sentence, idx) => {
      return this.reduceMetrics(result, sentence, idx, context.header.length, "header", cache)
    }, []))

    // Quick helper function
    const getMetricId = (metric, alignRel=false) => `${(alignRel && metric.type === SC_DATA.ASPECTS) ? SC_DATA.MAIN : metric.type}:${metric.entryLabel}`

    // Grab counts of similar types
    const counts = context.metrics.reduce((result, metric) => {
      const id = getMetricId(metric)
      result[id] = result[id] ? result[id] + 1 : 1
      return result
    }, {})
    const goal = Object.values(counts).reduce((a, c) => c > a ? c : a, 0)

    // Score weights and multiply by occurrences
    for (const metric of context.metrics) {
      const weights = Object.values(metric.weights)
      const entry = this.entries[metric.entryLabel]

      if (entry && entry.data.status === SC_STATUS.DEAD) metric.occurrences = SC_OCCURRENCE_DEAD
      else metric.occurrences = this.getWeight(counts[getMetricId(metric, true)], goal < SC_OCCURRENCE_MAX ? goal : SC_OCCURRENCE_MAX)
      metric.score = (weights.reduce((a, i) => a + i) / weights.length) * metric.occurrences
    }

    // Store pronouns for debug
    context.pronouns = cache.pronouns

    // Sort by score desc, sentenceIdx desc,
    context.metrics.sort((a, b) => b.score - a.score || b.sentenceIdx - a.sentenceIdx)
    this.benchmark("gatherMetrics")
  }

  reduceMetrics(metrics, sentence, idx, total, section, cache) {
    const distance = this.getWeight(idx + 1, total)

    // Iterate through cached entries for main keys matching
    for (const [entry, regex] of cache.entries) {
      // Match against world info keys
      const match = sentence.match(regex)
      if (!match) continue

      // Create new metric object that will act as template for all derived metrics
      const { label, category } = entry.data

      // Create main, aspects, notes and side-loaded metrics
      const metric = {
        type: SC_DATA.MAIN, entryLabel: label, section, sentence, sentenceIdx: idx, matchText: match[0], pattern: this.getRegexPattern(regex),
        weights: { distance, quality: SC_WEIGHTS.QUALITY.DIRECT, strength: SC_WEIGHTS.STRENGTH.MAIN, category: SC_WEIGHTS.CATEGORY[category.toUpperCase()] }
      }
      const aspectsMetric = Object.assign({}, metric, {
        type: SC_DATA.ASPECTS, weights: Object.assign({}, metric.weights, { strength: SC_WEIGHTS.STRENGTH.ASPECTS })
      })
      const noteMetrics = this.buildNotesMetrics(entry, Object.assign({}, metric))
      const sideLoadedMetrics = this.buildSideLoadedMetrics(entry, Object.assign({}, metric))

      // Push metrics into queue
      metrics.push(metric, aspectsMetric, ...noteMetrics, ...sideLoadedMetrics)

      // Match extended metrics and do pronoun caching
      if (this.state.you !== label) cache.history.unshift(entry)
      this.matchMetrics(metrics, metric, entry, entry.regex)
      this.cachePronouns(metric, entry, cache)
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
        weights: Object.assign({}, metric.weights, { distance: this.getWeight(idx + 1, total), quality: SC_WEIGHTS.QUALITY.PRONOUN })
      })
      if (this.entries[target]) this.matchMetrics(metrics, expMetric, this.entries[target], regex, true)
    }

    // Match new pronouns
    // Skip YOU, HIS and HER top level pronouns
    const expMetrics = []
    for (const pronoun of Object.keys(cache.pronouns).filter(p => p.includes(" "))) {
      const { regex, metric } = cache.pronouns[pronoun]

      // Determine which entry to use
      const targets = metric.entryLabel.split("|")
      const existing = cache.history.find(e => targets.includes(e.data.label))
      const target = existing ? existing.data.label : targets[0]

      // Skip if already parsed
      const parsedKey = `${pronoun}:${section}:${idx}:${target}`
      if (cache.parsed[parsedKey]) continue
      else cache.parsed[parsedKey] = true

      // If pronoun lookup, only detect outside of speech
      const modifiedText = ["your", "her", "his"].includes(pronoun.split(" ")[0]) ? sentence.replace(SC_RE.ENCLOSURE, "") : sentence
      const expMatches = modifiedText.match(regex)
      if (!expMatches) continue

      // Create new metric based on match
      const expMetric = Object.assign({}, metric, {
        section, sentence, sentenceIdx: idx, entryLabel: target, matchText: expMatches[0],
        weights: Object.assign({}, metric.weights, { distance: this.getWeight(idx + 1, total), quality: SC_WEIGHTS.QUALITY.EXPANDED_PRONOUN })
      })
      const noteMetrics = this.entries[target] ? this.buildNotesMetrics(this.entries[target], Object.assign({}, expMetric)) : []
      metrics.push(expMetric, ...noteMetrics)
      expMetrics.push(expMetric)
    }

    // Get new pronouns before continuing
    for (const expMetric of expMetrics) {
      if (this.entries[expMetric.entryLabel]) this.cachePronouns(expMetric, this.entries[expMetric.entryLabel], cache)
    }

    return metrics
  }

  matchMetrics(metrics, metric, entry, regex, pronounLookup=false) {
    // Get structured entry object, only perform matching if entry key's found
    const { data: RE } = this.regex
    const { status } = entry.data
    const pattern = this.getRegexPattern(regex)
    const injPattern = pronounLookup ? pattern : `\\b(${pattern})${this.regex.data.PLURAL}\\b`

    // We don't do seen matching on dead entries
    // combination of match and specific lookup regex, ie (glance|look|observe).*(pattern)
    if (status !== SC_STATUS.DEAD) {
      const seenRegex = this.getRegex([
        `\\b(${RE.SEEN_AHEAD})${RE.INFLECTED}${RE.PLURAL}\\b.*${injPattern}`,
        `\\b(${RE.SEEN_AHEAD_ACTION})${RE.INFLECTED}${RE.PLURAL}\\b.*\\bat\\b.*${injPattern}`,
        `${injPattern}.*\\b(${RE.SEEN_BEHIND})\\b`,
        `${injPattern}.*\\bis\\b.*\\b(${RE.SEEN_BEHIND_ACTION})\\b`
      ], regex.flags)
      const seenMatch = metric.sentence.match(seenRegex)
      if (seenMatch) {
        const expMetric = Object.assign({}, metric, {
          type: SC_DATA.SEEN, matchText: seenMatch[0], pattern: this.getRegexPattern(seenRegex),
          weights: Object.assign({}, metric.weights, { strength: SC_WEIGHTS.STRENGTH.SEEN })
        })
        const notesMetrics = this.buildNotesMetrics(entry, expMetric)
        const sideLoadedMetrics = this.buildSideLoadedMetrics(entry, Object.assign({}, expMetric))
        metrics.push(expMetric, ...notesMetrics, ...sideLoadedMetrics)
      }
    }

    // We don't do heard matching on dead entries
    // determine if match is owner of quotations, ie ".*".*(pattern)  or  (pattern).*".*"
    if (status !== SC_STATUS.DEAD) {
      const searchPatterns = [`\\b(${RE.HEARD_AHEAD})${RE.INFLECTED}${RE.PLURAL}\\b \\bof\\b.*${injPattern}`]
      if (![SC_CATEGORY.LOCATION, SC_CATEGORY.THING].includes(entry.category)) {
        searchPatterns.push(`(\".*\"|'.*')(?=[^\\w]).*${injPattern}`)
        searchPatterns.push(`${injPattern}.*(?=[^\\w])(\".*\"|'.*')`)
        searchPatterns.push(`${injPattern}.*\\b(${RE.HEARD_BEHIND})${RE.INFLECTED}${RE.PLURAL}\\b`)
      }
      const headRegex = this.getRegex(searchPatterns, regex.flags)
      const heardMatch = metric.sentence.match(headRegex)
      if (heardMatch) {
        const expMetric = Object.assign({}, metric, {
          type: SC_DATA.HEARD, matchText: heardMatch[0], pattern: this.getRegexPattern(headRegex),
          weights: Object.assign({}, metric.weights, { strength: SC_WEIGHTS.STRENGTH.HEARD })
        })
        const notesMetrics = this.buildNotesMetrics(entry, expMetric)
        const sideLoadedMetrics = this.buildSideLoadedMetrics(entry, Object.assign({}, expMetric))
        metrics.push(expMetric, ...notesMetrics, ...sideLoadedMetrics)
      }
    }

    // We don't do topic matching on pronoun lookups.
    // match within quotations, ".*(pattern).*"
    // do NOT do pronoun lookups on this
    if (!pronounLookup) {
      const topicRegex = this.getRegex([
        `(?<=[^\\w])".*${injPattern}.*"(?=[^\\w])`,
        `(?<=[^\\w])'.*${injPattern}.*'(?=[^\\w])`
      ], regex.flags)
      const topicMatch = metric.sentence.match(topicRegex)
      if (topicMatch) {
        const expMetric = Object.assign({}, metric, {
          type: SC_DATA.TOPIC, matchText: topicMatch[0], pattern: this.getRegexPattern(topicRegex),
          weights: Object.assign({}, metric.weights, { strength: SC_WEIGHTS.STRENGTH.TOPIC })
        })
        const notesMetrics = this.buildNotesMetrics(entry, expMetric)
        const sideLoadedMetrics = this.buildSideLoadedMetrics(entry, Object.assign({}, expMetric))
        metrics.push(expMetric, ...notesMetrics, ...sideLoadedMetrics)
      }
    }
  }

  buildSideLoadedMetrics(entry, metric) {
    return this.getAspects(entry).reduce((result, aspect) => {
      if (!aspect.inject || result.find(m => m.entryLabel === aspect.target)) return result
      const expMetric = Object.assign({}, metric, { entryLabel: aspect.target })
      result.push(expMetric)
      if (metric.type === SC_DATA.MAIN) result.push(Object.assign({}, expMetric, {
        type: SC_DATA.ASPECTS, weights: Object.assign({}, metric.weights, { strength: SC_WEIGHTS.STRENGTH.ASPECTS })
      }))
      return result
    }, [])
  }

  buildNotesMetrics(entry, metric) {
    const { context } = this.state

    return this.getNotesBySection(entry, metric.type).reduce((result, note) => {
      // Get projected injection idx
      const sentenceIdx = this.determineIdx(metric.sentenceIdx, note.pos)
      const posText = note.pos !== 0 ? `#${note.pos}` : ""
      const type = `${note.section}+${note.label}${posText}`

      // Determine strength weight
      let strength = SC_WEIGHTS.STRENGTH.MAIN_NOTE
      if (type === SC_DATA.SEEN) strength = SC_WEIGHTS.STRENGTH.SEEN_NOTE
      else if (type === SC_DATA.HEARD) strength = SC_WEIGHTS.STRENGTH.HEARD_NOTE
      else if (type === SC_DATA.TOPIC) strength = SC_WEIGHTS.STRENGTH.TOPIC_NOTE

      // If sentence in range then add note
      if (sentenceIdx !== -1) {
        const expMetric = Object.assign({}, metric, {
          type, sentence: context[metric.section][sentenceIdx], sentenceIdx: sentenceIdx,
          weights: Object.assign({}, metric.weights, { distance: this.getWeight(sentenceIdx + 1, context[metric.section].length), strength })
        })
        result.push(expMetric)
      }

      return result
    }, [])
  }

  determineIdx(sentenceIdx, notePos) {
    const { context } = this.state

    // Find sentence range matching idx to determine starting point
    const range = context.ranges.find(r => r.idx === sentenceIdx)
    if (!range) return -1
    const charCount = range.min + notePos

    // Get idx match for calculated range
    const match = context.ranges.find(r => charCount >= r.min && charCount < r.max)
    return match ? match.idx : -1
  }

  cachePronouns(metric, entry, cache) {
    const { you, banned } = this.state
    const { pronoun, label } = entry.data
    const isYou = you === label

    // Determine pronoun type
    const lookupPattern = isYou ? "your" : (pronoun === SC_PRONOUN.UNKNOWN ? "their" : (pronoun === SC_PRONOUN.HER ? "her" : "his"))

    // Add PRONOUN regex
    if (pronoun !== SC_PRONOUN.UNKNOWN) {
      const lookupPronoun = isYou ? SC_PRONOUN.YOU : pronoun
      const pattern = `\\b(${this.regex.data[lookupPronoun.toUpperCase()]})\\b`
      const regex = this.getRegex(pattern, "gi")
      cache.pronouns[lookupPronoun] = {regex, metric: Object.assign({}, metric, {pattern})}
    }

    // Get cached relationship data with other characters
    if (!cache.relationships[label]) {
      cache.relationships[label] = this.getAspects(entry).filter(a => a.exists && this.entries[a.target].data.category === SC_CATEGORY.CHARACTER)
    }
    const relationships = cache.relationships[label]

    // Loop through relationships and try to build expanded pronoun list
    for (let rel of relationships) {
      // Grab all potential targets, excluding banned entries
      if (banned.includes(rel.target)) continue

      // Create PRONOUN TITLE regex
      const pronounPattern = `\\b${lookupPattern}\\b \\b(${rel.pattern})${this.regex.data.PLURAL}\\b`
      const pronounRegex = this.getRegex(pronounPattern, "gi")
      cache.pronouns[`${lookupPattern} ${rel.title}`] = {
        regex: pronounRegex, metric: Object.assign({}, metric, { pattern: pronounPattern, entryLabel: rel.target })
      }

      // No noun looks for 'you'
      if (isYou) continue

      // Create NOUN TITLE regex
      const namePattern = `\\b(${entry.pattern})${this.regex.data.PLURAL}\\b \\b(${rel.pattern})${this.regex.data.PLURAL}\\b`
      const nameRegex = this.getRegex(pronounPattern, "gi")
      cache.pronouns[`${rel.source} ${rel.title}`] = {
        regex: nameRegex, metric: Object.assign({}, metric, { pattern: namePattern, entryLabel: rel.target })
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
        result.push(item)
      }
      return result
    }, [])

    // Prepare branch nodes and weighting
    const secondPass = firstPass.reduce((result, branch) => {
      // Get total score for weighting
      const metricsWeight = branch.scores.reduce((a, c) => a + c, 0) / branch.scores.length
      const nodes = this.getAspects(this.entries[branch.label]).reduce((result, aspect) => {
        if (aspect.restricted) return result
        const reciprocal = firstPass.find(i => i.label === aspect.target)
        const metrics = reciprocal ? (reciprocal.scores.reduce((a, c) => a + c, 0) / reciprocal.scores.length) : (metricsWeight / (topLabels.includes(aspect.target) ? 2 : 3))
        return result.concat([Object.assign({ label: aspect.source, weights: { metrics } }, aspect)])
      }, [])

      // Ignore entries that don't have relationships
      if (!nodes.length) return result

      // Otherwise add it to the list for consideration
      result.push({ label: branch.label, weights: { metrics: metricsWeight }, nodes })
      return result
    }, [])

    // Cross match top level keys to figure out degrees of separation (how many people know the same people)
    const degrees = secondPass.reduce((result, branch) => {
      if (!result[branch.label]) result[branch.label] = 0
      result[branch.label] += 1
      for (let node of branch.nodes) {
        if (!result[node.target]) result[node.target] = 0
        result[node.target] += 1
      }
      return result
    }, {})

    // Update total weights to account for degrees of separation, calculate total score
    const thirdPass = secondPass.map(branch => {
      branch.weights.degrees = this.getWeight(degrees[branch.label], degreesGoal)
      let weight = Object.values(branch.weights)
      branch.score = weight.reduce((a, i) => a + i) / weight.length
      for (const node of branch.nodes) {
        node.weights.degrees = this.getWeight(degrees[node.target], degreesGoal)
        weight = Object.values(node.weights)
        node.score = weight.reduce((a, i) => a + i) / weight.length
      }
      return branch
    }, [])

    // Create master list
    context.relations = thirdPass.reduce((result, branch) => {
      return result.concat(branch.nodes.reduce((result, node) => {
        const existing = result.find(n => n.target === node.target)
        const item = existing || Object.assign({ titles: [] }, node)
        item.titles.push(node.title)
        if (!existing) result.push(item)
        return result
      }, []))
    }, [])

    // Sort all relations by score desc
    context.relations.sort((a, b) => b.score - a.score)
    this.benchmark("mapRelations")
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

      for (const title of rel.titles) {
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
    this.benchmark("mapRelationsTree")
  }

  mapRelationsFacet(tree, source, join, value) {
    const tmpTree = Object.assign({}, tree)
    const tmpSource = ` ${source}`
    const tmpJoin = ` ${join}`
    const tmpValue = ` ${value}`
    if (!tmpTree[tmpSource]) tmpTree[tmpSource] = {}
    if (!tmpTree[tmpSource][tmpJoin]) tmpTree[tmpSource][tmpJoin] = []
    if (value) tmpTree[tmpSource][tmpJoin].push(tmpValue)
    return tmpTree
  }

  determineCandidates() {
    const { context } = this.state

    // Split entries
    const split = context.metrics.reduce((result, metric) => {
      result[metric.section].push(metric)
      return result
    }, { header: [], sentences: [] })

    // Determine candidates for entry injection
    const injectedIndexes = {}
    context.candidates = split.sentences.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), [])
    context.candidates = split.header.reduce((a, c, i) => this.reduceCandidates(a, c, i, injectedIndexes), context.candidates)

    this.benchmark("determineCandidates")
  }

  reduceCandidates(result, metric, idx, injectedIndexes) {
    const { context } = this.state

    // Setup entry and retrieve existing candidate list
    const entry = this.entries[metric.entryLabel]
    if (!injectedIndexes[metric.sentenceIdx]) injectedIndexes[metric.sentenceIdx] = []
    const candidateList = injectedIndexes[metric.sentenceIdx]
    const lastEntryText = candidateList.length ? candidateList[candidateList.length - 1] : (metric.sentenceIdx ? context[metric.section][metric.sentenceIdx - 1] : "")

    // Setup relations data if needed
    const relLabel = ` ${metric.entryLabel}`
    const relTree = context.tree[relLabel] || context.tree[[relLabel, this.getConfig(SC_DATA.CONFIG_DEAD_TEXT)].join(" ")]

    // Track injected items and skip if already done
    const existing = context.injected.find(i => i.label === metric.entryLabel)
    const item = existing || { label: metric.entryLabel, types: [], injected: [] }
    const [ baseType, baseLabel ] = metric.type.split("#")[0].split("+")
    if (item.injected.includes(metric.type) || (baseType !== SC_DATA.ASPECTS && !baseLabel && !entry.data[metric.type]) || (metric.type === SC_DATA.ASPECTS && !relTree)) return result
    if (!item.types.includes(baseType)) item.types.push(baseType)
    item.injected.push(metric.type)

    // Determine whether to put newlines before or after injection
    const insertNewlineBefore = !lastEntryText.endsWith("\n")
    const insertNewlineAfter = !metric.sentence.startsWith("\n")

    // Build entry
    const note = baseLabel && entry.data.notes.find(n => n.label === baseLabel)
    const entryText = metric.type === SC_DATA.ASPECTS ? JSON.stringify([{[relLabel]: relTree}]) : (note ? note.text : entry.data[metric.type])
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
    this.benchmark("injectCandidates")
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
    this.benchmark("injectSignposts")
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
    this.benchmark("truncateContext")
  }

  buildFinalContext() {
    const { context, info } = this.state
    const { history, header, sentences, text } = context

    // Restore memory, clean context
    const contextMemory = (text && info.memoryLength) ? text.slice(0, info.memoryLength) : ""
    const rebuiltContext = [...history, ...header, ...sentences].join("")

    // Reassemble and clean final context string
    context.final = ((contextMemory && this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) ? `${contextMemory}${SC_SIGNPOST}\n${rebuiltContext}` : contextMemory + rebuiltContext)
      .replace(/([\n]{2,})/g, "\n")
      .split("\n").filter(l => !!l).join("\n")

    // Signpost cleanup
    if (this.getConfig(SC_DATA.CONFIG_SIGNPOSTS)) {
      context.final = context.final.replace(this.getRegex(`${SC_SIGNPOST}\n${SC_SIGNPOST}`, "g"), SC_SIGNPOST)
    }
    this.benchmark("buildFinalContext")
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
    let modifiedText = text.replace(/(^\s+(> You (say ")?)?)|([".]?\s+$)/g, "")

    if (this.state.isDisabled && !modifiedText.startsWith("/enable")) return text
    this.initialize()

    // Check if no input (ie, prompt AI)
    if (!modifiedText) return this.finalize(modifiedText)

    // Handle entry and relationship menus
    if (!this.menuHandler(modifiedText)) return this.finalize("")

    // Handle quick create character
    if (!this.quickCommand(modifiedText)) return this.finalize("")

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
    else if (this.povCommands.includes(cmd)) this.loadPov(params)
    else if (this.loadCommands.includes(cmd)) return this.loadScene(params, !cmd.endsWith("!"))
    else if (this.banCommands.includes(cmd)) this.banEntry(params)
    else if (this.killCommands.includes(cmd)) this.setEntryStatus(params, SC_STATUS.DEAD)
    else if (this.reviveCommands.includes(cmd)) this.setEntryStatus(params, SC_STATUS.ALIVE)
    else if (this.updateCommands.includes(cmd)) this.updatePlugin(!cmd.endsWith("!"))
    else if (this.flushCommands.includes(cmd)) {
      state.displayStats = []
      if (cmd.endsWith("!")) this.reloadPlugin()
      this.parseContext()
    }
    return ""
  }

  /*
   * Input Modifier: Entry and Relationship Command Handler
   * - Used for updating and creating new entries/relationships
   */
  menuHandler(modifiedText) {
    const { creator, you } = this.state

    // Already processing input
    if (creator.step) {
      if (modifiedText.startsWith("/") && ![SC_DATA.TRIGGER, "match"].includes(creator.step.toLowerCase())) {
        this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! You are currently in a menu, please exit the menu with '!' before typing new commands.`)
      }
      else this.menuNavHandler(modifiedText)
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
      this.displayHUD()
      this.state.creator = {}
      return ""
    }

    // Do global notes display
    if (this.notesCommands.includes(cmd)) {
      creator.cmd = cmd
      this.state.exitCreator = true
      this.displayHUD()
      this.state.creator = {}
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
      creator.totalPages = 2

      // Direct to correct menu
      this.menuScenePromptStep()
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
          this.messageOnce(`${SC_UI_ICON.ERROR} ERROR! Entry with that label does not exist, try creating it with '/entry ${label}${icon ? `:${icon}` : ""}' before continuing.`)
          return this.menuExit()
        }
      }

      // Preload entry if found, otherwise setup default values
      this.setEntrySource(existing || label)

      // Add/update icon
      this.menuHandleIcon(icon)

      // Setup page
      creator.page = isEntry ? SC_UI_PAGE.ENTRY : SC_UI_PAGE.ENTRY_ASPECTS
      creator.currentPage = isEntry ? 1 : 2
      creator.totalPages = (isEntry && !creator.source) ? 1 : 3

      // Direct to correct menu
      this.menuEntryFirstStep()
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
    else if (creator.page === SC_UI_PAGE.ENTRY_NOTES) this.menuEntryNotesStep()
    else if (creator.page === SC_UI_PAGE.ENTRY_ASPECTS) this.menuEntryAspectsStep()
    else this.menuMainStep()
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

    // Save and exit handling
    if (text === SC_UI_SHORTCUT.SAVE_EXIT) {
      if (creator.hasChanged) return this.menuConfirmHandler("y")
      else return this.menuExit()
    }

    // Exit without saving handling
    if (text === SC_UI_SHORTCUT.EXIT_NO_SAVE) return this.menuExit()

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
        creator.currentPage = isNextPage ? 2 : 3
        creator.page = isNextPage ? SC_UI_PAGE.ENTRY_ASPECTS : SC_UI_PAGE.ENTRY_NOTES
        this.menuEntryFirstStep()
      }

      else if (creator.page === SC_UI_PAGE.ENTRY_ASPECTS) {
        creator.currentPage = isNextPage ? 3 : 1
        creator.page = isNextPage ? SC_UI_PAGE.ENTRY_NOTES : SC_UI_PAGE.ENTRY
        this.menuEntryFirstStep()
      }

      else if (creator.page === SC_UI_PAGE.ENTRY_NOTES) {
        creator.currentPage = isNextPage ? 1 : 2
        creator.page = isNextPage ? SC_UI_PAGE.ENTRY : SC_UI_PAGE.ENTRY_ASPECTS
        this.menuEntryFirstStep()
      }

      else if (creator.page === SC_UI_PAGE.SCENE) {
        creator.currentPage = 2
        creator.page = SC_UI_PAGE.SCENE_NOTES
        this.menuSceneNotesStep()
      }

      else if (creator.page === SC_UI_PAGE.SCENE_NOTES) {
        creator.currentPage = 1
        creator.page = SC_UI_PAGE.SCENE
        this.menuScenePromptStep()
      }
    }

    // Goto field
    else if (text.startsWith(SC_UI_SHORTCUT.GOTO)) {
      const index = Number(text.slice(1))
      if (index === 0 && [SC_UI_PAGE.ENTRY, SC_UI_PAGE.SCENE].includes(creator.page)) return this.menuLabelStep()
      if (!(index > 0)) return this.menuCurrentStep()

      if (creator.page === SC_UI_PAGE.CONFIG) {
        const keys = SC_CONFIG_KEYS
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = keys[index - 1]
        return this.menuCurrentStep()
      }
      else if (creator.page === SC_UI_PAGE.ENTRY) {
        if (!creator.data) return this.menuCategoryStep()
        if (index > SC_ENTRY_ALL_KEYS.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(SC_ENTRY_ALL_KEYS[index - 1])
        return this.menuCurrentStep()
      }
      else if ([SC_UI_PAGE.SCENE].includes(creator.page)) {
        const keys = SC_SCENE_PROMPT_KEYS
        if (index > keys.length) return this.menuCurrentStep()
        creator.step = this.toTitleCase(keys[index - 1])
        return this.menuCurrentStep()
      }
      else this.menuCurrentStep()
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
    if (text === SC_UI_SHORTCUT.NEXT || this.setEntryJson(SC_DATA.CONFIG_HUD_MAXIMIZED, text, false)) return this.menuConfigHudMinimizedStep()
  }

  menuConfigHudMaximizedStep() {
    const { creator } = this.state
    creator.step = "config_hud_maximized"
    this.displayMenuHUD(`${SC_UI_ICON.TEXT} Enter the HUD arrangement: `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigHudMinimizedHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigHudMaximizedStep()
    if (text === SC_UI_SHORTCUT.NEXT || this.setEntryJson(SC_DATA.CONFIG_HUD_MINIMIZED, text, false)) return this.menuConfigRelSizeLimitStep()
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
    this.menuConfigSignpostsDistanceStep()
  }

  menuConfigRelSizeLimitStep() {
    const { creator } = this.state
    creator.step = "config_rel_size_limit"
    this.displayMenuHUD(`${SC_UI_ICON.MEASURE} Determines the maximum amount of relationship context to inject (measured in characters): `)
  }

  // noinspection JSUnusedGlobalSymbols
  menuConfigSignpostsDistanceHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuConfigRelSizeLimitStep()
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
   * ENTRY MENU
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

    const isEntry = this.entryCommands.includes(creator.cmd)
    creator.keys = `${isEntry ? SC_WI_ENTRY : SC_WI_SCENE}${label}`
    creator.data.label = label
    creator.hasChanged = true

    // Add/update icon
    if (creator.data.icon) this.removeStat(creator.data.icon)
    if (!icon) delete creator.data.icon
    else creator.data.icon = icon

    if (isEntry) this.menuLabelStep()
    else this.menuScenePromptStep()
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
    const trigger = this.getEntryRegex(text, false, !text.match(/[A-Z]/))
    if (!trigger) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! Invalid regex detected in keys, try again!`)
    if (creator.data[SC_DATA.TRIGGER] && text === SC_UI_SHORTCUT.DELETE) delete creator.data[SC_DATA.TRIGGER]
    else {
      this.setEntryJson(SC_DATA.TRIGGER, trigger.toString())
    }
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
      if (SC_RELATABLE.includes(category)) creator.data.status = this.getStatus(creator.data[SC_DATA.MAIN])
    }

    return this.menuSeenStep()
  }

  menuMainStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.MAIN)
    this.displayMenuHUD(`${SC_UI_ICON.MAIN} Enter MAIN content to inject when this entries keys are found:`)
  }

  // noinspection JSUnusedGlobalSymbols
  menuSeenHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuMainStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.SEEN, text)
    this.menuHeardStep()
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
    if (text === SC_UI_SHORTCUT.PREV) return this.menuHeardStep()
    else if (text !== SC_UI_SHORTCUT.NEXT) this.setEntryJson(SC_DATA.TOPIC, text)
    this.menuTopicStep()
  }

  menuTopicStep() {
    const { creator } = this.state
    creator.step = this.toTitleCase(SC_DATA.TOPIC)
    this.displayMenuHUD(`${SC_UI_ICON.TOPIC} Enter content to inject when this entry is the TOPIC of conversation:`)
  }


  /*
   * ENTRY RELATIONS MENU
   */

  // noinspection JSUnusedGlobalSymbols
  menuEntryAspectsHandler(text) {
    const { creator } = this.state

    let match = text.match(SC_RE.QUICK_NOTE_CMD)
    if (match && match.length === 7) {
      if (!creator.data[SC_DATA.ASPECTS]) creator.data[SC_DATA.ASPECTS] = []
      const label = (match[1] || "").toString().trim()
      const pos = Number(match[3])
      const toggle = (match[4] || "") === "!"
      const text = (match[6] || "").toString()
      const status = this.addNote(creator, label, pos, text, SC_NOTE_TYPES.ASPECT, toggle, match[0].startsWith("++"))
      if (status === "error") return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! A note with that label does not exist, try creating it with '+${match[1]}:Your note.' first!`, false)
      creator.hasChanged = true
    }

    this.menuEntryAspectsStep()
  }

  menuEntryAspectsStep() {
    const { creator } = this.state
    creator.step = "EntryAspects"

    this.displayMenuHUD(`${SC_UI_ICON.ASPECT}  Enter an ASPECT NOTE: `, false)
  }


  /*
   * ENTRY NOTES MENU
   */

  // noinspection JSUnusedGlobalSymbols
  menuEntryNotesHandler(text) {
    const { creator } = this.state

    let match = text.match(SC_RE.QUICK_ENTRY_NOTE_CMD)
    if (match && match.length === 9) {
      if (!creator.data[SC_DATA.NOTES]) creator.data[SC_DATA.NOTES] = []
      const label = (match[3] || "").toString().trim()
      const pos = Number(match[5])
      if (!isNaN(pos) && pos < 0) return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! You can't set negative position values on entry notes.`, false)
      const toggle = (match[6] || "") === "!"
      const text = (match[8] || "").toString()
      const status = this.addNote(creator, label, pos, text, SC_NOTE_TYPES.ENTRY, toggle, match[2].startsWith("++"), match[1])
      if (status === "error") return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! A note with that label does not exist, try creating it with '+${match[1]}:Your note.' first!`, false)
      creator.hasChanged = true
    }

    this.menuEntryNotesStep()
  }

  menuEntryNotesStep() {
    const { creator } = this.state
    creator.step = "EntryNotes"
    this.displayMenuHUD(`${SC_UI_ICON.NOTES}  Enter an ENTRY NOTE: `, false)
  }


  /*
   * SCENE MENUS
   */

  // noinspection JSUnusedGlobalSymbols
  menuScenePromptHandler(text) {
    if (text === SC_UI_SHORTCUT.PREV) return this.menuLabelStep()
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
  menuSceneNotesHandler(text) {
    const { creator } = this.state

    let match = text.match(SC_RE.QUICK_NOTE_CMD)
    if (match && match.length === 7) {
      if (!creator.data[SC_DATA.NOTES]) creator.data[SC_DATA.NOTES] = []
      const label = (match[1] || "").toString().trim()
      const pos = Number(match[3])
      const toggle = (match[4] || "") === "!"
      const text = (match[6] || "").toString()
      const status = this.addNote(creator, label, pos, text, SC_NOTE_TYPES.SCENE, toggle, match[0].startsWith("++"))
      if (status === "error") return this.displayMenuHUD(`${SC_UI_ICON.ERROR} ERROR! A note with that label does not exist, try creating it with '+${match[1]}:Your note.' first!`, false)
      creator.hasChanged = true
    }

    this.menuSceneNotesStep()
  }

  menuSceneNotesStep() {
    const { creator } = this.state
    creator.step = "SceneNotes"
    this.displayMenuHUD(`${SC_UI_ICON.NOTES}  Enter a SCENE NOTE: `, false)
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
    else if (this.sceneCommands.includes(creator.cmd)) this.menuConfirmSceneHandler()
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

  menuConfirmSceneHandler() {
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
    const successMessage = `${SC_UI_ICON.SUCCESS} Scene '${creator.data.label}' was ${creator.remove ? "deleted" : (creator.source ? "updated" : "created")} successfully!`

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
      if (!creator.remove) this.syncAspects(creator)
      else this.syncAspects(creator.source)
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

  setSceneSource(source) {
    const { creator } = this.state

    if (typeof source === "object") {
      creator.source = source
      creator.keys = source.keys
      creator.data = Object.assign({ notes: [] }, creator.source.data)
    }
    else {
      creator.keys = `${SC_WI_SCENE}${source}`
      creator.data = { label: source, category: "scene", notes: [] }
    }
  }

  setEntrySource(source) {
    const { creator } = this.state

    if (typeof source === "object") {
      creator.source = source
      creator.keys = creator.conversion ? `${SC_WI_ENTRY}${source.keys.split(",")[0].trim()}` : source.keys
      if (creator.data) creator.data = Object.assign({ label: creator.data.label, notes: [], relations: [] }, source.data, { category: source.data.category || creator.data.category })
      else creator.data = Object.assign({ notes: [], relations: [] }, source.data, creator.conversion ? { label: source.keys.split(",")[0].trim(), pronoun: this.getPronoun(source.entry), status: this.getStatus(source.entry) } : source.data)
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
      creator.data = { label: source, trigger: this.getEntryRegex(source, false, !source.match(/[A-Z]/)).toString(), category: "", pronoun: SC_PRONOUN.UNKNOWN, notes: [], relations: [] }
      const keys = `${SC_WI_ENTRY}${source}`
      if (!this.worldInfo[keys]) creator.keys = keys
    }
  }

  setEntryJson(key, text, ignoreSize=false, validItems=[]) {
    const { creator } = this.state

    if (validItems.length) {
      let values = text.toLowerCase().split(",").map(i => i.trim()).reduce((a, c) => a.concat(validItems.includes(c) ? [c] : []), [])
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
    else if (creator.page === SC_UI_PAGE.SCENE) hudStats = this.getSceneStats()
    else if ([SC_UI_PAGE.SCENE_NOTES, SC_UI_PAGE.ENTRY_NOTES, SC_UI_PAGE.ENTRY_ASPECTS].includes(creator.page) || this.notesCommands.includes(creator.cmd)) hudStats = this.getNotesStats()
    else if (this.configCommands.includes(creator.cmd)) hudStats = this.getConfigStats()
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
      keys = keys.toUpperCase().split("/").filter(k => ["TRACK", "NOTES"].includes(k.toUpperCase()) || sections[k.toLowerCase()])

      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i].toUpperCase()
        const newline = i === (l - 1) ? "\n" : " "

        if (key === "TRACK") {
          // Setup tracking information
          const track = injected.map(inj => {
            const entry = this.entries[inj.label]
            const injectedEmojis = inj.types.filter(t => ![SC_DATA.MAIN, SC_DATA.ASPECTS].includes(t)).map(t => SC_UI_ICON[`INJECTED_${t.toUpperCase()}`]).join("")
            return `${this.getEmoji(entry)} ${entry.data.label}${injectedEmojis ? ` [${injectedEmojis}]` : ""}`
          })

          // Display World Info injected into context
          if (track.length) displayStats.push({
            key: SC_UI_ICON.TRACK, color: SC_UI_COLOR.TRACK,
            value: `${track.join(SC_UI_ICON.SEPARATOR)}${!SC_UI_ICON.TRACK.trim() ? " :" : ""}${newline}`
          })
        }

        else if (key === "NOTES") {
          const notes = Object.values(this.state.notes).reduce((result, note) => {
            if (note.visible === false) return result
            if (note.pos < 0) result.header.push(note)
            else result.sentences.push(note)
            return result
          }, { header: [], sentences: [] })

          notes.header.sort((a, b) => a.pos - b.pos)
          notes.sentences.sort((a, b) => b.pos - a.pos)

          for (const note of notes.header) displayStats.push({
            key: this.getNoteDisplayLabel(note), color: this.getNoteDisplayColor(note),
            value: `${note.text}\n`
          })

          for (const note of notes.sentences) displayStats.push({
            key: this.getNoteDisplayLabel(note), color: this.getNoteDisplayColor(note),
            value: `${note.text}\n`
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
    for (let key of SC_ENTRY_ALL_KEYS) displayStats.push({
      key: this.getSelectedLabel(SC_UI_ICON[key.toUpperCase()]), color: SC_UI_COLOR[key.toUpperCase()],
      value: `${creator.data[key] || SC_UI_ICON.EMPTY}\n`
    })

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

  getNotesStats() {
    const { creator } = this.state
    let displayStats = []

    // Use global notes if applicable
    const notes = this.notesCommands.includes(creator.cmd) ? Object.values(this.state.notes) : creator.data[creator.page === SC_UI_PAGE.ENTRY_ASPECTS ? SC_DATA.ASPECTS : SC_DATA.NOTES]
    console.log(creator)

    // Get combined text to search for references
    const text = notes.reduce((a, c) => a.concat(` ${c.text}`), "")

    // Find references
    const track = this.getReferences(text)

    // Display label and tracked world info
    displayStats = displayStats.concat(this.getLabelTrackStats(track))

    // Display all ASPECTS
    if (creator.page === SC_UI_PAGE.ENTRY_ASPECTS) {
      notes.sort((a, b) => a.label > b.label ? 1 : (a.label === b.label ? 0 : -1))

      const orderedNotes = notes.reduce((result, note) => {
        if (note.follow) result.follow.push(note)
        else result.restricted.push(note)
        return result
      }, { follow: [], restricted: [] })

      for (const note of orderedNotes.follow) displayStats.push({
        key: this.getNoteDisplayLabel(note), color: this.getNoteDisplayColor(note),
        value: `${note.text}\n`
      })

      for (const note of orderedNotes.restricted) displayStats.push({
        key: this.getNoteDisplayLabel(note), color: this.getNoteDisplayColor(note),
        value: `${note.text}\n`
      })
    }

    // Display all ENTRY NOTES
    else if (creator.page === SC_UI_PAGE.ENTRY_NOTES) {
      notes.sort((a, b) => a.pos - b.pos)

      for (const note of notes) displayStats.push({
        key: this.getNoteDisplayLabel(note), color: this.getNoteDisplayColor(note),
        value: `${note.text}\n`
      })
    }

    // Display all OTHER NOTES
    else {
      const orderedNotes = notes.reduce((result, note) => {
        if (note.pos < 0) result.hoisted.push(note)
        else result.injections.push(note)
        return result
      }, { hoisted: [], injections: [] })

      orderedNotes.hoisted.sort((a, b) => a.pos - b.pos)
      orderedNotes.injections.sort((a, b) => b.pos - a.pos)

      for (const note of orderedNotes.hoisted) displayStats.push({
        key: this.getNoteDisplayLabel(note), color: this.getNoteDisplayColor(note),
        value: `${note.text}\n`
      })

      for (const note of orderedNotes.injections) displayStats.push({
        key: this.getNoteDisplayLabel(note), color: this.getNoteDisplayColor(note),
        value: `${note.text}\n`
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
      try { searchRegex = this.getRegex(creator.searchPattern, "i") }
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

  getLabelTrackStats(track=[], extended=[], other=[]) {
    const { creator } = this.state
    const displayStats = []
    const isSingleton = this.configCommands.includes(creator.cmd)
    const breakCommands = [
      ...this.configCommands,
      ...this.sceneCommands
    ]
    const breakPages = [SC_UI_PAGE.ENTRY_ASPECTS, SC_UI_PAGE.ENTRY_NOTES]

    if (creator.data) {
      const status = !isSingleton && !creator.source ? "New " : ""
      const pagination = creator.totalPages > 1 ? ` (${creator.currentPage}/${creator.totalPages})` : ""
      const label = creator.page === SC_UI_PAGE.ENTRY && creator.data.category ? this.toTitleCase(creator.data.category.toLowerCase()) : (creator.source ? creator.page.replace("Title ∙∙ ", "") : creator.page)
      const pageText = creator.page ? `${isSingleton ? "" : SC_UI_ICON.SEPARATOR}${status}${label}${pagination}` : ""
      const newline = (breakCommands.includes(creator.cmd) || breakPages.includes(creator.page)) ? `\n${SC_UI_ICON.BREAK}\n` : "\n"

      if (creator.data.label) displayStats.push({
        key: this.getSelectedLabel(SC_UI_ICON.LABEL), color: SC_UI_COLOR.LABEL,
        value: `${creator.data.label}${pageText}${newline}`
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

    else if (this.notesCommands.includes(creator.cmd)) {
      displayStats.push({
        key: SC_UI_ICON.NOTES, color: SC_UI_COLOR.NOTES,
        value: `${SC_UI_PAGE.NOTES}\n${SC_UI_ICON.BREAK}\n`
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

  getEmoji(entry, fallback=SC_UI_ICON.EMPTY) {
    if (!entry) return fallback

    const { you } = this.state
    const { category, icon, pronoun, status } = entry.data

    if (you === entry.data.label) return SC_UI_ICON[SC_PRONOUN.YOU.toUpperCase()]
    if (icon) return icon
    if (fallback === "") return fallback

    if (category === SC_CATEGORY.CHARACTER) {
      if (status && status !== SC_STATUS.ALIVE) return SC_UI_ICON[status.toUpperCase()]
      return SC_UI_ICON[pronoun.toUpperCase()]
    }
    return SC_UI_ICON[category && category.toUpperCase()] || fallback
  }

  getSelectedLabel(label) {
    const { creator } = this.state
    const step = SC_UI_ICON[creator.step.replace(/^(source|target|editor|author|scene)/i, "").toUpperCase()]
    const icon = label === SC_UI_ICON.LABEL ? this.getEmoji(creator, label) : label
    return step === label ? `${SC_UI_ICON.SELECTED}${icon}` : icon
  }

  getReferences(text) {
    const { creator } = this.state

    return this.entriesList.reduce((result, entry) => {
      if (creator.data && [creator.data.label, creator.originalLabel].includes(entry.data.label)) return result
      if (entry.regex && text.match(entry.regex)) result.push(`${this.getEmoji(entry)} ${entry.data.label}`)
      return result
    }, [])
  }

  getNoteDisplayLabel(note) {
    const sectionEmoji = note.section ? SC_UI_ICON[note.section.toUpperCase()] : ""
    const posText = note.pos !== 0 ? `#${note.pos}` : ""
    return `${sectionEmoji}+${note.label}${note.follow === false ? "*" : ""}${posText}${note.visible === false ? "!" : ""}`
  }

  getNoteDisplayColor(note) {
    if (note.type === SC_NOTE_TYPES.ASPECT) {
      if (!note.follow) return "dimgrey"
      return "steelblue"
    }

    if (note.type === SC_NOTE_TYPES.CUSTOM) return note.pos < 0 ? "goldenrod" : "indianred"

    if (note.type === SC_NOTE_TYPES.ENTRY) {
      if (SC_ENTRY_ALL_KEYS.includes(note.label)) return "steelblue"
      if (note.pos <= 200) return "slategrey"
      return "dimgrey"
    }

    if (note.pos < 0) return "dimgrey"
    if (note.pos < 100) return "seagreen"
    if (note.pos < 300) return "steelblue"
    if (note.pos < 600) return "slategrey"
    return "dimgrey"
  }

  removeStat(key) {
    state.displayStats = state.displayStats.filter(s => key !== (s.key || "").replace(SC_UI_ICON.SELECTED, ""))
  }

  displayDebug() {
    const { isDebug, context, creator } = this.state

    if (!isDebug) return

    // Output to AID Script Diagnostics
    console.log(context)

    // Don't hijack state.message while doing creating/updating a World Info entry
    if (creator.step) return

    // Output context to state.message with numbered lines
    let debugLines = context.final.split("\n")
    debugLines.reverse()
    debugLines = debugLines.map((l, i) => "(" + (i < 9 ? "0" : "") + `${i + 1}) ${l}`)
    debugLines.reverse()
    state.message = debugLines.join("\n")
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
