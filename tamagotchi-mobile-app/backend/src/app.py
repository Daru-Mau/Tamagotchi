from flask import Flask
from backend.src.routes.routes import api_routes

app = Flask(__name__)

# Register the API routes
app.register_blueprint(api_routes)

if __name__ == "__main__":
    app.run(debug=True)