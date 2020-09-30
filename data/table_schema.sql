-- DATABASED NAME: houses

-- CREATE TABLES 
CREATE TABLE metropolitan_zone (
	id_mzone SERIAL PRIMARY KEY,
	description VARCHAR(60) NOT NULL);

SELECT * FROM metropolitan_zone;

CREATE TABLE cities (
	id_city SERIAL PRIMARY KEY,
	description_city VARCHAR(100) NOT NULL,
	id_mzone INT NOT NULL,
	crime_idx INT NOT NULL,
	city_lat FLOAT, 
	city_long FLOAT,
	FOREIGN KEY (id_mzone) REFERENCES metropolitan_zone(id_mzone));
	
--DROP TABLE cities;

SELECT * FROM cities;

CREATE TABLE place_type (
	id_place_type SERIAL PRIMARY KEY,
	description_place VARCHAR(100) NOT NULL);

SELECT * FROM place_type;

CREATE TABLE crime_subtype (
	id_crime_subtype SERIAL PRIMARY KEY,
	description_subtype VARCHAR(60) NOT NULL);

SELECT * FROM crime_subtype;

CREATE TABLE crime_type (
	id_crime_type_subtype SERIAL PRIMARY KEY,
	id_crime_type INT,
	description_type VARCHAR(100) NOT NULL,
	id_crime_subtype INT,
	FOREIGN KEY (id_crime_subtype) REFERENCES crime_subtype(id_crime_subtype));

SELECT * FROM crime_type;

CREATE TABLE crime_detail (
	id_crime SERIAL PRIMARY KEY,
	id_city INT NOT NULL,
	id_crime_type_subtype INT NOT NULL,
	year_record INT NOT NULL,  
	month_record INT NOT NULL,
	amount INT NOT NULL,
	FOREIGN KEY (id_city) REFERENCES cities(id_city),
	FOREIGN KEY (id_crime_type_subtype) REFERENCES crime_type(id_crime_type_subtype));

--DROP TABLE crime_detail;

SELECT * FROM crime_detail;

CREATE TABLE places_of_interest (
	id_place SERIAL PRIMARY KEY,
	id_city INT NOT NULL,
	id_place_type INT NOT NULL,
	place_name VARCHAR(100),
	place_lat FLOAT NOT NULL,  
	place_long FLOAT NOT NULL,
	rating FLOAT,
	user_rating_total FLOAT,
	FOREIGN KEY (id_place_type) REFERENCES place_type(id_place_type),
	FOREIGN KEY (id_city) REFERENCES cities(id_city));

--DROP TABLE places_of_interest;

SELECT * FROM places_of_interest;

CREATE TABLE houses (
	id_publicacion SERIAL PRIMARY KEY,
	id_city INT NOT NULL,
	house_lat FLOAT NOT NULL,  
	house_long FLOAT NOT NULL,
	rooms INT,
	bathrooms INT,
	squared_meters FLOAT,
	builded_squared_meters FLOAT,
	house_details VARCHAR(3000),
	address VARCHAR(1000),
	price FLOAT NOT NULL,
	FOREIGN KEY (id_city) REFERENCES cities(id_city));
	
--DROP TABLE houses;

SELECT * FROM houses;



