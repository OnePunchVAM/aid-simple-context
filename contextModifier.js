
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
    // If shuffleContext, move everything forward one line in the context
    const pos = state.shuffleContext ? 6 : 7
    if (state.context.story) {
      const entry = `[ ${state.context.story.join(" ")}]`
      if (lines.length <= pos) lines.splice(0, 0, entry)
      else lines.splice((pos * -1), 0, entry)
    }
    if (state.context.scene) {
      const entry = `[ ${state.context.scene.join(" ")}]`
      if (lines.length <= pos) lines.splice(state.context.story ? 1 : 0, 0, entry)
      else lines.splice((pos * -1), 0, entry)
    }
    if (state.context.focus) {
      const entry = `[ ${state.context.focus.join(" ")}]`
      if (lines.length <= 1 || state.shuffleContext) lines.push(entry)
      else lines.splice(-1, 0, entry)
    }
  }

  // Manually insert world info mentioned in combined state
  const combinedState = [state.context.story || "", state.context.scene || "", state.context.focus || ""].join(" ")
  for (let wi of worldInfo) {
    for (let key of wi.keys.split(",")) {
      if (combinedState.indexOf(key.trim()) !== -1 && text.indexOf(key.trim()) === -1) {
        lines.unshift(wi.entry)
        break
      }
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
