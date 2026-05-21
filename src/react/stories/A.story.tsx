import React from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { A } from '../A';

const controls = {
	label: 'Click me',
	disabled: false,
	fontSize: Slider(16, 8, 48, 1),
	textAlign: Choose(['left', 'center', 'right'] as const, 1),
	borderRadius: Slider(8, 0, 32, 1),
};

const story = CreateReactStory(
	{
		name: 'A',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary: 'Anchor / link element. Renders as a textbutton.',
	},
	(props: InferProps<typeof controls>) => {
		const { label, disabled, fontSize, textAlign, borderRadius } = props.controls;

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				<A
					Text={label}
					style={{
						fontSize,
						textAlign: textAlign as 'left' | 'center' | 'right',
						borderRadius,
						color: disabled ? '#888888' : '#60a5fa',
						backgroundColor: '#1e293b',
						padding: [8, 16],
					}}
					onClick={disabled ? undefined : () => print('A clicked')}
				/>
			</frame>
		);
	}
);

export = story;
