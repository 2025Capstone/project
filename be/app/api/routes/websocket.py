from fastapi import APIRouter, WebSocket
import json

router = APIRouter()

@router.websocket("/landmarks")
async def websocket_landmarks(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            landmarks = json.loads(data)
            # print(f"Received landmarks count: {len(landmarks)}")
            # print(f"First landmark coordinates: {landmarks[:3]}")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        print("WebSocket connection closed")
        await websocket.close()