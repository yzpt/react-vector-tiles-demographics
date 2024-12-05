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


gh repo create react-vector-tiles-demographics --public --confirm

# rm -rf .git
git init
git branch -M main
git remote add origin https://github.com/yzpt/react-vector-tiles-demographics.git
git add .
git commit -m "inserting data to postgres population database"
git push --set-upstream origin main
