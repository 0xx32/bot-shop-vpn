import { eq } from 'drizzle-orm'
import { bold, code, format } from 'gramio'

import type { BotType } from '@/bot'

import { db } from '@/db'
import { usersTable } from '@/db/schemes'
import { backKeyboard } from '@/shared/keyboards'

export default (bot: BotType) => {
	bot.callbackQuery('profile', async (ctx) => {
		ctx.answerCallbackQuery()

		const user = (
			await db.select().from(usersTable).where(eq(usersTable.telegramID, ctx.from.id.toString()))
		).at(0)

		if (!user) {
			return ctx.send('Профиль не найден')
		}

		const uniqueID = user.uniqueID ?? 'не установлен'

		ctx.editText(
			format`${bold`Профиль`}\n\nID: ${code`${uniqueID}`}\nБаланс: ${user.ballance} RUB`,
			{
				reply_markup: backKeyboard,
			}
		)
	})
}
