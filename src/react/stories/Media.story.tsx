import React, { useState } from '@rbxts/react';
import ReactDOM from '@rbxts/react-roblox';
import { Choose, CreateReactStory, type InferProps, Slider } from '@rbxts/ui-labs';
import { Button } from '../Button';
import { Div } from '../Div';
import { Audio, Video } from '../Media';
import { P } from '../Text';

const controls = {
	component: Choose(['Audio', 'Video'] as const, 1),
	autoPlay: false,
	loop: false,
	volume: Slider(1, 0, 1, 0.1),
	playbackSpeed: Slider(1, 0.5, 2, 0.25),
};

const story = CreateReactStory(
	{
		name: 'Media',
		react: React,
		reactRoblox: ReactDOM,
		controls,
		summary:
			'Media components for audio and video playback. Audio renders as a Sound object; Video renders as a VideoFrame. Note: Playback is controlled via autoPlay and loop props; button controls are for demonstration.',
	},
	(props: InferProps<typeof controls>) => {
		const { component, autoPlay, loop, volume, playbackSpeed } = props.controls;
		const [isPlaying, setIsPlaying] = useState(autoPlay);

		return (
			<frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={Color3.fromRGB(30, 30, 35)} BorderSizePixel={0}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 24)}
				/>

				<P style={{ color: '#94a3b8', fontSize: 12 }} Text={`Component: ${component}`} />

				{component === 'Audio' && (
					<Div style={{ display: 'column', gap: 12, autoSize: 'xy' }}>
						<Audio
							src='rbxassetid://1234567890'
							autoPlay={autoPlay}
							loop={loop}
							volume={volume}
							playbackSpeed={playbackSpeed}
							onPlay={() => {
								setIsPlaying(true);
								print('Audio playing');
							}}
							onPause={() => {
								setIsPlaying(false);
								print('Audio paused');
							}}
							onEnded={() => {
								setIsPlaying(false);
								print('Audio ended');
							}}
						/>

						<Div style={{ display: 'column', gap: 8, autoSize: 'xy' }}>
							<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Audio Player' />
							<P
								style={{ color: '#64748b', fontSize: 12 }}
								Text={`Status: ${isPlaying ? 'Playing' : 'Stopped'}`}
							/>

							<Div style={{ display: 'row', gap: 8, autoSize: 'xy' }}>
								<Button
									Text={isPlaying ? 'Pause' : 'Play'}
									style={{
										fontSize: 14,
										borderRadius: 6,
										backgroundColor: isPlaying ? '#dc2626' : '#2563eb',
										color: '#ffffff',
										padding: [8, 16],
										width: 100,
									}}
									onClick={() => print(isPlaying ? 'Pausing (demo)' : 'Playing (demo)')}
								/>
								<Button
									Text='Stop'
									style={{
										fontSize: 14,
										borderRadius: 6,
										backgroundColor: '#334155',
										color: '#cbd5e1',
										padding: [8, 16],
										width: 100,
									}}
									onClick={() => {
										setIsPlaying(false);
										print('Stopped (demo)');
									}}
								/>
							</Div>

							<P
								style={{ color: '#64748b', fontSize: 11 }}
								Text={`Volume: ${math.floor(volume * 100)}%`}
							/>
							<P style={{ color: '#64748b', fontSize: 11 }} Text={`Speed: ${tostring(playbackSpeed)}x`} />
						</Div>
					</Div>
				)}

				{component === 'Video' && (
					<Div style={{ display: 'column', gap: 12, autoSize: 'xy' }}>
						<Div
							style={{
								backgroundColor: '#000000',
								borderRadius: 8,
								width: 320,
								height: 180,
								borderWidth: 1,
								borderColor: '#334155',
							}}
						>
							<Video
								src='rbxassetid://1234567890'
								autoPlay={autoPlay}
								loop={loop}
								volume={volume}
								style={{
									width: '100%',
									height: '100%',
									borderRadius: 8,
								}}
								onPlay={() => {
									setIsPlaying(true);
									print('Video playing');
								}}
								onEnded={() => {
									setIsPlaying(false);
									print('Video ended');
								}}
							/>
						</Div>

						<Div style={{ display: 'column', gap: 8, autoSize: 'xy' }}>
							<P style={{ color: '#f1f5f9', fontSize: 14 }} Text='Video Player' />
							<P
								style={{ color: '#64748b', fontSize: 12 }}
								Text={`Status: ${isPlaying ? 'Playing' : 'Stopped'}`}
							/>

							<Div style={{ display: 'row', gap: 8, autoSize: 'xy' }}>
								<Button
									Text={isPlaying ? 'Pause' : 'Play'}
									style={{
										fontSize: 14,
										borderRadius: 6,
										backgroundColor: isPlaying ? '#dc2626' : '#2563eb',
										color: '#ffffff',
										padding: [8, 16],
										width: 100,
									}}
									onClick={() => print(isPlaying ? 'Pausing (demo)' : 'Playing (demo)')}
								/>
								<Button
									Text='Stop'
									style={{
										fontSize: 14,
										borderRadius: 6,
										backgroundColor: '#334155',
										color: '#cbd5e1',
										padding: [8, 16],
										width: 100,
									}}
									onClick={() => {
										setIsPlaying(false);
										print('Stopped (demo)');
									}}
								/>
							</Div>

							<P
								style={{ color: '#64748b', fontSize: 11 }}
								Text={`Volume: ${math.floor(volume * 100)}%`}
							/>
						</Div>
					</Div>
				)}
			</frame>
		);
	}
);

export = story;
