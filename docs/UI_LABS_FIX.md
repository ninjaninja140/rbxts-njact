# UI-Labs Story Rendering Fix

## Problem

When opening stories in ui-labs, some stories (like Text and Div) would not render and throw an error:
```
FIXME (roblox): createTextInstance is unimplemented
```

## Root Cause

The react-roblox library had four text node handling functions marked as "unimplemented" in the host config:
- `createTextInstance`
- `commitTextUpdate`  
- `hideTextInstance`
- `unhideTextInstance`

When React encountered text nodes during rendering (which occurs when stories render JSX components with text content), it would call these functions and immediately throw an error since they were deliberately left unimplemented.

## Solution

Implemented the four unimplemented functions in `@rbxts-js/react-roblox/src/client/ReactRobloxHostConfig.lua`:

1. **createTextInstance**: Creates a TextLabel instance to represent the text node
   - Sets the text content via the Text property
   - Applies default styling (transparent background, text scaled)
   - Caches the fiber node for React's reconciliation

2. **commitTextUpdate**: Updates the text content of an existing TextLabel
   - Updates the Text property when content changes

3. **hideTextInstance**: Hides a text node
   - Sets Visible property to false

4. **unhideTextInstance**: Shows a hidden text node
   - Sets Visible property to true
   - Updates the text content

## Implementation Details

A postinstall script (`scripts/patch-react-roblox.js`) automatically applies these implementations to the react-roblox library when dependencies are installed. The script:

1. Checks if the patches are already applied
2. Replaces the unimplemented functions with working implementations
3. Provides informative console output

## How It Works

When React needs to render text content:
1. It calls `createTextInstance` which creates a TextLabel
2. The TextLabel is parented to the containing element via the normal appendChild mechanism
3. Updates are handled through `commitTextUpdate`
4. Visibility changes use `hideTextInstance` and `unhideTextInstance`

This approach allows text to be rendered in Roblox, which lacks native text nodes, by creating TextLabel instances to represent them.

## Testing

After this fix, ui-labs stories should render correctly:
- Text stories now display text content properly
- Div stories work as expected
- Other stories continue to function normally
