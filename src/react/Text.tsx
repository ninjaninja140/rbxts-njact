import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import type { TextProps } from '../utils/types/common';

/**
 * P — paragraph element.
 *
 * Web:    `<p>text content</p>`
 * :  `<P>text content</P>`
 *
 * Renders as a `textlabel` with TextWrapped on and AutomaticSize XY by default.
 * Block-level: use inside a Div with `style={{ display: "column" }}` to stack
 * multiple paragraphs vertically.
 */
export function P(props: TextProps) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', props.style);

	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<textlabel
			RichText={true}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			TextWrap={props.style?.textWrap ?? true}
			Event={Event}
			{...robloxProps}
			{...styleProps}
		>
			{styleChildren}
		</textlabel>
	);
}

/**
 * Span — inline text element.
 *
 * Web:    `<span>text</span>`
 * :  `<Span>text</Span>`
 *
 * Renders as a `textlabel`. Unlike P, Span defaults AutomaticSize to X only —
 * it sizes to fit its content horizontally and inherits its height from the
 * parent layout (matches the inline-level CSS box model concept).
 */
export function Span(props: TextProps) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', props.style);

	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<textlabel
			AutomaticSize={
				hasExplicitSize
					? Enum.AutomaticSize.None
					: props.style?.autoSize
						? undefined // computeStyle already set it
						: Enum.AutomaticSize.X
				// the fact this was a bug because it was literally below styleProps makes me laugh out loud
			}
			{...robloxProps}
			{...styleProps}
			RichText={true}
			TextWrap={props.style?.textWrap ?? false}
			Event={Event}
		>
			{styleChildren}
		</textlabel>
	);
}

/**
 * Bold — inline text element (span but bold).
 *
 * Web:    `<b>text</b>`
 * :  `<b>text</b>`
 *
 * Renders as a `textlabel`. Unlike P, Span defaults AutomaticSize to X only —
 * it sizes to fit its content horizontally and inherits its height from the
 * parent layout (matches the inline-level CSS box model concept).
 */
export function Bold(props: TextProps) {
	return <Span {...props} style={{ ...props.style, fontWeight: 'bold' }} />;
}
export { Bold as B }; // alias

/**
 * Code — inline text element (span but monospaced).
 *
 * Web:    `<code>text</code>`
 * :  `<code>text</code>`
 *
 * Renders as a `textlabel`. Unlike P, Span defaults AutomaticSize to X only —
 * it sizes to fit its content horizontally and inherits its height from the
 * parent layout (matches the inline-level CSS box model concept).
 */
export function Code(props: TextProps) {
	return (
		<Span
			{...props}
			style={{
				...props.style,
				autoSize: 'xy',
				fontFamily: 'BuilderMono',
				borderRadius: 4,
				padding: 4,
				backgroundColor: 'lightgray', // its done!
			}}
		/>
	);
}
