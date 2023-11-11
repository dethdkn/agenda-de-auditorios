import type { IncomingMessage } from 'node:http'

declare global {
	type H3Req = IncomingMessage
}

export { H3Req }
