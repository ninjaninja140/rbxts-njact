import React from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { HexKey } from '../../utils/types/common';
import { Div } from '../Div';
import { P } from '../Text';

const controls = {
	direction: Choose(['row', 'column'] as const, 1),
	gap: Slider(8, 0, 48, 1),
	padding: Slider(12, 0, 48, 1),
	borderRadius: Slider(8, 0, 32, 1),
	itemCount: Slider(3, 1, 6, 1),
	showBg: true,
};

const ITEM_COLORS: HexKey[] = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

const story = CreateReactStory(
	{
		name: 'Div',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary: 'Generic block container. Renders as a frame. Supports display: row | column via UIListLayout.',
	},
	(props: InferProps<typeof controls>) => {
		const { direction, gap, padding, borderRadius, itemCount, showBg } = props.controls;

		const items: React.Element[] = [];
		for (let i = 0; i < itemCount; i++) {
			items.push(
				<Div
					key={tostring(i)}
					style={{
						backgroundColor: ITEM_COLORS[i % ITEM_COLORS.size()],
						borderRadius: 6,
						padding: 8,
						width: direction === 'row' ? 80 : undefined,
						autoSize: direction === 'row' ? 'y' : 'xy',
					}}
				>
					<P
						Text={`Item ${i + 1}`}
						style={{
							color: '#ffffff',
							fontSize: 14,
							textAlign: 'center',
						}}
					/>
				</Div>
			);
		}

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				<Div
					style={{
						display: direction,
						gap,
						padding,
						borderRadius,
						backgroundColor: showBg ? '#1e293b' : undefined,
					}}
				>
					{items}
				</Div>
			</frame>
		);
	}
);

export = story;
