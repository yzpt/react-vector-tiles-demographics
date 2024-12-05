from flask import Flask, jsonify, request
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

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
    Example: http://localhost:5000/data?CODGEO=59350
    """
    codgeo = request.args.get('CODGEO')
    if not codgeo:
        return jsonify({"error": "CODGEO parameter is required"}), 400

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

    cur.close()
    conn.close()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

