from flask import Flask, render_template,redirect, url_for,session, jsonify,request


app=Flask(__name__)
app.secret_key="ninja"
@app.route("/")
@app.route("/login")
def login():
    return render_template("login.html",title="Login")

@app.get("/dashboard")
def home():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("home.html", title="Home")


@app.route("/logout")
def logout():
    if "user" not in session:
        return redirect(url_for("login"))
    session.pop("user")
    print("user deleted successful!")
    return redirect(url_for("login"))




@app.post("/login/sessions")
def createSessions():
    data= request.get_json()
    id=data["id"]
    token=data["token"]
    role=data["role"]
    user={"id":id, "token":token, "role":role}
    session["user"]=user
    print(user)
    return jsonify({"message":"Session added"}), 201

if __name__=="__main__":
    app.run(debug=True,port=7000)