/*
 * Simple Context (v2.0.0-alpha)
 */

// Preset data that can be loaded at the start of an adventure
const SC_DEFAULT_DATA = {
  /*
   * Uncomment out the following lines to initialize the script with preset data
   */

  // note: "A story about a hobbit.",
  // style: "detailed, playful",
  // genre: "fantasy",
  // rating: "T",
  // you: "John Smith",
  // scene: "You are an average joe.",
  // think: "You wonder if you can eat the clouds."
}

// HUD and UI labels and colors
const SC_LABEL = {
  // HUD
  TRACK: " ",
  NOTES: "✒️",
  POV: "🕹️",
  SCENE: "🎬",
  THINK: "💭",
  FOCUS: "🧠",

  // Entry UI
  LABEL: "🏷️",
  KEYS: "🔍",
  MAIN: "📑",
  SEEN: "👁️",
  HEARD: "🔉",
  TOPIC: "💬",

  // Relationship UI
  PARENTS: "🤱",
  CHILDREN: "🧸",
  KNOWN: "👋",

  // Relationship Disposition UI: 1-5
  HATE: "🖤",
  DISLIKE: "🤎",
  NEUTRAL: "💛",
  LIKE: "🧡",
  LOVE: "❤️",

  // Relationship Type UI: CAFE
  CONTACT: "👋",
  ALLY: "🤝",
  FRIEND: "🙌",
  ENEMY: "🤬",

  // Relationship Trait UI: SIX
  SPOUSE: "💍",
  INTIMATE: "✨",
  EX: "💔",

  // Pronoun UI
  YOU: "🎭",
  HER: "👩",
  HIM: "🧔",
  UNKNOWN: "🔰",

  // General UI
  CONFIRM: "✔️",
  ERROR: "💥",
  SEPARATOR: " ∙ ",
  SELECTED: "🔅 "
}
const SC_COLOR = {
  // HUD
  TRACK: "chocolate",
  NOTES: "dimgrey",
  POV: "slategrey",
  SCENE: "steelblue",
  THINK: "seagreen",
  FOCUS: "indianred",

  // Relationship UI
  PARENTS: "seagreen",
  CHILDREN: "steelblue",
  KNOWN: "slategrey",

  // Entry UI
  LABEL: "indianred",
  KEYS: "seagreen",
  MAIN: "steelblue",
  SEEN: "slategrey",
  HEARD: "slategrey",
  TOPIC: "slategrey"
}

// Determines total characters between each section, rounded by whole sentences
const SC_SECTION_SIZES = {
  FOCUS: 150,
  THINK: 500,
  SCENE: 1000
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

// Pronouns
const SC_PRONOUN = { YOU: "YOU", HIM: "HIM", HER: "HER", UNKNOWN: "UNKNOWN" }

// Context injection mapping
const SC_ENTRY = { MAIN: "main", SEEN: "seen", HEARD: "heard", TOPIC: "topic" }
const SC_ENTRY_KEYS = [SC_ENTRY.MAIN, SC_ENTRY.SEEN, SC_ENTRY.HEARD, SC_ENTRY.TOPIC]

// Relationship mapping for World Info json
const SC_ENTRY_REL = { PARENTS: "parents", CHILDREN: "children", KNOWN: "known" }
const SC_ENTRY_REL_OPPOSITE = { PARENTS: "children", CHILDREN: "parents", KNOWN: "known" }
const SC_ENTRY_REL_KEYS = [SC_ENTRY_REL.PARENTS, SC_ENTRY_REL.CHILDREN, SC_ENTRY_REL.KNOWN]

// Expanded relationship mapping that is dynamically generated based on parents/children combinations
const SC_REL_SCOPE = {
  PARENTS: "parents", CHILDREN: "children", SIBLINGS: "siblings",
  GRANDPARENTS: "grandparents", GRANDCHILDREN: "grandchildren",
  PARENTS_SIBLINGS: "parents_siblings", SIBLINGS_CHILDREN: "siblings_children",
}

// Relationship disposition flags: 1 - 5
const SC_REL_DISP = { HATE: 1, DISLIKE: 2, NEUTRAL: 3, LIKE: 4, LOVE: 5 }
const SC_REL_DISP_REV = Object.assign({}, ...Object.entries(SC_REL_DISP).map(([a,b]) => ({ [`${b}`]: a })))

// Relationship type flags: CAFE
const SC_REL_TYPE = { CONTACT: "C", ALLY: "A", FRIEND: "F", ENEMY: "E" }
const SC_REL_TYPE_REV = Object.assign({}, ...Object.entries(SC_REL_TYPE).map(([a,b]) => ({ [b]: a })))

// Relationship trait flags: SIX
const SC_REL_TRAIT = { SPOUSE: "S", INTIMATE: "I", EX: "X" }
const SC_REL_TRAIT_REV = Object.assign({}, ...Object.entries(SC_REL_TRAIT).map(([a,b]) => ({ [b]: a })))

// Mapping of relationship keys
const SC_REL_MAPPING_RULES = [
  { label: "mother", pronoun: SC_PRONOUN.HER, scope: SC_REL_SCOPE.PARENTS },
  { label: "father", pronoun: SC_PRONOUN.HIM, scope: SC_REL_SCOPE.PARENTS },

  { label: "daughter", pronoun: SC_PRONOUN.HER, scope: SC_REL_SCOPE.CHILDREN },
  { label: "son", pronoun: SC_PRONOUN.HIM, scope: SC_REL_SCOPE.CHILDREN },

  { label: "sister", pronoun: SC_PRONOUN.HER, scope: SC_REL_SCOPE.SIBLINGS },
  { label: "brother", pronoun: SC_PRONOUN.HIM, scope: SC_REL_SCOPE.SIBLINGS },

  { label: "niece", pronoun: SC_PRONOUN.HER, scope: SC_REL_SCOPE.SIBLINGS_CHILDREN },
  { label: "nephew", pronoun: SC_PRONOUN.HIM, scope: SC_REL_SCOPE.SIBLINGS_CHILDREN },

  { label: "aunt", pronoun: SC_PRONOUN.HER, scope: SC_REL_SCOPE.PARENTS_SIBLINGS },
  { label: "uncle", pronoun: SC_PRONOUN.HIM, scope: SC_REL_SCOPE.PARENTS_SIBLINGS },

  { label: "grandmother", pronoun: SC_PRONOUN.HER, scope: SC_REL_SCOPE.GRANDPARENTS },
  { label: "grandfather", pronoun: SC_PRONOUN.HIM, scope: SC_REL_SCOPE.GRANDPARENTS },

  { label: "granddaughter", pronoun: SC_PRONOUN.HER, scope: SC_REL_SCOPE.GRANDCHILDREN },
  { label: "grandson", pronoun: SC_PRONOUN.HIM, scope: SC_REL_SCOPE.GRANDCHILDREN },

  { label: "wife", pronoun: SC_PRONOUN.HER, trait: SC_REL_TRAIT.SPOUSE },
  { label: "husband", pronoun: SC_PRONOUN.HIM, trait: SC_REL_TRAIT.SPOUSE },

  { label: "girlfriend", pronoun: SC_PRONOUN.HER, trait: SC_REL_TRAIT.INTIMATE, type: SC_REL_TYPE.FRIEND },
  { label: "boyfriend", pronoun: SC_PRONOUN.HIM, trait: SC_REL_TRAIT.INTIMATE, type: SC_REL_TYPE.FRIEND },
]

// Default relationship flag value to set new relationships that don't have a status explicitly set
const SC_REL_FLAG_DEFAULT = {
  [SC_ENTRY_REL.PARENTS]: `${SC_REL_DISP.LOVE}${SC_REL_TYPE.FRIEND}`,
  [SC_ENTRY_REL.CHILDREN]: `${SC_REL_DISP.LOVE}${SC_REL_TYPE.FRIEND}`,
  [SC_ENTRY_REL.KNOWN]: `${SC_REL_DISP.NEUTRAL}${SC_REL_TYPE.CONTACT}`
}

// Index World Info key and injection trigger labels
const SC_INDEX_KEY = "#index"

// Ignore all World Info keys that start with these strings
const SC_IGNORE = "#"

// Regular expressions used for everything
const SC_RE = {
  // Matches against sentences to detect whether to inject the SEEN entry
  DESCRIBE_PERSON: /(^|[^\w])(describ|display|examin|expos|frown|gaz|glanc|glar|glimps|image|leer|look|notic|observ|ogl|peek|see|smil|spot|star(e|ing)|view|vision|watch)/gi,
  DESCRIBED_PERSON: /[^\w]appear|described|displayed|examined|exposed|glimpsed|noticed|observed|ogled|seen|spotted|viewed|watched/gi,

  // Matches against the MAIN entry for automatic pronoun detection
  FEMALE: /(^|[^\w])(♀|female|woman|lady|girl|gal|chick|mother)([^\w]|$)/gi,
  MALE: /(^|[^\w])(♂|male|man|gentleman|boy|guy|dude|father)([^\w]|$)/gi,

  // Substitutes she/he etc with the last named entry found that matches pronoun
  HER: /(^|[^\w])?(she|her(self|s)?)([^\w]|$)/gi,
  HIM: /(^|[^\w])?(he|him(self)?|his)([^\w]|$)/gi,
  YOU: /(^|[^\w])?(you)([^\w]|$)/gi,

  // Internally used regex for everything else
  INPUT_CMD: /^> You say "\/(\w+)\s?(.*)?"$|^> You \/(\w+)\s?(.*)?[.]$|^\/(\w+)\s?(.*)?$/,
  WI_REGEX_KEYS: /.?\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)|[^,]+/g,
  BROKEN_ENCLOSURE: /(")([^\w])(")|(')([^\w])(')|(\[)([^\w])(])|(\()([^\w])(\))|({)([^\w])(})|(<)([^\w])(>)/g,
  ENCLOSURE: /([^\w])("[^"]+")([^\w])|([^\w])('[^']+')([^\w])|([^\w])(\[[^]]+])([^\w])|([^\w])(\([^)]+\))([^\w])|([^\w])({[^}]+})([^\w])|([^\w])(<[^<]+>)([^\w])/g,
  SENTENCE: /([^!?.]+[!?.]+[\s]+?)|([^!?.]+[!?.]+$)|([^!?.]+$)/g,
  ESCAPE_REGEX: /[.*+?^${}()|[\]\\]/g,
  MISSING_FORMAT: /^[^\[({<].*[^\])}>]$/g,
  REL_KEYS: /([^,\[]+)(\[([1-5][CAFE][SIX]?)])|([^,]+)/gi
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
  controlList = ["enable", "disable", "show", "hide", "min", "max", "spacing", "reset", "debug"] // Plugin Controls
  commandList = [
    "note", "title", "author", "genre", "setting", "theme", "subject", "style", "rating", // Notes
    "you", "at", "with", // PoV
    "scene", // Scene
    "think", // Think
    "focus" // Focus
  ]
  entryCommandList = ["entry", "e", "rel", "r"]
  sceneBreak = "\n\n--\n\n"
  youReplacements = [
    ["you is", "you are"],
    ["you was", "you were"],
    ["you has", "you have"],
    [/(^|[^.][.!?]\s+)you /g, "$1You "]
  ]

  constructor() {
    // All state variables scoped to state.simpleContextPlugin
    // for compatibility with other plugins
    if (!state.simpleContextPlugin) state.simpleContextPlugin = {
      data: Object.assign({}, SC_DEFAULT_DATA || {}),
      you: undefined,
      context: {},
      injected: [],
      entry: {},
      isDebug: false,
      isHidden: false,
      isDisabled: false,
      isMinimized: false,
      isSpaced: true,
      isVerbose: true
    }
    this.state = state.simpleContextPlugin

    // Create master list of commands
    this.commandList = this.controlList.concat(this.commandList)

    // Setup external plugins
    this.paragraphFormatterPlugin = new ParagraphFormatterPlugin()

    // Initialize displayStats if not already done
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

  getPronoun(entryJson) {
    const text = entryJson[SC_ENTRY.MAIN]
    return text.match(SC_RE.FEMALE) ? "HER" : (text.match(SC_RE.MALE) && "HIM")
  }

  escapeRegExp(text) {
    return text.replace(SC_RE.ESCAPE_REGEX, '\\$&'); // $& means the whole matched string
  }

  getRegExpPattern(regex) {
    return regex.toString().split("/").slice(1, -1).join("/")
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
    let sentences = modifiedText.match(SC_RE.SENTENCE) || []
    return sentences.map(s => this.insertEnclosures(s, enclosures))
  }

  getKeysRegExp(text) {
    let flags = "g"
    let brokenRegex = false
    let pattern = [...text.matchAll(SC_RE.WI_REGEX_KEYS)].map(match => {
      if (!match[1] && match[0].startsWith("/")) brokenRegex = true
      if (match[2]) flags = match[2].includes("g") ? match[2] : `g${match[2]}`
      return match[1] ? (match[1].includes("|") ? `(${match[1]})` : match[1]) : this.escapeRegExp(match[0].trim())
    })
    if (brokenRegex) return false
    return new RegExp(pattern.join("|"), flags)
  }

  getVanillaKeys(text) {
    return [...text.matchAll(SC_RE.WI_REGEX_KEYS)].map(m => !m[1] && m[0]).filter(k => !!k)
  }

  getRelationKeys(scope, text) {
    return [...text.matchAll(SC_RE.REL_KEYS)].map(m => m.filter(k => !!k))
      .map(m => {
        const label = m[1].split("[")[0].trim()
        const flag = m.length >= 3 ? m[3].toUpperCase() : SC_REL_FLAG_DEFAULT[scope]
        return { scope, label, flag }
      })
  }

  getRelationKeysText(relations) {
    return relations.map(rel => `${rel.label} [${rel.flag}]`).join(", ")
  }

  getRelationFlagBits(flag) {
    return { disp: Number(flag[0]), type: flag[1], trait: flag.length >= 3 ? flag[2] : "" }
  }

  getWeight(score, goal) {
    return score !== 0 ? ((score <= goal ? score : goal) / goal) : 0
  }

  getRelationFlagWeights(rel) {
    const { disp, type, trait } = this.getRelationFlagBits(rel.flag)
    const flagGoal = 4
    const dispScore = [SC_REL_DISP.LOVE, SC_REL_DISP.HATE].includes(disp) ? flagGoal : ([SC_REL_DISP.LIKE, SC_REL_DISP.DISLIKE].includes(disp) ?  2 : 0)
    const typeScore = [SC_REL_TYPE.ENEMY, SC_REL_TYPE.FRIEND].includes(type) ? flagGoal : (type === SC_REL_TYPE.ALLY ? 2 : 1)
    const traitScore = trait ? 1 : 0
    return { disp: this.getWeight(dispScore, flagGoal), type: this.getWeight(typeScore, flagGoal), trait: traitScore }
  }

  getRelationTitles(scope, pronoun, flag) {
    const flagBits = this.getRelationFlagBits(flag)
    return SC_REL_MAPPING_RULES.map(rule => {
      const ruleScope = rule.scope && (Array.isArray(rule.scope) ? rule.scope : [rule.scope])
      const rulePronoun = rule.pronoun && (Array.isArray(rule.pronoun) ? rule.pronoun : [rule.pronoun])
      const ruleDisp = rule.disp && (Array.isArray(rule.disp) ? rule.disp : [rule.disp])
      const ruleType = rule.type && (Array.isArray(rule.type) ? rule.type : [rule.type])
      const ruleTrait = rule.trait && (Array.isArray(rule.trait) ? rule.trait : [rule.trait])
      if ((!ruleScope || ruleScope.includes(scope)) && (!rulePronoun || rulePronoun.includes(pronoun)) &&
        (!ruleDisp || ruleDisp.includes(flagBits.disp)) && (!ruleType || ruleType.includes(flagBits.type)) &&
        (!ruleTrait || ruleTrait.includes(flagBits.trait))) return rule.label
    }).filter(l => !!l)
  }

  getRelationships(entryJson) {
    const relations = []
    for (let scope of SC_ENTRY_REL_KEYS.filter(s => !!entryJson[s])) {
      for (let rel of this.getRelationKeys(scope, entryJson[scope])) {
        if (relations.find(r => r.label === rel.label)) continue
        const idx = this.getEntryIndexByIndexLabel(rel.label)
        if (idx === -1) continue
        relations.push(Object.assign({ idx }, rel))
      }
    }
    return relations
  }

  getExpandedRelationships(entryJson) {
    const relations = []
    for (let scope of SC_ENTRY_REL_KEYS.filter(s => !!entryJson[s])) {
      for (let rel of this.getRelationKeys(scope, entryJson[scope])) {
        if (relations.find(r => r.label === rel.label)) continue
        const idx = this.getEntryIndexByIndexLabel(rel.label)
        if (idx === -1) continue
        relations.push(Object.assign({ idx }, rel))

        if (scope === SC_REL_SCOPE.PARENTS) {
          // search for grandparents
          // search for parents_siblings
        }

        // const relations = this.getRelationships()
      }
    }
    return relations
  }

  getRelationshipTree() {
    // Iterate over all injected entries
    const matchGoal = 10
    const firstPass = this.state.injected.reduce((result, injected) => {
      // Check to see if it is an autoInjected key, skip if so
      const idx = this.getEntryIndexByIndexLabel(injected.label)
      if (idx === -1) return

      // Setup pronoun and ensure we don't do relationship lookups for unknown entities
      const entryJson = this.getEntry(worldInfo[idx].entry)
      const pronoun = this.getPronoun(this.getEntry(worldInfo[idx].entry))

      // Get total matches for this injected entry (factors into weight)
      const matchTotal = SC_ENTRY_KEYS.reduce((a, i) => a + (injected.metrics[i] ? injected.metrics[i].length : 0), 0)
      const matchWeight = matchTotal !== 0 ? ((matchTotal <= matchGoal ? matchTotal : matchGoal) / matchGoal) : 0

      // Otherwise add it to the list for consideration
      return result.concat({
        idx, label: injected.label, pronoun, weight: { match: matchWeight },
        nodes: this.getExpandedRelationships(entryJson).map(r => {
          const entryJson = this.getEntry(worldInfo[r.idx].entry)
          const pronoun = this.getPronoun(entryJson)
          return {
            idx: r.idx, label: r.label, pronoun, scope: r.scope, flag: r.flag,
            weight: Object.assign({ match: matchWeight }, this.getRelationFlagWeights(r))
          }
        })
      })
    }, [])
    if (!firstPass) return []

    // Cross match top level keys to figure out degrees of separation (how many people know the same people)
    let degrees = firstPass.reduce((result, branch) => {
      if (!result[branch.label]) result[branch.label] = 0
      result[branch.label] += 1
      for (let node of branch.nodes) {
        if (!result[node.label]) result[node.label] = 0
        result[node.label] += 1
      }
      return result
    }, {})

    // Update total weights to account for degrees of separation, calculate weight total
    const degreesGoal = 4
    const secondPass = firstPass.map(branch => {
      branch.weight.degrees = this.getWeight(degrees[branch.label], degreesGoal)
      let weight = Object.values(branch.weight)
      branch.weight.score = weight.reduce((a, i) => a + i) / weight.length
      for (let node of branch.nodes) {
        node.weight.degrees = this.getWeight(degrees[node.label], degreesGoal)
        weight = Object.values(node.weight)
        node.weight.score = weight.reduce((a, i) => a + i) / weight.length
      }
      return branch
    })
    if (!secondPass) return []

    // Create master list
    const thirdPass = secondPass && secondPass.reduce((result, branch) => {
      return result.concat(branch.nodes.map(node => {
        const relations = this.getRelationTitles(node.scope, node.pronoun, node.flag)
        if (!relations.length) return
        return { score: node.weight.score, source: branch.label, target: node.label, relations }
      }).filter(n => !!n))
    }, [])
    if (!thirdPass) return []

    // Sort all branches by total weight score
    thirdPass.sort((a, b) => b.score - a.score)
    return thirdPass
  }

  injectRelationships(sentences, modifiedSize, originalSize) {
    const items = []

    for (let rel of this.state.relations) {
      const existing = items.find(i => i.name === rel.source)
      const item = existing || { name: rel.source, relations: {} }
      for (let title of rel.relations) {
        if (!item.relations[rel.target]) item.relations[rel.target] = []
        if (!item.relations[rel.target].includes(title)) item.relations[rel.target].push(title)
      }
      if (!existing) items.push(item)
    }

    const validItems = []
    for (let item of items) {
      const text = JSON.stringify([item])
      const size = (text.length + 2)
      if (!this.validEntrySize(modifiedSize, originalSize, size)) continue
      validItems.push(text)
      modifiedSize += size
    }

    sentences.push(`\n${validItems.join("\n")}`)
    return { sentences, modifiedSize }
  }

  syncRelationships(id) {
    let { indexJson } = this.getIndex()
    indexJson = [indexJson.find(i => i.id === id), ...indexJson.filter(i => i.id !== id)]

    // Iterate over all known entries
    for (let index of indexJson) {
      const entryInfo = worldInfo.find(i => i.id === index.id)
      if (!entryInfo) continue
      const entryJson = this.getEntry(entryInfo.entry)

      // Iterate over all relationships
      const targetRelations = this.getRelationships(entryJson)
      for (let target of targetRelations) {
        const revScope = SC_ENTRY_REL_OPPOSITE[target.scope.toUpperCase()]
        const targetInfo = worldInfo[target.idx]
        const targetEntry = this.getEntry(targetInfo.entry)
        if (!targetEntry[revScope]) targetEntry[revScope] = ""
        const targetKeys = this.getRelationKeys(revScope, targetEntry[revScope])
        const foundSelf = targetKeys.find(r => r.label === index.label)

        // Sync relationships
        if (foundSelf && foundSelf.flag.slice(1) === target.flag.slice(1)) continue
        if (!foundSelf) targetKeys.push({ scope: revScope, label: index.label, flag: target.flag })
        else foundSelf.flag = foundSelf.flag[0] + target.flag.slice(1)
        targetEntry[revScope] = this.getRelationKeysText(targetKeys)
        updateWorldEntry(target.idx, targetInfo.keys, JSON.stringify(targetEntry))
      }
    }
  }

  getEntryRefs() {
    const text = SC_ENTRY_KEYS.map(s => this.state.entry.json[s]).filter(e => !!e).join(" ")
    return worldInfo.filter(i => !i.keys.includes(SC_IGNORE)).map(info => {
      const keys = this.getKeysRegExp(info.keys)
      if (keys && text.match(keys)) return info
    }).filter(i => !!i)
  }

  getEntry(text) {
    let json = this.getJson(text)
    if (typeof json !== 'object' || Array.isArray(json) || !json[SC_ENTRY.MAIN]) {
      json = {}
      json[SC_ENTRY.MAIN] = text
    }
    return json
  }

  getValidEntry(text, modifiedSize, originalSize, replaceYou=true) {
    if (!text) return

    // You replacement
    if (replaceYou) text = this.replaceYou(text)

    // Encapsulation of entry in brackets
    const match = text.match(SC_RE.MISSING_FORMAT)
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

  replaceYou(text) {
    if (!this.state.you) return text

    // Match contents of /you and if found replace with the text "you"
    const youMatch = new RegExp(`(^|[^\w])${this.state.data.you}('s|s'|s)?([^\w]|$)`, "gi")
    if (text.match(youMatch)) {
      text = text.replace(youMatch, "$1you$3")
      for (let [find, replace] of this.youReplacements) text = text.replace(find, replace)
    }

    return text
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
        injectedEntries.push({ id: info.id, label: key, matches: [SC_ENTRY.MAIN] })
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
        injectedEntry = { id: metrics.id, label, metrics, matches: [] }
        injectedEntries.push(injectedEntry)
      }

      // Run through each entry type (ie, main, seen, heard, topic)
      for (let trigger of triggers) {
        // Skip if already injected
        if (injectedEntry.matches.includes(trigger)) continue

        // Determine placement of injection
        const count = metrics[trigger].length
        const idx = count > 0 ? (trigger === SC_ENTRY.MAIN ? metrics[trigger][0] : metrics[trigger][count - 1]) : -1

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

  matchMetrics(metrics, text, idx, entities) {
    let matches, regex

    // Determine if key matched at all
    if (entities) {
      matches = [...text.matchAll(metrics.key)]
      if (!matches.length) return false
      if (!metrics.matchText) metrics.matchText = matches[0][0]
      metrics[SC_ENTRY.MAIN].push(idx)
      if (metrics.pronoun) entities[metrics.pronoun] = metrics
      regex = metrics.key
    }

    // If not any pronoun set on entity return early
    else if (!metrics.pronoun) return false

    // If no entities passed we are doing a pronoun lookup (ignore undefined genders)
    else regex = SC_RE[metrics.pronoun]

    // Get structured entry object, only perform matching if entry key's found
    const pattern = this.getRegExpPattern(regex)

    // combination of match and specific lookup regex, ie (glance|look|observe).*(pattern)
    if (metrics.entry[SC_ENTRY.SEEN]) {
      const describe = this.getRegExpPattern(SC_RE.DESCRIBE_PERSON)
      const described = this.getRegExpPattern(SC_RE.DESCRIBED_PERSON)
      const lookup = new RegExp(`(${describe}[^,]+${pattern})|(${pattern}[^,]+${described})`, regex.flags)
      if (text.match(lookup)) metrics[SC_ENTRY.SEEN].push(idx)
    }

    // determine if match is owner of quotations, ie ".*".*(pattern)  or  (pattern).*".*"
    if (metrics.entry[SC_ENTRY.HEARD]) {
      const lookup = new RegExp(`(((^|[^\w])".*"[^\w]|(^|[^\w])'.*'[^\w]).*${pattern})|(${pattern}.*([^\w]".*"([^\w]|$)|[^\w]'.*'([^\w]|$)))`, regex.flags)
      if (text.match(lookup)) metrics[SC_ENTRY.HEARD].push(idx)
    }

    // match within quotations, ".*(pattern).*"
    // do NOT do pronoun lookups on this
    if (entities && metrics.entry[SC_ENTRY.TOPIC]) {
      const lookup = new RegExp(`((^|[^\w])".*${pattern}.*"([^\w]|$))|((^|[^\w])'.*${pattern}.*'([^\w]|$))`, regex.flags)
      if (text.match(lookup)) metrics[SC_ENTRY.TOPIC].push(idx)
    }

    return true
  }

  getMetricTemplate(id, key, entry) {
    const pronoun = this.state.you && this.state.you.id === id ? "YOU" : this.getPronoun(entry)
    return { id, key, entry, pronoun, matchText: "", [SC_ENTRY.MAIN]: [], [SC_ENTRY.SEEN]: [], [SC_ENTRY.HEARD]: [], [SC_ENTRY.TOPIC]: [] }
  }

  injectWorldInfo(sentences, injectedEntries, modifiedSize, originalSize, injectFront=false) {
    const infoMetrics = []
    const entities = {}

    // Pre-populate "you" pronoun
    if (this.state.you) {
      const key = this.getKeysRegExp(this.state.you.keys)
      if (key) {
        entities.YOU = this.getMetricTemplate(this.state.you.id, key, this.getEntry(this.state.you.entry))
        infoMetrics.push(entities.YOU)
      }
    }

    // Collect metric data on keys that match, including indexes of sentences where found
    for (let idx = sentences.length - 1; idx >= 0; idx--) {
      for (const info of worldInfo) {
        const existing = infoMetrics.find(m => m.id === info.id)
        const key = this.getKeysRegExp(info.keys)
        if (!key) continue
        const metrics = existing || this.getMetricTemplate(info.id, key, this.getEntry(info.entry))
        if (!this.matchMetrics(metrics, sentences[idx], idx, entities)) continue
        if (!existing) infoMetrics.push(metrics)
      }

      // Do pronoun matching
      for (let metrics of Object.values(entities)) this.matchMetrics(metrics, sentences[idx], idx)
    }

    // Main positions itself towards the end of the context (last position in history found)
    // Mention, Heard and Seen position themselves towards the front of the context
    const indexedMetrics = {}
    modifiedSize = this.processEntries(modifiedSize, originalSize, infoMetrics, indexedMetrics, injectedEntries, [
      SC_ENTRY.MAIN, SC_ENTRY.SEEN, SC_ENTRY.HEARD, SC_ENTRY.TOPIC
    ])

    // Reverse all entries
    Object.values(indexedMetrics).map(i => i.reverse())

    // Insert into context
    const orderedIndexes = Object.keys(indexedMetrics).map(k => Number(k))
    orderedIndexes.sort((a, b) => b - a)
    for (let idx of orderedIndexes) {
      let adjustedIdx = injectFront ? idx : idx + 1
      sentences.splice(adjustedIdx, 0, ...indexedMetrics[idx])
    }

    return { sentences, modifiedSize }
  }

  getEntryStatsLabel(trigger, pronoun) {
    let step = this.state.entry.step.toUpperCase()
    let key = (trigger === "LABEL" && pronoun) ? pronoun : trigger
    return step === trigger ? `${SC_LABEL.SELECTED}${SC_LABEL[key]}` : SC_LABEL[key]
  }

  addEntryLabelStat(displayStats, newline=true) {
    const keysMatchYou = this.state.data.you && this.state.entry.keys && this.state.data.you.match(this.getKeysRegExp(this.state.entry.keys))
    displayStats.push({
      key: this.getEntryStatsLabel("LABEL", keysMatchYou ? "YOU" : (this.state.entry.pronoun || "UNKNOWN")),
      color: SC_COLOR.LABEL, value: `${this.state.entry.label}${newline ? `\n` : ""}`
    })
  }

  getPronounEmoji(info) {
    const label = info && this.getIndexLabel(info.id)
    if (!label) return SC_LABEL["UNKNOWN"]
    const isYou = this.state.you && this.getIndexLabel(this.state.you.id) === label
    const pronoun = isYou ? "YOU" : this.getPronoun(this.getEntry(info.entry))
    return pronoun ? SC_LABEL[pronoun] : SC_LABEL["UNKNOWN"]
  }

  getRelStats() {
    const displayStats = []

    // Scan each rel entry for matching labels in index
    const track = this.getRelationships(this.state.entry.json)
      .map(rel => {
        const pronounEmoji = this.getPronounEmoji(worldInfo[rel.idx])
        const dispEmoji = SC_LABEL[SC_REL_DISP_REV[rel.flag[0]]]
        const typeEmoji = SC_LABEL[SC_REL_TYPE_REV[rel.flag[1]]]
        const traitEmoji = rel.flag.length >= 3 ? SC_LABEL[SC_REL_TRAIT_REV[rel.flag[2]]] : ""
        return `${pronounEmoji}${rel.label}${dispEmoji}${typeEmoji}${traitEmoji}`
      })

    // Display custom LABEL
    this.addEntryLabelStat(displayStats, !track.length)

    // Display tracked RELATIONSHIPS
    if (track.length) displayStats.push({
      key: SC_LABEL.TRACK, color: SC_COLOR.TRACK,
      value: `${track.join(SC_LABEL.SEPARATOR)}${!SC_LABEL.TRACK.trim() ? " :" : ""}\n`
    })

    // Display all ENTRIES
    for (let key of SC_ENTRY_REL_KEYS) {
      if (this.state.entry.json[key]) displayStats.push({
        key: this.getEntryStatsLabel(key.toUpperCase()), color: SC_COLOR[key.toUpperCase()],
        value: `${this.state.entry.json[key]}\n`
      })
    }

    return displayStats
  }

  getEntryStats() {
    const displayStats = []

    // Scan each rel entry for matching labels in index
    const track = this.getEntryRefs().map(info => {
      const label = this.getIndexLabel(info.id)
      if (!label || label === this.state.entry.label) return
      const pronounEmoji = this.getPronounEmoji(info)
      return `${pronounEmoji}${label}`
    }).filter(i => !!i)

    // Display custom LABEL
    this.addEntryLabelStat(displayStats, !track.length)
    if (track.length) displayStats.push({
      key: SC_LABEL.TRACK, color: SC_COLOR.TRACK,
      value: `${track.join(SC_LABEL.SEPARATOR)}${!SC_LABEL.TRACK.trim() ? " :" : ""}\n`
    })

    // Display KEYS
    if (this.state.entry.keys) displayStats.push({
      key: this.getEntryStatsLabel("KEYS"), color: SC_COLOR.KEYS,
      value: `${this.state.entry.keys}\n`
    })

    // Display all ENTRIES
    for (let trigger of SC_ENTRY_KEYS) {
      if (this.state.entry.json[trigger]) displayStats.push({
        key: this.getEntryStatsLabel(trigger.toUpperCase()), color: SC_COLOR[trigger.toUpperCase()],
        value: `${this.state.entry.json[trigger]}\n`
      })
    }

    return displayStats
  }

  getInfoStats() {
    const displayStats = []
    if (!this.isVisible()) return displayStats

    // Setup tracking information
    const track = this.state.injected.map(inj => {
      const idx = this.getEntryIndexByIndexLabel(inj.label)
      const pronoun = (this.state.you && inj.id === this.state.you.id) ? "YOU" : (idx !== -1 && this.getPronoun(this.getEntry(worldInfo[idx].entry)))
      const pronounEmoji = pronoun ? SC_LABEL[pronoun] : SC_LABEL["UNKNOWN"]
      const injectedEmojis = this.state.isMinimized ? "" : inj.matches.filter(p => p !== SC_ENTRY.MAIN).map(p => SC_LABEL[p.toUpperCase()]).join("")
      return `${pronounEmoji}${inj.label}${injectedEmojis}`
    })

    // Display World Info injected into context
    if (track.length) displayStats.push({
      key: SC_LABEL.TRACK, color: SC_COLOR.TRACK,
      value: `${track.join(SC_LABEL.SEPARATOR)}${!SC_LABEL.TRACK.trim() ? " :" : ""}\n`
    })

    // Display relevant HUD elements
    const contextKeys = this.state.isMinimized ? ["THINK", "FOCUS"] : ["NOTES", "POV", "SCENE", "THINK", "FOCUS"]
    for (let key of contextKeys) {
      if (this.state.context[key.toLowerCase()]) displayStats.push({
        key: SC_LABEL[key], color: SC_COLOR[key],
        value: `${this.state.context[key.toLowerCase()]}\n`
      })
    }

    return displayStats
  }

  updateHUD() {
    // Clear out Simple Context stats, keep stats from other mods
    const labels = Object.values(SC_LABEL)
    state.displayStats = state.displayStats.filter(s => !labels.includes(s.key.replace(SC_LABEL.SELECTED, "")))

    // Get correct stats to display
    const hudStats = this.state.entry.cmd === "entry" ? this.getEntryStats() : (this.state.entry.cmd === "rel" ? this.getRelStats() : this.getInfoStats())

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
    const { indexIdx, indexJson } = this.getIndex()

    // Add index if not found
    if (!indexJson.find(e => e.id === id)) indexJson.push({ id, label })

    // Attempt to delete old label if found
    if (oldLabel) {
      const oldIdx = indexJson.findIndex(i => i.label === oldLabel)
      if (oldIdx !== -1) delete indexJson[oldIdx]
    }

    // Add or update world info index
    if (indexIdx === -1) addWorldEntry(SC_INDEX_KEY, JSON.stringify(indexJson))
    else updateWorldEntry(indexIdx, SC_INDEX_KEY, JSON.stringify(indexJson))
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
      this.state.entry.pronoun = this.getPronoun(this.state.entry.json)
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
    this.updateEntryPrompt(`${SC_LABEL.CONFIRM} Are you happy with these changes? (y/n)`, false)
  }

  entryKnownStep() {
    this.state.entry.step = this.toTitleCase(SC_ENTRY_REL.KNOWN)
    this.updateEntryPrompt(`${SC_LABEL[SC_ENTRY_REL.KNOWN.toUpperCase()]} Enter comma separated list of entry KNOWN (optional):`)
  }

  entryChildrenStep() {
    this.state.entry.step = this.toTitleCase(SC_ENTRY_REL.CHILDREN)
    this.updateEntryPrompt(`${SC_LABEL[SC_ENTRY_REL.CHILDREN.toUpperCase()]} Enter comma separated list of entry CHILDREN (optional):`)
  }

  entryParentsStep() {
    this.state.entry.step = this.toTitleCase(SC_ENTRY_REL.PARENTS)
    this.updateEntryPrompt(`${SC_LABEL[SC_ENTRY_REL.PARENTS.toUpperCase()]} Enter comma separated list of entry PARENTS (optional):`)
  }

  entryTopicStep() {
    this.state.entry.step = this.toTitleCase(SC_ENTRY.TOPIC)
    this.updateEntryPrompt(`${SC_LABEL[SC_ENTRY.TOPIC.toUpperCase()]} Enter entry to inject when TOPIC of conversation (optional):`)
  }

  entryHeardStep() {
    this.state.entry.step = this.toTitleCase(SC_ENTRY.HEARD)
    this.updateEntryPrompt(`${SC_LABEL[SC_ENTRY.HEARD.toUpperCase()]} Enter entry to inject when HEARD (optional):`)
  }

  entrySeenStep() {
    this.state.entry.step = this.toTitleCase(SC_ENTRY.SEEN)
    this.updateEntryPrompt(`${SC_LABEL[SC_ENTRY.SEEN.toUpperCase()]} Enter entry to inject when SEEN (optional):`)
  }

  entryMainStep() {
    this.state.entry.step = this.toTitleCase(SC_ENTRY.MAIN)
    this.updateEntryPrompt(`${SC_LABEL[SC_ENTRY.MAIN.toUpperCase()]} Enter the MAIN entry to inject when keys found:`)
  }

  entryKeysStep() {
    this.state.entry.step = "Keys"
    this.updateEntryPrompt(`${SC_LABEL.KEYS} Enter the KEYS used to trigger entry injection:`)
  }

  entryLabelStep() {
    this.state.entry.step = "Label"
    this.updateEntryPrompt(`${SC_LABEL.LABEL} Enter the LABEL used to refer to this entry: `)
  }

  entryIsValid() {
    return this.state.entry.json[SC_ENTRY.MAIN] && this.state.entry.keys
  }

  entryRelExclude(rel, entryJson, scope) {
    if (!entryJson[scope]) return rel
    const targetRelLabels = this.getRelationKeys(scope, entryJson[scope]).map(r => r.label)
    return rel.filter(r => !targetRelLabels.includes(r.label))
  }

  entryRelExclusive(rel, entryJson, scope) {
    if (!entryJson[scope]) return
    const relLabels = rel.map(r => r.label)
    const targetRel = this.getRelationKeys(scope, entryJson[scope]).filter(r => !relLabels.includes(r.label))
    entryJson[scope] = this.getRelationKeysText(targetRel)
  }

  entryExitHandler() {
    state.message = this.state.entry.previousMessage
    this.state.entry = {}
    this.updateHUD()
  }

  entryConfirmHandler(text) {
    if (text === SC_CMD.BACK_ALL) {
      if (this.state.entry.cmd === "entry") return this.entryLabelStep()
      else return this.entryParentsStep()
    }
    if ([SC_CMD.SKIP, SC_CMD.SKIP_ALL, SC_CMD.DELETE].includes(text)) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) {
      if (this.state.entry.cmd === "entry") return this.entryTopicStep()
      else return this.entryKnownStep()
    }

    // Exit without saving if anything other than "y" passed
    if (!text.toLowerCase().startsWith("y")) return this.entryExitHandler()

    // Add new World Info
    const entry = JSON.stringify(this.state.entry.json)
    if (!this.state.entry.source) {
      addWorldEntry(this.state.entry.keys, entry)
      this.state.entry.source = worldInfo.find(i => i.keys === this.state.entry.keys)
      this.setIndex(this.state.entry.source.id, this.state.entry.label)
    }

    // Update existing World Info
    else {
      updateWorldEntry(this.state.entry.sourceIndex, this.state.entry.keys, entry)
      this.setIndex(this.state.entry.source.id, this.state.entry.label, this.state.entry.oldLabel)
    }

    // Update preloaded info
    if (this.state.data.you) this.state.you = this.matchInfo(this.state.data.you)

    // Sync relationships and status
    this.syncRelationships(this.state.entry.source.id)

    // Reset everything back
    this.entryExitHandler()
  }

  entryKnownHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryParentsStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryChildrenStep()
    if (text === SC_CMD.DELETE && this.state.entry.json[SC_ENTRY_REL.KNOWN]) delete this.state.entry.json[SC_ENTRY_REL.KNOWN]
    else if (text !== SC_CMD.SKIP) {
      let rel = this.getRelationKeys(SC_ENTRY_REL.KNOWN, text)
      rel = this.entryRelExclude(rel, this.state.entry.json, SC_ENTRY_REL.PARENTS)
      rel = this.entryRelExclude(rel, this.state.entry.json, SC_ENTRY_REL.CHILDREN)
      this.setEntryJson(this.state.entry.json, SC_ENTRY_REL.KNOWN, this.getRelationKeysText(rel))
    }
    this.entryConfirmStep()
  }

  entryChildrenHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryParentsStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryParentsStep()
    if (text === SC_CMD.DELETE && this.state.entry.json[SC_ENTRY_REL.CHILDREN]) delete this.state.entry.json[SC_ENTRY_REL.CHILDREN]
    else if (text !== SC_CMD.SKIP) {
      let rel = this.getRelationKeys(SC_ENTRY_REL.CHILDREN, text)
      rel = this.entryRelExclude(rel, this.state.entry.json, SC_ENTRY_REL.PARENTS)
      this.entryRelExclusive(rel, this.state.entry.json, SC_ENTRY_REL.KNOWN)
      this.setEntryJson(this.state.entry.json, SC_ENTRY_REL.CHILDREN, this.getRelationKeysText(rel))
    }
    this.entryKnownStep()
  }

  entryParentsHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryParentsStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryParentsStep()
    if (text === SC_CMD.DELETE && this.state.entry.json[SC_ENTRY_REL.PARENTS]) delete this.state.entry.json[SC_ENTRY_REL.PARENTS]
    else if (text !== SC_CMD.SKIP) {
      let rel = this.getRelationKeys(SC_ENTRY_REL.PARENTS, text)
      rel = this.entryRelExclude(rel, this.state.entry.json, SC_ENTRY_REL.CHILDREN)
      this.entryRelExclusive(rel, this.state.entry.json, SC_ENTRY_REL.KNOWN)
      this.setEntryJson(this.state.entry.json, SC_ENTRY_REL.PARENTS, this.getRelationKeysText(rel))
    }
    this.entryChildrenStep()
  }

  entryTopicHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryHeardStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(this.state.entry.json, SC_ENTRY.TOPIC, text)
    this.entryConfirmStep()
  }

  entryHeardHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entrySeenStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(this.state.entry.json, SC_ENTRY.HEARD, text)
    this.entryTopicStep()
  }

  entrySeenHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) return this.entryConfirmStep()
    if (text === SC_CMD.BACK) return this.entryMainStep()
    if (text !== SC_CMD.SKIP) this.setEntryJson(this.state.entry.json, SC_ENTRY.SEEN, text)
    this.entryHeardStep()
  }

  entryMainHandler(text) {
    if (text === SC_CMD.BACK_ALL) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (this.state.entry.source || this.entryIsValid()) return this.entryConfirmStep()
      else return this.entryMainStep()
    }
    if (text === SC_CMD.BACK) return this.entryKeysStep()
    if (text === SC_CMD.SKIP) {
      if (this.state.entry.source || this.state.entry.json[SC_ENTRY.MAIN]) return this.entrySeenStep()
      else return this.entryMainStep()
    }
    this.setEntryJson(this.state.entry.json, SC_ENTRY.MAIN, text)
    this.state.entry.pronoun = this.getPronoun(this.state.entry.json)
    this.entrySeenStep()
  }

  entryKeysHandler(text) {
    if (text === SC_CMD.BACK_ALL || text === SC_CMD.BACK) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (this.state.entry.source || this.entryIsValid()) return this.entryConfirmStep()
      else return this.entryKeysStep()
    }
    if (text === SC_CMD.SKIP) {
      if (this.state.entry.source || this.state.entry.keys) return this.entryMainStep()
      else return this.entryKeysStep()
    }

    // Ensure valid regex if regex key
    const key = this.getKeysRegExp(text)
    if (!key) return this.updateEntryPrompt(`${SC_LABEL.ERROR} ERROR! Invalid regex detected in keys, try again: `)

    // Detect conflicting/existing keys and display error
    const existingIdx = worldInfo.findIndex(i => i.keys === key.toString())
    if (existingIdx !== -1 && existingIdx !== this.state.entry.sourceIndex) {
      if (!this.state.entry.source && this.getEntryIndexByKeys(text) === -1) {
        this.state.entry.sourceIndex = existingIdx
        this.setEntrySource()
      }
      else return this.updateEntryPrompt(`${SC_LABEL.ERROR} ERROR! World Info with that key already exists, try again: `)
    }

    // Update keys to regex format
    this.state.entry.keys = key.toString()

    // Otherwise proceed to entry input
    this.entryMainStep()
  }

  entryLabelHandler(text) {
    if (text === SC_CMD.BACK_ALL || text === SC_CMD.BACK) return this.entryLabelStep()
    if (text === SC_CMD.SKIP_ALL) {
      if (this.state.entry.source || this.entryIsValid()) return this.entryConfirmStep()
      else return this.entryLabelStep()
    }
    if (text !== SC_CMD.SKIP) {
      if (this.state.entry.source) this.state.entry.oldLabel = this.state.entry.label
      this.state.entry.label = text
    }
    this.entryKeysStep()
  }

  entryHandler(text) {
    const modifiedText = text.slice(1)

    // Already processing input
    if (this.state.entry.step) {
      // Hints toggling
      if (modifiedText === SC_CMD.HINTS) {
        this.state.isVerbose = !this.state.isVerbose
        const handlerString = `entry${this.state.entry.step}Step`
        if (typeof this[handlerString] === 'function') this[handlerString]()
        else this.entryExitHandler()
      }
      // Dynamically execute function based on step
      else {
        const handlerString = `entry${this.state.entry.step}Handler`
        if (modifiedText === SC_CMD.CANCEL) this.entryExitHandler()
        else if (typeof this[handlerString] === 'function') this[handlerString](modifiedText)
        else this.entryExitHandler()
      }
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
    cmd = cmd === "e" ? "entry" : (cmd === "r" ? "rel" : cmd)
    if (!this.entryCommandList.includes(cmd)) return text
    let label = match.length > 1 && match[2] && match[2].trim()

    // Shortcuts for "/e you" and "/r you"
    if (!label || label.toLowerCase() === "you") {
      if (this.state.you) label = this.getIndexLabel(this.state.you.id)
      else return ""
    }

    // Setup index and preload entry if found
    this.state.entry.label = label
    this.state.entry.sourceIndex = this.getEntryIndexByIndexLabel(this.state.entry.label)
    if (this.state.entry.sourceIndex === -1 && cmd === "rel") return ""
    this.setEntrySource()

    // Store current message away to restore once done
    this.state.entry.previousMessage = state.message

    // Direct to correct menu
    this.state.entry.cmd = cmd
    if (this.state.entry.cmd === "entry") this.entryKeysStep()
    else this.entryParentsStep()
    return ""
  }

  commandHandler(text) {
    // Check if a command was inputted
    let match = SC_RE.INPUT_CMD.exec(text)
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
      else if (cmd === "spacing") this.state.isSpaced = !this.state.isSpaced
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

    // Do you detection early
    if (this.state.data.you) this.state.you = this.matchInfo(this.state.data.you)

    // Notes - Author's Note, Title, Author, Genre, Setting, Theme, Subject, Writing Style and Rating
    // Placed at the very end of context.
    const notes = []
    delete this.state.context.notes
    if (this.state.data.note) notes.push(`Author's note: ${this.appendPeriod(this.state.data.note)}`)
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
    if (this.state.data.scene) this.state.context.scene = this.replaceYou(this.toTitleCase(this.appendPeriod(this.state.data.scene)))

    // Think - Use to nudge a story in a certain direction
    // Placed 550 characters from the front of context
    delete this.state.context.think
    if (this.state.data.think) this.state.context.think = this.replaceYou(this.toTitleCase(this.appendPeriod(this.state.data.think)))

    // Focus - Use to force a narrative or story direction
    // Placed 150 characters from the front of context
    delete this.state.context.focus
    if (this.state.data.focus) this.state.context.focus = this.replaceYou(this.toTitleCase(this.appendPeriod(this.state.data.focus)))

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
    if (this.state.isSpaced) modifiedText = this.paragraphFormatterPlugin.inputModifier(modifiedText)

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
    const noteEntry = this.getValidEntry(this.state.context.notes, modifiedSize, originalSize)
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

    // Inject World Info into context
    const sentencesInject = this.injectWorldInfo(sentences, injectedEntries, headerInject.modifiedSize, originalSize)
    sentences = sentencesInject.sentences

    // Store injected entries away for relationship algorithm and World Info tracking
    this.state.injected = injectedEntries
    this.state.relations = this.getRelationshipTree()

    // Inject Relationship json into context
    const relationshipInject = this.injectRelationships(header, sentencesInject.modifiedSize, originalSize)
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
      }
      filterBreak = true
    })

    // Fill in past content
    const history = filterBreak ? [] : sentenceGroups.history.filter(sentence => {
      if (filterBreak) return false
      const calcSize = totalSize + sentence.length + headerSize
      if (calcSize < maxSize) {
        totalSize += sentence.length
        return true
      }
      filterBreak = true
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
    if (this.state.isSpaced) modifiedText = this.paragraphFormatterPlugin.outputModifier(modifiedText)

    return modifiedText
  }
}
const simpleContextPlugin = new SimpleContextPlugin()
