const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connections = {};
const pendingResponses = {};
const id = 'myapp';

// دعم JSON body (مهم لطلبات POST)
app.use(express.json());

wss.on('connection', (ws, req) => {
  connections[id] = ws;
  console.log(`Client ${id} connected`);

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      const { requestId } = data;


      
      if (requestId && pendingResponses[requestId]) {
      
     
        pendingResponses[requestId](data);
        delete pendingResponses[requestId];
      }
    } catch (err) {
      console.error('❌ Invalid JSON from client:', err.message);
    }
  });

  ws.on('close', () => {
    delete connections[id];
    console.log(`Client ${id} disconnected`);
  });
});

// كل الطلبات تذهب إلى العميل
app.use((req, res) => {


    res.setHeader('Access-Control-Allow-Origin', '*'); // أو أصل معين
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  const ws = connections[id];
  if (!ws) return res.status(404).send('Client not connected');

  const requestId = Math.random().toString(36).slice(2);



  let url = req.originalUrl // original url with custom 

  let requestData = {
    requestId,
    method: req.method,
    url: url,
    headers: req.headers,
    body: req.body
  };
  // custom url  
  if(url.includes('api')){
   requestData.url =`:3081${url}`  // example: if use port in url localhost
  } else
  if(url.includes('fastmart-data'))  // example: if url get image or file
  {
   requestData.responseType= 'arraybuffer'
    
  }






  // إرسال للعميل
  ws.send(JSON.stringify(requestData));

  // انتظار الرد  1 دقيقة انتظار
  const timeout = setTimeout(() => {
    delete pendingResponses[requestId];
    res.status(504).send('Gateway Timeout');
  }, 10 * 1000); // 1 دقيقة انتظار

  pendingResponses[requestId] = (clientResponse) => {
    clearTimeout(timeout);
     let data = clientResponse.data 

    if(clientResponse.responseType === 'arraybuffer'){
      res.setHeader('Content-Type', clientResponse.contentType);

      data = Buffer.from(data, 'base64');
    }
    else
    {
        res.setHeader('Content-Type', 'application/json');
    }
    res.status(clientResponse.status || 200).send(data);
  };
});

server.listen(8080, () => console.log('Relay running on port 8080'));
