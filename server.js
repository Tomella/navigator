// Serve up static content only.
import express from "express";
import config from "./lib/config.js";

const port = 3000;

run().then(() => console.log("Running"));

async function run() {

   //const modRouter = new ModRouter();
   var app = express();

   // serve static files
   //app.use(express.static("web"));

   // Typically, we take some npma installed caode and allow them through as static content.
   if(config.staticMappings) {
      config.staticMappings.forEach(map => {
         app.use(map.path, express.static(map.mapping));
      })
   }
   
    app.listen(port, function (err) {
        console.log("running server on port " + port);
    });

}

