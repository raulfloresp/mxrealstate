#################################################
#                      Imports                  #
#################################################
from flask import Flask, jsonify, render_template
import json
from flask_cors import CORS
from config import key as password
from sqlalchemy import create_engine
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)

#################################################
# Set Env to prod when pushing changes to Master 
# branch, for local environment set to dev.
# Note: Make sure to update the 
#################################################
ENV = 'dev'

if ENV == 'dev':
    # app.debug = True
    parameters = f'postgresql+psycopg2://postgres:{password}@localhost:5432/houses'
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'
else:
    # app.debug = False
    parameters = f'postgres://rckfecgbjhzqbs:c6a8e20cc6950a3d6cffb277853f5f24209635f4e1297324d3e79c5d41fcef02@ec2-3-210-255-177.compute-1.amazonaws.com:5432/d2t3v6h0hju42m'

# Posgre connection
engine = create_engine(parameters)


#################################################
#                   Endpoints                   #
#################################################
@app.route('/')
def index():
    ## API Description 
    return (
    
        f"Welcome to houses analysis API!<br/>"
        f"Available Routes:<br/>"
        f"/metropoli_zone<br/>"
        f"/cities/<id_mzone><br/>"
        f"/housesCrimePlaces_filter/<id_mzone>/<id_city>/<min_presupuesto>/<max_presupuesto><br/>"
        f"/housesPrices_filter/<id_city>/<min_presupuesto>/<max_presupuesto>/<id_publicacion><br/>"
        
    )

@app.route("/metropoli_zone")
def getMetropolitanAreas():
    ## Retrieve metropolitan zones data 
    postgreSQL_select_met_zone = "SELECT * FROM metropolitan_zone;"
    connection = engine.connect()
    met_zone_catalog = connection.execute(postgreSQL_select_met_zone)
    connection.close()
    
    # Return json with metropoli id and description 
    return json.dumps([dict(r) for r in met_zone_catalog])

@app.route("/cities/<id_mzone>")
def getCities(id_mzone):
    ## Retrieve food descriptions in selected category 
    postgreSQL_select_cities = ("SELECT id_city,description_city " +
                                    " FROM cities" + 
	                                "   WHERE id_mzone= " + id_mzone)
    connection = engine.connect()
    cities_desc = connection.execute(postgreSQL_select_cities)
    connection.close()
    
    # Return json with descriptions 
    return json.dumps([dict(r) for r in cities_desc])

@app.route("/housesCrimePlaces_filter/<id_mzone>/<id_city>/<min_presupuesto>/<max_presupuesto>")
def getHousesCrimePlaces(id_mzone,id_city,min_presupuesto,max_presupuesto):
    resultHousesCrimePlaces = {
        "houses":[],        
        "crimes":[],
        "places":[],
        "city_coordinates":[]        
    }
   
    ## Retrieve food descriptions in selected category 
    postgreSQL_select_houses = ("SELECT ho.id_publicacion,ho.id_city,ho.house_lat ,ho.house_long, " +
                                    " ho.rooms,ho.bathrooms,ho.squared_meters,ho.builded_squared_meters, " +
                                    " ho.address, ho.price, ci.crime_idx " +
                                    " FROM houses ho " +
                                    " INNER JOIN cities ci " +
                                    " ON ho.id_city = ci.id_city" +
                                    " WHERE ho.id_city = " + id_city  +
	                                "       AND ho.price >= '" + min_presupuesto + "'"+
                                    "       AND ho.price <= '" + max_presupuesto + "'")  
    
    postgreSQL_select_crime = ("SELECT ct.description_type, sum(cd.amount)" +
                                    "  FROM crime_detail cd" +
	                                "       INNER JOIN crime_type  ct  " + 
                                    "           ON  cd.id_crime_type_subtype = ct.id_crime_type_subtype " + 
                                    "  WHERE id_city = " + id_city +
                                    "  GROUP BY ct.description_type")
    
    postgreSQL_select_places = ("SELECT pt.description_place, pi.place_name,pi.place_lat," +
                                    "  pi.place_long,pi.rating,pi.user_rating_total" +
                                    "  FROM places_of_interest pi" +
	                                "       INNER JOIN place_type pt  " + 
                                    "           ON pi.id_place_type = pt.id_place_type" + 
                                    "  WHERE id_city = " + id_city)
                                    



    postgreSQL_city_coordinates = ("select city_lat,city_long" +
                                    "  from cities" +
                                    "  where id_city = " + id_city)

    connection = engine.connect()
    
    filtered_houses = connection.execute(postgreSQL_select_houses)
    for row in filtered_houses:
        json_houses_data={}
        json_houses_data["id_publicacion"] = row[0]
        json_houses_data["id_city"] = row[1]
        json_houses_data["house_lat"] = row[2]
        json_houses_data["house_long"] = row[3]
        json_houses_data["rooms"] = row[4]
        json_houses_data["bathrooms"] = row[5]
        json_houses_data["squared_meters"] = row[6]
        json_houses_data["builded_squared_meters"] = row[7]
        json_houses_data["address"] = row[8]
        json_houses_data["price"] = row[9]
        json_houses_data["crime_idx"] = row[10]
        resultHousesCrimePlaces["houses"].append(json_houses_data)

    filtered_crime = connection.execute(postgreSQL_select_crime)
    for row in filtered_crime:
        json_crimes_data={}
        json_crimes_data["description_type"] = row[0]
        json_crimes_data["amount"] = row[1]
        resultHousesCrimePlaces["crimes"].append(json_crimes_data)

    filtered_places = connection.execute(postgreSQL_select_places)
    for row in filtered_places:
        json_places_data={}
        json_places_data["description_place"] = row[0]
        json_places_data["place_name"] = row[1]
        json_places_data["place_lat"] = row[2]
        json_places_data["place_long"] = row[3]
        json_places_data["rating"] = row[4]
        json_places_data["user_rating_total"] = row[5]
        resultHousesCrimePlaces["places"].append(json_places_data)
    
    filtered_city_coordinates = connection.execute(postgreSQL_city_coordinates)
    for row in filtered_city_coordinates:
        json_city_coordinates_data={}
        json_city_coordinates_data["city_lat"] = row[0]
        json_city_coordinates_data["city_long"] = row[1]
        resultHousesCrimePlaces["city_coordinates"].append(json_city_coordinates_data)
    
    
    connection.close()
    
    # Return json with descriptions 
    return resultHousesCrimePlaces

@app.route("/housesPrices_filter/<id_mzone>/<id_city>/<min_presupuesto>/<max_presupuesto>/<selected_id_publicacion>")
def getSuggestedPrice(id_mzone,id_city,min_presupuesto,max_presupuesto,selected_id_publicacion):
    resultHousesPrice = {
        "house":[],
        "places":[],
        "suggested_price": "" 
    }
   
    ## Retrieve food descriptions in selected category 
    postgreSQL_select_houses = ("SELECT ho.id_publicacion,ho.id_city,ho.house_lat ,ho.house_long, " +
                                    " ho.rooms,ho.bathrooms,ho.squared_meters,ho.builded_squared_meters, " +
                                    " ho.address, ho.price, ci.crime_idx " +
                                    " FROM houses ho " +
                                    " INNER JOIN cities ci " +
                                    " ON ho.id_city = ci.id_city" +
                                    " WHERE ho.id_publicacion = " +  selected_id_publicacion)

    postgreSQL_select_places = ("SELECT pt.description_place, pi.place_name,pi.place_lat," +
                                    "  pi.place_long,pi.rating,pi.user_rating_total" +
                                    "  FROM places_of_interest pi" +
	                                "       INNER JOIN place_type pt  " + 
                                    "           ON pi.id_place_type = pt.id_place_type" + 
                                    "  WHERE id_city = " + id_city)

    connection = engine.connect()
    filtered_houses = connection.execute(postgreSQL_select_houses)
        
    for row in filtered_houses:
        json_houses_data={}
        json_houses_data["id_publicacion"] = row[0]
        json_houses_data["id_city"] = row[1]
        json_houses_data["house_lat"] = row[2]
        json_houses_data["house_long"] = row[3]
        json_houses_data["rooms"] = row[4]
        json_houses_data["bathrooms"] = row[5]
        json_houses_data["squared_meters"] = row[6]
        json_houses_data["builded_squared_meters"] = row[7]
        json_houses_data["address"] = row[8]
        json_houses_data["price"] = row[9]
        json_houses_data["crime_idx"] = row[10]
        resultHousesPrice["house"].append(json_houses_data)
        filtered_places = connection.execute(postgreSQL_select_places)
        
    filtered_places = connection.execute(postgreSQL_select_places)    
    for row in filtered_places:
        json_places_data={}
        json_places_data["description_place"] = row[0]
        json_places_data["place_name"] = row[1]
        json_places_data["place_lat"] = row[2]
        json_places_data["place_long"] = row[3]
        json_places_data["rating"] = row[4]
        json_places_data["user_rating_total"] = row[5]
        resultHousesPrice["places"].append(json_places_data)

    
    connection.close()

    # Get the suggested priced by using a Scikit-Learn linear regression
    
    # Building the array for the prediction 
    X_to_predict=[int(resultHousesPrice["house"][0]["builded_squared_meters"]),int(resultHousesPrice["house"][0]["squared_meters"]),int(id_city)]

    X_to_predict_numpy = np.asarray(X_to_predict)

    X_to_predict_reshaped = X_to_predict_numpy.reshape(1,-1) 

    # Choosing the model to use 
    if int(id_mzone) == 1:
            route_model = "scikit_learn_models/cd_mx_model03.pkl"
    elif int(id_mzone) == 2:
            route_model = "scikit_learn_models/mty_model06.pkl"
    else:
            route_model = "scikit_learn_models/gdl_model09.pkl"
   
    # load_model
    mty_houses_model = pickle.load(open(route_model, "rb"))
    

    # Predict suggested price for selected house 
    prediction = mty_houses_model.predict(X_to_predict_reshaped)
    print(prediction[0])
    resultHousesPrice["suggested_price"] = '${:,.2f}'.format(round(prediction[0][0],0))

    # Return json with descriptions 
    return resultHousesPrice


#################################################
#                    Run App                    #
#################################################
if __name__ == '__main__':
    app.run(debug=True)