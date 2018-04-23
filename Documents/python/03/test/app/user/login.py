from flask import request, jsonify, render_template

from app.user import passport

@passport.route("/login", methods=["POST","GET"])
def login():
    return render_template("login.html")

@passport.route("/login_do", methods=["POST"])
def login_do():
    data = request.get_data()
    code = request.values.get("code")
    user_name = request.values.get("username")
    password = request.values.get("password")

    
    print(data)