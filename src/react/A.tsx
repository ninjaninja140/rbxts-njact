import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import { resolveChildren } from '../utils/resolveChildren';
import type { TextProps } from '../utils/types/common';

export interface IAnchorProps extends TextProps {
	/** The "href" concept in Roblox-land — a callback fired on click. */
	href?: () => void;
}

/**
 * A — anchor / link element.
 *
 * Web:    `<a onClick={...}>text</a>`
 * :  `<A onClick={...}>text</A>`
 *
 * Renders as a `textbutton`. AutomaticSize is XY by default unless an explicit
 * width/height is set in the style prop.
 */
export function A(properties: IAnchorProps) {
	const props = table.clone(properties);
	const href = props.href;
	delete props.href;

	// Merge href into onClick — href is the "declarative" form, onClick the imperative.
	// If both are provided, both fire.
	const mergedProps: IAnchorProps = {
		...props,
		onClick:
			href !== undefined
				? () => {
						href();
						props.onClick?.();
					}
				: props.onClick,
	};

	const robloxProps = omitProps(mergedProps, ['href']);
	const { Event } = mapEvents('textbutton', mergedProps);
	const { props: styleProps, children: styleChildren } = computeStyle('textbutton', mergedProps.style);
	const { text, nodes } = resolveChildren(mergedProps.children);

	const hasExplicitSize = mergedProps.style?.width !== undefined || mergedProps.style?.height !== undefined;

	return (
		<textbutton
			{...robloxProps}
			{...styleProps}
			Text={mergedProps.Text ?? text ?? ''}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			TextWrap={mergedProps.style?.textWrap ?? true}
			Event={Event}
		>
			{styleChildren}
			{nodes}
		</textbutton>
	);
}
