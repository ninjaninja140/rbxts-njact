import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import type { BaseProps } from '../utils/types/common';

export interface IContainerProps extends BaseProps {
	children?: React.Element | React.Element[];
}

function Container(props: IContainerProps, displayName: string) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('frame', props);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', props.style);

	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<frame
			{...robloxProps}
			{...styleProps}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps['BackgroundTransparency'] as number) ?? 1}
			Event={Event}
		>
			{styleChildren}
			{props.children}
		</frame>
	);
}

/**
 * Div — generic block container.
 *
 * Web:    `<div style={{ display: "flex", flexDirection: "column" }}>`
 * :  `<Div style={{ display: "column" }}>`
 *
 * Renders as a `frame`. Background is transparent by default (matching the
 * web default of no visible background). Set `style.backgroundColor` to make
 * it visible.
 *
 * Use `style.display` ("row" | "column") to add a UIListLayout automatically.
 */
export function Div(props: IContainerProps) {
	return Container(props, 'Div');
}

/**
 * Section — semantic section container. Identical to Div in rendering,
 * exists for semantic clarity (mirrors HTML `<section>`).
 */
export function Section(props: IContainerProps) {
	return Container(props, 'Section');
}
