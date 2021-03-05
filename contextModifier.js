
const validEntrySize = (originalSize, entrySize, totalSize) => {
  if (originalSize === 0) return false
  const modifiedPercent = (totalSize + entrySize) / originalSize
  return modifiedPercent < 0.85
}

const modifier = (text) => {
  if (!state.data) state.data = {}
  if (!state.context) state.context = {}
  
  // Gather existing context
  const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ""
  const context = info.memoryLength ? text.slice(info.memoryLength) : text

  // Split context into lines, remove empty lines
  const lines = context.split("\n").filter(line => !!line)

  // If enabled, inject modified context
  if (!state.isDisabled) {
    let totalSize = 0
    const originalSize = context.length
    const combinedState = (state.context.story || "") + (state.context.scene || "") + (state.context.focus || "")

    // Insert focus
    if (state.context.focus) {
      const entry = `[ ${state.context.focus}]`
      if (validEntrySize(originalSize, entry.length, totalSize)) {
        if (lines.length <= 1 || state.shuffleContext) lines.push(entry)
        else lines.splice(-1, 0, entry)
        totalSize += entry.length
      }
    }

    // Build header
    const header = []
    const headerPos = state.shuffleContext ? 9 : 8

    // Build character and scene information
    if (state.context.scene) {
      const entry = `[ ${state.context.scene}]`
      if (validEntrySize(originalSize, entry.length, totalSize)) {
        header.push(entry)
        totalSize += entry.length
      }
    }

    // Build author's note
    if (state.context.story) {
      const entry = `[ ${state.context.story}]`
      if (validEntrySize(originalSize, entry.length, totalSize)) {
        header.push(entry)
        totalSize += entry.length
      }
    }

    // Build world info entries by matching keys to combinedState
    if (combinedState) {
      for (let info of worldInfo) {
        for (let key of info.keys.split(",")) {
          if (combinedState.indexOf(key.trim()) !== -1 && text.indexOf(key.trim()) === -1) {
            if (validEntrySize(originalSize, info.entry.length, totalSize)) {
              header.push(info.entry)
              totalSize += info.entry.length
            }
            break
          }
        }
      }
    }

    // Insert header
    if (lines.length <= headerPos) for (let line of header) lines.unshift(line)
    else {
      header.reverse()
      for (let line of header) lines.splice((headerPos * -1), 0, line)
    }
  }
  
  // Make sure the new context isn't too long, or it will get truncated by the server.
  const combinedLines = lines.join("\n").slice(-(info.maxChars - info.memoryLength))
  const finalText = [contextMemory, combinedLines].join("")

  if (state.isDebug) state.message = finalText
  return { text: finalText }
}

// Don't modify this part
modifier(text)
