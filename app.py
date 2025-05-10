from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import mimetypes

# the mime types for js and ts dont get set automatically for some reason :(
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/typescript', '.ts')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!' #! replace with .env
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/draw")
def draw():
    return render_template("draw.html")




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
    response_data = {
        'points': lineInfo['points'],
        'color': lineInfo['color'],
        'isNewPath': lineInfo['isNewPath']
    }    
    emit('draw_line', response_data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)