import type { Events, RobloxElementType } from './types/events';

/**
 * The shape of the Roblox `Event` prop accepted by rbxts/react elements.
 * Each key is a Roblox signal name; each value is the handler.
 */
type RobloxEventMap = Record<string, (...args: never[]) => void>;

/**
 * Which Roblox signal names exist on each element type.
 * mapEvents() uses this to silently drop events that aren't valid
 * for the target element, matching React's behaviour of ignoring
 * unknown event props rather than throwing.
 */
const ELEMENT_SIGNALS: Record<RobloxElementType, ReadonlySet<string>> = {
	textbutton: new Set([
		'MouseButton1Click',
		'MouseButton2Click',
		'MouseButton1Down',
		'MouseButton1Up',
		'MouseButton2Down',
		'MouseButton2Up',
		'Activated',
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'MouseWheelForward',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
	imagebutton: new Set([
		'MouseButton1Click',
		'MouseButton2Click',
		'MouseButton1Down',
		'MouseButton1Up',
		'MouseButton2Down',
		'MouseButton2Up',
		'Activated',
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'MouseWheelForward',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
	textlabel: new Set([
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'MouseWheelForward',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
	imagelabel: new Set([
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'MouseWheelForward',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
	textbox: new Set([
		'FocusLost',
		'Focused',
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'MouseWheelForward',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
	frame: new Set([
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'MouseWheelForward',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
	scrollingframe: new Set([
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'MouseWheelForward',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
	viewportframe: new Set([
		'MouseEnter',
		'MouseLeave',
		'MouseMoved',
		'InputBegan',
		'InputEnded',
		'InputChanged',
		'SelectionGained',
		'SelectionLost',
	]),
};

/**
 * Returns true if the given signal name is valid for the element type.
 */
function supports(element: RobloxElementType, signal: string): boolean {
	return ELEMENT_SIGNALS[element].has(signal);
}

/**
 * Conditionally adds a signal to the event map if:
 *   1. The handler is defined on props.
 *   2. The signal exists on the target element.
 */
function addEvent(
	events: RobloxEventMap,
	element: RobloxElementType,
	signal: string,
	handler: ((...args: never[]) => void) | undefined
): void {
	if (handler !== undefined && supports(element, signal)) {
		events[signal] = handler as (...args: never[]) => void;
	}
}

/**
 * mapEvents — translates React-style event props to a Roblox `Event` object.
 *
 * Pass the result directly as the `Event` prop on a Roblox element.
 * Events not supported by the target element are silently dropped.
 *
 * TextBox `onChange` is handled via a `Change` prop (not `Event`) because it
 * maps to the Changed signal on the Text property. mapEvents() returns both
 * the `Event` object and a `Change` object; destructure accordingly.
 *
 * @example
 * ```tsx
 * const { Event, Change } = mapEvents("textbox", props);
 * return <textbox Event={Event} Change={Change} />;
 *
 * // For buttons/labels, Change will always be empty:
 * const { Event } = mapEvents("textbutton", props);
 * return <textbutton Event={Event} />;
 * ```
 */
export function mapEvents(
	element: RobloxElementType,
	props: Partial<Events>
): { Event: RobloxEventMap; Change: RobloxEventMap } {
	const Event: RobloxEventMap = {};
	const Change: RobloxEventMap = {};

	// ── Shared GUI events (every GuiObject) ──
	addEvent(Event, element, 'MouseEnter', props.onMouseEnter as never);
	addEvent(Event, element, 'MouseLeave', props.onMouseLeave as never);
	addEvent(Event, element, 'MouseMoved', props.onMouseMove as never);
	addEvent(Event, element, 'MouseWheelForward', props.onWheel as never);
	addEvent(Event, element, 'InputBegan', props.onInputStart as never);
	addEvent(Event, element, 'InputEnded', props.onInputEnd as never);
	addEvent(Event, element, 'InputChanged', props.onInputChange as never);
	addEvent(Event, element, 'SelectionGained', props.onFocus as never);
	addEvent(Event, element, 'SelectionLost', props.onBlur as never);

	// ── Button events ──
	addEvent(Event, element, 'MouseButton1Click', props.onClick as never);
	addEvent(Event, element, 'MouseButton2Click', props.onContextMenu as never);
	addEvent(Event, element, 'MouseButton1Down', props.onMouseDown as never);
	addEvent(Event, element, 'MouseButton1Up', props.onMouseUp as never);
	addEvent(Event, element, 'MouseButton2Down', props.onAuxMouseDown as never);
	addEvent(Event, element, 'MouseButton2Up', props.onAuxMouseUp as never);
	addEvent(Event, element, 'Activated', props.onActivated as never);

	// ── TextBox: focus events use different signal names ──
	if (element === 'textbox') {
		if (props.onFocus !== undefined) Event.Focused = props.onFocus as never;

		if (props.onBlur !== undefined || props.onCommit !== undefined) {
			// FocusLost provides (enterPressed: boolean) — wire whichever handler exists.
			// If both are set, onCommit takes priority for value reading;
			// onBlur fires as a side effect.
			const commitHandler = props.onCommit;
			const blurHandler = props.onCommitBlur;

			if (commitHandler !== undefined)
				// FocusLost(textBox: TextBox, enterPressed: boolean)
				// We read textBox.Text to give onChange-like value access.
				Event.FocusLost = ((textBox: TextBox, enterPressed: boolean) => {
					commitHandler(textBox.Text, enterPressed);
					blurHandler?.(enterPressed);
				}) as never;
			else if (blurHandler !== undefined)
				Event.FocusLost = ((_textBox: TextBox, enterPressed: boolean) => {
					blurHandler(enterPressed);
				}) as never;
		}

		// onChange → Changed on the Text property.
		// This is returned as `Change` (not `Event`) because rbxts/react uses
		// a separate `Change` prop for property-changed signals.
		if (props.onChange !== undefined) {
			const changeHandler = props.onChange;
			Change.Text = ((textBox: TextBox) => {
				changeHandler(textBox.Text);
			}) as never;
		}
	}

	// ── ScrollingFrame: CanvasPosition change → onScroll ──
	if (element === 'scrollingframe' && props.onScroll !== undefined) {
		const scrollHandler = props.onScroll;
		Change.CanvasPosition = ((frame: ScrollingFrame) => {
			scrollHandler(frame.CanvasPosition);
		}) as never;
	}

	return { Event, Change };
}
