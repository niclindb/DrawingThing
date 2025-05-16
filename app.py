from flask import *
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import os
from dotenv import load_dotenv
import mimetypes

load_dotenv()

# the mime types for js and ts dont get set automatically for some reason :(
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/typescript', '.ts')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SOCKET_SECRET')
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/draw")
def draw():
    if (not "groupCode" in session):
        return redirect("/join")
    return render_template("draw.html")

@app.route("/join", methods=["GET", "POST"])
def joinGroup():
    if request.method == 'POST':
        newCode = request.form['groupCode']
        print ("newcode: ", newCode)
        session["groupCode"] = newCode
        return redirect("/draw")
    return render_template("joinGroup.html")


@socketio.on('join_group')
def on_join():
    if (not "groupCode" in session):
        print("user not in group")
        return
    roomCode = session["groupCode"]
    print("joining room: ", roomCode)
    join_room(roomCode)

@socketio.on('leave_group')
def on_leave():
    """ I dont think this should really be called, leaving should happen when you try to join a new group"""
    if (not "groupCode" in session):
        return
    leave_room(session["groupCode"])

@socketio.on('message')
def handle_message(msg):
    print('Received message: ' + msg)
    send("Echo: " + msg, broadcast=True)  # Send message back to all clients

@socketio.on('hello')
def handle_hello():
    print("You pushed hello")
    emit("hello", {'data': 'BLAH'}, broadcast=True)
    #send("bobcat", broadcast=True)

@socketio.on('draw_line')
def handle_draw_line(lineInfo):
    if (not "groupCode" in session):
        print("user not in a room")
        return # Dont send to anyone if youre not in a group
    
    room = session["groupCode"]
    response_data = {
        'points': lineInfo['points'],
        'color': lineInfo['color'],
        'isNewPath': lineInfo['isNewPath']
    }
    emit('draw_line', response_data, room=room)


if __name__ == '__main__':
    socketio.run(app, debug=True)