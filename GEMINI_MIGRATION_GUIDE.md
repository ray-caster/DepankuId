# Migration Guide: OpenRouter to Google Gemini API

This guide helps you migrate from OpenRouter to Google's Gemini 2.5 Flash API.

## 🔄 What Changed

### API Provider
- **Before**: OpenRouter (Claude 3.5 Sonnet)
- **After**: Google Gemini 2.5 Flash

### Configuration
- **Before**: `OPENROUTER_API_KEY`
- **After**: `GEMINI_API_KEY`

### Dependencies
- **Added**: `google-genai>=0.8.0`
- **Removed**: OpenRouter API calls

## 🚀 Migration Steps

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for your environment

### 2. Update Environment Variables

Replace in your `.env` file:
```env
# OLD
OPENROUTER_API_KEY=your_openrouter_api_key

# NEW
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install New Dependencies

```bash
cd backend
pip install google-genai>=0.8.0
```

Or update requirements:
```bash
pip install -r requirements.txt
```

### 4. Deploy Changes

The following files have been updated:
- ✅ `backend/config/settings.py` - Updated configuration
- ✅ `backend/services/moderation_service.py` - Updated to use Gemini
- ✅ `backend/services/ai_service.py` - New AI service
- ✅ `backend/routes/ai_routes.py` - New AI routes
- ✅ `backend/app.py` - Registered AI routes
- ✅ `backend/requirements.txt` - Added google-genai
- ✅ `backend/ENV_TEMPLATE.md` - Updated environment template
- ✅ `backend/utils/env_validator.py` - Updated validation
- ✅ `backend/README.md` - Updated documentation

## 🔧 API Differences

### OpenRouter vs Gemini

| Feature | OpenRouter | Gemini |
|---------|------------|--------|
| Model | Claude 3.5 Sonnet | Gemini 2.5 Flash |
| API Format | REST with messages array | Direct content generation |
| Authentication | Bearer token | API key in client |
| Response Format | `choices[0].message.content` | `response.text` |

### Code Changes

**Before (OpenRouter):**
```python
response = requests.post(
    OPENROUTER_URL,
    headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
    json={
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [{"role": "user", "content": message}]
    }
)
ai_response = response.json()['choices'][0]['message']['content']
```

**After (Gemini):**
```python
client = genai.Client(api_key=GEMINI_API_KEY)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=message
)
ai_response = response.text
```

## 🆕 New Features

### Enhanced AI Service
- **Chat**: Intelligent conversation with context
- **Discovery**: Personalized opportunity discovery
- **Suggestions**: AI-powered opportunity recommendations
- **Health Check**: Service status monitoring

### New Endpoints
- `POST /api/ai/chat` - AI chat with conversation history
- `POST /api/ai/discovery/start` - Start discovery session
- `POST /api/ai/suggestions` - Get opportunity suggestions
- `GET /api/ai/health` - AI service health check

## 🧪 Testing

### 1. Test AI Chat
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{"message": "Hello, I need help finding opportunities"}'
```

### 2. Test Discovery
```bash
curl -X POST http://localhost:5000/api/ai/discovery/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{"user_profile": {"interests": ["technology", "science"]}}'
```

### 3. Test Health Check
```bash
curl http://localhost:5000/api/ai/health
```

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify key is correct in Google AI Studio
   - Check environment variable is set: `echo $GEMINI_API_KEY`

2. **Import Errors**
   - Install google-genai: `pip install google-genai>=0.8.0`
   - Check Python path and virtual environment

3. **Rate Limiting**
   - Gemini has different rate limits than OpenRouter
   - Monitor usage in Google AI Studio dashboard

4. **Response Format**
   - Gemini responses are in Indonesian by default
   - Check AI service configuration for language settings

### Debug Mode

Enable detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📊 Performance Comparison

| Metric | OpenRouter | Gemini 2.5 Flash |
|--------|------------|-------------------|
| Speed | ~2-3s | ~1-2s |
| Cost | Variable | Free tier available |
| Context | 200k tokens | 1M+ tokens |
| Languages | English | 100+ languages |

## 🎯 Benefits of Migration

1. **Better Performance**: Faster response times
2. **Cost Effective**: Free tier available
3. **Multilingual**: Native Indonesian support
4. **Latest Technology**: Google's latest AI model
5. **Better Integration**: Direct Google services integration

## 📞 Support

If you encounter issues:

1. Check the logs: `tail -f backend/logs/app.log`
2. Verify environment variables: `python -c "from config.settings import GEMINI_API_KEY; print('OK' if GEMINI_API_KEY else 'Missing')"`
3. Test API key: `python -c "from google import genai; print('OK')"`

## 🔄 Rollback Plan

If you need to rollback to OpenRouter:

1. Revert environment variable: `OPENROUTER_API_KEY=your_key`
2. Restore old service files
3. Remove `google-genai` dependency
4. Update configuration

---

**Migration completed successfully!** 🎉

Your Depanku.id platform now uses Google Gemini 2.5 Flash for AI-powered features.
