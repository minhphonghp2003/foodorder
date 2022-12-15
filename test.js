const {category,product, cart,address, customer, customer_address, table_booking } = require('./models')
const { signToken, verifyToken } = require("./library/jwt.js")
try {
    const token = signToken({ userId: 1 })
    console.log({ token })
    
    const verified = verifyToken(token)
    console.log({ verified }) 
    
} catch (error) {
   console.log(error); 
}
// let main = async () => {
//     try {
//         let addr_obj = {
//             street: "b1",
//             commune_ward: "b",
//             city: "city",
//         }
//         let customer_obj = {
//             first_name: "a",
//             last_name: "b",
//             email: "c",
//             username: "c",
//             password: "d",
//             phone: 1,
//         }
//         let cus_addr = {
//             customerId: "985ffb42-2ce1-4a41-a2b4-f2ffb919e675",
//             addressId: "04dfbf70-617d-4115-9320-03418f023907"
//         }
//         let table = {
//             customerId: "905f24ab-817d-4ed6-b0c8-54f491f09b24",
//             date: '2022-12-15',
//             time: "9:05",
//             message: "table booking"
//         }
//         let cart_obj = {
//             productId:"905f24ab-817d-4ed6-b0c8-54f491f09b24",
//             customerId:"905f24ab-817d-4ed6-b0c8-54f491f09b24",
//             quanity:3,
//         }
//         let cate = {
//             name:"house"
//         }
//         let prod = {
//             categoryId:1,
//             name:"car",
//             sku:"AAAA",
//             price:2345,
//             description:"Descp"
//         }
//         // await product.create(prod)
//         // let c = await customer_address.create(cus_addr)
//         let c = await customer.findAll({include:[address,customer_address]})
//         // let c = await customer_address.findAll({include:[customer]})
//         console.log(c);    
//         // let p = await product.findAll({include:[category]});
//         // console.log(p);
// // ----------------------------------------------------------------------------






//     } catch (error) {
//         console.log(error);
//     }
// }

// main()