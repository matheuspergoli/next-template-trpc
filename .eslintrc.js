/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: [
		"eslint:recommended",
		"next/core-web-vitals",
		"plugin:@typescript-eslint/strict",
		"plugin:@typescript-eslint/stylistic",
		"plugin:@tanstack/eslint-plugin-query/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname
	},
	env: {
		node: true
	},
	globals: {
		JSX: "writable",
		React: "writable"
	},
	settings: {
		react: {
			version: "detect"
		},
		tailwindcss: {
			callees: ["cn"],
			config: "tailwind.config.ts"
		}
	},
	ignorePatterns: [
		"**/.*.js",
		"**/.*.ts",
		"**/*.config.ts",
		"**/*.config.js",
		"node_modules",
		".next"
	]
}