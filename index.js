//criptos project
//importing the express module
const express = require("express");
//importing axios module
const axios = require("axios");
//importing cheerio module
const cheerio = require("cheerio");
//importing colors module
const colors = require("colors");

//creating the server
const app = express();

//function to get cripto prizes
const getCriptoPrizes = async () => {
  try {
    //setting the url
    const url = "https://coinmarketcap.com/es/";
    //getting the data
    const { data } = await axios({
      method: "GET",
      url: url,
    });

    //values
    const values = [
      "id",
      "nombre",
      "precio",
      "hora",
      "dia",
      "semana",
      "marketCap",
      "volumen",
      "circulacion"
    ];

    //using cheerio to get the data
    const $ = cheerio.load(data);
    //getting the selector
    const elementSelector = ".sc-beb003d5-3 > tbody:nth-child(3) > tr";
    //creating the array to save the data
    const objectsValues = [];
    //calling the data and iretating it
    $(elementSelector).each((getIndex, getElement) => {
      //console.log(getElement);

      let indexValue = 0;

      //building the json whith fields and values
      const objects = {};

      //obtaining the data from the selector and iretating it
      if (getIndex <= 9) {
        $(getElement)
          .children()
          .each((getChildIndex, getChildElement) => {
            //printing the data in the console
            //console.log($(getChildElement).text());

            let tdValue = $(getChildElement).text();

            //if td value is not empty
            if (tdValue) {
                //adding the values to the json
                //console.log(`${values[indexValue]}: ${tdValue}`.green);
                //adding the values to the json
                objects[values[indexValue]] = tdValue;
                indexValue++;
            }

          });

          //printing the json
          objectsValues.push(objects);
        }
        
      });
      
      //console.log(objectsValues);
      return objectsValues;
    //its necesary parse the data

    //returning the data
    //console.log(data);
    //console.log($);
  } catch (error) {
    console.log(error);
  }
};

//setting the port
const port = 3000;

//setting the route
app.get('/api/prizes', async (req, res) => {
    try {
        const prizes = await getCriptoPrizes();
        //printing the data in table format
        //console.table(prizes);
        return res.status(200).json({
            prizes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    res.send('ENJOY THE CRIPTOS');
});

//listening the port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
