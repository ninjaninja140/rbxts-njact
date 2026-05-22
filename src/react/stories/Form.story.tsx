import React, { useState } from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { Div } from '../Div';
import { Form, Label, Fieldset, Textarea, Select, Option } from '../Form';
import { Input } from '../Input';
import { P } from '../Text';
import { Button } from '../Button';

const controls = {
	component: Choose(['Form + Input', 'Label', 'Fieldset', 'Textarea', 'Select + Option'] as const, 0),
	fontSize: Slider(14, 8, 32, 1),
	borderRadius: Slider(6, 0, 24, 1),
};

const story = CreateReactStory(
	{
		name: 'Form',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary: 'Form elements including Form container, Label, Fieldset, Textarea, Select, and Option components.',
	},
	(props: InferProps<typeof controls>) => {
		const { component, fontSize, borderRadius } = props.controls;
		const [formData, setFormData] = useState<Map<string, string>>(new Map());

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Padding={new UDim(0, 24)}
				/>

				<P style={{ color: '#64748b', fontSize: 12 }} Text={`Component: ${component}`} />

				{component === 'Form + Input' && (
					<Form
						style={{
							gap: 12,
							display: 'column',
							autoSize: 'xy',
						}}
						onSubmit={(data) => {
							setFormData(data);
							print('Form submitted:', data);
						}}
					>
						<Label htmlFor='username' style={{ color: '#f1f5f9', fontSize }} Text='Username' />
						<Input
							name='username'
							placeholder='Enter username'
							style={{
								fontSize,
								borderRadius,
								backgroundColor: '#1e293b',
								color: '#f1f5f9',
								padding: [8, 12],
								width: 280,
							}}
						/>

						<Label htmlFor='email' style={{ color: '#f1f5f9', fontSize }} Text='Email' />
						<Input
							name='email'
							placeholder='Enter email'
							style={{
								fontSize,
								borderRadius,
								backgroundColor: '#1e293b',
								color: '#f1f5f9',
								padding: [8, 12],
								width: 280,
							}}
						/>

						<Button
							Text='Submit'
							style={{
								fontSize,
								borderRadius,
								backgroundColor: '#2563eb',
								color: '#ffffff',
								padding: [10, 20],
								width: 280,
							}}
							onClick={() => print('Submit clicked')}
						/>
					</Form>
				)}

				{component === 'Label' && (
					<Div style={{ display: 'column', gap: 12, autoSize: 'xy' }}>
						<Label htmlFor='test' style={{ color: '#f1f5f9', fontSize }} Text='This is a Label Component' />
						<Label htmlFor='test2' style={{ color: '#60a5fa', fontSize, fontWeight: 'bold' }} Text='Bold Label' />
					</Div>
				)}

				{component === 'Fieldset' && (
					<Fieldset
						legend='Personal Information'
						style={{
							padding: 16,
							gap: 12,
							display: 'column',
							autoSize: 'xy',
						}}
					>
						<Label htmlFor='name' style={{ color: '#f1f5f9', fontSize }} Text='Name' />
						<Input
							placeholder='Enter your name'
							style={{
								fontSize,
								borderRadius,
								backgroundColor: '#1e293b',
								color: '#f1f5f9',
								padding: [8, 12],
								width: 280,
							}}
						/>
					</Fieldset>
				)}

				{component === 'Textarea' && (
					<Div style={{ display: 'column', gap: 8, autoSize: 'xy' }}>
						<P style={{ color: '#f1f5f9', fontSize }} Text='Textarea' />
						<Textarea
							placeholder='Enter your message here...'
							maxLength={200}
							style={{
								fontSize: fontSize - 2,
								borderRadius,
								backgroundColor: '#1e293b',
								color: '#f1f5f9',
								padding: 12,
								width: 320,
								height: 150,
							}}
							onChange={(text) => print(`Textarea changed: ${text}`)}
						/>
					</Div>
				)}

				{component === 'Select + Option' && (
					<Div style={{ display: 'column', gap: 12, autoSize: 'xy' }}>
						<P style={{ color: '#f1f5f9', fontSize }} Text='Select' />
						<Select
							style={{
								backgroundColor: '#1e293b',
								color: '#f1f5f9',
								padding: 12,
								width: 280,
								gap: 0,
							}}
							onChange={(value) => print(`Selected: ${value}`)}
						>
							<Option value='option1' selected={true} Text='Option 1' />
							<Option value='option2' Text='Option 2' />
							<Option value='option3' Text='Option 3' />
						</Select>
					</Div>
				)}
			</frame>
		);
	}
);

export = story;
