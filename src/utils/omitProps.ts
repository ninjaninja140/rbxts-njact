import { PROP_KEYS, type PropKey } from './types/common';

// OmitLoose<T, K> — like Omit<T, K> but doesn't require K to be keyof T.
// TypeScript's built-in Omit requires K extends keyof T, which fails when T
// is an unconstrained generic. This version uses Exclude on keyof T instead,
// so unknown keys in K are simply ignored rather than causing a constraint error.
type OmitLoose<T, K extends string> = Pick<T, Exclude<keyof T, K>>;

/**
 * omitProps — removes all -owned prop keys from a props object so the
 * remainder can be safely spread onto a Roblox element without Roblox seeing
 * unknown properties.
 *
 * @param props  The full component props object.
 * @param extra  Optional additional keys to strip (component-specific  props
 *               not covered by the shared PROP_KEYS list).
 * @returns      A shallow copy with all  keys deleted.
 *
 * @example
 * ```tsx
 * export function Button(props: IButtonProps) {
 *     const robloxProps = omitProps(props, ["href"]);
 *     const events = mapEvents("textbutton", props);
 *     const { props: styleProps, children: styleChildren } = computeStyle("textbutton", props.style);
 *
 *     return (
 *         <textbutton {...robloxProps} {...styleProps} Event={events}>
 *             {styleChildren}
 *         </textbutton>
 *     );
 * }
 * ```
 */
export function omitProps<T extends object, K extends string>(props: T, extra: K[] = []): OmitLoose<T, PropKey | K> {
	const result = table.clone(props) as Record<string, unknown>;

	for (const key of PROP_KEYS) result[key] = undefined!;
	for (const key of extra) result[key] = undefined!;

	return result as unknown as OmitLoose<T, PropKey | K>;
}
