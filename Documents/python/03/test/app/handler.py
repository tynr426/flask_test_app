from flask import Blueprint, render_template

handler = Blueprint('hander', __name__)

@handler.route("/")
def index():
    return render_template("index.html")