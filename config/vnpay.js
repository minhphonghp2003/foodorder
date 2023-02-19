
require('dotenv').config()

module.exports  = {
    vnp_TmnCode:process.env.VNPAY_TMN,
    vnp_HashSecret:process.env.VNPAY_SEC_KEY,
    vnp_Url:process.env.VNPAY_URL,
    vnp_ReturnUrl:process.env.VNPAY_RETURN_URL
}