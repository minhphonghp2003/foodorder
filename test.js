const {address,customer,customer_address} = require('./models')
let main = async() =>{
    try {
        let addr_obj = {
            street:"b1",
            commune_ward:"b",
            city:"city",
        }
        let customer_obj = {
            first_name:"B",
            last_name:"r",
            email:"r",
            username:"r",
            password:"r",
            phone:12,
        }
        let cus_addr = {
            customerId:"985ffb42-2ce1-4a41-a2b4-f2ffb919e675",
            addressId:"04dfbf70-617d-4115-9320-03418f02390"
        }
        // await address.create(addr_obj)
        let c = await customer_address.create(cus_addr)
    console.log(c);
    } catch (error) {
       console.log(error); 
    }
}

main()