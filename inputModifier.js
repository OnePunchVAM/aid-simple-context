
const modifier = (text) => {
  let modifiedText = text

  // Add custom code here

  // Plugins
  modifiedText = simpleContext.inputModifier(modifiedText)

  return { text: modifiedText }
}

// Don't modify this part
modifier(text)
