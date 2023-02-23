let obj1 = {
    name:"obj1"
}
let change = (obj)=>{
    obj = {
        name:"obj2"
    }
}
console.log(obj1);
change(obj1)
console.log(obj1);