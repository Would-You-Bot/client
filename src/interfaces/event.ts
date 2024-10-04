import type WouldYou from "../util/wouldYou";

export interface Event {
	event: string;
	execute(client: WouldYou, payload: any, payload2?: any): Promise<void>;
}
