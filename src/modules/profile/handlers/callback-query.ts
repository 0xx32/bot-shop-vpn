import { bold, format } from 'gramio'

import type { BotType } from '@/bot'

import { backKeyboard } from '@/shared/keyboards'

export default (bot: BotType) => {
	bot.callbackQuery('profile', (ctx) => {
		ctx.answerCallbackQuery()
		ctx.editText(format`${bold`Ваш профиль`}\n\nВаш баланс: 1000 RUB`, {
			reply_markup: backKeyboard,
		})
	})
}
