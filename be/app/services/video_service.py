import boto3
from botocore.exceptions import NoCredentialsError
from app.core.config import settings
from uuid import uuid4

# S3 클라이언트 생성
s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_KEY,
    region_name=settings.AWS_REGION
)

def upload_video_to_s3(file_data, file_name: str):
    """비디오 파일을 S3에 업로드하고 URL 반환"""
    try:
        # 파일명 충돌 방지를 위해 UUID 적용
        unique_file_name = f"{uuid4()}_{file_name}"

        s3_client.upload_fileobj(file_data, settings.AWS_S3_BUCKET_NAME, unique_file_name, ExtraArgs={"ACL": "public-read", "ContentType": "video/mp4"})

        # 업로드된 파일의 URL 반환
        video_url = f"https://{settings.AWS_S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_file_name}"
        return video_url
    except NoCredentialsError:
        raise Exception("AWS 자격 증명 오류: credentials 확인 필요")