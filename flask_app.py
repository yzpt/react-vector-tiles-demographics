from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(
        host="localhost", database="your_database", user="your_user", password="your_password"
    )

@app.route('/data')
def get_filtered_data():
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
