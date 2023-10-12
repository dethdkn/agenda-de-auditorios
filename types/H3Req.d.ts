import type {IncomingMessage} from 'http'

declare global {
	type H3Req = IncomingMessage
}

export {H3Req}
