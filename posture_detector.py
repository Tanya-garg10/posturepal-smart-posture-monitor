"""
PosturePal - Real-time Posture & Eye Detection
Uses MediaPipe Pose + Face Mesh to detect posture angles and eye state,
then sends results to the backend /api/posture/analyze endpoint.

Requirements:
    pip install mediapipe opencv-python requests

Usage:
    python posture_detector.py
"""

import cv2
import mediapipe as mp
import requests
import math
import time

# ── Config ────────────────────────────────────────────────────────────────────
BACKEND_URL = "http://127.0.0.1:8000/api/posture/analyze"
SEND_INTERVAL_SEC = 4       # how often to POST to backend
EYE_CLOSED_THRESHOLD = 0.25 # EAR below this = eye closed
EYE_CLOSED_DURATION = 2.0   # seconds eyes must be closed to trigger alert
NECK_ANGLE_THRESHOLD = 30   # degrees
BACK_ANGLE_THRESHOLD = 25   # degrees
SHOULDER_ALIGN_THRESHOLD = 15  # pixel difference (normalized * 1000)

# ── MediaPipe setup ───────────────────────────────────────────────────────────
mp_pose = mp.solutions.pose
mp_face = mp.solutions.face_mesh
mp_draw = mp.solutions.drawing_utils

pose = mp_pose.Pose(min_detection_confidence=0.6, min_tracking_confidence=0.6)
face_mesh = mp_face.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6,
)

# Eye landmark indices (MediaPipe Face Mesh)
# Left eye: top=159, bottom=145, left=33, right=133
# Right eye: top=386, bottom=374, left=362, right=263
LEFT_EYE  = {"top": 159, "bottom": 145, "left": 33,  "right": 133}
RIGHT_EYE = {"top": 386, "bottom": 374, "left": 362, "right": 263}


def euclidean(p1, p2):
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)


def eye_aspect_ratio(landmarks, eye, w, h):
    """Calculate EAR for one eye."""
    top    = (landmarks[eye["top"]].x * w,    landmarks[eye["top"]].y * h)
    bottom = (landmarks[eye["bottom"]].x * w, landmarks[eye["bottom"]].y * h)
    left   = (landmarks[eye["left"]].x * w,   landmarks[eye["left"]].y * h)
    right  = (landmarks[eye["right"]].x * w,  landmarks[eye["right"]].y * h)
    vertical   = euclidean(top, bottom)
    horizontal = euclidean(left, right)
    return vertical / (horizontal + 1e-6)


def angle_with_vertical(a, b):
    """Angle (degrees) of vector a→b relative to vertical axis."""
    dx = b[0] - a[0]
    dy = b[1] - a[1]
    angle = math.degrees(math.atan2(abs(dx), abs(dy)))
    return angle


def get_coords(landmarks, idx, w, h):
    lm = landmarks[idx]
    return (lm.x * w, lm.y * h)


def send_to_backend(payload: dict):
    try:
        resp = requests.post(BACKEND_URL, json=payload, timeout=3)
        data = resp.json()
        print("\n── Backend Response ──────────────────────")
        print(f"  Status  : {data.get('posture_status')}")
        print(f"  Score   : {data.get('correction_score')}")
        print(f"  Issues  : {data.get('detected_issues')}")
        print(f"  Fixes   : {data.get('suggested_fixes')}")
        print("──────────────────────────────────────────\n")
    except Exception as e:
        print(f"[WARN] Could not reach backend: {e}")


def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Cannot open webcam.")
        return

    session_start = time.time()
    last_send     = time.time()
    eye_closed_since = None  # timestamp when eyes first closed

    print("[INFO] PosturePal detector running. Press Q to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # ── Pose ──────────────────────────────────────────────────────────────
        pose_result = pose.process(rgb)
        neck_angle = back_angle = shoulder_alignment = 0.0

        if pose_result.pose_landmarks:
            lm = pose_result.pose_landmarks.landmark

            # Key points
            nose          = get_coords(lm, mp_pose.PoseLandmark.NOSE, w, h)
            left_shoulder = get_coords(lm, mp_pose.PoseLandmark.LEFT_SHOULDER, w, h)
            right_shoulder= get_coords(lm, mp_pose.PoseLandmark.RIGHT_SHOULDER, w, h)
            left_hip      = get_coords(lm, mp_pose.PoseLandmark.LEFT_HIP, w, h)
            right_hip     = get_coords(lm, mp_pose.PoseLandmark.RIGHT_HIP, w, h)
            left_ear      = get_coords(lm, mp_pose.PoseLandmark.LEFT_EAR, w, h)

            mid_shoulder = ((left_shoulder[0] + right_shoulder[0]) / 2,
                            (left_shoulder[1] + right_shoulder[1]) / 2)
            mid_hip      = ((left_hip[0] + right_hip[0]) / 2,
                            (left_hip[1] + right_hip[1]) / 2)

            # Neck angle: ear → shoulder → vertical
            neck_angle = angle_with_vertical(left_ear, left_shoulder)

            # Back angle: shoulder midpoint → hip midpoint → vertical
            back_angle = angle_with_vertical(mid_shoulder, mid_hip)

            # Shoulder alignment: vertical difference (normalized * 1000 for readability)
            shoulder_alignment = abs(left_shoulder[1] - right_shoulder[1]) / h * 1000

            # Draw skeleton
            mp_draw.draw_landmarks(frame, pose_result.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # ── Face / Eye ────────────────────────────────────────────────────────
        face_result = face_mesh.process(rgb)
        eye_closed = False

        if face_result.multi_face_landmarks:
            fl = face_result.multi_face_landmarks[0].landmark
            left_ear_val  = eye_aspect_ratio(fl, LEFT_EYE,  w, h)
            right_ear_val = eye_aspect_ratio(fl, RIGHT_EYE, w, h)
            avg_ear = (left_ear_val + right_ear_val) / 2

            if avg_ear < EYE_CLOSED_THRESHOLD:
                if eye_closed_since is None:
                    eye_closed_since = time.time()
                elif time.time() - eye_closed_since >= EYE_CLOSED_DURATION:
                    eye_closed = True
            else:
                eye_closed_since = None

        # ── Sitting duration ──────────────────────────────────────────────────
        sitting_minutes = int((time.time() - session_start) / 60)

        # ── HUD overlay ───────────────────────────────────────────────────────
        neck_color  = (0, 0, 255) if neck_angle > NECK_ANGLE_THRESHOLD else (0, 255, 0)
        back_color  = (0, 0, 255) if back_angle > BACK_ANGLE_THRESHOLD else (0, 255, 0)
        eye_color   = (0, 0, 255) if eye_closed else (0, 255, 0)

        cv2.putText(frame, f"Neck  : {neck_angle:.1f}°",        (10, 30),  cv2.FONT_HERSHEY_SIMPLEX, 0.65, neck_color, 2)
        cv2.putText(frame, f"Back  : {back_angle:.1f}°",        (10, 60),  cv2.FONT_HERSHEY_SIMPLEX, 0.65, back_color, 2)
        cv2.putText(frame, f"Shldr : {shoulder_alignment:.1f}", (10, 90),  cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 200, 0), 2)
        cv2.putText(frame, f"Eyes  : {'CLOSED' if eye_closed else 'Open'}", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.65, eye_color, 2)
        cv2.putText(frame, f"Sit   : {sitting_minutes}m",       (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (200, 200, 200), 2)

        # ── Send to backend every SEND_INTERVAL_SEC ───────────────────────────
        if time.time() - last_send >= SEND_INTERVAL_SEC:
            payload = {
                "neck_angle":            round(neck_angle, 2),
                "back_angle":            round(back_angle, 2),
                "shoulder_alignment":    round(shoulder_alignment, 2),
                "sitting_duration_minutes": sitting_minutes,
                "eye_closed":            eye_closed,
            }
            print(f"[SEND] {payload}")
            send_to_backend(payload)
            last_send = time.time()

        cv2.imshow("PosturePal - Press Q to quit", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
    pose.close()
    face_mesh.close()


if __name__ == "__main__":
    main()
