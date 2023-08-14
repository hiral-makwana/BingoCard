'use strict'
import { Model, Sequelize, DataTypes, Association, ENUM, TextDataType } from "sequelize"
import { sequelize } from "./index";
import subscriptionAttributes from "../models/interface/subscription.interface"

export enum subscription_status {
    ACTIVE = 'active',
    TRIAL = 'trial',
    CANCELLED = 'Cancelled',
}
export class subscription extends Model<subscriptionAttributes>
    implements subscriptionAttributes {
        us_id!: number
        user_id! : number 
        subscribe_id! : number
        bingo_plan_id! : number
        order_id! : string
        stripe_plan_id! : string
        plan_name! : string
        purchase_type!: string
        subscription_status! : string
        purchase_date! :Date
        next_renewal!:Date
}

subscription.init({
    us_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT
    },
    subscribe_id :{
        type : DataTypes.INTEGER
    },
    bingo_plan_id : {
        type: DataTypes.SMALLINT
    },
    order_id: {
        type: DataTypes.STRING
    },
    stripe_plan_id: {
        type: DataTypes.STRING
    },
    plan_name: {
        type: DataTypes.STRING
    },
    purchase_type: {
        type: DataTypes.STRING
    },
    subscription_status: {
        type: DataTypes.ENUM,
        values: Object.values(subscription_status),
    },
    purchase_date: {
        type: DataTypes.DATE
    },
    next_renewal: {
        type: DataTypes.DATE
    }

},
    {
        sequelize: sequelize,
        tableName: 'wp_usersubscriptions',
        modelName: "subscription"
    })