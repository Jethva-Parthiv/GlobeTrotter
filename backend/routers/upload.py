import uuid
from typing import Optional
from pathlib import Path
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status


import schemas
from dependencies import get_optional_current_user
import models

router = APIRouter(prefix="/api/upload", tags=["Upload"])

UPLOAD_BASE_DIR = Path("uploads")
ALLOWED_FOLDERS = {"covers", "avatars", "general"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/image", response_model=schemas.UploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Query("covers", description="Subfolder to store image (covers, avatars, general)"),
    current_user: Optional[models.User] = Depends(get_optional_current_user),
):

    if folder not in ALLOWED_FOLDERS:
        folder = "covers"

    # Validate file extension
    ext = Path(file.filename or "").suffix.lower()
    if not ext or ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image type ({file.content_type}). Allowed: JPG, PNG, WEBP, GIF.",
        )

    # Prepare target directory
    target_dir = UPLOAD_BASE_DIR / folder
    target_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = target_dir / unique_filename

    # Read and validate size while saving
    size = 0
    try:
        with open(target_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                size += len(chunk)
                if size > MAX_FILE_SIZE:
                    # Clean up file on oversize
                    buffer.close()
                    if target_path.exists():
                        target_path.unlink()
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="File exceeds maximum allowed size of 10MB.",
                    )
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        if target_path.exists():
            target_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save image file: {str(e)}",
        )
    finally:
        await file.close()

    # Publicly accessible URL path
    public_url = f"/uploads/{folder}/{unique_filename}"

    return schemas.UploadResponse(
        url=public_url,
        filename=unique_filename,
        content_type=file.content_type or "image/jpeg",
    )
