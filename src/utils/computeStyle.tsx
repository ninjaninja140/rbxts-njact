import React from '@rbxts/react';
import strings from '@rbxts/string-utils';
import { computeColor, parseHex } from './computeColor';
import type { RobloxElementType } from './types/events';
import type { BorderRadius, ColorValue, PaddingShorthand, Style } from './types/style';

/**
 * The result of computeStyle().
 *
 * `props`    — spread directly onto the Roblox element.
 * `children` — React elements for UI objects that must be children
 *              (UICorner, UIPadding, UIListLayout, etc.).
 *              Render these inside the element's JSX.
 */
export interface ComputedStyle {
	props: Record<string, unknown>;
	children: React.Element[];
}

/** Properties that only exist on text-bearing elements. */
const TEXT_ELEMENTS = new Set<RobloxElementType>(['textbutton', 'imagebutton', 'textlabel', 'textbox']);

/** Properties that only exist on button elements. */
const BUTTON_ELEMENTS = new Set<RobloxElementType>(['textbutton', 'imagebutton']);

/** Properties that only exist on image-bearing elements. */
const IMAGE_ELEMENTS = new Set<RobloxElementType>(['imagelabel', 'imagebutton']);

/** Properties that support ClipsDescendants (frame-like containers). */
const CLIP_ELEMENTS = new Set<RobloxElementType>(['frame', 'scrollingframe', 'viewportframe']);

function isText(el: RobloxElementType) {
	return TEXT_ELEMENTS.has(el);
}
function isButton(el: RobloxElementType) {
	return BUTTON_ELEMENTS.has(el);
}
function isImage(el: RobloxElementType) {
	return IMAGE_ELEMENTS.has(el);
}
function canClip(el: RobloxElementType) {
	return CLIP_ELEMENTS.has(el);
}

/**
 * Parses a ColorValue (Color3 or hex string) to Color3.
 * Accepts "#rrggbb", "rrggbb" (with or without hash).
 */
function parseColor(value: ColorValue): Color3 {
	if (typeIs(value, 'Color3')) return value;
	if (strings.startsWith(value, '#')) return parseHex(value);
	return computeColor(value);
}

/**
 * Parses a width/height value to UDim.
 *
 * UDim2 → taken as-is (returned directly, skip UDim conversion).
 * UDim  → used as-is.
 * number → UDim(0, value) (pixels).
 * "N%"  → UDim(N/100, 0) (scale).
 */
function parseUDim(value: UDim2 | UDim | number | string): UDim {
	if (typeIs(value, 'UDim')) return value;
	if (typeIs(value, 'number')) return new UDim(0, value);

	const str = value as string;
	if (str.sub(-1) === '%') {
		const pct = tonumber(str.sub(1, -2)) ?? 0;
		return new UDim(pct / 100, 0);
	}

	// Fallback: treat as pixel value
	return new UDim(0, tonumber(str) ?? 0);
}

/**
 * Builds a UDim2 from separate width/height values.
 * If the value is already a UDim2, returns it directly.
 */
function buildSize(width?: UDim2 | UDim | number | string, height?: UDim2 | UDim | number | string): UDim2 | undefined {
	if (width === undefined && height === undefined) return undefined;
	if (typeIs(width, 'UDim2')) return width;
	if (typeIs(height, 'UDim2')) return height;

	const x = width !== undefined ? parseUDim(width) : new UDim(0, 0);
	const y = height !== undefined ? parseUDim(height) : new UDim(0, 0);
	return new UDim2(x.Scale, x.Offset, y.Scale, y.Offset);
}

function parseAutoSize(value: Style['autoSize']): Enum.AutomaticSize {
	switch (value) {
		case 'x':
			return Enum.AutomaticSize.X;
		case 'y':
			return Enum.AutomaticSize.Y;
		case 'xy':
			return Enum.AutomaticSize.XY;
		case 'none':
			return Enum.AutomaticSize.None;
		default:
			return Enum.AutomaticSize.None;
	}
}

interface PaddingSides {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

function parsePadding(style: Style): PaddingSides | undefined {
	// Explicit per-side values override the shorthand
	const hasExplicit =
		style.paddingTop !== undefined ||
		style.paddingRight !== undefined ||
		style.paddingBottom !== undefined ||
		style.paddingLeft !== undefined;

	if (hasExplicit)
		return {
			top: style.paddingTop ?? 0,
			right: style.paddingRight ?? 0,
			bottom: style.paddingBottom ?? 0,
			left: style.paddingLeft ?? 0,
		};

	if (style.padding === undefined) return undefined;

	const p = style.padding as PaddingShorthand;

	if (typeIs(p, 'number')) return { top: p, right: p, bottom: p, left: p };

	if (p.size() === 2) {
		const [v, h] = p as [number, number];
		return { top: v, right: h, bottom: v, left: h };
	}

	if (p.size() === 3) {
		const [top, h, bottom] = p as [number, number, number];
		return { top, right: h, bottom, left: h };
	}

	const [top, right, bottom, left] = p as [number, number, number, number];
	return { top, right, bottom, left };
}

function parseCornerRadius(value: BorderRadius): UDim {
	if (typeIs(value, 'number')) return new UDim(0, value);

	const str = value as string;
	if (str.sub(-1) === '%') {
		const pct = tonumber(str.sub(1, -2)) ?? 0;
		return new UDim(pct / 100, 0);
	}

	return new UDim(0, tonumber(str) ?? 0);
}

function parseFontWeight(weight: Style['fontWeight']): Enum.FontWeight {
	switch (weight) {
		case 'thin':
			return Enum.FontWeight.Thin;
		case 'extralight':
			return Enum.FontWeight.ExtraLight;
		case 'light':
			return Enum.FontWeight.Light;
		case 'medium':
			return Enum.FontWeight.Medium;
		case 'semibold':
			return Enum.FontWeight.SemiBold;
		case 'bold':
			return Enum.FontWeight.Bold;
		case 'extrabold':
			return Enum.FontWeight.ExtraBold;
		case 'heavy':
			return Enum.FontWeight.Heavy;
		default:
			return Enum.FontWeight.Regular;
	}
}

function parseFontStyle(style: Style['fontStyle']): Enum.FontStyle {
	return style === 'italic' ? Enum.FontStyle.Italic : Enum.FontStyle.Normal;
}

/**
 * Resolves fontFamily + fontWeight + fontStyle to a FontFace.
 * If fontFamily is already a Font object, returns it unchanged.
 * If fontFamily is a string, interprets it as:
 *   - A Roblox font family name ("GothamSSm", "SourceSansPro", etc.)
 *   - An rbxasset:// or rbxgameasset:// URI
 */
function buildFontFace(style: Style): Font | undefined {
	const { fontFamily, fontWeight, fontStyle } = style;

	if (fontFamily === undefined && fontWeight === undefined && fontStyle === undefined) return undefined;
	if (typeIs(fontFamily, 'Font')) return fontFamily;

	const weight = parseFontWeight(fontWeight);
	const fStyle = parseFontStyle(fontStyle);

	if (fontFamily === undefined)
		// Only weight/style changed — use default family
		return new Font('rbxasset://fonts/families/SourceSansPro.json', weight, fStyle);

	const family = fontFamily;
	const font = strings.startsWith(family, 'rbx') // Check if it looks like a URI
		? new Font(family, weight, fStyle)
		: Font.fromName(fontFamily, weight, fStyle);

	return font;
}

function parseTextAlign(align: Style['textAlign']): Enum.TextXAlignment {
	switch (align) {
		case 'left':
			return Enum.TextXAlignment.Left;
		case 'center':
			return Enum.TextXAlignment.Center;
		case 'right':
			return Enum.TextXAlignment.Right;
		default:
			return Enum.TextXAlignment.Left;
	}
}

function parseVerticalAlign(align: Style['verticalAlign']): Enum.TextYAlignment {
	switch (align) {
		case 'top':
			return Enum.TextYAlignment.Top;
		case 'bottom':
			return Enum.TextYAlignment.Bottom;
		default:
			return Enum.TextYAlignment.Center;
	}
}

function parseBorderMode(mode: Style['borderMode']): Enum.BorderMode {
	switch (mode) {
		case 'inset':
			return Enum.BorderMode.Inset;
		case 'middle':
			return Enum.BorderMode.Middle;
		default:
			return Enum.BorderMode.Outline;
	}
}

function parseJustify(
	justify: Style['justifyContent'],
	isHorizontal: boolean
): Enum.HorizontalAlignment | Enum.VerticalAlignment {
	if (isHorizontal) {
		switch (justify) {
			case 'center':
				return Enum.HorizontalAlignment.Center;
			case 'end':
				return Enum.HorizontalAlignment.Right;
			default:
				return Enum.HorizontalAlignment.Left;
		}
	} else {
		switch (justify) {
			case 'center':
				return Enum.VerticalAlignment.Center;
			case 'end':
				return Enum.VerticalAlignment.Bottom;
			default:
				return Enum.VerticalAlignment.Top;
		}
	}
}

function parseAlign(
	align: Style['alignItems'],
	isHorizontal: boolean
): Enum.HorizontalAlignment | Enum.VerticalAlignment {
	if (isHorizontal)
		switch (align) {
			case 'center':
				return Enum.VerticalAlignment.Center;
			case 'end':
				return Enum.VerticalAlignment.Bottom;
			default:
				return Enum.VerticalAlignment.Top;
		}
	else
		switch (align) {
			case 'center':
				return Enum.HorizontalAlignment.Center;
			case 'end':
				return Enum.HorizontalAlignment.Right;
			default:
				return Enum.HorizontalAlignment.Left;
		}
}

function parseSortOrder(sort: Style['sortOrder']): Enum.SortOrder {
	switch (sort) {
		case 'name':
			return Enum.SortOrder.Name;
		case 'custom':
			return Enum.SortOrder.Custom;
		default:
			return Enum.SortOrder.LayoutOrder;
	}
}

/**
 * computeStyle — maps a Style object to Roblox instance props and child
 * UI elements, filtered by the target Roblox element type.
 *
 * Returns:
 *   `props`    — spread onto the Roblox element with `{...styleProps}`.
 *   `children` — render inside the element (UICorner, UIPadding, UIListLayout).
 *
 * Properties not applicable to the given element type are silently dropped,
 * matching CSS behaviour where inapplicable declarations are ignored.
 *
 * @example
 * ```tsx
 * const { props: styleProps, children: styleChildren } = computeStyle("textbutton", props.style);
 *
 * return (
 *     <textbutton {...robloxProps} {...styleProps}>
 *         {styleChildren}
 *         {props.children}
 *     </textbutton>
 * );
 * ```
 */
export function computeStyle(element: RobloxElementType, style?: Style): ComputedStyle {
	if (style === undefined) return { props: {}, children: [] };

	const props: Record<string, unknown> = {};
	const children: React.Element[] = [];

	//  Background
	if (style.backgroundColor !== undefined) props.BackgroundColor3 = parseColor(style.backgroundColor);
	if (style.backgroundOpacity !== undefined) props.BackgroundTransparency = style.backgroundOpacity;
	if (style.opacity !== undefined)
		if (props.BackgroundTransparency === undefined)
			// opacity affects the overall element; map to BackgroundTransparency
			// (components that also set backgroundOpacity explicitly take precedence)
			props.BackgroundTransparency = style.opacity;

	//  Text (text-bearing elements only)
	if (isText(element)) {
		if (style.color !== undefined) props.TextColor3 = parseColor(style.color);
		if (style.textOpacity !== undefined) props.TextTransparency = style.textOpacity;
		if (style.fontSize !== undefined) props.TextSize = style.fontSize;
		if (style.textAlign !== undefined) props.TextXAlignment = parseTextAlign(style.textAlign);
		if (style.verticalAlign !== undefined) props.TextYAlignment = parseVerticalAlign(style.verticalAlign);
		if (style.textWrap !== undefined) props.TextWrapped = style.textWrap;
		if (style.textOverflow !== undefined)
			props.TextTruncate = style.textOverflow === 'ellipsis' ? Enum.TextTruncate.AtEnd : Enum.TextTruncate.None;
		if (style.textStrokeColor !== undefined) props.TextStrokeColor3 = parseColor(style.textStrokeColor);
		if (style.textStrokeOpacity !== undefined) props.TextStrokeTransparency = style.textStrokeOpacity;

		// Font (weight + style + family → FontFace)
		const fontFace = buildFontFace(style);
		if (fontFace !== undefined) props.FontFace = fontFace;
	}

	if (isButton(element)) props.AutoButtonColor = false; // disable by default so props controls styling
	if (isImage(element)) if (style.backgroundOpacity !== undefined) props.ImageTransparency = style.backgroundOpacity;

	//  Sizing
	const size = buildSize(style.width, style.height);
	if (size !== undefined) props.Size = size;
	if (style.autoSize !== undefined) props.AutomaticSize = parseAutoSize(style.autoSize);

	//  Visibility / Z-index
	if (style.visible !== undefined) props.Visible = style.visible;
	if (style.zIndex !== undefined) props.ZIndex = style.zIndex;

	//  Border
	if (style.borderWidth !== undefined) props.BorderSizePixel = style.borderWidth;
	if (style.borderColor !== undefined) props.BorderColor3 = parseColor(style.borderColor);
	if (style.borderMode !== undefined) props.BorderMode = parseBorderMode(style.borderMode);

	//  Overflow / clipping (frame-like elements)
	if (canClip(element) && style.overflow !== undefined) props.ClipsDescendants = style.overflow === 'hidden';

	//  UICorner (borderRadius)
	if (style.borderRadius !== undefined) {
		const cornerRadius = parseCornerRadius(style.borderRadius);
		children.push(<uicorner key='-corner' CornerRadius={cornerRadius} />);
	}

	//  UIPadding (padding)
	const padding = parsePadding(style);
	if (padding !== undefined)
		children.push(
			<uipadding
				key='-padding'
				PaddingTop={new UDim(0, padding.top)}
				PaddingRight={new UDim(0, padding.right)}
				PaddingBottom={new UDim(0, padding.bottom)}
				PaddingLeft={new UDim(0, padding.left)}
			/>
		);

	// UIListLayout (display: row | column)
	if (style.display !== undefined) {
		const isHorizontal = style.display === 'row';

		const fillDirection = isHorizontal ? Enum.FillDirection.Horizontal : Enum.FillDirection.Vertical;

		const horizontalAlign = isHorizontal
			? (parseJustify(style.justifyContent, true) as Enum.HorizontalAlignment)
			: (parseAlign(style.alignItems, false) as Enum.HorizontalAlignment);

		const verticalAlign = isHorizontal
			? (parseAlign(style.alignItems, true) as Enum.VerticalAlignment)
			: (parseJustify(style.justifyContent, false) as Enum.VerticalAlignment);

		children.push(
			<uilistlayout
				key='-list'
				FillDirection={fillDirection}
				HorizontalAlignment={horizontalAlign}
				VerticalAlignment={verticalAlign}
				Padding={style.gap !== undefined ? new UDim(0, style.gap) : new UDim(0, 0)}
				SortOrder={parseSortOrder(style.sortOrder)}
			/>
		);
	}

	return { props, children };
}
