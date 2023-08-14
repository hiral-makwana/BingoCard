export default interface subscriptionAttributes {
    us_id: number,
    user_id:number,
    subscribe_id : number
    bingo_plan_id:number,
    order_id:string,
    stripe_plan_id:string,
    plan_name:string,
    purchase_type:string,
    subscription_status : string,
    purchase_date : Date,
    next_renewal:Date
}