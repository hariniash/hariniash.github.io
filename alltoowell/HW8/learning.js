// log this

function f1(response){
    return response.body
}
function f2(data){
    return {
        name:data.name,
        value:data.value
    }
}
function errorHandler(e){

}
a=axios("blabla.com").then(f1).then(f2).catch(errorHandler)
b=axios("blublu.com").then(f1).then(f2).catch(errorHandler)

Promise.all([a,b]).then(([ar,br])=>{
    response.send({...ar,...br})
})

async function asd(input){
    a=await axios("blabla.com").then(f1).then(f2).catch(errorHandler)
    return a;
}

function asd(input){
    
        return axios("blabla.com").then(f1).then(f2).catch(errorHandler)
    
}

aResponse={
    name:"Amal",
    roll:123
}
bResponse={
    roll:123,
    marks:90
}
output={
    name,roll,marks
}
aResponse.marks = null
bResponse.name = null
output = {
    name:"Amal",
    roll:123,
    marks:90
}
arr1=[1,2,3]
arr2=[4,5,6]
arr3=[...arr1,...arr2]

response={
    body:{
        ticker:"TSLA",
        value:30.4,
        dayStats:{
            good:1
        }
    }
}
responseBad={
    body:{
        ticker:"TSLA",
        value:30.4,
    }
}
let good=response.body?.dayStats?.good;
