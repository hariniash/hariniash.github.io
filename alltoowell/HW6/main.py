
from flask import Flask, jsonify, request, send_from_directory, Response

app = Flask(__name__)
import requests
from datetime import * 
from dateutil.relativedelta import *


# symbol = ''

TODAY = date.today()

@app.route('/')
def index():
    return send_from_directory('UI', 'index.html')

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('UI', path)

TOKEN = 'c81adb2ad3i8p98ihmh0'

@app.route('/company_details')
def company_details():
    symbol = request.args.get('symbol')
    url = 'https://finnhub.io/api/v1/stock/profile2'
    response = requests.get(url, params={'symbol': symbol, 'token': TOKEN})
    # print(req.url)
    res = response.json()
    if len(res) == 0:
        return Response('No response for given ticker', status=500)
    return res

@app.route('/stock_summary')
def stock_summary():
    symbol = request.args.get('symbol')
    
    url = 'https://finnhub.io/api/v1/quote'
    response = requests.get(url, params={'symbol': symbol, 'token': TOKEN})
    stock_res = response.json()
    url = 'https://finnhub.io/api/v1/stock/recommendation'
    response = requests.get(url, params={'symbol': symbol, 'token': TOKEN})
    recommendation_res = response.json()

    date_list = [rec_obj['period']for rec_obj in recommendation_res]
    date_list = [datetime.strptime(date,'%Y-%m-%d') for date in date_list] 
    return {'stock': stock_res, 'recommendation': recommendation_res[date_list.index(max(date_list))]}

@app.route('/charts')
def charts():
    symbol = request.args.get('symbol')
    params = {'symbol': symbol}
    params['resolution'] = 'D'
    params['from'] =  int(datetime.combine(TODAY+relativedelta(months=-6, days=-1), datetime.min.time()).timestamp())
    params['to'] =  int(datetime.combine(TODAY, datetime.min.time()).timestamp())  
    params['token'] = TOKEN
    url = 'https://finnhub.io/api/v1/stock/candle'
    response = requests.get(url, params=params)
    charts_data = response.json()

    stock_price =[]
    volume =[]
    for i, v in enumerate(charts_data['t']):
        stock_price.append((charts_data['t'][i]*1000, charts_data['c'][i]))
        volume.append((charts_data['t'][i]*1000, charts_data['v'][i]))

    return {'stock_price': stock_price, 'volume': volume}


@app.route('/latest_news')
def latest_news():

    symbol = request.args.get('symbol')
    url = 'https://finnhub.io/api/v1/company-news'
     
    
    
    response = requests.get(url, params={'symbol': symbol, 'token': TOKEN, 'from': TODAY+relativedelta(months=-1), 'to': TODAY})
    
    result = response.json()
    news_segments =[]
    for news in result:
        c = 0
        if news['datetime']:
            c+=1
        for key in ['image', 'url', 'headline']:
            if news[key] != '':
                c+=1
            
        if c == 4:
            news_segments.append(news)
      
    return jsonify(news_segments[:5])

if __name__ == '__main__':
   app.run(debug=True)