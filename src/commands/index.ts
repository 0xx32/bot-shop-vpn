import { eq } from 'drizzle-orm'

import type { BotType } from '@/bot'
import type { PaymentMethodsConfig } from '@/shared/types'

import { db } from '@/db'
import { usersTable } from '@/db/schemes'
import { mainKeyboard } from '@/shared/keyboards'
import { START_MESSAGE } from '@/utils/constants/messages'
import { getConfig } from '@/utils/helpers/getConfig'

export default (bot: BotType) => {
	bot
		.command('start', async (ctx) => {
			await ctx.send(START_MESSAGE, {
				reply_markup: mainKeyboard,
			})

			const user = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.telegramID, ctx.from.id.toString()))

			if (!user.at(0)) {
				await db.insert(usersTable).values({
					telegramID: ctx.from.id.toString(),
					tgUserName: ctx.from.username,
					uniqueID: crypto.randomUUID(),
				})
			}
		})
		.command('test', async (ctx) => {
			// await db.insert(configTable).values({
			// 	key: 'paymentMethods',
			// 	values: {
			// 		cryptoBot: {
			// 			label: 'CryptoBot',
			// 			key: 'cryptoBot',
			// 			enabled: true,
			// 		},
			// 		lolz: {
			// 			label: 'Lolz Market',
			// 			key: 'lolz',
			// 			enabled: false,
			// 		}
			// 	},
			// })

			const payments = await getConfig<PaymentMethodsConfig>('paymentMethods')

			console.log(payments?.values.cryptoBot.enabled)

			await ctx.send('test')
		})
}
