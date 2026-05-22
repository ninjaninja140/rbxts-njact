import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import { resolveChildren } from '../utils/resolveChildren';
import type { ContainerProps } from '../utils/types/common';

// * change this to use Span objects inside the text button so then images/icons can be put into the button and be aligned with the text
// * add button types for forms

export type ButtonType = 'button' | 'submit' | 'reset';

export interface IButtonProps extends ContainerProps {
	/** The type of the button. */
	type?: ButtonType;

	Text?: string;

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
	const robloxProps = omitProps(props, ['disabled', 'type', 'Text']);
	const { Event } = mapEvents('textbutton', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textbutton', props.style);
	const { text, nodes } = resolveChildren(props.children);

	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	const label = props.Text ?? text;

	return (
		<textbutton
			{...robloxProps}
			{...styleProps}
			Active={!props.disabled}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			TextWrap={props.style?.textWrap ?? true}
			Event={Event}
			Text={''}
		>
			{styleChildren}
			<uilistlayout
				key='button-layout'
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{label !== undefined && (
				<textlabel
					key='button-text'
					Text={label}
					BackgroundTransparency={1}
					TextColor3={(styleProps.TextColor3 as Color3) ?? new Color3(1, 1, 1)}
					FontFace={(styleProps.FontFace as Font) ?? Font.fromEnum(Enum.Font.SourceSans)}
					TextSize={(styleProps.TextSize as number) ?? 14}
					AutomaticSize={Enum.AutomaticSize.XY}
					TextWrap={false}
					LayoutOrder={5}
				/>
			)}
			{nodes}
		</textbutton>
	);
}
