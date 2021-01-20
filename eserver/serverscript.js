// a) Homepage/ Search Route [‘/’] – It is a default route of this application.
// b) Watchlist Route [‘/watchlist’] – It displays the watchlist of the user.
// c) Portfolio Route [‘/portfolio’] – It displays the portfolio of the user.
// d) Details Route [‘/details/<ticker>’] – It shows the details of the <ticker>.

// import {formatDate} from "@angular/common";

const express = require("express");
const fetch = require('node-fetch');
const path = require("path");
const cors = require('cors');
const app = express();
app.use(cors())
// res.header("Access-Control-Allow-Origin","*")
// const config = require("./config");
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const APIKeyTiingo = '293da9828b3db14e5e6ce4861b5890a157a0adbc'
const NewsAPIkey='8d3901717bc14f95910d625752ca74c1';
app.get('/',(req,res)=>
{
  res.send('Hello');

});

app.get('/autocomplete/:ticker', cors(),function (req, res) {
  let finaldata=[];
  let i=0;
  let ticker=req.params.ticker;
  console.log("entereed autocomplete")
  fetch('https://api.tiingo.com/tiingo/utilities/search?query='+ticker+'&token='+APIKeyTiingo)
    .then(response => response.json()).then(data => {
    // console.log(data)
    // console.log('printing data')
    // console.log(typeof data)

    for (const [key, value] of Object.entries(data)) {
      finaldata[i]={"name":data[i]["name"],"ticker":data[i]["ticker"]}
      // console.log(data[i]["name"])
      // console.log(data[i]["ticker"])
      i=i+1
    }
    // console.log(data[0]["name"])
    // console.log(data[0]["ticker"])
    res.send(finaldata)
  })
    .catch(err => { console.log('error')})

})


app.get('/watchlist', function (req, res) {
  res.send('routing to locala storage')
})

app.get('/portfolio', function (req, res) {
  res.send('portfolio')

})


app.get('/details/:ticker', function (req, res) {
  let finaldata={}
  let ticker=req.params.ticker
  console.log('https://api.tiingo.com/iex/?tickers='+req.params.ticker+'&token='+APIKeyTiingo);
  fetch('https://api.tiingo.com/iex/?tickers='+req.params.ticker+'&token='+APIKeyTiingo).then(response => response.json()).then(data => {
    console.log(data)
    // // finaldata=JSON.parse(data)
    // console.log(data[0])
    // console.log(typeof data[0])c
    console.log("finaldata");
    console.log(data)
    finaldata=JSON.parse(JSON.stringify(data[0]));
    console.log(data)
    res.send(data)
  })
    .catch(err => { console.log('error')})
})

app.get('/details/description/:ticker', function (req, res) {

  // let ticker=req.params.ticker

  fetch('https://api.tiingo.com/tiingo/daily/'+req.params.ticker+'?token='+APIKeyTiingo)
    .then(response => response.json()).then(data => {
    // console.log(data)
    // delete data['ticker']
    delete data['endDate']
    // console.log(data)
    res.send(data)
  })
    .catch(err => { console.log('erroxdcr')})


})


// app.get('/details/latestprice/:ticker', function (req, res) {
//   // let finaldata=[]
//   let resampleFreq = '4min'
//   let date_ob = new Date();
//   let startDate = "" + date_ob.getDate()
//   let ticker = req.params.ticker
//   fetch('https://api.tiingo.com/iex/?tickers=' + req.params.ticker + '&token=' + APIKeyTiingo).then(response => response.json()).then(data => {
//     console.log(data)
//     // finaldata=JSON.parse(data)
//     console.log(typeof data)
//     res.send(data)
//     // res.send(' ticker:' + req.params.ticker + ' data:' + data)
//   })
//     .catch(err => {
//       console.log('error')
//     })
// })
//
// app.get('/details/historicaldata/:ticker', function (req, res) {
//   // let finaldata=[]
//   let resampleFreq='4min';
//   let date_ob = new Date();
//   let startDate=""+date_ob.getFullYear()+'-'+date_ob.getMonth()+'-'+date_ob.getDate();
//   console.log(startDate);
//   let ticker=req.params.ticker;
//   fetch('https://api.tiingo.com/iex/'+ticker+'/prices?startDate='+startDate+'&resampleFreq='+resampleFreq+'&token='+APIKeyTiingo)
//     .then(response => response.json()).then(data => {
//     console.log(data)
//     res.send(data)
//   })
//     .catch(err => { console.log('error')})
//
// })



app.get('/details/news/:ticker', function (req, res) {
  let finaldata=[]
  let ticker=req.params.ticker;


  fetch('https://newsapi.org/v2/everything?apiKey='+NewsAPIkey+'&q='+ticker)
    .then(response => response.json()).then(data => {
    // console.log(data["articles"])
    data=data["articles"]
    // console.log(data)
    let i=0;
    for (const [key, value] of Object.entries(data)) {
      finaldata[i]={"source":data[i]["source"]["name"],"title":data[i]["title"],
        "description":data[i]["description"],"url":data[i]["url"],"urlToImage":data[i]["urlToImage"],"publishedAt":data[i]["publishedAt"]}
      i=i+1
    }
    // console.log(finaldata[0])
    res.send(finaldata)
  })
    .catch(err => { console.log('error')})
})


app.get('/details/charts/:ticker/:lastdate', function (req, res) {
  // let finaldata=[]
  console.log("inside summary chart backend")
  let ticker=req.params.ticker;
  let lastdate=req.params.lastdate;
  console.log(ticker);
  console.log(lastdate);
  let date_ob = new Date(lastdate);
  let yyyy = date_ob.getFullYear();
  let mm=date_ob.getMonth()+1;
  let dd=date_ob.getDate();
  let priordate=yyyy+'-'+mm+'-'+dd;
  console.log(priordate);
  fetch("https://api.tiingo.com/iex/"+ticker+"/prices?startDate="+priordate+"&resampleFreq=4min&token="+APIKeyTiingo)
    .then(response => response.json()).then(data => {
    // console.log(data)

    res.send(data)
  })
    .catch(err => { console.log('error')})
})


app.get('/details/smachart/:ticker',function (req, res) {
  // let finaldata=[]
  let ticker=req.params.ticker;
  let date_ob = new Date();
  let yyyy = date_ob.getFullYear()-2;
  let mm=date_ob.getMonth();
  let dd=date_ob.getDate();
  let priordate=yyyy+'-'+mm+'-'+dd;
  // priordate=formatDate(priordate);
  fetch("https://api.tiingo.com/tiingo/daily/"+ticker+"/prices?startDate="+priordate+"&resampleFreq=daily&token="+APIKeyTiingo)
    .then(response => response.json()).then(data => {
    // console.log(data)
    res.send(data)
  })
    .catch(err => { console.log('error')})
})


const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}...`));

