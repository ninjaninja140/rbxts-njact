import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import type { TextProps } from '../utils/types/common';

// * change this to use Span objects inside the text button so then images/icons can be put into the button and be aligned with the text
// * add button types for forms

export interface IButtonProps extends TextProps {
	/** Whether the button is non-interactive. Mirrors HTML disabled attribute. */
	disabled?: boolean;
}

/**
 * Button — interactive button element.
 *
 * Web:    `<button onClick={...}>label</button>`
 * :  `<Button onClick={...}>label</Button>`
 *
 * Renders as a `textbutton`. Unlike `A`, Button is semantically a control,
 * not a navigation element — prefer Button for actions, A for navigation.
 */
export function Button(props: IButtonProps) {
	const robloxProps = omitProps(props, ['disabled']);
	const { Event } = mapEvents('textbutton', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textbutton', props.style);

	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<textbutton
			{...robloxProps}
			{...styleProps}
			Active={!props.disabled}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			TextWrap={props.style?.textWrap ?? true}
			Event={Event}
		>
			{styleChildren}
		</textbutton>
	);
}
