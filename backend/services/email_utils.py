import smtplib
from email.mime.text import MIMEText
from config.settings import settings

def send_email(to: str, subject: str, body: str):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_USER
    msg["To"] = to

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print("Email sending failed:", e)
        raise
