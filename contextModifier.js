
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
    const header = []
    const headerPos = state.shuffleContext ? 9 : 8

    // Insert focus
    if (state.context.focus) {
      const entry = `[ ${state.context.focus}]`
      if (lines.length <= 1 || state.shuffleContext) lines.push(entry)
      else lines.splice(-1, 0, entry)
    }

    // Insert world info mentioned in combined state
    const combinedState = (state.context.story || "") + (state.context.scene || "") + (state.context.focus || "")
    for (let wi of worldInfo) {
      for (let key of wi.keys.split(",")) {
        if (combinedState.indexOf(key.trim()) !== -1 && text.indexOf(key.trim()) === -1) {
          header.push(wi.entry)
          break
        }
      }
    }

    // Insert author's note
    if (state.context.story) header.push(`[ ${state.context.story}]`)

    // Insert contextual character and scene information
    if (state.context.scene) header.push(`[ ${state.context.scene}]`)

    // Insert header context into lines
    if (lines.length <= headerPos) {
      header.reverse()
      for (let line of header) lines.unshift(line)
    } else {
      for (let line of header) lines.splice((headerPos * -1), 0, line)
    }
  }
  
  // Make sure the new context isn't too long, or it will get truncated by the server.
  const combinedLines = lines.join("\n").slice(-(info.maxChars - info.memoryLength))
  const finalText = [contextMemory, combinedLines].join("")
  if (state.isDebug && !state.isDisabled && !state.isHidden) state.message = finalText
  return { text: finalText }
}

// Don't modify this part
modifier(text)
