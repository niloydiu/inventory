#!/bin/bash

echo "Testing API endpoints..."
echo ""

# Start server in background
node server/index.js &
SERVER_PID=$!
echo "Started server (PID: $SERVER_PID)"

# Wait for server to start
sleep 3

echo ""
echo "Testing health endpoint..."
curl -s http://localhost:5000/health | jq .

echo ""
echo "Testing login endpoint..."
curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq .

echo ""
echo "Stopping server..."
kill $SERVER_PID

echo "Done!"
