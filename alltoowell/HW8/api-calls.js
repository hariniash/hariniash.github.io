import axios from 'axios'
import { response } from 'express';
// import { response } from 'express';
const API_KEY = 'c81adb2ad3i8p98ihmh0';
const HOST = 'https://finnhub.io/api/v1/'

function getTodayDate(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}
let makeHttpCall = function(url){
    let res = axios.get(url)
    return res    
}

function checkCommonStock(stock){
    return stock.type == 'Common Stock'
}

let autoComplete = async function(query){
    let autoResults = new Object();
    let url = `${HOST}search?q=${query}&token=${API_KEY}`;
    
    await makeHttpCall(url).then(data => 
    
        autoResults = data.data.result.filter(checkCommonStock));
    console.log(autoResults)

    //filter search results autocomplete
    return autoResults
}


// let fetchCompanyDetails = async function(ticker){
//     let companyDetails = new Object()

//     return await companyProfile(ticker).then(async function (profile)  {
//         companyDetails.profile = profile;
//         await companySentiment(ticker).then(insights => companyDetails.insights = insights)
//         await companyNews(ticker).then(news => companyDetails.news = news)
//         await peers(ticker).then(response => companyDetails.peers = response)
//         return companyDetails
    
//     })
    
   
let fetchCompanyDetails =  function(ticker){
    let companyDetails = new Object()

    return companyProfile(ticker).then(function (profile)  {
        companyDetails.profile = profile;
        let sentimentPromise = companySentiment(ticker).then(insights => companyDetails.insights = insights)
        let newsPromise = companyNews(ticker).then(news => companyDetails.news = news)
        let peersPromise =  peers(ticker).then(response => companyDetails.peers = response)
        
        return Promise.all([sentimentPromise, newsPromise, peersPromise]).then(()=>{
            return companyDetails
        })
    
    })
    

}
 async function companyProfile(ticker){
    let profile = {}
    let url = `${HOST}stock/profile2?symbol=${ticker}&token=${API_KEY}`

    // profile2.ticker, profile2.name, profile2.exchange, profile2.ipo, profile2.finnhubIndustry, 
    //profile2.logo, Profile2.weburl

    await makeHttpCall(url).then((response) =>{
        
        profile.ticker = response.data.ticker
        profile.name = response.data.name
        profile.exchange = response.data.exchange
        profile.ipo = response.data.ipo
        profile.finnhubIndustry = response.data.finnhubIndustry
        profile.logo = response.data.logo
        profile.weburl = response.data.weburl
        // console.log(profile)
    })
    return profile
}

async function chartsQuote(ticker){
    let dynamicDetails = new Object()
    await quote(ticker).then(data => dynamicDetails.quote = data)

    return dynamicDetails

}

async function quote(ticker){
    let quote = {}
    // quote.c, quote.d, quote.dp, quote.t,quote.h, quote.l, quote.o, quote.pc

    let url = `${HOST}quote?symbol=${ticker}&token=${API_KEY}`
    await makeHttpCall(url).then((response)=>{
        quote = response.data
        // console.log(quote)

    })
    return quote
}

async function peers(ticker){
    let peer = {}
    let url = `${HOST}stock/peers?symbol=${ticker}&token=${API_KEY}`
    await makeHttpCall(url).then((response) =>{
        peer = response.data
        // console.log(peer)
    })
    return peer
}

async function companyNews(ticker){
    let news = []
    
    let url = `${HOST}company-news?symbol=${ticker}&token=${API_KEY}&from=2022-01-01&to=${getTodayDate()}`
    // console.log(url)

    //Company-news.source, company-news.datetime, company-news.summary, 
    //company-news.headline, company-news.url, company-news.title(same as headline), company-news.image
    await makeHttpCall(url).then((response) =>{
        const topSlice = response.data.slice(0,5);
        topSlice.forEach(newsItem => {
            let item = {}
            item.source = newsItem.source
            item.datetime = newsItem.datetime
            item.summary = newsItem.summary
            item.headline = newsItem.headline
            item.url = newsItem.url
            item.image = newsItem.image
            news.push(item)
            
        });
        // console.log(news)
    })
    return news
}

let companySentiment = async function(ticker){
    let insights = {}
    let url = `${HOST}/stock/social-sentiment?symbol=${ticker}&token=${API_KEY}&from=2022-01-01`
    await makeHttpCall(url).then((response) => {
        insights.reddit = {}
        insights.reddit.mention = 0
        insights.reddit.positiveMention = 0
        insights.reddit.negativeMention = 0

        insights.twitter = {}
        insights.twitter.mention = 0
        insights.twitter.positiveMention = 0
        insights.twitter.negativeMention = 0

        console.log(response.data.reddit)
        response.data.reddit.forEach(sentimentItem => {
            console.log(sentimentItem)
            insights.reddit.mention += sentimentItem.mention
            insights.reddit.positiveMention += sentimentItem.positiveMention
            insights.reddit.negativeMention += sentimentItem.negativeMention
        })
    
        response.data.twitter.forEach(sentimentItem => {
            insights.twitter.mention += sentimentItem.mention
            insights.twitter.positiveMention += sentimentItem.positiveMention
            insights.twitter.negativeMention += sentimentItem.negativeMention
        })
    })

    url = `${HOST}/stock/recommendation?symbol=${ticker}&token=${API_KEY}`
    await makeHttpCall(url).then((response) => {
        insights.recommendation = response.data
    })

    url = `${HOST}/stock/earnings?symbol=${ticker}&token=${API_KEY}`
    await makeHttpCall(url).then((response) => {
        insights.earnings = response.data
        // console.log(insights.earnings)
    })
    return insights
    
    
}


export {autoComplete, fetchCompanyDetails, chartsQuote};


