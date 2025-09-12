import type { BotType } from '@/bot'

import { mainKeyboard } from '@/shared/keyboards'
import { START_MESSAGE } from '@/utils/constants/messages'

export default (bot: BotType) => {
	bot.command('start', (ctx) => {
		ctx.send(START_MESSAGE, {
			reply_markup: mainKeyboard,
		})
	})
}
