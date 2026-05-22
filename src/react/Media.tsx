import React, { useEffect, useRef } from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import type { BaseProps } from '../utils/types/common';

export interface IAudioProps extends BaseProps {
	src?: string;
	autoPlay?: boolean;
	loop?: boolean;
	volume?: number;
	playbackSpeed?: number;
	onPlay?: () => void;
	onPause?: () => void;
	onEnded?: () => void;
}

export function Audio(props: IAudioProps) {
	const soundRef = useRef<Sound>();

	useEffect(() => {
		const sound = soundRef.current;
		if (!sound) return;
		sound.SoundId = props.src ?? '';
		sound.Volume = props.volume ?? 1;
		sound.PlaybackSpeed = props.playbackSpeed ?? 1;
		sound.Looped = props.loop ?? false;

		if (props.autoPlay) {
			sound.Play();
		}

		const playConn = sound.Played.Connect(() => props.onPlay?.());
		const pauseConn = sound.Paused.Connect(() => props.onPause?.());
		const endedConn = sound.Ended.Connect(() => props.onEnded?.());

		return () => {
			playConn.Disconnect();
			pauseConn.Disconnect();
			endedConn.Disconnect();
			sound.Stop();
		};
	}, [props.src, props.autoPlay, props.loop, props.volume, props.playbackSpeed]);

	return (
		<sound
			ref={soundRef}
			SoundId={props.src ?? ''}
			Volume={props.volume ?? 1}
			PlaybackSpeed={props.playbackSpeed ?? 1}
			Looped={props.loop ?? false}
		/>
	);
}

export interface IVideoProps extends BaseProps {
	src?: string;
	autoPlay?: boolean;
	loop?: boolean;
	volume?: number;
	onPlay?: () => void;
	onPause?: () => void;
	onEnded?: () => void;
}

export function Video(props: IVideoProps) {
	const robloxProps = omitProps(props, ['src', 'autoPlay', 'loop', 'volume', 'onPlay', 'onPause', 'onEnded']);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', props.style);
	const { Event } = mapEvents('frame', props);
	const videoRef = useRef<VideoFrame>();
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		video.Video = props.src ?? '';
		video.Volume = props.volume ?? 1;
		video.Looped = props.loop ?? false;

		if (props.autoPlay) {
			video.Play();
		}

		const playConn = video.DidLoop.Connect(() => props.onPlay?.());
		const endedConn = video.Ended.Connect(() => props.onEnded?.());

		return () => {
			playConn.Disconnect();
			endedConn.Disconnect();
			video.Pause();
		};
	}, [props.src, props.autoPlay, props.loop, props.volume]);

	return (
		<videoframe
			ref={videoRef}
			{...robloxProps}
			{...styleProps}
			Video={props.src ?? ''}
			Volume={props.volume ?? 1}
			Looped={props.loop ?? false}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps.BackgroundTransparency as number) ?? 1}
			Event={Event}
		>
			{styleChildren}
		</videoframe>
	);
}
