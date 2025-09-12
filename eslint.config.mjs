import antfu from '@antfu/eslint-config'
import drizzle from 'eslint-plugin-drizzle'

export default antfu(
	{
		stylistic: false,
	},
	{
		files: ['**/*.js', '**/*.ts'],
		rules: {
			'node/prefer-global/process': 'off',
			'no-console': 'off',
			'antfu/no-top-level-await': 'off',
		},
		plugins: {
			drizzle,
		},
	}
)
