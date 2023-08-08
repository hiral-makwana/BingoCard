'use strict'
import { Model, Sequelize, DataTypes, Association, ENUM, TextDataType } from "sequelize"
import { sequelize } from "./index";
import cardAttributes from "../models/interface/card.interface"


export class card extends Model<cardAttributes>
    implements cardAttributes {
        card_id!: number
        user_id! : number 
        card_logo! : String
        card_title! : String
        card_type! : String
        card_grid! : number
        card_settings!: String
        card_items! : String
        card_style! :String
}


card.init({
    card_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT
    },
    card_logo : {
        type: DataTypes.STRING
    },
    card_title: {
        type: DataTypes.STRING
    },
    card_type: {
        type: DataTypes.STRING
    },
    card_grid: {
        type: DataTypes.TINYINT("2")
    },
    card_settings: {
        type: DataTypes.TEXT
    },
    card_items: {
        type: DataTypes.TEXT('long')
    },
    card_style: {
        type: DataTypes.TEXT
    },
},
    {
        sequelize: sequelize,
        tableName: 'wp_userbingocards',
        modelName: "card"
    })