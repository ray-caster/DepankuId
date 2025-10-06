# 🚀 Running the Backend Server

## Option 1: ASGI with Uvicorn (Recommended for Production)

### Install dependencies
```bash
pip install -r requirements.txt
```

### Run with auto-reload (Development)
```bash
python run_uvicorn.py
```

Or directly:
```bash
uvicorn asgi:application --host 0.0.0.0 --port 5000 --reload
```

### Run for production
```bash
uvicorn asgi:application --host 0.0.0.0 --port 5000 --workers 4
```

## Option 2: WSGI with Flask (Development only)

```bash
python app.py
```

## Option 3: WSGI with Gunicorn

```bash
gunicorn app:app --bind 0.0.0.0:5000 --workers 4
```

## 🔍 What's Different?

### Uvicorn (ASGI)
- ✅ Better performance
- ✅ WebSocket support (future-ready)
- ✅ HTTP/2 support
- ✅ Async-ready
- ✅ Modern standard

### Flask Dev Server (WSGI)
- ⚠️ Development only
- ⚠️ Single-threaded
- ⚠️ Not for production

### Gunicorn (WSGI)
- ✅ Production-ready
- ✅ Multi-worker
- ❌ No async support
- ❌ No WebSocket support

## 📊 Logging

All requests and responses are now logged with:
- Request method and path
- Response status and duration
- Error details with tracebacks
- Sensitive data masking

Check console output for detailed logs.

## 🐛 Debugging

The server includes comprehensive error handling:
- Validation errors (400)
- Permission errors (403)
- Not found errors (404)
- Method not allowed (405)
- Server errors (500)

All errors are logged with full context.

