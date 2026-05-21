import { COLOR_ASSOCIATIONS, type ColorKey } from './types/common';

export function parseHex(value: string) {
	return Color3.fromHex(value);
}
export function computeColor(value: string) {
	return Color3.fromHex(COLOR_ASSOCIATIONS[value as ColorKey] ?? '#000000');
}
