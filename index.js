var cors = require("cors");
var express = require("express");
require("./config");
var app = express();
app.use(cors());
app.use(express.json());
var jwt = require('jsonwebtoken');

const mysql = require("mysql");


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ride_app"
});
con.connect((err) => {
    if (!err) {

    }
});

app.post("/bookride", async(req, res) => {





    sql = " SELECT";
    sql += "*,ceil(";
    sql += " 6371 *";
    sql += "ACOS(";
    sql += "COS(RADIANS(" + req.body.pickuplat + ")) *";
    sql += "COS(RADIANS(locationlat)) *";
    sql += "COS(RADIANS(locationlong) - RADIANS(" + req.body.pickuplong + ")) +";
    sql += "SIN(RADIANS(" + req.body.pickuplat + ")) *";
    sql += "SIN(RADIANS(locationlat))";
    sql += ")+1";
    sql += ") as distance from drivers  left join cars ON cars.driver_id=drivers.id left join car_type on cars.car_type=car_type.car_type_id  having car_type.car_type_name='" + req.body.CarType + "'   limit 1";




    con.query(sql, [req.body.CarType], (err, result) => {
        console.log(result);


        if (result != undefined) {



            if (result[0]) {
                driver_id = result[0].id;




                data = {
                    customer_name: req.body.customerName,
                    customer_number: req.body.customerNumber,
                    pickup_loc: req.body.pickup,
                    dropOff_loc: req.body.dropOff,
                    pickup_lat: req.body.pickuplat,
                    pickup_long: req.body.pickuplong,
                    bookingDate: req.body.bookingDate,
                    bookingTime: req.body.bookingTime,

                    dropOfflat: req.body.dropOfflat,
                    dropofflong: req.body.dropofflong,
                    estimatedFare: req.body.estimatedFare,
                    driver_id: driver_id,
                    status: 2,
                    car_id: result[0].car_id
                }


                con.query("insert into ride SET ?", data, (err, result, feild) => {


                    ride_id = result.insertId;
                    console.log(ride_id);
                    token = jwt.sign({ rides_id: ride_id }, 'riderapp ');





                    rideObject = {
                        msg: " Driver Found For selected Car Type For You ",
                        ride_id: ride_id,
                        token: token,
                        status: "success"

                    }


                    res.send(rideObject);

                });
            } else {


                rideObject = {
                    msg: " Driver Found For selected Car Type For You You",
                    ride_id: 0,
                    token: "",
                    status: "error"

                }
                res.send(rideObject);

            }

        } else {

            res.send({ msg: "No Ride Found For You You", ride_id: 0 });
        }
    });

    /*


        */
});
app.get("/cartype/:typecar?", async(req, res) => {
    CarType = req.params.typecar;
    sql = "SELECT car_type.*,cars.* ,drivers.* FRom car_type left join cars ON cars.car_type=car_type.car_type_id left JOIN drivers ON drivers.id=cars.driver_id WHERE car_type_name=?";

    con.query(sql, [CarType], async(err, result) => {






        return res.json({ "msg": "Car type found", "data": result }).status(200);


    });






});

app.get("/driverdistancemin/:typecar?", async(req, res) => {
    CarType = req.params.typecar;

    console.log(CarType);
    sql = "SELECT  ifnull(locationlong,0) as driverlong,ifnull(locationlat,0) as driverlat FRom car_type left join cars ON cars.car_type=car_type.car_type_id left JOIN drivers ON drivers.id=cars.driver_id WHERE car_type_name=?";

    con.query(sql, [CarType], async(err, result) => {






        return res.json({ "msg": "Car type found", "data": result }).status(200);


    });






});







app.get("/ride_detail/:id", async(req, res) => {

    ride_id = req.params.id;

    sql = " SELECT";
    sql += " ride.* , drivers.driver_name,drivers.driver_mobile,drivers.locationlat as driverlat,drivers.locationlong as driverlong,";
    sql += "   cars.number_plate,colors.color_name as car_color ,CONCAT(maker_name,' ',model_name)	as car_detail,car_type.car_type_name";
    sql += "  from ride left JOIN drivers ON ride.driver_id=drivers.id ";
    sql += "  left join cars ON ride.car_id=cars.car_id ";
    sql += " left join colors ON colors.color_id=cars.color ";
    sql += "  left join car_model ON cars.model=car_model.model_id ";
    sql += "  left join car_maker ON cars.maker_car =car_maker.maker_id  ";
    sql += "  left join car_type ON cars.car_type=car_type.car_type_id  ";
    sql += "  WHERE ride_id =" + ride_id;
    con.query(sql, (err, result) => {


        res.send(result);
    });


});

app.listen(5000);