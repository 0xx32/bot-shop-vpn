import { Scene } from '@gramio/scenes'
import { InlineKeyboard } from 'gramio'

import type { User } from '@/db/schemes'
import type { PaymentMethodsConfig } from '@/shared/types'

import { db } from '@/db'
import { paymentsTable } from '@/db/schemes'
import { getConfig } from '@/utils/helpers/getConfig'
import { CryptoPayApi } from '@/utils/services/crypto-pay'

const cryptoPay = new CryptoPayApi()

export const topupBalanceScene = new Scene('topupBalanceScene')
	.params<{ user: User }>()
	.step(['message', 'callback_query'], async (ctx) => {
		if (ctx.scene.step.firstTime) {
			return ctx.editText('Введите сумму или выберите готовую.', {
				reply_markup: new InlineKeyboard()
					.text('💵100', '100')
					.text('💵500', '200')
					.text('💵200', '500')
					.row()
					.add(InlineKeyboard.text('Назад', 'back')),
			})
		}

		if (ctx.is('callback_query')) {
			return ctx.scene.update({
				amount: ctx.queryPayload as number,
			})
		}

		if (ctx.text === '' || Number.isNaN(Number.parseFloat(ctx.text ?? ''))) {
			return ctx.send('Сумма должна быть числом')
		}

		return await ctx.scene.update({
			amount: ctx.text,
		})
	})
	.step(['callback_query', 'message'], async (ctx) => {
		const paymentMethods = await getConfig<PaymentMethodsConfig>('paymentMethods')

		if (!paymentMethods) {
			return await ctx.send('Не удалось получить конфигурацию платежей')
		}

		const paymentsLabels = Object.values(paymentMethods.values).filter((x) => x.enabled)

		const keyboard = new InlineKeyboard()
			.columns(2)
			.add(...paymentsLabels.map((x) => InlineKeyboard.text(x.label, x.key)))

		if (ctx.scene.step.firstTime && ctx.is('callback_query')) {
			return await ctx.editText('Выберите способ оплаты', {
				reply_markup: keyboard,
			})
		} else if (ctx.is('message')) {
			return await ctx.send('Выберите способ оплаты', {
				reply_markup: keyboard,
			})
		}

		if (ctx.is('callback_query')) {
			await ctx.answerCallbackQuery()
		}

		if (!paymentMethods.values[ctx.queryPayload as keyof typeof paymentMethods.values]) {
			// await ctx.send('❌Неизвестный способ оплаты')
			return await ctx.send('Выберите способ оплаты', {
				reply_markup: keyboard,
			})
		}

		return ctx.scene.update({
			paymentMethod: ctx.queryPayload as string,
		})
	})
	.step('callback_query', async (ctx) => {
		if (ctx.scene.step.firstTime) {
			const payment = await db
				.insert(paymentsTable)
				.values({
					userId: ctx.scene.params.user.id,
					amount: ctx.scene.state.amount,
					status: 'pending',
				})
				.returning()

			if (!payment.at(0)) {
				return await ctx.send('Ошибка при создании платежа')
			}

			const invoice = await cryptoPay.createInvoice({
				currency_type: 'fiat',
				amount: ctx.scene.state.amount.toString(),
				fiat: 'RUB',
				payload: payment.at(0)!.id.toString(),
			})

			return await ctx.editText('шаг 3', {
				reply_markup: new InlineKeyboard()
					.url('Оплатить', invoice.result.bot_invoice_url)
					.text('Отмена', 'cancel'),
			})
		}

		// if (ctx.queryPayload === 'cancel' && invoceID) {
		// 	console.log('2312312');

		// 	const res = await cryptoPay.deleteInvoice(invoceID)

		// 	console.log(res);

		// }
		ctx.scene.exit()
	})
