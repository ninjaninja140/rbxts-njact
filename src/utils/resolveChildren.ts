import React from '@rbxts/react';

export type ReactChild = React.Element | string | undefined | false;
export type ReactChildren = ReactChild | ReactChild[];

export function resolveChildren(children: ReactChildren | undefined): {
	text: string | undefined;
	nodes: React.Element[];
} {
	if (children === undefined) return { text: undefined, nodes: [] };

	const items = typeIs(children, 'table') ? (children as ReactChild[]) : [children as ReactChild];

	let text: string | undefined;
	const nodes: React.Element[] = [];

	for (const child of items) {
		if (child === undefined || child === false) continue;
		if (typeIs(child, 'string')) text = (text ?? '') + child;
		else nodes.push(child as React.Element);
	}

	return { text, nodes };
}
