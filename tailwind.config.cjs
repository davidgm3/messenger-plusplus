module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				'shantel-sans': ['Shantell Sans', 'cursive'],
			},
			animation: {
				fadeIn: 'fadeIn 0.1s ease-in',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: 0, transform: 'translateY(-5px)' },
					'100%': { opacity: 1, transfrom: 'translateY(0px)' },
				},
			},
		},
		container: null,
	},
	plugins: [],
};
