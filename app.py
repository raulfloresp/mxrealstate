#################################################
#                      Imports                  #
#################################################
from flask import Flask, jsonify
import json
from flask_cors import CORS
from config import key as password
from sqlalchemy import create_engine
import pandas as pd

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
    parameters = f'otra'

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
        f"/api/v1.0/category<br/>"
        f"/api/v1.0/nutrients<br/>"
        f"/api/v1.0/onChangeCategory/idCategory<br/>"
        f"/api/v1.0/onChangeFood/idCategory<br/>"
        f"/api/v1.0/onChangeNutrient/idNutrient"
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
        "places":[]
    }
   
    ## Retrieve food descriptions in selected category 
    postgreSQL_select_houses = ("SELECT ho.id_publicacion,ho.id_city,ho.house_lat ,ho.house_long, " +
                                    " ho.rooms,ho.bathrooms,ho.squared_meters,ho.builded_squared_meters, " +
                                    " ho.address, ho.price, ci.crime_idx " +
                                    " FROM houses ho " +
                                    " INNER JOIN cities ci " +
                                    " ON ho.id_city = ci.id_city" +
                                    " WHERE id_mzone = " +  id_mzone +
	                                "       AND ho.price >= '" + min_presupuesto + "'"+
                                    "       AND ho.price <= '" + max_presupuesto + "'")
    
    print(postgreSQL_select_houses)

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
    
    connection.close()
    
    # Return json with descriptions 
    return resultHousesCrimePlaces

@app.route("/housesPrices_filter/<id_city>/<min_presupuesto>/<max_presupuesto>/<id_publicacion>")
def getSuggestedPrice(id_city,min_presupuesto,max_presupuesto,id_publicacion):
    resultHousesPrice = {
        "houses":[],
        "suggested_price": 0 
    }
   
    ## Retrieve food descriptions in selected category 
    postgreSQL_select_houses = ("SELECT ho.id_publicacion,ho.id_city,ho.house_lat ,ho.house_long, " +
                                    " ho.rooms,ho.bathrooms,ho.squared_meters,ho.builded_squared_meters, " +
                                    " ho.address, ho.price, ci.crime_idx " +
                                    " FROM houses ho " +
                                    " INNER JOIN cities ci " +
                                    " ON ho.id_city = ci.id_city" +
                                    " WHERE ho.id_city = " +  id_city +
	                                "       AND price >= '" + min_presupuesto + "'"
                                    "       AND price <= '" + max_presupuesto) + "'"

    postgreSQL_select_publicacion = ("SELECT squared_meters,builded_squared_meters  " +
                                    " FROM houses " +
                                    " WHERE id_publicacion = " +  id_publicacion )
    
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
        resultHousesPrice["houses"].append(json_houses_data)

    publication_data = connection.execute(postgreSQL_select_publicacion)
    df_publication_data = pd.DataFrame(publication_data)

    print(df_publication_data)
    connection.close()

    # from tensorflow.keras.models import load_model
    # houses_model = load_model("house_model_trained.h5")
    
    # prediction = houses_model.predict(df_publication_data)
    # resultHousesPrice["suggested_price"] = prediction[0][0]

    # Return json with descriptions 
    return resultHousesPrice


#################################################
#                    Run App                    #
#################################################
if __name__ == '__main__':
    app.run()