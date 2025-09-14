import ky from 'ky'

import { config } from '@/config'

import type * as Types from './types'

const API_URL =
	config.NODE_ENV === 'production'
		? 'https://pay.crypt.bot/api'
		: 'https://testnet-pay.crypt.bot/api'

const headers = {
	'Content-Type': 'application/json',
	'Crypto-Pay-API-Token': config.CRYPTO_PAY_APP_TOKEN,
	charset: 'utf-8',
}

const api = ky.create({
	prefixUrl: API_URL,
	headers,
})
export class CryptoPayApi {
	_api: typeof api

	constructor() {
		this._api = api
	}
	async getMe() {
		return this._api.get<Types.GetMeResponse>(`getMe`).json()
	}

	async createInvoice(params: Types.CreateInvoiceParams) {
		return this._api
			.post<Types.CreateInvoiceResponse>(`createInvoice`, {
				json: params,
			})
			.json()
	}
	async deleteInvoice(invoiceId: string) {
		return this._api
			.post(`deleteInvoice`, {
				json: {
					invoice_id: invoiceId,
				},
			})
			.json()
	}
}
