import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.routes import api_routes
from routes.auth import auth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


def create_app(test_config=None):
    """Create and configure the Flask application"""
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        DATABASE_URI=os.environ.get('DATABASE_URI', 'sqlite:///tamagotchi.db'),
        MONGODB_URI=os.environ.get(
            'MONGODB_URI', 'mongodb://localhost:27017/tamagotchi'),
        JWT_SECRET_KEY=os.environ.get(
            'JWT_SECRET_KEY', 'Tamagotchi_JWT_Secret_2025'),
        DEBUG=os.environ.get('FLASK_ENV') == 'development'
    )

    # Enable CORS for all routes
    CORS(app)

    # Register blueprints
    app.register_blueprint(api_routes, url_prefix='/api')
    app.register_blueprint(auth, url_prefix='/auth')

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    # Add a health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "Tamagotchi API is running!"})

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get(
        'FLASK_ENV') == 'development')
