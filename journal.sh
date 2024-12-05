python3 -m venv venv_react_tiles_population
source venv_react_tiles_population/bin/activate

pip install geopandas ipykernel matplotlib
pip install psycopg2-binary python-dotenv flask
pip install tqdm

touch .gitignore
echo "venv*" > .gitignore
echo "key*" >> .gitignore
echo ".env" >> .gitignore
echo "data/*" >> .gitignore

touch 1.0.extract.ipynb && code 1.0.extract.ipynb

# https://www.insee.fr/fr/statistiques/8268848?sommaire=8205966
# https://www.insee.fr/fr/statistiques/fichier/8268848/RP2021_indcvi.zip


# posgresql
# connect to the database
sudo -u postgres psql
CREATE DATABASE population;
CREATE USER yzpt WITH PASSWORD 'pwd';
GRANT ALL PRIVILEGES ON DATABASE population TO yzpt;

\c population
# list tables
\dt
# delete table
DROP TABLE age_sex_pyramid;
select count(*) from age_sex_pyramid;
# ok pour insert pythn script 2.0.postrgesipynb

# list columns of the age_sex_pyramid table
\d age_sex_pyramid
CREATE INDEX idx_codgeo ON age_sex_pyramid (codgeo);


gh repo create react-vector-tiles-demographics --public --confirm

# rm -rf .git
git init
git branch -M main
git remote add origin https://github.com/yzpt/react-vector-tiles-demographics.git
git add .
git commit -m "inserting data to postgres population database"
git push --set-upstream origin main


# ===== tippecanoe =========================================
# setup:
# https://github.com/felt/tippecanoe
# sudo apt-get install gcc g++ make libsqlite3-dev zlib1g-dev
# git clone https://github.com/felt/tippecanoe.git
# cd tippecanoe
# make -j
# sudo make install
tippecanoe -v
# 2.71.0
tippecanoe -o data/communes-100m.mbtiles -z12 data/communes-100m.geojson --force



# ===== tileserver-gl ======================================
# mkdir data
chmod 777 $(pwd)/data
chmod 777 $(pwd)

docker run --rm -it -v $(pwd):/data -p 8080:8080 maptiler/tileserver-gl --file data/communes-100m.mbtiles
# http://localhost:8080/data/communes-100m/{z}/{x}/{y}.pbf


# ===== react ==============================================
# npx create-react-app react-vector-tiles-demographics

# npx create-react-app react-vector-tiles-demographics                                                        
# > npx create-react-app react-vector-tiles-demographics

# Creating a new React app in /home/yohann/projects/react_tiles_population/react-vector-tiles-demographics.

# Installing packages. This might take a couple of minutes.
# Installing react, react-dom, and react-scripts with cra-template...


# added 1313 packages in 1m

# 260 packages are looking for funding
#   run `npm fund` for details

# Installing template dependencies using npm...
# npm error code ERESOLVE
# npm error ERESOLVE unable to resolve dependency tree
# npm error
# npm error While resolving: react-vector-tiles-demographics@0.1.0
# npm error Found: react@19.0.0
# npm error node_modules/react
# npm error   react@"^19.0.0" from the root project
# npm error
# npm error Could not resolve dependency:
# npm error peer react@"^18.0.0" from @testing-library/react@13.4.0
# npm error node_modules/@testing-library/react
# npm error   @testing-library/react@"^13.0.0" from the root project
# npm error
# npm error Fix the upstream dependency conflict, or retry
# npm error this command with --force or --legacy-peer-deps
# npm error to accept an incorrect (and potentially broken) dependency resolution.
# npm error
# npm error
# npm error For a full report see:
# npm error /home/yohann/.npm/_logs/2024-12-05T19_21_08_252Z-eresolve-report.txt
# npm error A complete log of this run can be found in: /home/yohann/.npm/_logs/2024-12-05T19_21_08_252Z-debug-0.log
# `npm install --no-audit --save @testing-library/jest-dom@^5.14.1 @testing-library/react@^13.0.0 @testing-library/user-event@^13.2.1 web-vitals@^2.1.0` failed





# rm -rf react-vector-tiles-demographics
# npx create-react-app react-vector-tiles-demographics --legacy-peer-deps
npx create-react-app react-vector-tiles-demographics --force
echo "react-vector-tiles-demographics/node_modules" >> .gitignore
echo "node_modules/" >> .gitignore

cd react-vector-tiles-demographics
npm install react-map-gl mapbox-gl
npm install web-vitals
npm start

pip install flask-cors
python3 flask_app.py
cd react-vector-tiles-demographics && npm start


cd react-vector-tiles-demographics
npm install plotly.js react-plotly.js

npm install react-dom
