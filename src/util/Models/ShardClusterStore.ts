import { Schema, model } from "mongoose";


export interface IShardClusterStore {
    shard: number
    cluster: number
    isMaster: boolean
    pid: number
}

const ShardClusterStore = new Schema({
    shard: {
        type: Number,
        require: true
    },
    cluster: {
        type: Number,
        require: true
    },
    isMaster: {
        type: Boolean,
        default: false,
    },
    pid: {
        type: Number,
        default: 0
    }
});



