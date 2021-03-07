
const modifier = (text) => {
  let modifiedText = text

  // Add custom code here

  // Plugins
  modifiedText = simpleContext.contextModifier(modifiedText)
  modifiedText = trackingPlugin.contextModifier(modifiedText)

  return { text: modifiedText }
}

// Don't modify this part
modifier(text)
