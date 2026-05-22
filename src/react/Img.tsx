import React from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import type { BaseProps } from '../utils/types/common';

export type ImgScaleType = 'stretch' | 'slice' | 'tile' | 'fit' | 'crop';

export interface IImgProps extends BaseProps {
	src?: string;
	alt?: string;
	scaleType?: ImgScaleType;
	imageColor?: Color3;
	imageOpacity?: number;
	sliceCenter?: Rect;
	sliceScale?: number;
}

const SCALE_TYPE_MAP: Record<ImgScaleType, Enum.ScaleType> = {
	stretch: Enum.ScaleType.Stretch,
	slice: Enum.ScaleType.Slice,
	tile: Enum.ScaleType.Tile,
	fit: Enum.ScaleType.Fit,
	crop: Enum.ScaleType.Crop,
};

export function Img(props: IImgProps) {
	const robloxProps = omitProps(props, [
		'src',
		'alt',
		'scaleType',
		'imageColor',
		'imageOpacity',
		'sliceCenter',
		'sliceScale',
	]);
	const { Event } = mapEvents('imagelabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('imagelabel', props.style);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<imagelabel
			{...robloxProps}
			{...styleProps}
			Image={props.src ?? ''}
			ImageColor3={props.imageColor}
			ImageTransparency={props.imageOpacity ?? 0}
			ScaleType={SCALE_TYPE_MAP[props.scaleType ?? 'stretch']}
			SliceCenter={props.sliceCenter}
			SliceScale={props.sliceScale}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps.BackgroundTransparency as number) ?? 1}
			Event={Event}
		>
			{styleChildren}
		</imagelabel>
	);
}
