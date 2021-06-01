# SYSTEM REQUIREMENTS
The setup was tested only for Windows 10. If you are using some other system you are on your own.  
Supported browsers:
- Chrome (Chrome has a policy regarding making sound from the website without user interaction. <b>That's why you'll have to click left mouse btn once the website is loaded</b>)
- Edge  

As of writting this doc (01-06-2021) Edge has way nicer TTS voice

# HOW TO
To run experiment follow `SETUP LEAP MOTION`  
To create new features follow both `SETUP LEAP MOTION` and `SETUP DEV ENV`

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
Follow this tutorial: https://wolovim.medium.com/deploying-create-react-app-to-s3-or-cloudfront-48dae4ce0af