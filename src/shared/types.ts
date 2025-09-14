type PaymentMethodKeys = 'cryptoBot' | 'paypal' | 'yandexMoney'

interface PaymentMethod {
	label: string
	key: string
	enabled: boolean
}
export type PaymentMethodsConfig = Record<PaymentMethodKeys, PaymentMethod>
