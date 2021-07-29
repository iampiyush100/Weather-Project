const http = require("http");
const fs = require("fs");
var requests = require('requests');
let homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (oldfileData, orgVal) => {
    let temprature = oldfileData.replace("{%tempval%}", orgVal.main.temp);
    temprature = temprature.replace("{%city%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%mintemp%}", orgVal.main.temp_min);
    temprature = temprature.replace("{%maxtemp%}", orgVal.main.temp_max);
    return temprature;
};

const httpServer = http.createServer((request, response) => {
    if (request.url == "/") {

        requests("https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=0bd3d252b451977b3770882ce883a3e8")
            .on('data', (chunk) => {
                //converting JSON to JS OBJ
                let apiData = JSON.parse(chunk);

                //Converting JS OBJ to Array
                let arrayObj = [apiData];
                // console.log(chunk);
                //  console.log(apiData);
                console.log(arrayObj[0].main.temp);
                //now we the help of map method we can easyly play with array of an array
                var realtimeData = arrayObj.map((val) => replaceVal(homeFile, val)).join("");
                response.write(realtimeData);
            })

            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                response.end();
            });

        // response.writeHead(200, " [content : text/html]");
        // response.end("Welcome to Weather Home Page !!");

    } else {
        response.writeHead(404, " [content : text/html]");
        response.end("404 File Not Found !!");
    }
});
httpServer.listen(2000, "localhost", () => {
    console.log("Server is Started");
})