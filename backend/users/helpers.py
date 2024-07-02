import random
import string
import redis
import os
import boto3
from pytz import timezone
from datetime import datetime, timedelta

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

def generate_verification_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def store_verification_code(email, code):
    # store for 5 mintues
    redis_client.set(email, code, ex=300)

def restore_verification_code(email):
    code = redis_client.get(email)
    if code:
        return code
    return None

def send_verification_email(email, code):
    # Initialize SES client
    ses_client = boto3.client('ses', region_name='us-east-1', aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID') , aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY') )
    # current time + five minutes in EST
    expiration_time = datetime.now(timezone('US/Eastern')) + timedelta(minutes=5)
    # Replace the placeholders below with your actual email addresses and content
    sender_email = 'rr4461@nyu.edu'
    subject = 'Verification Code'
    message = f'Click this link to verify your account https://culinarycompass.software/verify_account/?email={email}&code={code}'
    
    # Send email
    response = ses_client.send_email(
        Source=sender_email,
        Destination={
            'ToAddresses': [email]
        },
        Message={
            'Subject': {'Data': subject},
            'Body': {'Text': {'Data': message}}
        }
    )
    
    print(response)