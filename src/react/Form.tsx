import React, { createContext, useContext, useRef } from '@rbxts/react';
import { computeStyle } from '../utils/computeStyle';
import { mapEvents } from '../utils/mapEvents';
import { omitProps } from '../utils/omitProps';
import { resolveChildren } from '../utils/resolveChildren';
import type { ContainerProps, TextProps } from '../utils/types/common';

interface FormContextValue {
	onSubmit?: (data: Map<string, string>) => void;
	onReset?: () => void;
	fields: Map<string, string>;
	setField: (name: string, value: string) => void;
}

const FormContext = createContext<FormContextValue>({
	fields: new Map(),
	setField: () => {},
});

export interface IFormProps extends ContainerProps {
	onSubmit?: (data: Map<string, string>) => void;
	onReset?: () => void;
}

export function Form(props: IFormProps) {
	const fields = useRef<Map<string, string>>(new Map()).current;

	const ctx: FormContextValue = {
		onSubmit: props.onSubmit,
		onReset: props.onReset,
		fields,
		setField: (name, value) => {
			fields.set(name, value);
		},
	};

	const robloxProps = omitProps(props, ['onSubmit', 'onReset']);
	const { Event } = mapEvents('frame', props);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', props.style);
	const { nodes } = resolveChildren(props.children);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<FormContext.Provider value={ctx}>
			<frame
				{...robloxProps}
				{...styleProps}
				AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
				BackgroundTransparency={(styleProps['BackgroundTransparency'] as number) ?? 1}
				Event={Event}
			>
				{styleChildren}
				{nodes}
			</frame>
		</FormContext.Provider>
	);
}

export interface ILabelProps extends TextProps {
	htmlFor?: string;
}

export function Label(props: ILabelProps) {
	const robloxProps = omitProps(props, ['htmlFor']);
	const { Event } = mapEvents('textlabel', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textlabel', props.style);
	const { text } = resolveChildren(props.children);

	return (
		<textlabel
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? ''}
			RichText={true}
			AutomaticSize={Enum.AutomaticSize.XY}
			TextWrap={true}
			Event={Event}
		>
			{styleChildren}
		</textlabel>
	);
}

export interface IFieldsetProps extends ContainerProps {
	legend?: string;
	disabled?: boolean;
}

export function Fieldset(props: IFieldsetProps) {
	const robloxProps = omitProps(props, ['legend', 'disabled']);
	const { Event } = mapEvents('frame', props);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', {
		borderWidth: 1,
		borderColor: '#475569',
		borderRadius: 6,
		padding: 12,
		...props.style,
	});
	const { nodes } = resolveChildren(props.children);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<frame
			{...robloxProps}
			{...styleProps}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps['BackgroundTransparency'] as number) ?? 1}
			Event={Event}
		>
			{styleChildren}
			<uilistlayout
				key='fieldset-layout'
				FillDirection={Enum.FillDirection.Vertical}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{props.legend !== undefined && (
				<textlabel
					key='fieldset-legend'
					Text={props.legend}
					BackgroundTransparency={1}
					TextColor3={new Color3(0.8, 0.8, 0.8)}
					TextSize={12}
					FontFace={Font.fromEnum(Enum.Font.SourceSansBold)}
					AutomaticSize={Enum.AutomaticSize.XY}
					LayoutOrder={0}
				/>
			)}
			{nodes}
		</frame>
	);
}

export interface ITextareaProps extends ContainerProps {
	value?: string;
	placeholder?: string;
	placeholderColor?: Color3;
	disabled?: boolean;
	maxLength?: number;
	defaultValue?: string;
	name?: string;
	onChange?: (text: string) => void;
	onCommit?: (text: string, enterPressed: boolean) => void;
}

export function Textarea(props: ITextareaProps) {
	const ctx = useContext(FormContext);

	const robloxProps = omitProps(props, [
		'value',
		'placeholder',
		'placeholderColor',
		'disabled',
		'maxLength',
		'defaultValue',
		'onChange',
		'onCommit',
	]);
	const { Event, Change } = mapEvents('textbox', {
		...props,
		onChange: (text: string) => {
			if (props.name) ctx.setField(props.name, text);
			props.onChange?.(text);
		},
	});
	const { props: styleProps, children: styleChildren } = computeStyle('textbox', props.style);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<textbox
			{...robloxProps}
			{...styleProps}
			Text={props.value ?? props.defaultValue ?? ''}
			PlaceholderText={props.placeholder}
			PlaceholderColor3={props.placeholderColor}
			TextEditable={props.disabled !== true}
			MaxVisibleGraphemes={props.maxLength ?? -1}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			TextWrap={true}
			MultiLine={true}
			Event={Event}
			Change={Change}
		>
			{styleChildren}
		</textbox>
	);
}

export function useForm() {
	return useContext(FormContext);
}

export interface ISelectProps extends ContainerProps {
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	name?: string;
}

export interface IOptionProps extends TextProps {
	value: string;
	selected?: boolean;
}

export function Select(props: ISelectProps) {
	const ctx = useContext(FormContext);
	const robloxProps = omitProps(props, ['value', 'onChange', 'disabled', 'name']);
	const { Event } = mapEvents('frame', props);
	const { props: styleProps, children: styleChildren } = computeStyle('frame', {
		backgroundColor: '#1e293b',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#334155',
		...props.style,
	});
	const { nodes } = resolveChildren(props.children);
	const hasExplicitSize = props.style?.width !== undefined || props.style?.height !== undefined;

	return (
		<frame
			{...robloxProps}
			{...styleProps}
			AutomaticSize={hasExplicitSize ? Enum.AutomaticSize.None : Enum.AutomaticSize.XY}
			BackgroundTransparency={(styleProps['BackgroundTransparency'] as number) ?? 0}
			Event={Event}
		>
			{styleChildren}
			<uilistlayout
				key='select-layout'
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{nodes}
		</frame>
	);
}

export function Option(props: IOptionProps) {
	const ctx = useContext(FormContext);
	const robloxProps = omitProps(props, ['value', 'selected']);
	const { Event } = mapEvents('textbutton', props);
	const { props: styleProps, children: styleChildren } = computeStyle('textbutton', {
		padding: [6, 12],
		backgroundColor: props.selected ? '#3b82f6' : undefined,
		color: '#f1f5f9',
		...props.style,
	});
	const { text } = resolveChildren(props.children);

	return (
		<textbutton
			{...robloxProps}
			{...styleProps}
			Text={props.Text ?? text ?? props.value}
			AutomaticSize={Enum.AutomaticSize.XY}
			AutoButtonColor={false}
			Event={Event}
		>
			{styleChildren}
		</textbutton>
	);
}
