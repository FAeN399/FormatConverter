#!/bin/bash

case $1 in
  "start")
    echo "🚀 Starting FormatConverter development server..."
    python3 -m http.server 8080 &
    echo "Server started on http://localhost:8080"
    echo "Open: http://localhost:8080/src/web/index-fixed.html"
    ;;
  "stop")
    echo "🛑 Stopping development server..."
    pkill -f "python.*http.server" || echo "No server running"
    ;;
  "test")
    echo "🧪 Running quick tests..."
    node quick-test.js
    ;;
  "status")
    echo "📊 FormatConverter Status:"
    if pgrep -f "python.*http.server" > /dev/null; then
      echo "✅ Server: Running on port 8080"
    else
      echo "❌ Server: Not running"
    fi
    if [ -f "src/web/index-fixed.html" ]; then
      echo "✅ Web Interface: Available"
    else
      echo "❌ Web Interface: Missing"
    fi
    ;;
  "open")
    echo "🌐 Opening FormatConverter in browser..."
    if command -v xdg-open > /dev/null; then
      xdg-open "http://localhost:8080/src/web/index-fixed.html"
    elif command -v open > /dev/null; then
      open "http://localhost:8080/src/web/index-fixed.html"
    else
      echo "Manual: http://localhost:8080/src/web/index-fixed.html"
    fi
    ;;
  *)
    echo "FormatConverter Development Commands:"
    echo "  ./dev-commands.sh start   - Start development server"
    echo "  ./dev-commands.sh stop    - Stop development server"  
    echo "  ./dev-commands.sh test    - Run quick tests"
    echo "  ./dev-commands.sh status  - Check status"
    echo "  ./dev-commands.sh open    - Open in browser"
    ;;
esac
