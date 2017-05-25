const app = require('./app/route');

const port = process.env.PORT || 8000;



app.listen(port, '0.0.0.0', function (err) {
  if (err) {

  	console.log(err);
    throw err
  }

  console.log(`server is listening on ${port}...`)
});


