/**
 * Style — CSS-like style interface for  components.
 *
 * Property names mirror web CSS where possible. computeStyle() maps these
 * to the appropriate Roblox instance properties and child UI objects.
 *
 * Not every property applies to every element — computeStyle() filters
 * based on the target element type passed to it.
 */

import type { ColorKey, HexKey } from './common';

/**
 * A Color3 value, or a hex string like "#ff0000" / "ff0000".
 * computeStyle() accepts either form and normalises to Color3.
 */
export type ColorValue = Color3 | ColorKey | HexKey;

/**
 * Mirrors CSS font-weight keywords. Maps to Enum.FontWeight.
 */
export type FontWeight =
	| 'thin' // 100
	| 'extralight' // 200
	| 'light' // 300
	| 'regular' // 400  (default)
	| 'medium' // 500
	| 'semibold' // 600
	| 'bold' // 700
	| 'extrabold' // 800
	| 'heavy'; // 900

/**
 * Mirrors CSS font-style. Maps to Enum.FontStyle.
 */
export type FontStyle = 'normal' | 'italic';

/**
 * CSS text-align values supported by Roblox (TextXAlignment).
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * CSS vertical-align equivalent (TextYAlignment).
 */
export type VerticalAlign = 'top' | 'center' | 'bottom';

/**
 * CSS text-overflow equivalent.
 * "clip"    → no truncation, Roblox default
 * "ellipsis" → TextTruncate.AtEnd
 */
export type TextOverflow = 'clip' | 'ellipsis';

/**
 * Mirrors CSS overflow. Maps to ClipsDescendants on frames.
 */
export type Overflow = 'visible' | 'hidden';

/**
 * Mirrors CSS border-radius. Maps to a UICorner child element.
 * Number = pixels (UDim offset). string "50%" = UDim scale 0.5.
 */
export type BorderRadius = number | string;

/**
 * Padding shorthand — mirrors CSS padding.
 * number          → all sides equal (pixels)
 * [v, h]          → vertical / horizontal
 * [top, h, bottom]
 * [top, right, bottom, left]
 */
export type PaddingShorthand = number | [number, number] | [number, number, number] | [number, number, number, number];

export interface Style {
	/** Foreground / text colour. → TextColor3 on text elements. */
	color?: ColorValue;

	/** Background colour. → BackgroundColor3. */
	backgroundColor?: ColorValue;

	/** Background transparency (0 = opaque, 1 = fully transparent). → BackgroundTransparency. */
	backgroundOpacity?: number;

	/** Text transparency. → TextTransparency on text elements. */
	textOpacity?: number;

	/** Font family. → Font (Enum.Font) or FontFace. */
	fontFamily?: string | Font;

	/** Font size in pixels. → TextSize. */
	fontSize?: number;

	/** Font weight. → FontFace.Weight. */
	fontWeight?: FontWeight;

	/** Font style (normal / italic). → FontFace.Style. */
	fontStyle?: FontStyle;

	/** Horizontal text alignment. → TextXAlignment. */
	textAlign?: TextAlign;

	/** Vertical text alignment. → TextYAlignment. */
	verticalAlign?: VerticalAlign;

	/** Whether text wraps. → TextWrapped. */
	textWrap?: boolean;

	/** Text overflow behaviour. → TextTruncate. */
	textOverflow?: TextOverflow;

	/** Text stroke colour. → TextStrokeColor3. */
	textStrokeColor?: ColorValue;

	/** Text stroke transparency. → TextStrokeTransparency. */
	textStrokeOpacity?: number;

	/** Element width. → Size (UDim2 x component). UDim2 | UDim | number (px) | string ("50%") */
	width?: UDim2 | UDim | number | string;

	/** Element height. → Size (UDim2 y component). */
	height?: UDim2 | UDim | number | string;

	/**
	 * CSS-like auto-sizing axis.
	 * "x" | "y" | "xy" | "none" → Enum.AutomaticSize
	 */
	autoSize?: 'x' | 'y' | 'xy' | 'none';

	/**
	 * Padding shorthand. Generates a UIpadding child element.
	 * All values are in pixels (UDim offset).
	 */
	padding?: PaddingShorthand;

	/** Explicit per-side padding (pixels). Override shorthand. */
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	paddingLeft?: number;

	/**
	 * Border radius. Generates a UICorner child element.
	 * number = pixels | string "N%" = scale
	 */
	borderRadius?: BorderRadius;

	/** Border thickness (pixels). → BorderSizePixel. */
	borderWidth?: number;

	/** Border colour. → BorderColor3. */
	borderColor?: ColorValue;

	/** Border mode. → BorderMode. */
	borderMode?: 'outline' | 'inset' | 'middle';

	/** Element visibility. → Visible. */
	visible?: boolean;

	/** Overall element transparency (0–1). → ImageTransparency on images, grouped with bg. */
	opacity?: number;

	/** Whether children are clipped to this element's bounds. → ClipsDescendants. */
	overflow?: Overflow;

	/** Stacking order. → ZIndex. */
	zIndex?: number;

	/** ZIndex behaviour. → ZIndexBehavior. */
	zIndexBehavior?: 'global' | 'sibling';

	/**
	 * When set, generates a UIListLayout child with the given orientation.
	 * "row" = Horizontal, "column" = Vertical.
	 */
	display?: 'row' | 'column';

	/** Gap between list layout children (pixels). → UIListLayout.Padding. */
	gap?: number;

	/** Alignment of children along the main axis. → FillDirection + HorizontalAlignment / VerticalAlignment. */
	justifyContent?: 'start' | 'center' | 'end';

	/** Alignment of children on the cross axis. */
	alignItems?: 'start' | 'center' | 'end';

	/** Sort order for list layout children. → UIListLayout.SortOrder. */
	sortOrder?: 'layout' | 'name' | 'custom';
}
