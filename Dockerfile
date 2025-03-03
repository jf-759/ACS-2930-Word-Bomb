# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variable
ENV FLASK_APP=app.py
ENV PORT=3000

# Command to run the application
CMD gunicorn --bind 0.0.0.0:$PORT app:app
