import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import type { BaseProps } from '../utils/types/common';

export interface IInputProps extends BaseProps {
	/** Current value. → Text. */
	value?: string;

	/** Placeholder text shown when the box is empty. → PlaceholderText. */
	placeholder?: string;

	/** Placeholder text colour. → PlaceholderColor3. */
	placeholderColor?: Color3;

	/** Whether the input is non-interactive. → TextEditable = false. */
	disabled?: boolean;

	/** Whether text is masked (password field). → TextEditable stays true, but content is hidden. */
	type?: 'text' | 'password' | 'number';

	/**
	 * Max visible characters before truncation (not a hard limit on input length).
	 * → MaxVisibleGraphemes.
	 */
	maxLength?: number;

	/** Whether to clear the box on focus. → ClearTextOnFocus. */
	clearOnFocus?: boolean;

	/**
	 * onChange fires on every keystroke.
	 * Inherited from BaseProps via Events.
	 */

	/**
	 * onCommit fires when the user presses Enter or the box loses focus.
	 * Inherited from BaseProps via Events.
	 */
}

/**
 * Input — single-line text input element.
 *
 * Web:    `<input value={v} onChange={e => setValue(e.target.value)} />`
 * :  `<Input value={v} onChange={text => setValue(text)} />`
 *
 * Renders as a `textbox`.
 *
 * onChange fires on every keystroke (maps to Changed on the Text property).
 * onCommit fires on Enter / focus loss (maps to FocusLost).
 */
export function Input(props: IInputProps) {
	const robloxProps = omitProps(props, [
		'value',
		'placeholder',
		'placeholderColor',
		'disabled',
		'type',
		'maxLength',
		'clearOnFocus',
	]);

	const { Event, Change } = mapEvents('textbox', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textbox', props.style);

	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<textbox
			{...robloxProps}
			{...styleProps}
			Text={props.value ?? ''}
			PlaceholderText={props.placeholder}
			PlaceholderColor3={props.placeholderColor}
			TextEditable={!props.disabled}
			ClearTextOnFocus={props.clearOnFocus ?? false}
			MaxVisibleGraphemes={props.maxLength ?? -1}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			TextWrap={props.style?.textWrap ?? false}
			Event={Event}
			Change={Change}
		>
			{styleChildren}
		</textbox>
	);
}
