import React, { useState } from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { Div } from '../Div';
import { Input } from '../Input';
import { P } from '../Text';

const controls = {
	placeholder: 'Type something...',
	disabled: false,
	clearOnFocus: false,
	fontSize: Slider(16, 8, 32, 1),
	borderRadius: Slider(6, 0, 24, 1),
	mode: Choose(['controlled', 'uncontrolled'] as const, 1),
};

function ControlledInput(props: {
	placeholder: string;
	disabled: boolean;
	clearOnFocus: boolean;
	fontSize: number;
	borderRadius: number;
}) {
	const [value, setValue] = useState('');

	return (
		<Div style={{ display: 'column', gap: 8, autoSize: 'xy' }}>
			<Input
				value={value}
				placeholder={props.placeholder}
				disabled={props.disabled}
				clearOnFocus={props.clearOnFocus}
				style={{
					fontSize: props.fontSize,
					borderRadius: props.borderRadius,
					backgroundColor: '#1e293b',
					color: '#f1f5f9',
					padding: [8, 12],
					width: 280,
				}}
				onChange={(text) => setValue(text)}
				onCommit={(text, enter) => print(`Committed: "${text}" (enter=${tostring(enter)})`)}
			/>
			<P
				style={{ color: '#64748b', fontSize: 12 }}
				Text={`Value: "${value}" (${tostring(value.size())} chars)`}
			/>
		</Div>
	);
}

function UncontrolledInput(props: {
	placeholder: string;
	disabled: boolean;
	clearOnFocus: boolean;
	fontSize: number;
	borderRadius: number;
}) {
	return (
		<Input
			placeholder={props.placeholder}
			disabled={props.disabled}
			clearOnFocus={props.clearOnFocus}
			style={{
				fontSize: props.fontSize,
				borderRadius: props.borderRadius,
				backgroundColor: '#1e293b',
				color: '#f1f5f9',
				padding: [8, 12],
				width: 280,
			}}
			onCommit={(text, enter) => print(`Committed: "${text}" (enter=${tostring(enter)})`)}
		/>
	);
}

const story = CreateReactStory(
	{
		name: 'Input',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary:
			'Text input element. Renders as a textbox. onChange fires per keystroke; onCommit fires on Enter/blur.',
	},
	(props: InferProps<typeof controls>) => {
		const { placeholder, disabled, clearOnFocus, fontSize, borderRadius, mode } = props.controls;

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 16)}
				/>

				<P style={{ color: '#94a3b8', fontSize: 12 }} Text={`Mode: ${mode}`} />

				{mode === 'controlled' ? (
					<ControlledInput
						placeholder={placeholder}
						disabled={disabled}
						clearOnFocus={clearOnFocus}
						fontSize={fontSize}
						borderRadius={borderRadius}
					/>
				) : (
					<UncontrolledInput
						placeholder={placeholder}
						disabled={disabled}
						clearOnFocus={clearOnFocus}
						fontSize={fontSize}
						borderRadius={borderRadius}
					/>
				)}
			</frame>
		);
	}
);

export = story;
