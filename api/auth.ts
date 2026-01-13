import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  }

  res.setHeader('Content-Type', 'text/html')
  res.send(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Auth</title>
    </head>
    <body>
      <div id="status">Signing in...</div>
      <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'
        import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js'

        const firebaseConfig = ${JSON.stringify(firebaseConfig)}
        const app = initializeApp(firebaseConfig)
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()

        async function run() {
          try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user && {
              uid: result.user.uid,
              displayName: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL,
            }
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage({ type: 'auth-result', user }, '*')
            }
            window.close()
          } catch (err) {
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage({ type: 'auth-result', error: { code: err?.code, message: err?.message } }, '*')
            }
            document.getElementById('status').innerText = 'Auth error. You can close this window.'
            console.error('Auth error', err)
          }
        }

        run()
      </script>
    </body>
  </html>
  `)
}
