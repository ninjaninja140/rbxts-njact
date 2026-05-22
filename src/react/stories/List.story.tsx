import React from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { Div } from '../Div';
import { Dd, Dl, Dt, Li, Ol, Ul } from '../List';
import { P } from '../Text';

const controls = {
	component: Choose(['Ul', 'Ol', 'Dl'] as const, 1),
	fontSize: Slider(14, 10, 24, 1),
	gap: Slider(4, 0, 16, 1),
};

const story = CreateReactStory(
	{
		name: 'List',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary:
			'List components including Ul (unordered), Ol (ordered), and Dl (definition lists) with Li, Dt, and Dd elements.',
	},
	(props: InferProps<typeof controls>) => {
		const { component, fontSize, gap } = props.controls;

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Padding={new UDim(0, 24)}
				/>

				<P style={{ color: '#94a3b8', fontSize: 12 }} Text={`Component: ${component}`} />

				<Div
					style={{
						backgroundColor: '#1e293b',
						borderRadius: 8,
						padding: 16,
						autoSize: 'xy',
					}}
				>
					{component === 'Ul' && (
						<Ul gap={gap} style={{ color: '#f1f5f9', fontSize }}>
							<Li Text='First item in the list' />
							<Li Text='Second item with bold text' />
							<Li bullet='✓' Text='Custom bullet point' />
							<Li Text='Fourth item' />
							<Li bullet='→' Text='Another custom bullet' />
						</Ul>
					)}

					{component === 'Ol' && (
						<Ol gap={gap} style={{ color: '#f1f5f9', fontSize }}>
							<Li bullet='1.' Text='First ordered item' />
							<Li bullet='2.' Text='Second ordered item' />
							<Li bullet='3.' Text='Third ordered item' />
							<Li bullet='4.' Text='Fourth ordered item' />
							<Li bullet='5.' Text='Fifth ordered item' />
						</Ol>
					)}

					{component === 'Dl' && (
						<Dl gap={gap}>
							<Dt style={{ color: '#60a5fa', fontSize }} Text='HTML' />
							<Dd style={{ color: '#f1f5f9', fontSize }} Text='HyperText Markup Language' />

							<Dt style={{ color: '#60a5fa', fontSize }} Text='CSS' />
							<Dd style={{ color: '#f1f5f9', fontSize }} Text='Cascading Style Sheets' />

							<Dt style={{ color: '#60a5fa', fontSize }} Text='JavaScript' />
							<Dd
								style={{ color: '#f1f5f9', fontSize }}
								Text='A programming language commonly used for web development'
							/>
						</Dl>
					)}
				</Div>

				<P style={{ color: '#64748b', fontSize: 11 }} Text={`Gap: ${gap}px`} />
			</frame>
		);
	}
);

export = story;
