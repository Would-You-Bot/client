const Prometheus = require('prom-client');
const register = new Prometheus.Registry();

Prometheus.collectDefaultMetrics({ register });

const http = require('http');
const server = http.createServer(async (req, res) => {
  const serverGrowthGauge = new Prometheus.Gauge({ name: 'server_growth', help: 'The number of new servers added to the server in the last hour' });
  if (req.url === '/metrics') {
    const metrics = await register.metrics();


  serverGrowthGauge.set(100);
    res.setHeader('Content-Type', register.contentType);
    res.end(metrics);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(9091);



console.log('Server listening on port 9090');