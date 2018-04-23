
from flask import Flask

def createApp():
    app = Flask(__name__)

    from app.handler import handler as handler_blueprint
    app.register_blueprint(handler_blueprint)

    from app.user import passport as passport_blueprint
    app.register_blueprint(passport_blueprint, url_prefix='/passport')

    return app

app = createApp()

if __name__ == '__main__':
    app.run()