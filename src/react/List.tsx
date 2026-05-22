import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import { resolveChildren } from '../utils/resolveChildren';
import type { ContainerProps, TextProps } from '../utils/types/common';
import type { Style } from '../utils/types/style';

export interface IListProps extends ContainerProps {
	gap?: number;
}

function ListContainer(props: IListProps, bulletStyle?: Style) {
	const robloxProps = omitProps(props, ['gap']);
	const { Event } = mapEvents('frame', props);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', props.style);
	const { nodes } = resolveChildren(props.children);
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
			<uilistlayout
				key='list-layout'
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				VerticalAlignment={Enum.VerticalAlignment.Top}
				Padding={new UDim(0, props.gap ?? 4)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{nodes}
		</frame>
	);
}

export function Ul(props: IListProps) {
	return ListContainer(props);
}
export function Ol(props: IListProps) {
	return ListContainer(props);
}

export interface ILiProps extends TextProps {
	bullet?: string;
}

export function Li(props: ILiProps) {
	const robloxProps = omitProps(props, ['bullet']);
	const { Event } = mapEvents('frame', props);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', props.style);
	const { text, nodes } = resolveChildren(props.children);

	return (
		<frame
			{...robloxProps}
			{...styleProps}
			AutomaticSize={Enum.AutomaticSize.XY}
			BackgroundTransparency={1}
			Event={Event}
		>
			{styleChildren}
			<uilistlayout
				key='li-layout'
				FillDirection={Enum.FillDirection.Horizontal}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 6)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<textlabel
				key='li-bullet'
				Text={props.bullet ?? '•'}
				BackgroundTransparency={1}
				TextColor3={(styleProps.TextColor3 as Color3) ?? new Color3(1, 1, 1)}
				TextSize={(styleProps.TextSize as number) ?? 14}
				FontFace={(styleProps.FontFace as Font) ?? Font.fromEnum(Enum.Font.SourceSans)}
				AutomaticSize={Enum.AutomaticSize.XY}
				LayoutOrder={0}
			/>
			{(props.Text !== undefined || text !== undefined) && (
				<textlabel
					key='li-text'
					Text={props.Text ?? text ?? ''}
					BackgroundTransparency={1}
					TextColor3={(styleProps.TextColor3 as Color3) ?? new Color3(1, 1, 1)}
					TextSize={(styleProps.TextSize as number) ?? 14}
					FontFace={(styleProps.FontFace as Font) ?? Font.fromEnum(Enum.Font.SourceSans)}
					AutomaticSize={Enum.AutomaticSize.XY}
					RichText={true}
					TextWrap={true}
					LayoutOrder={1}
				/>
			)}
			{nodes}
		</frame>
	);
}

export interface IDtProps extends TextProps {}
export interface IDdProps extends TextProps {}

export function Dl(props: IListProps) {
	return ListContainer(props);
}
export function Dt(props: IDtProps) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', {
		fontWeight: 'bold',
		...props.style,
	});
	const { text } = resolveChildren(props.children);
	return (
		<textlabel
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? ''}
			RichText={true}
			AutomaticSize={Enum.AutomaticSize.XY}
			TextWrap={true}
			Event={Event}
		>
			{styleChildren}
		</textlabel>
	);
}
export function Dd(props: IDdProps) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', {
		paddingLeft: 16,
		...props.style,
	});
	const { text } = resolveChildren(props.children);
	return (
		<textlabel
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? ''}
			RichText={true}
			AutomaticSize={Enum.AutomaticSize.XY}
			TextWrap={true}
			Event={Event}
		>
			{styleChildren}
		</textlabel>
	);
}
