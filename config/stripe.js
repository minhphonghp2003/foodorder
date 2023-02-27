require('dotenv').config()

module.exports ={
    sk_test:process.env.STRIPE_SK_TEST,
    pk_test:process.env.STRIPE_PK_TEST,
    success_url:process.env.STRIPE_PAYMENT_SUCCESS,
    cancle_url:process.env.WEBSITE_URL
}