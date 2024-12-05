from flask import Flask, jsonify, request
from flask_cors import CORS

import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT"),
        dbname=os.getenv("POSTGRES_DATABASE"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )

@app.route('/data')
def get_filtered_data():
    """
    Get the data from the database, filtered by CODGEO parameter
    and optionally grouped by age range.
    Example: http://localhost:5000/data?CODGEO=59350&range=10
    """
    codgeo = request.args.get('CODGEO')
    if not codgeo:
        return jsonify({"error": "CODGEO parameter is required"}), 400

    age_range = request.args.get('range', default=None, type=int)

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT SEXE, AGED100, NB
        FROM age_sex_pyramid
        WHERE CODGEO = %s
    """, (codgeo,))
    rows = cur.fetchall()

    # Structure the data as a list of dictionaries
    data = [{"SEXE": row[0], "AGED100": row[1], "NB": row[2]} for row in rows]

    # Group by age range if range parameter is provided
    if age_range:
        grouped_data = {}
        for entry in data:
            age = entry["AGED100"]
            group_key = f"{(age // age_range) * age_range}-{((age // age_range) + 1) * age_range - 1}"
            if group_key not in grouped_data:
                grouped_data[group_key] = {"MALE": 0, "FEMALE": 0}
            if entry["SEXE"] == 1:
                grouped_data[group_key]["MALE"] += entry["NB"]
            elif entry["SEXE"] == 2:
                grouped_data[group_key]["FEMALE"] += entry["NB"]

        # Transform grouped_data into a list for JSON response
        data = [{"AGE_GROUP": group, "MALE": count["MALE"], "FEMALE": count["FEMALE"]}
                for group, count in grouped_data.items()]

    cur.close()
    conn.close()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
