//from timestamp to formatted string
export const timestampToDateTime = (timestamp: number) => {
	const date = new Date(timestamp);
	return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

//slices a string to a given length and adds ellipsis
export const sliceWithEllipsis = (str: string, length: number) => {
	if (str.length > length) {
		return str.slice(0, length) + '...';
	}
	return str;
};
