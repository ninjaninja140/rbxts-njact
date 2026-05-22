import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import { resolveChildren } from '../utils/resolveChildren';
import type { BaseProps, ContainerProps, TextProps } from '../utils/types/common';

export function Hr(props: BaseProps) {
	const { props: styleProps } = computeStyle('frame', props.style);
	return (
		<frame
			BackgroundColor3={(styleProps.BackgroundColor3 as Color3) ?? new Color3(0.28, 0.34, 0.42)}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 1)}
		/>
	);
}

export function Br(_props: BaseProps) {
	return <frame BackgroundTransparency={1} Size={new UDim2(1, 0, 0, 14)} BorderSizePixel={0} />;
}

export interface IScrollProps extends ContainerProps {
	canvasSize?: UDim2;
	scrollBarThickness?: number;
	scrollingDirection?: 'x' | 'y' | 'xy';
	onScroll?: (position: Vector2) => void;
}

export function ScrollDiv(props: IScrollProps) {
	const robloxProps = omitProps(props, ['canvasSize', 'scrollBarThickness', 'scrollingDirection', 'onScroll']);
	const { Event, Change } = mapEvents('scrollingframe', { ...props });
	const { props: styleProps, children: styleChildren } = computeStyle('scrollingframe', props.style);
	const { nodes } = resolveChildren(props.children);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	const dirMap = {
		x: Enum.ScrollingDirection.X,
		y: Enum.ScrollingDirection.Y,
		xy: Enum.ScrollingDirection.XY,
	};

	return (
		<scrollingframe
			{...robloxProps}
			{...styleProps}
			CanvasSize={props.canvasSize ?? new UDim2(0, 0, 0, 0)}
			AutomaticCanvasSize={props.canvasSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.Y}
			ScrollBarThickness={props.scrollBarThickness ?? 6}
			ScrollingDirection={dirMap[props.scrollingDirection ?? 'y']}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps['BackgroundTransparency'] as number) ?? 1}
			ScrollBarImageColor3={new Color3(0.5, 0.5, 0.5)}
			Event={Event}
			Change={Change}
		>
			{styleChildren}
			{nodes}
		</scrollingframe>
	);
}

export interface IDetailsProps extends ContainerProps {
	open?: boolean;
	summary?: string;
}

export function Details(props: IDetailsProps) {
	const [open, setOpen] = React.useState(props.open ?? false);
	const robloxProps = omitProps(props, ['open', 'summary']);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', props.style);
	const { nodes } = resolveChildren(props.children);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<frame
			{...robloxProps}
			{...styleProps}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps['BackgroundTransparency'] as number) ?? 1}
		>
			{styleChildren}
			<uilistlayout
				key='details-layout'
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<textbutton
				key='details-summary'
				Text={`${open ? '▾' : '▸'} ${props.summary ?? ''}`}
				BackgroundTransparency={1}
				TextColor3={new Color3(0.9, 0.9, 0.9)}
				TextSize={14}
				AutomaticSize={Enum.AutomaticSize.XY}
				FontFace={Font.fromEnum(Enum.Font.SourceSans)}
				AutoButtonColor={false}
				LayoutOrder={0}
				Event={{ MouseButton1Click: () => setOpen(!open) }}
			/>
			{open && (
				<frame
					key='details-content'
					BackgroundTransparency={1}
					AutomaticSize={Enum.AutomaticSize.XY}
					LayoutOrder={1}
				>
					<uipadding PaddingLeft={new UDim(0, 16)} />
					<uilistlayout FillDirection={Enum.FillDirection.Vertical} SortOrder={Enum.SortOrder.LayoutOrder} />
					{nodes}
				</frame>
			)}
		</frame>
	);
}

export interface ISummaryProps extends TextProps {}
export function Summary(props: ISummaryProps) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', props.style);
	const { text } = resolveChildren(props.children);
	return (
		<textlabel
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? ''}
			AutomaticSize={Enum.AutomaticSize.XY}
			RichText={true}
			Event={Event}
		>
			{styleChildren}
		</textlabel>
	);
}

export interface IFigureProps extends ContainerProps {}
export interface IFigcaptionProps extends TextProps {}

export function Figure(props: IFigureProps) {
	const robloxProps = omitProps(props);
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
				key='figure-layout'
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
				Padding={new UDim(0, 4)}
			/>
			{nodes}
		</frame>
	);
}

export function Figcaption(props: IFigcaptionProps) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('textlabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', {
		color: '#94a3b8',
		fontSize: 12,
		textAlign: 'center',
		...props.style,
	});
	const { text } = resolveChildren(props.children);
	return (
		<textlabel
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? ''}
			AutomaticSize={Enum.AutomaticSize.XY}
			RichText={true}
			Event={Event}
		>
			{styleChildren}
		</textlabel>
	);
}

export interface IAddressProps extends ContainerProps {}
export function Address(props: IAddressProps) {
	const robloxProps = omitProps(props);
	const { Event } = mapEvents('frame', props);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', {
		fontStyle: 'italic',
		...props.style,
	});
	const { nodes } = resolveChildren(props.children);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;
	return (
		<frame
			{...robloxProps}
			{...styleProps}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps.BackgroundTransparency as number) ?? 1}
			Event={Event}
		>
			{styleChildren}
			<uilistlayout
				key='address-layout'
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{nodes}
		</frame>
	);
}
