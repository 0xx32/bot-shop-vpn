import { autoload } from '@gramio/autoload'
import { Bot } from 'gramio'

import { config } from './config'

export const bot = new Bot(config.BOT_TOKEN)
	.extend(
		autoload({
			path: './commands',
		})
	)
	.extend(
		autoload({
			path: './handlers',
		})
	)
	.extend(
		autoload({
			path: './modules',
			skipImportErrors: true,
		})
	)
	.onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`))

export type BotType = typeof bot
