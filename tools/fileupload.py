import io
from supabase import create_client, Client
# ✅ Supabase Credentials (Keep these secret!)
SUPABASE_URL = "https://vfjlbmvuxkijzhcsmimc.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmamxibXZ1eGtpanpoY3NtaW1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODk4OTEzMywiZXhwIjoyMDU0NTY1MTMzfQ.2htuscBsRBqSxp0_u4rChMycbhFS3f0J0FtIucQf0uQ"
STORAGE_BUCKET = "files"

# ✅ Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def upload_file_to_supabase(file_obj: io.BytesIO, file_name: str):
    """
    Uploads a file to Supabase Storage.

    Args:
        file_obj (BytesIO): The file object in memory.
        file_name (str): The name of the file.

    Returns:
        dict: Status, uploaded filename, and URLs.
    """
    storage_path = f"uploads/{file_name}"  # Define storage path

    try:
        file_obj.seek(0)  # Reset file pointer before reading

        # Upload file object with correct format
        response = supabase.storage.from_(STORAGE_BUCKET).upload(
            storage_path, file_obj.read(), file_options={"content-type": "application/octet-stream"}
        )

        if response:
            public_url = supabase.storage.from_(STORAGE_BUCKET).get_public_url(storage_path)
            return {
                "status": "success",
                "uploaded_as": storage_path,
                "url": public_url,
                "resource_url": f"{SUPABASE_URL}/storage/v1/object/public/{storage_path}"
            }
        else:
            return {"status": "error", "message": "Upload failed."}

    except Exception as e:
        return {"status": "error", "message": str(e)}
