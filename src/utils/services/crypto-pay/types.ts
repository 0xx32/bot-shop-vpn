export interface BaseResponse<Data> {
	ok: boolean
	result: Data
	error?: Error
}
export interface CryptoApiError {
	code: number
	name: string
}

export type GetMeResponse = BaseResponse<{
	app_id: number
	name: string
	payment_processing_bot_username: string
}>

export interface CreateInvoiceParams {
	currency_type: 'crypto' | 'fiat'
	asset?: string
	fiat?: string
	amount: string
	description?: string
	hidden_message?: string
	paid_btn_name?: 'openBot' | 'callback' | 'viewItem'
	paid_btn_url?: string
	payload?: string
	expires_in?: number
}

export type CreateInvoiceResponse = BaseResponse<{
	invoice_id: number
	hash: string
	currency_type: string
	fiat: string
	amount: string
	accepted_assets: string[]
	pay_url: string
	bot_invoice_url: string
	mini_app_invoice_url: string
	web_app_invoice_url: string
	status: string
	created_at: string
	allow_comments: boolean
	allow_anonymous: boolean
}>
