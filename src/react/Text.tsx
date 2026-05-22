import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import { resolveChildren } from '../utils/resolveChildren';
import type { TextProps } from '../utils/types/common';
import type { Style } from '../utils/types/style';

function TextLabel(props: TextProps, defaultStyle?: Partial<Style>) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const merged: Style = { ...defaultStyle, ...props.style };
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', merged);
	const { text, nodes } = resolveChildren(props.children);
	const hasExplicitSize = merged.width !== undefined || merged.height !== undefined;

	return (
		<textlabel
			RichText={props.richText ?? true}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			TextWrap={merged.textWrap ?? true}
			Event={Event}
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? ''}
		>
			{styleChildren}
			{nodes}
		</textlabel>
	);
}

function InlineLabel(props: TextProps, defaultStyle?: Partial<Style>) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const merged: Style = { ...defaultStyle, ...props.style };
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', merged);
	const { text, nodes } = resolveChildren(props.children);
	const hasExplicitSize = merged.width !== undefined || merged.height !== undefined;

	return (
		<textlabel
			AutomaticSize={
				hasExplicitSize ? Enum.AutomaticSize.None : merged.autoSize ? undefined : Enum.AutomaticSize.X
			}
			RichText={props.richText ?? true}
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? ''}
			TextWrap={merged.textWrap ?? false}
			Event={Event}
		>
			{styleChildren}
			{nodes}
		</textlabel>
	);
}

export function P(props: TextProps) {
	return TextLabel(props);
}

const HEADING_SIZES: Record<string, number> = { H1: 32, H2: 28, H3: 24, H4: 20, H5: 16, H6: 14 };
const HEADING_WEIGHTS: Record<string, Style['fontWeight']> = {
	H1: 'bold',
	H2: 'bold',
	H3: 'semibold',
	H4: 'semibold',
	H5: 'medium',
	H6: 'medium',
};

function Heading(level: string) {
	return (props: TextProps) =>
		TextLabel(props, { fontSize: HEADING_SIZES[level], fontWeight: HEADING_WEIGHTS[level] });
}

export const H1 = Heading('H1');
export const H2 = Heading('H2');
export const H3 = Heading('H3');
export const H4 = Heading('H4');
export const H5 = Heading('H5');
export const H6 = Heading('H6');

export function Span(props: TextProps) {
	return InlineLabel(props);
}
export function Strong(props: TextProps) {
	return InlineLabel(props, { fontWeight: 'bold' });
}
export function Em(props: TextProps) {
	return InlineLabel(props, { fontStyle: 'italic' });
}
export function S(props: TextProps) {
	return InlineLabel(props);
}
export function U(props: TextProps) {
	return InlineLabel(props);
}
export function Small(props: TextProps) {
	return InlineLabel(props, { fontSize: 11 });
}
export function Mark(props: TextProps) {
	return InlineLabel(props, { backgroundColor: 'yellow', color: 'black' });
}
export function Kbd(props: TextProps) {
	return InlineLabel(props, { fontFamily: 'BuilderMono', borderRadius: 3, borderWidth: 1, padding: [2, 6] });
}
export function Samp(props: TextProps) {
	return InlineLabel(props, { fontFamily: 'BuilderMono' });
}
export function Var(props: TextProps) {
	return InlineLabel(props, { fontStyle: 'italic' });
}

export function Code(props: TextProps) {
	return InlineLabel(props, {
		fontFamily: 'BuilderMono',
		backgroundColor: '#1e1e2e',
		color: '#cdd6f4',
		borderRadius: 4,
		padding: [2, 6],
		autoSize: 'xy',
	});
}

export function Pre(props: TextProps) {
	return TextLabel(props, {
		fontFamily: 'BuilderMono',
		backgroundColor: '#1e1e2e',
		color: '#cdd6f4',
		borderRadius: 6,
		padding: 12,
		textWrap: false,
		textOverflow: 'clip',
	});
}

export function Blockquote(props: TextProps) {
	return TextLabel(props, {
		paddingLeft: 16,
		borderWidth: 2,
		color: '#94a3b8',
		fontStyle: 'italic',
	});
}

export function Sub(props: TextProps) {
	return InlineLabel(props, { fontSize: 10, verticalAlign: 'bottom' });
}
export function Sup(props: TextProps) {
	return InlineLabel(props, { fontSize: 10, verticalAlign: 'top' });
}
export function Abbr(props: TextProps) {
	return InlineLabel(props);
}
export function Cite(props: TextProps) {
	return InlineLabel(props, { fontStyle: 'italic' });
}
export function Q(props: TextProps) {
	const { text } = resolveChildren(props.children);
	const inner = props.Text ?? text;

	return InlineLabel({ ...props, Text: inner !== undefined ? `"${inner}"` : undefined }, { fontStyle: 'italic' });
}
export function Bold(props: TextProps) {
	return InlineLabel(props, { fontWeight: 'bold' });
}
export { Strong as B, Em as I };
