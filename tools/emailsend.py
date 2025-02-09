import os
import smtplib
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pydantic import BaseModel
from typing import List, Optional

# Load environment variables
load_dotenv()

# Pydantic Model for Validation
class EmailRequest(BaseModel):
    subject: str
    body: str
    to_recipients: List[str]
    cc_recipients: Optional[List[str]] = None
    bcc_recipients: Optional[List[str]] = None

def send_email_logic(email_data: EmailRequest):
    """
    Core function that handles sending an email.

    Args:
        email_data (EmailRequest): Email details.

    Returns:
        dict: Status of the email sending process.
    """
    try:
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT"))
        sender_email = os.getenv("SENDER_EMAIL")
        sender_password = os.getenv("SENDER_PASSWORD")

        if not all([smtp_server, smtp_port, sender_email, sender_password]):
            raise ValueError("Missing SMTP credentials in the .env file.")

        # Setup SMTP Connection
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)

        # Prepare email
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = ", ".join(email_data.to_recipients)
        msg["CC"] = ", ".join(email_data.cc_recipients) if email_data.cc_recipients else ""
        msg["Subject"] = email_data.subject
        msg.attach(MIMEText(email_data.body, "plain"))

        # Combine all recipients
        all_recipients = email_data.to_recipients + (email_data.cc_recipients or []) + (email_data.bcc_recipients or [])

        # Send email
        server.sendmail(sender_email, all_recipients, msg.as_string())
        server.quit()

        return {"status": "success", "message": f"Email sent to {len(all_recipients)} recipients."}

    except Exception as e:
        return {"status": "error", "message": str(e)}
