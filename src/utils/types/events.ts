/**
 * Events — React-parity event props for  components.
 *
 * mapEvents() consumes this and returns a Roblox-compatible Event object.
 * Only attach handlers that exist on the target Roblox element — mapEvents()
 * accepts an element type and silently drops inapplicable events.
 */

/**
 * Which Roblox element a component renders as.
 * Used by mapEvents() to filter events that don't exist on a given element.
 */
export type RobloxElementType =
	| 'textbutton'
	| 'imagebutton'
	| 'textlabel'
	| 'imagelabel'
	| 'textbox'
	| 'frame'
	| 'scrollingframe'
	| 'viewportframe';

export interface GuiEvents {
	/** MouseEnter — fires when the cursor enters the element's bounds. */
	onMouseEnter?: (x: number, y: number) => void;

	/** MouseLeave — fires when the cursor leaves the element's bounds. */
	onMouseLeave?: (x: number, y: number) => void;

	/** MouseMoved — fires when the cursor moves within the element. */
	onMouseMove?: (x: number, y: number) => void;

	/** MouseWheelForward — fires on scroll up. */
	onWheel?: (x: number, y: number) => void;

	/** InputBegan — fires on any input beginning over this element. */
	onInputStart?: (input: InputObject) => void;

	/** InputEnded — fires on any input ending over this element. */
	onInputEnd?: (input: InputObject) => void;

	/** InputChanged — fires as input state changes over this element. */
	onInputChange?: (input: InputObject) => void;

	/** SelectionGained — fires when Roblox gamepad/keyboard selection moves to this element. */
	onFocus?: () => void;

	/** SelectionLost — fires when selection leaves this element. */
	onBlur?: () => void;
}

export interface ButtonEvents extends GuiEvents {
	/** MouseButton1Click — left-click (down + up on same element). */
	onClick?: () => void;

	/** MouseButton2Click — right-click. */
	onContextMenu?: () => void;

	/** MouseButton1Down — left mouse button pressed. */
	onMouseDown?: (x: number, y: number) => void;

	/** MouseButton1Up — left mouse button released. */
	onMouseUp?: (x: number, y: number) => void;

	/** MouseButton2Down — right mouse button pressed. */
	onAuxMouseDown?: (x: number, y: number) => void;

	/** MouseButton2Up — right mouse button released. */
	onAuxMouseUp?: (x: number, y: number) => void;

	/** Activated — fires on click or gamepad activation. Closest to a universal "submit" event. */
	onActivated?: () => void;
}

export interface TextBoxEvents extends GuiEvents {
	/**
	 * onChange — fires on every character change while the box is focused.
	 * Maps to the Changed signal filtered to the Text property.
	 * Web equivalent: onInput (not onChange — see note below).
	 *
	 * Note: in React, onChange fires on every keystroke for inputs.
	 * Roblox has no direct equivalent; this maps to `Changed` on `Text`.
	 */
	onChange?: (text: string) => void;

	/**
	 * onCommit — fires when the user presses Enter or the box loses focus.
	 * Maps to FocusLost. Web equivalent: onChange on a committed field,
	 * or onBlur combined with value read.
	 */
	onCommit?: (text: string, enterPressed: boolean) => void;

	/** FocusLost without reading the value — raw blur equivalent. */
	onCommitBlur?: (enterPressed: boolean) => void;

	/** Focused — fires when the textbox gains input focus. */
	onFocus?: () => void;
}

export interface ScrollEvents extends GuiEvents {
	/**
	 * onScroll — fires when CanvasPosition changes.
	 * Maps to Changed filtered to CanvasPosition.
	 */
	onScroll?: (position: Vector2) => void;
}

/**
 * Full event prop set. Components pick the relevant subset.
 * mapEvents() accepts this and filters by element type.
 */
export type Events = ButtonEvents & TextBoxEvents & ScrollEvents;
