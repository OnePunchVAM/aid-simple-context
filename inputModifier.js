
const modifier = (text) => {
  let modifiedText = text

  // Add custom code here

  // Plugins
  modifiedText = simpleContextPlugin.inputModifier(modifiedText)
  if (!modifiedText) return { stop: true }

  return { text: modifiedText }
}

// Don't modify this part
modifier(text)
