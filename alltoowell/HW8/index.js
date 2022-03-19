import {autoComplete, fetchCompanyDetails, chartsQuote} from './api-calls.js'
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
        console.log(data)
        response.send(data)
    });
    
});
app.get('/company_details', async (request, response) => {
    let ticker = request.query.symbol
    // console.log(query)
    let result = fetchCompanyDetails(ticker)        //Result = Promise
    let res = await result;

    response.send(res)
    // .then(data=>{
    //         response.send(data)
    //     });
})

app.get('/stock_quote', async (request, response) => {
    let ticker = request.query.symbol
    // console.log(query)
    let result = chartsQuote(ticker)
    let res = {}
    await Promise.all([result]).then(data => res = data)
    console.log('result')
    console.log(res)
    response.send(res)
    // .then(data=>{
    //         response.send(data)
    //     });
})


app.listen(port, () => {
    // console.log('Hello WOrld2')
});
