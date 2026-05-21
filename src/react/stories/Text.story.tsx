import React from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import type { HexKey } from '../../utils/types/common';
import { Div } from '../Div';
import { Bold, Code, P, Span } from '../Text';

const controls = {
	content: 'The quick brown fox jumps over the lazy dog',
	fontSize: Slider(16, 8, 48, 1),
	textAlign: Choose(['left', 'center', 'right'] as const, 1),
	fontWeight: Choose(['regular', 'medium', 'bold', 'heavy'] as const, 1),
	textWrap: true,
	showStroke: false,
	component: Choose(['P', 'Span', 'Bold', 'Code'] as const, 1),
};

const story = CreateReactStory(
	{
		name: 'Text (P / Span)',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary: 'Text display elements. P wraps with AutomaticSize XY; Span sizes on X only (inline).',
	},
	(props: InferProps<typeof controls>) => {
		const { content, fontSize, textAlign, fontWeight, textWrap, showStroke, component } = props.controls;

		const sharedStyle = {
			fontSize,
			textAlign: textAlign as 'left' | 'center' | 'right',
			fontWeight: fontWeight as 'regular' | 'medium' | 'bold' | 'heavy',
			textWrap,
			color: '#f1f5f9' as HexKey,
			textStrokeColor: showStroke ? ('#3b82f6' as HexKey) : undefined,
			textStrokeOpacity: showStroke ? 0.6 : undefined,
		};

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 24)}
				/>

				{/* Label showing which component is active */}
				<P style={{ color: '#64748b', fontSize: 12 }} Text={`<${component}>`} />

				{/* Constrained container so wrapping behaviour is visible */}
				<Div
					style={{
						backgroundColor: '#1e293b',
						borderRadius: 8,
						padding: 16,
						width: 320,
						autoSize: 'y',
					}}
				>
					{component === 'P' ? (
						<P style={sharedStyle} Text={content} />
					) : component === 'Bold' ? (
						<Bold style={sharedStyle} Text={content} />
					) : (
						<Code style={sharedStyle} Text={content} />
					)}
				</Div>

				{/* Side-by-side Span demo — shows inline sizing */}
				{component === 'Span' && (
					<Div
						style={{
							display: 'row',
							gap: 4,
							backgroundColor: '#1e293b',
							borderRadius: 8,
							padding: 16,
							autoSize: 'xy',
						}}
					>
						<Span style={{ ...sharedStyle, color: '#f1f5f9' }} Text='Hello,' />
						<Span style={{ ...sharedStyle, color: '#60a5fa' }} Text='world!' />
					</Div>
				)}
			</frame>
		);
	}
);

export = story;
