import {autoComplete, fetchCompanyDetails,quote, autoUpdate} from './api-calls.js'
import express from 'express';

// const apiCalls = require('./api-calls.js')
const app = express();
const port = 4000


app.get('/', (request, response) =>{

    response.send('Hello World')
});
app.get('/search', async (request, response) =>{
    response.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    let query = request.query.q
    // console.log(query)
    await autoComplete(query)
    .then(data=>{
        // console.log(data)
        response.send(data)
    })
    .catch(error =>{
        response.status(500).send({'name':'Error', 'message':error.message})
    });
    
});
app.get('/company_details', async (request, response) => {
    response.set('Access-Control-Allow-Origin', 'http://localhost:8080');

    let ticker = request.query.symbol.toUpperCase()
    console.log(ticker)
    let result = fetchCompanyDetails(ticker)        //Result = Promise

    try{
        let res = await result;

        response.send(res)
    }
    catch(e){
        response.status(500).send({'name':'Error', 'message':e.message})
    }
    
 
})

app.get('/stock_quote', async (request, response) => {
    response.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    let ticker = request.query.symbol.toUpperCase()
    // console.log(query)
    let result = quote(ticker)
    let res = {}
    await Promise.all([result])
    .then(data => {
        res = data
        response.send(res)
    })
    .catch(e => {
        response.status(500).send({'name':'Error', 'message':e.message})
    })
    
})


app.listen(port, () => {
    // console.log('Hello WOrld2')
});
