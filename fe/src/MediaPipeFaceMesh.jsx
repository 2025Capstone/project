import React, { useRef, useEffect } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const MediaPipeFaceMesh = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const inactivityTimerRef = useRef(null); // 웹소켓 자동 닫기 타이머

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      if (results.image) {
        canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      }
      if (results.multiFaceLandmarks) {
        results.multiFaceLandmarks.forEach((landmarks) => {
          drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 1,
          });

          // 478개 랜드마크 좌표 추출
          const flatLandmarks = landmarks.flatMap((lm) => [lm.x, lm.y, lm.z]);

          // **웹소켓이 닫혀있다면 새로 열기**
          if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            openWebSocket();
          }

          // **웹소켓이 열려 있다면 데이터 전송**
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(flatLandmarks));
          }

          // **2초 동안 데이터가 없으면 웹소켓 닫기**
          resetInactivityTimer();
        });
      }
      canvasCtx.restore();
    });

    const processFrame = async () => {
      if (video.readyState >= 2) {
        await faceMesh.send({ image: video });
      }
      requestAnimationFrame(processFrame);
    };

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        requestAnimationFrame(processFrame);
      };
    }).catch((err) => {
      console.error("Error accessing webcam:", err);
    });

    // 컴포넌트가 언마운트될 때 웹소켓 종료
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // **웹소켓 열기 함수**
  const openWebSocket = () => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/landmarks");

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
      wsRef.current = null;
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  // **웹소켓 닫기 타이머 리셋**
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (wsRef.current) {
        console.log("No data received for 2 seconds, closing WebSocket.");
        wsRef.current.close();
      }
    }, 2000); // 2초 후 닫기
  };

  return (
      <div>
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
      </div>
  );
};

export default MediaPipeFaceMesh;