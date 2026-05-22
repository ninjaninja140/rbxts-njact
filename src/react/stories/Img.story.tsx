import React from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { Div } from '../Div';
import { Img } from '../Img';
import { P } from '../Text';

const controls = {
	scaleType: Choose(['stretch', 'slice', 'tile', 'fit', 'crop'] as const, 0),
	width: Slider(200, 100, 400, 10),
	height: Slider(200, 100, 400, 10),
	opacity: Slider(1, 0, 1, 0.1),
};

const story = CreateReactStory(
	{
		name: 'Img',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary: 'Image display element. Renders as an imagelabel with support for various scale types.',
	},
	(props: InferProps<typeof controls>) => {
		const { scaleType, width, height, opacity } = props.controls;

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 24)}
				/>

				<Div style={{ display: 'column', gap: 12, autoSize: 'xy' }}>
					<P style={{ color: '#94a3b8', fontSize: 12 }} Text={`ScaleType: ${scaleType}`} />
					<P style={{ color: '#94a3b8', fontSize: 12 }} Text={`Size: ${width}x${height}`} />

					{/* Image container with visible background */}
					<Div
						style={{
							backgroundColor: '#1e293b',
							borderRadius: 8,
							padding: 8,
							width,
							height,
						}}
					>
						<Img
							src='rbxasset://textures/Cursors/MouseLock/ArrowCursor.png'
							scaleType={scaleType}
							imageOpacity={opacity}
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					</Div>

					<P
						style={{ color: '#64748b', fontSize: 11 }}
						Text='Note: Actual image visibility depends on the image asset availability'
					/>
				</Div>
			</frame>
		);
	}
);

export = story;
