# Interactive Virtual Assistant

An immersive 3D virtual assistant powered by AI, featuring real-time conversation, text-to-speech, dynamic facial expressions, and animated poses.
<img width="2855" height="1442" alt="image" src="https://github.com/user-attachments/assets/e07865f9-1776-4d1c-8b8e-c1a134729c87" />

![Virtual Assistant Demo](https://via.placeholder.com/800x400?text=Virtual+Assistant+Demo)

## Features

- **3D Animated Character** - Fully rigged character model with procedural breathing and blinking
- **Real-time Chat** - WebSocket-based communication for responses
- **Text-to-Speech** - AI-generated voice responses with Google Cloud TTS Chirp Voices
- **Dynamic Expressions** - Context-aware facial expressions (happy, sad, thinking, etc.)
- **Multiple Poses** - Character poses that adapt to conversation context (more coming soon...)
- **HDRI Environments** - Beautiful lighting with customizable backgrounds

## Architecture

This project consists of two Docker containers that work together:

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│                 │◄──────────────────────────►│                 │
│  Frontend       │                            │  Backend        │
│  (React + R3F)  │         REST API           │  (Spring Boot)  │
│  Port: 5173     │◄──────────────────────────►│  Port: 8080     │
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
```

### Frontend Stack
- React 18
- Three.js + React Three Fiber
- @react-three/drei for 3D utilities
- STOMP.js for WebSocket communication
- Leva for debug controls

### Backend Stack (Please consult the backend repo for instructions on how to properly set up)
- Spring Boot
- WebSocket (STOMP protocol)
- AI integration for response generation
- Text-to-Speech service
- Expression and pose analysis

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)
- At least 8GB of available RAM
- Ports 5174 (Front End), 8080 (Back End), and 11434 (Ollama) available

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Gro0mp/InteractiveVirtualAssistant
cd InteractiveVirtualAssistant
```
### 2. Set Up Google Cloud Authentication

- Go to the Google Cloud Website and create a new project. Within the project, activate the Cloud Text-to-Speech API.
https://docs.cloud.google.com/text-to-speech/docs/reference/rest

- Afterwards, go to your console and enter the APIs and Services Page.
<img width="2306" height="551" alt="image" src="https://github.com/user-attachments/assets/f66d54d9-7e1e-4c59-9714-5e9f0fccac99" />

- Enter the credentials tab on the right hand side. After you have entered the credentials tab, click on "Create Credentials" and create a new Service account.
<img width="958" height="562" alt="image" src="https://github.com/user-attachments/assets/1e289c97-e29f-43bb-b032-8f9560cb9af6" />

- Follow the instructions on the credential creation page. For my case, I set permissions to Owner.
<img width="1111" height="906" alt="image" src="https://github.com/user-attachments/assets/48fe7ca6-ef7b-481b-923f-35a3a12fb346" />

- After the service account has been created, enter it and click on the keys tab. Within, create a new key with the JSON format
<img width="2377" height="1331" alt="image" src="https://github.com/user-attachments/assets/0e2b68c7-6214-4816-a13a-6bce0acb52e8" />

- Set the path of the JSON you created and downloaded to the root of your system. Open a terminal and enter the following commands.

```bash
cd\
mkdir GoogleCloudCredentials
move C:\Users\<Username>\Downloads\example.json C:\GoogleCloudCredentials\
setx GOOGLE_APPLICATION_CREDENTIALS "C:\GoogleCloudCredentials\example.json"
```

### 3. Set up Ollama
- Although the you could use the Docker Ollama Image file, that comes with uncertainty. So I reccomend going to the Ollama website and downloading it on your system.

https://ollama.com/

- Afterwards, once you have installed it, run the following command in your terminal.
```bash
ollama pull gemma3:4b
```

### 4. Install and Run Docker Images
 - If you do not have Docker on your system, please install it following the directions on the Docker Website.

https://www.docker.com/get-started/

- After it has been installed, open a terminal and run the following commands.
```bash
docker pull dennisw342/virtual-assistant-frontend
docker pull dennisw342/virtual-assistant-backend
docker pull postgres:18
docker pull ollama/ollama:latest
```

- Finally, run all of these images.
```bash
docker run dennisw342/virtual-assistant-frontend
docker run dennisw342/virtual-assistant-backend
docker run postgres:18
docker run ollama/ollama:latest
```

## Usage

### Basic Interaction

1. Open your browser to `http://localhost:5173`
2. The virtual assistant will appear in a 3D environment
3. Type your message in the chat box at the bottom
4. Press Enter or click Send to submit
5. The assistant will respond with:
   - Text message in the chat
   - Spoken audio response
   - Appropriate facial expression
   - Relevant pose/gesture

### Guest Mode

The application supports guest sessions without authentication:
- Each session gets a temporary ID
- No chat history is persisted
- Full conversation features available

### Debug Controls

Press the Leva debug panel, which allows you to:
- Manually control character poses
- Adjust facial expressions
- Modify breathing and blinking parameters
- Change lighting and environment settings
- Adjust camera and shadow properties

## Configuration

## Features Breakdown

### Character Animation System

- **Procedural Breathing**: Realistic chest and shoulder movement
- **Automatic Blinking**: Random, natural eye blinks
- **Lip Sync**: Mouth movements synchronized with speech
- **Pose Library**: Multiple pre-defined poses (Neutral, Thinking, Thumbs Up, etc.)
- **Morph Targets**: 
  - Eyebrow expressions (angry, sad)
  - Eye states (closed, winking)
  - Mouth shapes (happy, sad, phonemes)

### WebSocket Communication

The application uses STOMP over WebSocket for real-time bidirectional communication:

**Message Flow**:
1. User sends message via `/app/chat`
2. Backend processes message with AI
3. Backend generates:
   - Text response
   - Audio data (TTS)
   - Expression values
   - Pose selection
4. Response sent to `/user/{sessionId}/queue/messages`
5. Frontend updates UI, plays audio, animates character

### Audio System

- Automatic audio playback when response arrives
- Base64-encoded audio data transmission
- Proper cleanup and memory management
- Speaking state tracking for lip movement

## Troubleshooting

### Common Issues

**WebSocket Connection Failed**
```
Error: WebSocket connection to 'ws://localhost:8080/websocket' failed
```
- Ensure backend container is running: `docker ps`
- Check backend logs: `docker-compose logs backend`
- Verify port 8080 is not in use by another application

**Audio Not Playing**
- Check browser console for errors
- Ensure browser allows autoplay (user interaction may be required)
- Verify audio data is being received in network tab
- Check browser audio permissions

### Debug Mode

Enable debug controls to troubleshoot animation issues:

1. Click anywhere in the 3D scene
2. Press Leva panel
3. Toggle "Enable GUI Control (Override Props)"
4. Manually test poses and expressions

### Hot Reload

Both containers support hot reload during development:
- Frontend: Changes to `.jsx` files automatically reload
- Backend: Use Spring DevTools for automatic restart

## API Reference

### WebSocket Endpoints

**Connect**: `ws://localhost:8080/websocket`

**Subscribe**: `/user/{sessionId}/queue/messages`

**Publish**: `/app/chat`

**Message Format** (Send):
```json
{
    "userId": "guest-123456",
    "message": "Hello, assistant!",
    "isGuest": true
}
```

**Message Format** (Receive):
```json
{
    "type": "response",
    "response": "Hello! How can I help you?",
    "audioData": "base64_encoded_audio",
    "pose": "Neutral_A",
    "expressionValues": {
        "Mouth - Happy": 0.8,
        "Eyebrows - Sad": 0.0
        ....
    }
}
```

## Performance Optimization

- Models are preloaded using `useGLTF.preload()`
- Audio URLs are properly revoked to prevent memory leaks
- Shadow rendering is optimized with contact shadows
- HDRI textures are loaded efficiently
- Animation mixer runs at 60 FPS

## Browser Support

- Chrome/Edge 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Opera 76+

**Note**: WebGL 2.0 support required

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Character model: https://sketchfab.com/3d-models/vrc-lapwing-92f3ee0bc77542eb83a1f6efecf9a465
- HDRI environments: https://polyhaven.com/
- Three.js and React Three Fiber communities
- Spring Boot team

## Roadmap

- [ ] Multiple character models
- [ ] Custom environment creation
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Emotion detection from user input
- [ ] Advanced gesture system

---

**Important**: This application requires both Docker containers (frontend and backend) to be running simultaneously for full functionality. The frontend alone will not work without the backend WebSocket server. If you just want to see the model functionality, the backend is not necessary and you can check out the model on dwong.net/chatbot-test.
