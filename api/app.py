from flask import Flask,request, make_response
from flask_cors import CORS
import sqlite3
import base64
import json
import os
from geopy.geocoders import GoogleV3
import re
import secrets
import boto3
import time
import shutil
from datetime import datetime, timedelta
app = Flask(__name__)
client = boto3.client('ses', aws_access_key_id="AKIA2ZY5M47N7Y2RZ2HO", aws_secret_access_key="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", region_name="us-east-2")
cors = CORS(app, resources=[r"/*"], origins= ["http://localhost:3000"], supports_credentials=True)

@app.route("/api/reset", methods=["POST"])
def reset_db():
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        cur.execute("""DROP TABLE IF EXISTS MANAGEDPROPS """)
        cur.execute("""DROP TABLE IF EXISTS USERS """)
        cur.execute("""DROP TABLE IF EXISTS SESSIONS """)
        cur.execute("""DROP TABLE IF EXISTS PROPERTIES """)
        for root,dirs,files in os.walk('../real-estate/build'):
            for i in dirs:
                shutil.rmtree(os.path.join(root,i))
        cur.execute(""" CREATE TABLE PROPERTIES (ID integer PRIMARY KEY,
                                                ADDRESS string NOT NULL,
                                                CITY string NOT NULL,
                                                PRICE real NOT NULL,
                                                AFEE real NOT NULL,
                                                SDEPO real NOT NULL,
                                                BEDS real NOT NULL,
                                                BATHS real NOT NULL,
                                                DIM real NOT NULL,
                                                PETS string,
                                                DATE string NOT NULL,
                                                CONTACT string NOT NULL,
                                                SUMMARY string,
                                                LAT real NOT NULL,
                                                LNG real NOT NULL
                                               )
                                                """)
        cur.execute("""CREATE TABLE USERS (ID integer PRIMARY KEY,
                                          USERNAME string NOT NULL,
                                          PASSWORD string NOT NULL,
                                          EMAIL string NOT NULL,
                                          ADDRESS string,
                                          CONFIRMED integer DEFAULT 0,
                                          LINK string NOT NULL,
                                          ADMIN integer DEFAULT 0,
                                          UNIT string,
                                          TIMESTAMP string NOT NULL) """)
        cur.execute(""" CREATE TABLE SESSIONS (ID string, 
                                              ADMIN integer DEFAULT 0,
                                              USER string NOT NULL,
                                              CSRF string,
                                              TIMESTAMP string NOT NULL,
                                              PRIMARY KEY(ID, CSRF)) """)
        cur.execute(""" CREATE TABLE MANAGEDPROPS (ID integer PRIMARY KEY, 
                                                    ADDRESS string NOT NULL,
                                                    MAINTENENCE string NOT NULL) """)
        return {"success" : True}
          
        
@app.route("/api/add", methods=["POST"])
def add():
    if(not verify(request.cookies.get("sessionid"), request.form.get("csrf"))):
        return {"success" : False}
    g = GoogleV3("AIzaSyCjl42UhWDtO8hZByUbclFaI72jDs4k9ag")
    r = g.geocode({"formatted_address" : request.form.get('address')}, exactly_one=True)
    city = [i["short_name"] for i in r.raw["address_components"] if 'locality' in i["types"] ]
    lat = r.point.latitude
    lng = r.point.longitude
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        cur.execute("""INSERT INTO PROPERTIES (ADDRESS, CITY, PRICE, AFEE, SDEPO, BEDS, BATHS, DIM, PETS, DATE, CONTACT, SUMMARY, LAT, LNG) VALUES 
                                                                                        (?,?,?,?,?,?,?,?,?,?,?,?,?,? ) """,
                                                                                        
                                                                                        (request.form.get('address').lower(),
                                                                                          city[0],
                                                                                          request.form.get('price'),
                                                                                          request.form.get('app'),
                                                                                          request.form.get('deposit'),
                                                                                          request.form.get('beds'),
                                                                                          request.form.get('baths'),
                                                                                          request.form.get('dim'),
                                                                                          request.form.get('pets'),
                                                                                          request.form.get('date'),
                                                                                          request.form.get('contact'),
                                                                                          request.form.get("summary"),
                                                                                          lat,
                                                                                          lng))
        pk = cur.lastrowid
        for inc,i in enumerate(request.form.getlist("images[]")):
            if(not os.path.exists(f"../real-estate/build/{pk}")):
                os.mkdir(f"../real-estate/build/{pk}")
            f = open(f"../real-estate/build/{pk}/{inc}.jpg","wb+")
            f.write(base64.b64decode(i.split(",")[1]))
            f.close()




    return {"success" : True}

@app.route("/api/search", methods=["GET"])
def ranges():
    cols = ["address", "city", "price", "beds", "pets", "date","baths"]
    query = "SELECT ADDRESS, CITY, PRICE, BEDS, PETS, DATE, BATHS  FROM PROPERTIES"
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        con.row_factory = sqlite3.Row
        ans = []
        for i in cur.execute(query).fetchall():
            ans.append({cols[j] : i[j] for j in range(0,len(i))})

        return json.dumps(ans)


@app.route("/api/geocode", methods=["GET"])
def geocode():
    g = GoogleV3("AIzaSyCjl42UhWDtO8hZByUbclFaI72jDs4k9ag")
    r = g.geocode({"formatted_address" : request.args.get('address')}, exactly_one=True)
    return {"success" : True if r != None else False}

@app.route("/api/properties", methods=["GET"])
def properties():
    query = "SELECT * FROM PROPERTIES"
    cols = ["image","address", "city" , "rent", "appfee" , "deposit", "beds", "baths", "dim", "pets", "date", "contact", "summary", "lat", "lng"]
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        con.row_factory = sqlite3.Row
        ans = []
        for i in cur.execute(query).fetchall():
            d = { cols[j]  : i[j] for j in range(len(i)) }
            d["pk"] = d["image"]
            print(i)
            d["image"] = [str(d["image"]) + "/" +  str(i) for i in os.listdir(f"""../real-estate/build/{d["image"]}""")]
            
            ans.append(d)
        return json.dumps(ans)


@app.route("/api/delete", methods=["POST"])
def delete():
    if(not verify(request.cookies.get("sessionid"), request.form.get("csrf"))):
        return {"success" : False}
    pk = request.form.get('pk')
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        cur.execute(f"DELETE FROM PROPERTIES WHERE ID={pk}")
    return {"success" : True}
@app.route("/api/edit", methods=["POST"])
def edit():
    if(not verify(request.cookies.get("sessionid"), request.form.get("csrf"))):
        return {"success" : False}
    g = GoogleV3("AIzaSyCjl42UhWDtO8hZByUbclFaI72jDs4k9ag")
    r = g.geocode({"formatted_address" : request.form.get('address')}, exactly_one=True)
    city = [i["short_name"] for i in r.raw["address_components"] if 'locality' in i["types"] ]
    lat = r.point.latitude
    lng = r.point.longitude
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        cur.execute("""UPDATE PROPERTIES SET ADDRESS=?, CITY=?, PRICE=?, AFEE=?, SDEPO=?, BEDS=?, BATHS=?, DIM=?, PETS=?, DATE=?, CONTACT=?, SUMMARY=?, LAT=?, LNG=?
                        WHERE ID=?""",
                                                                                        
                                                                                        (request.form.get('address'),
                                                                                          city[0],
                                                                                          request.form.get('price'),
                                                                                          request.form.get('app'),
                                                                                          request.form.get('deposit'),
                                                                                          request.form.get('beds'),
                                                                                          request.form.get('baths'),
                                                                                          request.form.get('dim'),
                                                                                          request.form.get('pets'),
                                                                                          request.form.get('date'),
                                                                                          request.form.get('contact'),
                                                                                          request.form.get("summary"),
                                                                                          lat,
                                                                                          lng,
                                                                                          request.form.get("pk")))
        pk = request.form.get("pk")

        if(not os.path.exists(f"../real-estate/build/{pk}")):
                os.mkdir(f"../real-estate/build/{pk}")
        else:
            for i in os.listdir(f"../real-estate/build/{pk}"):
                if( not f"{pk}/" + str(i) in request.form.getlist("images[]")):
                    os.remove( f"../real-estate/build/{pk}/" + str(i))
                

        for inc,i in enumerate(request.form.getlist("images[]")):
            if(re.match("./.\.jpg",i)):
                os.rename(f"../real-estate/build/{i}", f"../real-estate/build/{pk}/{inc}.jpg")
            else:
                f = open(f"../real-estate/build/{pk}/{inc}.jpg","wb+")
                f.write(base64.b64decode(i.split(",")[1]))
                f.close()
    return {"success" : True}


@app.route("/api/register", methods=["POST"])

def register():
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        name = request.form.get("first").capitalize() + " " + request.form.get("last").capitalize()
        link = secrets.token_hex(16)
        email_msg = f"""<html><head></head><body><p>Hello,</p><p>&nbsp;{name} wants to enroll in the OnePlus portal as a {"admin" if request.form.get("admin") else "tenant"}, navigate to this link to confirm their account.</p>
<p><a href="http://oneplusrealtypropertymanagement.com/api/confirm/{link}" target="_blank" rel="noopener"><button>Confirm</button></a></p>
<p>&nbsp;</p></body></html>"""
        cur.execute("""INSERT INTO USERS (USERNAME, PASSWORD, EMAIL, ADDRESS, CONFIRMED, LINK, ADMIN, TIMESTAMP) VALUES
                                        (?,?,?,?,?,?,?,?) """, (name ,
                                                                request.form.get("password"),
                                                                request.form.get("email").lower(),
                                                                request.form.get("address"),
                                                                0,
                                                                link,
                                                                request.form.get("admin"),
                                                                time.time()
                                                                ))
        pk = cur.lastrowid
        admins = cur.execute(""" SELECT EMAIL FROM USERS WHERE ADMIN=1 AND CONFIRMED=1""").fetchall()
        admins = [i[0] for i in admins]
        sendEmail(admins, email_msg, "ACCOUNT CREATION REQUEST",)
        return {"success" : True }

@app.route("/api/confirm/<hexcode>" , methods=["POST"])
def confirm(hexcode):
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()  
        print(str(hexcode))
        cur.execute(""" UPDATE USERS SET CONFIRMED=1 WHERE LINK=?""", [str(hexcode)])   

        return {"success" : True}

@app.route("/api/users", methods=["GET"])
def users():
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        return json.dumps(cur.execute(""" SELECT * FROM USERS""").fetchall())


def sendEmail(to, msg, sub):
    try:
        client.send_email(Destination={"ToAddresses" : to}, Message={ "Body" : { "Html" : {'Charset' : "UTF-8", "Data" : msg}}, "Subject" : {"Charset" : "UTF-8" , "Data" : sub} }, Source="OnePlus Realty <noreply@oneplusrealty.org>")
    except Exception as e:
        print(e )
        return False
    finally:
        return True 
@app.route("/api/email", methods=["GET"])
def getEmail():
    with sqlite3.connect('test.db') as con:
        con.row_factory = lambda cursor, row: row[0]
        cur = con.cursor()
        
        return json.dumps(cur.execute(""" SELECT EMAIL FROM USERS""").fetchall())

@app.route("/api/login", methods=["POST"])
def createSession():
    sessionid= secrets.token_hex(16)
    csrf = secrets.token_hex(16)
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        if(request.form.get("oauth")):
            query= cur.execute(f"""SELECT CONFIRMED FROM USERS WHERE email=?""" , (request.form.get("email").lower(),)).fetchone()
            admin = cur.execute(f"""SELECT ADMIN FROM USERS WHERE email=?""", (request.form.get("email").lower(),)).fetchone()
            if(query and query[0]):
                cur.execute(f"""INSERT INTO SESSIONS (ID,ADMIN ,USER, CSRF, TIMESTAMP) VALUES (?,?,?,?,?)""", (sessionid, admin[0],request.form.get("email"), csrf,time.time() ))
                resp = make_response({"csrf" : csrf })
                resp.set_cookie("sessionid" , sessionid, expires=datetime.now() + timedelta(days=1))
                return resp

        else:
            query= cur.execute(f"""SELECT PASSWORD, CONFIRMED FROM USERS WHERE email=?""",(request.form.get("email").lower(),)).fetchone()
            print(request.form.get("email").lower())
            admin = cur.execute(f"""    SELECT ADMIN FROM USERS WHERE email=?""",(request.form.get("email").lower(),)).fetchone()
            if(query and query[0] == request.form.get("password") and query[1]):
                cur.execute(f"""INSERT INTO SESSIONS (ID,ADMIN ,USER, CSRF, TIMESTAMP) VALUES (?,?,?,?,?)""", (sessionid, admin[0],request.form.get("email"), csrf,time.time() ))
                resp = make_response({"csrf" : csrf })
                resp.set_cookie("sessionid" , sessionid, expires=datetime.now() + timedelta(days=1))
                return resp
    
        return {"success" : False}

@app.route('/api/managed', methods=["GET"])
def getManaged():
    with sqlite3.connect('test.db') as con:
        con.row_factory = lambda cursor, row: row[0]
        cur= con.cursor()
        return json.dumps(cur.execute(""" SELECT ADDRESS FROM MANAGEDPROPS""").fetchall())

@app.route("/api/session", methods=["GET"])
def verifySession():
    with sqlite3.connect('test.db') as con:
        cur =  con.cursor()
        print(request.args)
        row = cur.execute(f""" SELECT * FROM SESSIONS WHERE ID=?""", (request.cookies.get("sessionid"),)).fetchone()
        if(row):
            cols = ["id" , "admin" , "user" , "csrf", "timestamp"]
            d =  { cols[i] : row[i] for i in range(len(row))}
            print(d)
            return d
        return {}
@app.route("/api/sessions", methods=["GET"])
def session():
        with sqlite3.connect('test.db') as con:
            cur = con.cursor()
            return json.dumps(cur.execute(""" SELECT * FROM SESSIONS""").fetchall())
@app.route("/api/token", methods=["GET"])
def token():
        csrf = secrets.token_hex(16)
        with sqlite3.connect('test.db') as con:
            cur = con.cursor()
            if(request.cookies.get("sessionid")):
                query = cur.execute("""SELECT ADMIN, USER FROM SESSIONS WHERE ID=?""", (request.cookies.get("sessionid"),)).fetchone()
                cur.execute(f"""INSERT INTO SESSIONS (ID,ADMIN ,USER, CSRF, TIMESTAMP) VALUES (?,?,?,?,?)""", (request.cookies.get("sessionid"), query[0], query[1], csrf,time.time() ))
        return {"csrf" : csrf}

@app.route("/api/logout", methods=["GET"])
def logout():
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        cur.execute("""DELETE FROM SESSIONS WHERE ID=?""", (request.cookies.get("sessionid"),))
        resp = make_response({"success" : True})
        resp.set_cookie("sessionid", "", expires=0)
        return resp

@app.route("/api/maintenance")
def maint():
    with sqlite3.connect('test.db') as con:
        cur = con.cursor()
        addr = cur.execute(""" SELECT ADDRESS,UNIT FROM USERS WHERE EMAIL=? """, (request.args.get("email"),)).fetchone()
        email = cur.execute(""" SELECT MAINTENENCE FROM MANAGEDPROPS WHERE ADDRESS=?""",(addr[0], )).fetchone()[0]
        msg = f"<html><body><p>{request.args.get('msg') }</p></body> </html>"
        sendEmail(email, msg , "Maintenance Request " + addr[0] + " " + addr[1])
        return {"success" : True}

def verify(sessionid , csrf):
     with sqlite3.connect('test.db') as con:
        cur =  con.cursor()
        print(request.args)
        row = cur.execute(f""" SELECT * FROM SESSIONS WHERE ID=? and CSRF=?""", (sessionid,csrf)).fetchone()
        if(row):
            return True
        return False
