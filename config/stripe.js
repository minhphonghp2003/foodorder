require('dotenv').config()

module.exports ={
    sk_test:process.env.STRIPE_SK_TEST,
    pk_test:process.env.STRIPE_PK_TEST,
    success_url:process.env.STRIPE_SUCCESS_URL
}