const {address,customer,customer_address} = require('./models')
let main = async() =>{
    try {
        let addr_obj = {
            street:"as",
            commune_ward:"as",
            city:"city",
        }
        // await address.create(addr_obj)
    console.log(await address.findAll());
    } catch (error) {
       console.log(error); 
    }
}

main()