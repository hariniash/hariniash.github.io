let active_tab = 'company-tab'
let active_tab_body = 'company'

function opentab(evt, tab){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tab-content');
    for(i=0;i<tabcontent.length;i++){
        tabcontent[i].style.display = 'none';
    }

    tablinks =  document.getElementsByClassName('tab-links');
    for(i=0;i<tablinks.length;i++){
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tab).style.display = ' flex'; 
    evt.currentTarget.className += ' active'
    active_tab = evt.currentTarget.id
    console.log(active_tab)
    active_tab_body = tab
}

let sleep = ms => {  
    return new Promise(resolve => setTimeout(resolve, ms));  
    };

let ticker = ''
let current_symbol = ''

function reset_data(){    
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    
}

function reset_data_valid(symbol){
    // debugger
    let tablinks =  document.getElementsByClassName('tab-links');
    for(i=0;i<tablinks.length;i++){
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    let tabcontent = document.getElementsByClassName('tab-content');
    for(i=0;i<tabcontent.length;i++){
        tabcontent[i].style.display = 'none';
    }

    //  is this necesary?
    if(current_symbol != '' && current_symbol != symbol ){
        
        document.getElementById('results-body').style.display = 'none';
        document.getElementById('error').style.display = 'none';
        current_symbol = symbol;
        
    }
    if(current_symbol == ''){
        current_symbol = symbol
    }
    
}

function get_today_date(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today =  yyyy + '-' + mm + '-' + dd;
    return today
}

function clear_results(){
    document.getElementById('search-results').style.display = 'none'
    document.getElementById('error').style.display = 'none'
}

function get_readable_date(UTCDate){
    let date = new Date(UTCDate*1000);
    month = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    return `${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}`
}

function search_ticker(){
    symbol = document.getElementsByName('ticker')[0].value.toUpperCase()
   
    reset_data_valid(symbol)

    // fetch company details and populate company div and make it visible
    let url= 'https://stock-api-341821.wl.r.appspot.com/'
    // let url = 'http://127.0.0.1:5000/'
    document.getElementById('loader').style.display = 'block'
    fetch(url+'company_details?symbol='+symbol)
    .then((response)=>{
        // console.log(response.status)
        if (response.status == 500) { throw response }
        response.json().then((company_data)=>{
            // console.log(data)
            document.getElementById('company-name').innerHTML = company_data.name
            document.getElementById('stock-ticker').innerHTML = company_data.ticker
            
            document.getElementById('stock-exchange-code').innerHTML = company_data.exchange
            document.getElementById('company-ipo-date').innerHTML = company_data.ipo
            document.getElementById('company-category').innerHTML = company_data.finnhubIndustry
            document.getElementById('company-image').src = company_data.logo
            // document.getElementById('company-tab').className += ' active' 
            document.getElementById('loader').style.display = 'none'
            document.getElementById('search-results').style.display = " flex"; // check to change in main css
            document.getElementById('results-body').style.display = " block"; 
            document.getElementsByClassName('company-details')[0].style.display = 'flex'

            fetch(url+'/stock_summary?symbol='+symbol)
            .then((response)=>{
                console.log(response.status)
                if (response.status == 500) { throw response }
                response.json().then((data)=>{
       
                    
                    document.getElementById('stock-ticker-symbol').innerHTML = company_data.ticker
                    document.getElementById('trading-day').innerHTML = get_readable_date(data.stock.t)
                    document.getElementById('previous-closing-price').innerHTML = data.stock.pc
                    document.getElementById('opening-price').innerHTML = data.stock.o
                    document.getElementById('high-price').innerHTML = data.stock.h
                    document.getElementById('low-price').innerHTML = data.stock.l
                    document.getElementById('change').innerHTML = data.stock.d
                    document.getElementById('change-percent').innerHTML = data.stock.dp
                    if(data.stock.d < 0){
                        console.log(document.getElementById('change-symbol'))
                        document.getElementById('change-symbol').src = 'assets/RedArrowDown.png'
                        
                    }
                    else if(data.stock.d > 0){
                        document.getElementById('change-symbol').src = 'assets/GreenArrowUp.png'
                    }
                    
                    if(data.stock.dp < 0){
                        document.getElementById('change-symbol-percent').src = 'assets/RedArrowDown.png'
                        
                    }
                    else if(data.stock.dp > 0){
                        document.getElementById('change-symbol-percent').src = 'assets/GreenArrowUp.png'
                    }
                    if(data.recommendation[0] == -1){
                        document.getElementById('strongSell').innerHTML = 'N.A'
                        document.getElementById('sell').innerHTML = 'N.A'
                        document.getElementById('hold').innerHTML = 'N.A'
                        document.getElementById('buy').innerHTML = 'N.A'
                        document.getElementById('strongBuy').innerHTML = 'N.A'
                    }
                    else{
                        document.getElementById('strongSell').innerHTML = data.recommendation.strongSell
                        document.getElementById('sell').innerHTML = data.recommendation.sell
                        document.getElementById('hold').innerHTML = data.recommendation.hold
                        document.getElementById('buy').innerHTML = data.recommendation.buy
                        document.getElementById('strongBuy').innerHTML = data.recommendation.strongBuy
                    }
                    
                    
                
                })
            }).catch(e => {
                // console.log('error',e)
                reset_data()
                document.getElementById('loader').style.display = 'none'
                document.getElementById('error').style.display = 'flex'
                active_tab = 'company-tab'
                active_tab_body = 'company'
            });

            fetch(url+'/latest_news?symbol='+symbol)
            .then((response)=>{
                console.log(response.status)
                if (response.status == 500) { throw response }
                response.json().then((data)=>{
                    news_html =''
                     data.forEach(news => {
                        formatted_date = get_readable_date(news.datetime)
                        news_html += `<div id="news-item-box">
                        <div ><img id="news-item-img"  src='${news.image}' style='width: 100px; height:100px;'></div>
                        <div class="news-item-text">
                            <span id="news-title">${news.headline}</span>
                            <span id='news-date'>${formatted_date}</span>
                            <a target='_blank' id='news-item-link' href='${news.url}'>See Original Post</a>
                        </div>
                    </div>`
                     });
                        
                     document.getElementById('latest-news').innerHTML = news_html
                    
                
                })
            }).catch(e => {
                // console.log('error',e)
                reset_data()
                document.getElementById('loader').style.display = 'none'
                document.getElementById('error').style.display = 'flex'
                active_tab = 'company-tab'
                active_tab_body = 'company'
            });

            fetch(url+'/charts?symbol='+symbol)
            .then((response)=>{
                console.log(response.status)
                if (response.status == 500) { throw response }
                response.json().then((data)=>{
                   
                    document.getElementById('high-charts').style.display = 'block';

                    // Create the chart
                    Highcharts.stockChart('high-charts', {

                        

                        rangeSelector: {
                        selected: 1
                        },

                        title: {
                        text: `Stock Price ${company_data.ticker} ${get_today_date()}`,
                        margin:40
                        },

                        subtitle: {
                            text: '<a href="https://finnhub.io/" target="_blank"> Source: Finnhub </a>',
                            useHTML:true,
                        },
                        plotOptions: {
                            column: {
                                pointPlacement: 'on'
                            }
                        },

                        yAxis: [{ //--- Primary yAxis
                            labels: {
                                align: 'right'
                            },
                            title: {
                                text: 'Stock Price'
                            },
                            opposite: false
                        }, { //--- Secondary yAxis
                            labels: {
                                align: 'left'
                            },
                            title: {
                                text: 'Volume'
                            },
                            opposite: true
                        }],
                        xAxis: {
                            type: 'datetime',
                            // labels: {
                            //   formatter: function() {
                            //     return Highcharts.dateFormat('%e. %b', this.value);
                            //   }
                            },

                        series: [{
                        name: 'Stock Price',
                        data: data['stock_price'],
                        type: 'area',
                        
                        threshold: null,
                        tooltip: {
                            valueDecimals: 2
                        },
                        fillColor: {
                            linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                            },
                            stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        }},
                        {
                            type: 'column',
                           
                            name: 'Volume',
                            data: data['volume'],
                            yAxis: 1,
                            color:"#434348",
                            pointWidth: 4,
                            dataGrouping: {
                                units: [['day',[1]],['week',[1,2]],['month',[1, 2, 3, 4]]]
                            }
                        }],

                        rangeSelector: {
                            buttons: [
                                {
                                    type: 'day',
                                    count: 7,
                                    text: '7d'
                                },{
                                    type: 'day',
                                    count: 15,
                                    text: '15d'
                                },{
                                    type: 'month',
                                    count: 1,
                                    text: '1m'
                                },{
                                    type: 'month',
                                    count: 3,
                                    text: '3m'
                                },
                                {
                                    type: 'month',
                                    count: 6,
                                    text: '6m'
                                }
                            ],
                            selected: 4,
                            inputEnabled: false
                        },
                        navigation: {
                            buttonOptions: {
                                enabled: true
                            }
                        }
                    });
                    
                
                })
            }).catch(e => {
                // console.log('error',e)
                reset_data()
                document.getElementById('loader').style.display = 'none'
                document.getElementById('error').style.display = 'flex'
                active_tab = 'company-tab'
                active_tab_body = 'company'
            });

            document.getElementById(active_tab).className += ' active'
            document.getElementById(active_tab_body).style.display = ' flex'; 
    
        })
        
    
    }).catch(e => {
        // console.log('error',e)
        reset_data()
        document.getElementById('loader').style.display = 'none'
        document.getElementById('error').style.display = 'flex'
        active_tab = 'company-tab'
        active_tab_body = 'company'

    });

    
    
}



