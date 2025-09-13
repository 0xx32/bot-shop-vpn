import { autoload } from '@gramio/autoload'
import { scenes } from '@gramio/scenes'
import { Bot } from 'gramio'

import { config } from './config'
import { profileScenes } from './modules/profile'

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
	.extend(scenes([...profileScenes]))
	.onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`))

export type BotType = typeof bot
