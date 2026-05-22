#!/usr/bin/env node

/**
 * Patch for @rbxts-js/react-roblox to implement text node support
 * This script implements createTextInstance, commitTextUpdate, hideTextInstance, and unhideTextInstance
 */

const fs = require('fs');
const path = require('path');

const hostConfigPath = path.join(
  __dirname,
  '../node_modules/@rbxts-js/react-roblox/src/client/ReactRobloxHostConfig.lua'
);

if (!fs.existsSync(hostConfigPath)) {
  console.warn('Warning: react-roblox host config not found at', hostConfigPath);
  console.warn('Skipping patch application');
  process.exit(0);
}

let content = fs.readFileSync(hostConfigPath, 'utf8');

// Patch 1: Implement createTextInstance
const createTextInstanceOld = `-- ROBLOX deviation: Text nodes aren't supported in Roblox renderer, so error so that tests fail immediately
exports.createTextInstance = function(
	text: string,
	rootContainerInstance: Container,
	hostContext: HostContext,
	internalInstanceHandle: Object
): any
	unimplemented("createTextInstance")
	return nil
end`;

const createTextInstanceNew = `-- ROBLOX implementation: Text nodes are represented as TextLabel instances
exports.createTextInstance = function(
	text: string,
	rootContainerInstance: Container,
	hostContext: HostContext,
	internalInstanceHandle: Object
): any
	local textLabel = Instance.new("TextLabel")
	textLabel.Text = text
	textLabel.BackgroundTransparency = 1
	textLabel.TextScaled = true
	textLabel.Size = UDim2.new(1, 0, 1, 0)
	
	-- Set name based on key for debugging
	if internalInstanceHandle.key then
		textLabel.Name = "TextNode_" .. tostring(internalInstanceHandle.key)
	else
		textLabel.Name = "TextNode"
	end
	
	precacheFiberNode(internalInstanceHandle, textLabel)
	
	return textLabel
end`;

if (!content.includes('ROBLOX implementation: Text nodes are represented as TextLabel instances')) {
  content = content.replace(createTextInstanceOld, createTextInstanceNew);
  console.log('✓ Patched createTextInstance');
} else {
  console.log('✓ createTextInstance already patched');
}

// Patch 2: Implement commitTextUpdate
const commitTextUpdateOld = `-- ROBLOX deviation: Ignore TextInstance logic, which isn't applicable to Roblox
-- exports.commitTextUpdate(
--   textInstance: TextInstance,
--   oldText: string,
--   newText: string,
-- ): void {
--   textInstance.nodeValue = newText
-- end`;

const commitTextUpdateNew = `-- ROBLOX implementation: Update text content
exports.commitTextUpdate = function(
	textInstance: TextInstance,
	oldText: string,
	newText: string
): ()
	textInstance.Text = newText
end`;

if (!content.includes('ROBLOX implementation: Update text content')) {
  content = content.replace(commitTextUpdateOld, commitTextUpdateNew);
  console.log('✓ Patched commitTextUpdate');
} else {
  console.log('✓ commitTextUpdate already patched');
}

// Patch 3: Implement hideTextInstance
const hideTextInstanceOld = `-- ROBLOX deviation: error on TextInstance logic, which isn't applicable to Roblox
exports.hideTextInstance = function(textInstance: TextInstance): ()
	unimplemented("hideTextInstance")
	--   textInstance.nodeValue = ''
end`;

const hideTextInstanceNew = `-- ROBLOX implementation: Hide text instance
exports.hideTextInstance = function(textInstance: TextInstance): ()
	textInstance.Visible = false
end`;

if (!content.includes('ROBLOX implementation: Hide text instance')) {
  content = content.replace(hideTextInstanceOld, hideTextInstanceNew);
  console.log('✓ Patched hideTextInstance');
} else {
  console.log('✓ hideTextInstance already patched');
}

// Patch 4: Implement unhideTextInstance
const unhideTextInstanceOld = `-- ROBLOX deviation: error on TextInstance logic, which isn't applicable to Roblox
exports.unhideTextInstance = function(textInstance: TextInstance, text: string): ()
	unimplemented("unhideTextInstance")
	--   textInstance.nodeValue = text
end`;

const unhideTextInstanceNew = `-- ROBLOX implementation: Unhide text instance
exports.unhideTextInstance = function(textInstance: TextInstance, text: string): ()
	textInstance.Visible = true
	textInstance.Text = text
end`;

if (!content.includes('ROBLOX implementation: Unhide text instance')) {
  content = content.replace(unhideTextInstanceOld, unhideTextInstanceNew);
  console.log('✓ Patched unhideTextInstance');
} else {
  console.log('✓ unhideTextInstance already patched');
}

// Write the patched content
fs.writeFileSync(hostConfigPath, content, 'utf8');
console.log('✓ Patch applied successfully to', hostConfigPath);
