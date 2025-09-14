import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { configTable } from '@/db/schemes/config'

export interface ReturnConfig<T> {
	key: string
	values: T
}

export const getConfig = async <Value>(key: string) => {
	const config = await db
		.select()
		.from(configTable)
		.where(eq(configTable.key, key))

	if (!config.at(0)) {
		return
	}

	return config.at(0) as ReturnConfig<Value>
}
