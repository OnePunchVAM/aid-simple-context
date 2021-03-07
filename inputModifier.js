
const modifier = (text) => {
  let modifiedText = text

  // Add custom code here

  // Plugins
  modifiedText = simpleContextPlugin.inputModifier(modifiedText)

  // Prevents energy from being used for commands
  if (!modifiedText) {
    statsFormatterPlugin.execute(statsFormatterConfig)
    return { stop: true }
  }

  return { text: modifiedText }
}

// Don't modify this part
modifier(text)
