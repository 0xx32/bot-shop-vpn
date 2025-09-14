import env from 'env-var'

export const config = {
	NODE_ENV: env
		.get('NODE_ENV')
		.default('development')
		.asEnum(['production', 'test', 'development']),
	BOT_TOKEN: env.get('BOT_TOKEN').required().asString(),

	DATABASE_URL: env.get('DATABASE_URL').required().asString(),
	LOCK_STORE: env.get('LOCK_STORE').default('memory').asEnum(['memory']),
	CRYPTO_PAY_APP_TOKEN: env.get('CRYPTO_PAY_APP_TOKEN').required().asString(),
}
