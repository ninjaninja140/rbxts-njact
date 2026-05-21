import React from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { Button } from '../Button';

const controls = {
	label: 'Submit',
	disabled: false,
	fontSize: Slider(16, 8, 48, 1),
	borderRadius: Slider(8, 0, 32, 1),
	variant: Choose(['primary', 'secondary', 'danger'] as const),
};

const VARIANT_STYLES = {
	primary: { backgroundColor: '#2563eb', color: '#ffffff' },
	secondary: { backgroundColor: '#334155', color: '#cbd5e1' },
	danger: { backgroundColor: '#dc2626', color: '#ffffff' },
} as const;

const story = CreateReactStory(
	{
		name: 'Button',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary: 'Interactive button element. Renders as a textbutton.',
	},
	(props: InferProps<typeof controls>) => {
		const { label, disabled, fontSize, borderRadius, variant } = props.controls;
		const variantStyle = VARIANT_STYLES[variant];

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 12)}
				/>

				{/* Active state */}
				<Button
					Text={label}
					disabled={disabled}
					style={{
						fontSize,
						borderRadius,
						color: disabled ? '#6b7280' : variantStyle.color,
						backgroundColor: disabled ? '#1f2937' : variantStyle.backgroundColor,
						padding: [10, 20],
					}}
					onClick={() => print('Button clicked')}
				/>
			</frame>
		);
	}
);

export = story;
