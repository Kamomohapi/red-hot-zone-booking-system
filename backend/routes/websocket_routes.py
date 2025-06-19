from fastapi import FastAPI, WebSocket,WebSocketDisconnect
from services.ws_manager import ConnectionManager

app = FastAPI()

manager = ConnectionManager()

@app.websocket("/ws/booking")
async def websocket_endpoint(websocket:WebSocket):

    salon_slug = await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(salon_slug,websocket)