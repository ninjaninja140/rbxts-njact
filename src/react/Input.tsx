import React, { useEffect, useRef, useState } from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import type { BaseProps } from '../utils/types/common';

export type InputType = 'text' | 'password' | 'number' | 'email' | 'search' | 'tel' | 'url';

export interface IInputProps extends BaseProps {
	value?: string;
	placeholder?: string;
	placeholderColor?: Color3;
	disabled?: boolean;
	type?: InputType;
	maxLength?: number;
	clearOnFocus?: boolean;
	defaultValue?: string;

	minWidth?: number;
	paddingX?: number;
}

export function Input(props: IInputProps) {
	const inputRef = useRef<TextBox>();
	const [autoWidth, setAutoWidth] = useState(props.minWidth ?? 80);

	const robloxProps = omitProps(props, [
		'value',
		'placeholder',
		'placeholderColor',
		'disabled',
		'type',
		'maxLength',
		'clearOnFocus',
		'defaultValue',
		'minWidth',
		'paddingX',
	]);

	const { Event, Change } = mapEvents('textbox', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textbox', props.style);

	const explicitSize = styleProps.Size as UDim2 | undefined;
	const explicitAnchorPoint = styleProps.AnchorPoint as Vector2 | undefined;

	const minWidth = props.minWidth ?? 80;
	const paddingX = props.paddingX ?? 24;

	const hasExplicitWidth = props.style?.width !== undefined;
	const hasExplicitHeight = props.style?.height !== undefined;

	const getMaxWidth = (box: TextBox) => {
		if (hasExplicitWidth && explicitSize !== undefined) {
			return explicitSize.X.Offset;
		}

		const parent = box.Parent;
		if (parent?.IsA('GuiObject')) {
			return parent.AbsoluteSize.X;
		}

		return math.huge;
	};

	const updateWidth = () => {
		const box = inputRef.current;
		if (!box) return;

		const maxWidth = math.max(getMaxWidth(box), minWidth);

		const placeholderWidth = box.PlaceholderText.size() * 6;
		const contentWidth = math.max(box.TextBounds.X, placeholderWidth);

		const nextWidth = math.clamp(contentWidth + paddingX, minWidth, maxWidth);

		setAutoWidth(nextWidth);
	};

	useEffect(() => {
		updateWidth();

		const box = inputRef.current;
		if (!box) return;

		const textBoundsConn = box.GetPropertyChangedSignal('TextBounds').Connect(updateWidth);
		const textConn = box.GetPropertyChangedSignal('Text').Connect(updateWidth);
		const placeholderConn = box.GetPropertyChangedSignal('PlaceholderText').Connect(updateWidth);

		const parent = box.Parent;
		const parentConn = parent?.IsA('GuiObject')
			? parent.GetPropertyChangedSignal('AbsoluteSize').Connect(updateWidth)
			: undefined;

		return () => {
			textBoundsConn.Disconnect();
			textConn.Disconnect();
			placeholderConn.Disconnect();
			parentConn?.Disconnect();
		};
	}, [props.value, props.defaultValue, props.placeholder, props.minWidth, props.paddingX, props.style]);

	const mergedChange = {
		...Change,
		Text: (rbx: TextBox) => {
			updateWidth();

			const changeText = (Change as unknown as { Text?: (rbx: TextBox) => void }).Text;
			changeText?.(rbx);
		},
	};

	return (
		<textbox
			ref={inputRef}
			{...robloxProps}
			{...styleProps}
			AnchorPoint={new Vector2(0, explicitAnchorPoint?.Y ?? 0)}
			Size={
				new UDim2(
					0,
					autoWidth,
					explicitSize?.Y.Scale ?? 0,
					hasExplicitHeight ? (explicitSize?.Y.Offset ?? 32) : (explicitSize?.Y.Offset ?? 32)
				)
			}
			ClipsDescendants
			Text={props.value ?? props.defaultValue ?? ''}
			PlaceholderText={props.placeholder}
			PlaceholderColor3={props.placeholderColor}
			TextEditable={props.disabled !== true}
			ClearTextOnFocus={props.clearOnFocus ?? false}
			MaxVisibleGraphemes={props.maxLength ?? -1}
			AutomaticSize={Enum.AutomaticSize.None}
			TextWrap={false}
			TextXAlignment={Enum.TextXAlignment.Left}
			Event={Event}
			Change={mergedChange}
		>
			{styleChildren}
		</textbox>
	);
}
