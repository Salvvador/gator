# SYSTEM REQUIREMENTS
The setup was tested only for Windows 10. If you are using some other system you are on your own.  
Supported browsers:
- Chrome (Chrome has a strict policy regarding voice output. <b>To enable TTS feature click left mouse btn once the website is loaded</b>)
- Edge  

# HOW TO RUN EXPERIMENT
1. Follow `SETUP LEAP MOTION`
2. Open Edge / Chrome (As of writting this doc (01-06-2021) Edge has way nicer TTS voice)
3. Go to `https://kind-plant-0d14acb03.azurestaticapps.net/`  
4. Accept permissions to use microphone
5. (Chrome only - click left mouse button)
6. Test by saying `start`

# Voice Commands
- "start'
- "stop"
- "restart"
- "repeat"
- phrase in text -> "delete" / "remove"
- phrase in text -> "replace" / "change" -> new phrase
- phrase in text -> "insert before" / "change" -> new phrase

# Gestures
In progress...   
Have a look in GATOR paper.

# SETUP LEAP MOTION
1. Download Leap Motion Developer Kit (it will require registartion)
`https://developer.leapmotion.com/sdk-leap-motion-controller/`
2. Connect Leap Motion to your laptop
3. Open Leap Motion Controller Panel
4. Test your connection in `Visualizer` (right click Leap Motion Controller in taskbar > `Visualizer...`)
5. Turn on `Allow Web Apps` (right click Leap Motion Controller in taskbar > `Settings...`)

# SETUP DEV ENV
1. Install node.js (`https://nodejs.org/en/download/`)
2. Install dependencies (`npm install` inside project's root folder)
3. Start (`npm start`)
4. In your browser (Chrome / Edge) open `http://localhost:3000/`

# DEPLOY TO WEBSITE
Contact:  
Patryk Pomykalski  
pspomykalski@gmail.com