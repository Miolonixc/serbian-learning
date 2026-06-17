#!/usr/bin/env bash

cd "$(dirname "$0")"

PORT=5173

IP=$(ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -1)

case "${1:-start}" in
  stop)
    pkill -f "node server.cjs" 2>/dev/null && echo "Остановлен" || echo "Не запущен"
    ;;
  restart)
    pkill -f "node server.cjs" 2>/dev/null
    sleep 1
    nohup node server.cjs > /dev/null 2>&1 &
    sleep 2
    if curl -s -o /dev/null -w "" http://localhost:$PORT/ 2>/dev/null; then
      echo "Запущен: http://${IP:-localhost}:${PORT}"
    else
      echo "Ошибка"
    fi
    ;;
  status)
    if curl -s -o /dev/null http://localhost:$PORT/ 2>/dev/null; then
      echo "Работает: http://${IP:-localhost}:${PORT}"
    else
      echo "Не работает"
      exit 1
    fi
    ;;
  start|"")
    if curl -s -o /dev/null http://localhost:$PORT/ 2>/dev/null; then
      echo "Уже работает: http://${IP:-localhost}:${PORT}"
    else
      nohup node server.cjs > /dev/null 2>&1 &
      sleep 2
      if curl -s -o /dev/null http://localhost:$PORT/ 2>/dev/null; then
        echo "Запущен: http://${IP:-localhost}:${PORT}"
      else
        echo "Ошибка"
        exit 1
      fi
    fi
    ;;
  *)
    echo "Использование: bash start.sh [start|stop|restart|status]"
    ;;
esac
