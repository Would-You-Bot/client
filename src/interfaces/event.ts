import WouldYou from "../util/wouldYou";

export interface Event {
  event: string;
  execute(client: WouldYou, payload: any): Promise<void>;
}
