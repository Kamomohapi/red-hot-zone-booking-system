from fastapi import WebSocket, WebSocketDisconnect,WebSocketException
from typing import Dict,List
from auth.auth_middleware import decode_token


class ConnectionManager:
    def _init_(self):
        self.active_connection: Dict[str,List[WebSocket]] = {}

    async def connect(self,websocket:WebSocket):
        token = websocket.query_params.get("token")
        if not token:
            raise WebSocketException(code=1008,reason ="Missing token")
        payload = decode_token(token)

        salon_slug = payload.get("salon_slug")

        if not salon_slug:
            raise WebSocketException(code = 1008, reason = "Missing salon slug")
        
        await websocket.accept()

        if salon_slug not in self.active_connection:
            self.active_connection[salon_slug] = []

        self.active_connection[salon_slug].append(websocket)

        return salon_slug

    def disconnect(self,salon_slug:str,websocket:WebSocket):
        connections = self.active_connection.get(salon_slug)
        if connections and websocket in connections:
            connections.remove(websocket)
            if not connections:
                del self.active_connection[salon_slug]


    async def send_booking_notification(self,salon_slug:str,data:dict):
        for websocket in self.active_connection.get(salon_slug,[]):
            try:
                await websocket.send_json(data)
            except Exception:
                pass

manager = ConnectionManager()