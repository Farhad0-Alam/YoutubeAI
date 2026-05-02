import os
import aiofiles
from backend.config.settings import settings

async def cleanup_temp_files(prefix=None):
    """Clean up files in the temp directory if prefix matches or all if None."""
    temp_dir = settings.TEMP_DIR
    for filename in os.listdir(temp_dir):
        if prefix is None or filename.startswith(prefix):
            file_path = os.path.join(temp_dir, filename)
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Error deleting temp file {file_path}: {e}")

async def save_upload_file(upload_file, filename):
    file_path = os.path.join(settings.TEMP_DIR, filename)
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await upload_file.read()
        await out_file.write(content)
    return file_path
