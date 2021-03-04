
const modifier = (text) => {
  // Unmodified input for reference
  const unmodified = { text: text }

  // Check if no input (ie, prompt AI)
  if (!text) {
    state.shuffleContext = true
    return unmodified
  }

  // Check if a command was inputted
  const match = commandMatch.exec(text)
  if (!match || match.length <= 1) return unmodified
  
  // Check if the command was valid
  const key = match[1].toLowerCase()
  const value = match.length > 2 && match[2] ? match[2].trim() : ""
  if (commandList.indexOf(key) === -1) return unmodified
  
  // Update state and HUD
  update(key, value)
  return { text: "" }
}

// Don't modify this part
modifier(text)
