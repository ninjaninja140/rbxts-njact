import React from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps } from '@rbxts/ui-labs';
import { Div } from '../Div';
import { Address, Br, Details, Figcaption, Figure, Hr, ScrollDiv } from '../Misc';
import { P } from '../Text';

const controls = {
	component: Choose(['Hr', 'Br', 'ScrollDiv', 'Details', 'Figure', 'Address'] as const, 1),
};

const story = CreateReactStory(
	{
		name: 'Misc',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary:
			'Miscellaneous utility components including Hr, Br, ScrollDiv, Details, Figure, Figcaption, and Address.',
	},
	(props: InferProps<typeof controls>) => {
		const { component } = props.controls;

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Padding={new UDim(0, 24)}
				/>

				<P style={{ color: '#94a3b8', fontSize: 12 }} Text={`Component: ${component}`} />

				{component === 'Hr' && (
					<Div
						style={{
							backgroundColor: '#1e293b',
							borderRadius: 8,
							padding: 16,
							width: 320,
							autoSize: 'y',
							display: 'column',
							gap: 8,
						}}
					>
						<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Text before horizontal rule' />
						<Hr style={{ borderColor: '#60a5fa' }} />
						<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Text after horizontal rule' />
					</Div>
				)}

				{component === 'Br' && (
					<Div
						style={{
							backgroundColor: '#1e293b',
							borderRadius: 8,
							padding: 16,
							width: 320,
							autoSize: 'xy',
							display: 'column',
						}}
					>
						<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Line 1' />
						<Br />
						<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Line 2 (with break above)' />
						<Br />
						<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Line 3 (with break above)' />
					</Div>
				)}

				{component === 'ScrollDiv' && (
					<Div
						style={{
							backgroundColor: '#1e293b',
							borderRadius: 8,
							width: 320,
							height: 200,
							borderWidth: 1,
							borderColor: '#334155',
						}}
					>
						<ScrollDiv
							style={{
								width: '100%',
								height: '100%',
								padding: 12,
								display: 'column',
								gap: 8,
							}}
							scrollingDirection='y'
							scrollBarThickness={6}
						>
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
								<P
									key={`scroll-item-${i}`}
									style={{
										color: '#f1f5f9',
										fontSize: 14,
										backgroundColor: '#0f172a',
										padding: 8,
										borderRadius: 4,
									}}
									Text={`Scrollable item ${i}`}
								/>
							))}
						</ScrollDiv>
					</Div>
				)}

				{component === 'Details' && (
					<Div
						style={{
							backgroundColor: '#1e293b',
							borderRadius: 8,
							padding: 16,
							width: 320,
							autoSize: 'y',
						}}
					>
						<Details open={false} summary='Click to expand details'>
							<P
								style={{ color: '#f1f5f9', fontSize: 14 }}
								Text='This is the hidden content that appears when the details element is expanded.'
							/>
							<P style={{ color: '#cbd5e1', fontSize: 12 }} Text='Additional details can go here.' />
						</Details>
					</Div>
				)}

				{component === 'Figure' && (
					<Figure
						style={{
							backgroundColor: '#1e293b',
							borderRadius: 8,
							padding: 12,
							width: 320,
							autoSize: 'xy',
						}}
					>
						{/* Placeholder for image */}
						<Div
							style={{
								backgroundColor: '#0f172a',
								borderRadius: 4,
								width: 300,
								height: 150,
								borderWidth: 1,
								borderColor: '#334155',
								display: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<P style={{ color: '#64748b', fontSize: 14 }} Text='[Image would go here]' />
						</Div>
						<Figcaption Text='Example figure caption describing the image above' />
					</Figure>
				)}

				{component === 'Address' && (
					<Address
						style={{
							backgroundColor: '#1e293b',
							borderRadius: 8,
							padding: 16,
							width: 320,
							autoSize: 'xy',
							display: 'column',
							gap: 4,
						}}
					>
						<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Contact Information' />
						<P style={{ color: '#cbd5e1', fontSize: 12 }} Text='123 Main Street' />
						<P style={{ color: '#cbd5e1', fontSize: 12 }} Text='Anytown, ST 12345' />
						<P style={{ color: '#cbd5e1', fontSize: 12 }} Text='Email: info@example.com' />
					</Address>
				)}
			</frame>
		);
	}
);

export = story;
