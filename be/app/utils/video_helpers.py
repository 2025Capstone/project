import tempfile
from moviepy.editor import VideoFileClip
from fastapi import UploadFile

def extract_video_duration(upload_file: UploadFile) -> float:
    """
    업로드된 파일에서 영상 길이를 추출한 후 초 단위 duration 반환.
    업로드 파일의 파일 포인터를 재설정합니다.
    """
    # 임시 파일에 저장
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        contents = upload_file.file.read()
        tmp.write(contents)
        tmp.flush()
    # moviepy로 임시 파일에서 길이 추출
    clip = VideoFileClip(tmp.name)
    duration = clip.duration  # 초 단위 (실수)
    clip.close()
    # 파일 포인터 재설정 (S3 업로드를 위해)
    upload_file.file.seek(0)
    return duration