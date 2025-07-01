#!/bin/bash

# Check if port 3000 is in use
if lsof -i :3000 > /dev/null; then
    echo "Port 3000 is currently in use. Attempting to free it..."
    
    # Get PID of process using port 3000
    PID=$(lsof -ti:3000)
    
    if [ -n "$PID" ]; then
        echo "Killing process $PID that is using port 3000..."
        kill -9 $PID
        echo "Process killed."
        sleep 1
    else
        echo "No process found using port 3000."
    fi
fi

# Start the app in production mode
echo "Starting app on port 3000..."
npm run start
