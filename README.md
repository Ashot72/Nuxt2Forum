It is a Nuxt.js 2.0 basic forum web application converted from my Vue.js 2.0 forum
[Vue.js 2 Forum](https://github.com/Ashot72/Vue2Forum)

Nuxt.js application can run in three modes

1) Universal - In this mode application is dynamically rendered on the server and after the first load the application turns into spa (Single Page Application). This is great for Search Engine Optimization (SEO). As the page is rendered on the server without having to wait all the JavaScript to be downloaded it ensures that users can still enjoy the fast speed provided by Server-Side Rendering.

2) Single Page Application (SPA) - In SPA mode you do not have any pre-rendering. Nothing gets rendered on the server. This is not good for SEO if you need to load some asynchronous data before rendering something in the screen and you have a problem. Google crawler is not going to wait for your content to be loaded. It just sees the entry page. In SPA mode a Nuxt.js application is the same as Vue.js but with Nuxt.js SPA mode you benifit from simplified development, automatically inferred routing and all Nuxt.js features.

3) Static - This is the coolest mode!!! In this mode Nuxt.js generates the entire app as static files which can be deployed to a static host. You do not send real requests and get back to real pages. This is pretty amazing because with that we got the best of both worlds. We got Search Engine Optimized application because everything is pre-rendered and all HTML files with all the content are there for the crawlers to be consumed. You can regenerate pages when your dynamic content changes. It can  be also set up as a dynamic automated process.

Nuxt.js 2.0 basic forum application can work in three modes and deployed without changing a single line of code!

Single Page Application version hosted on Firebase - [https://nuxt-spa-forums.firebaseapp.com](https://nuxt-spa-forums.firebaseapp.com)

Static version hosted on Firebase - [https://nuxt-static-forums.firebaseapp.com](https://nuxt-static-forums.firebaseapp.com)


To get started.
```
       Clone the repository
   
       git clone https://github.com/Ashot72/Nuxt2Forum
       cd Nuxt2Forum
       
       # install dependencies
       npm install OR yarn install
       
       # serve with hot reload at localhost:3000
       npm run dev OR yarn run dev
       
       # build for production and launch server
        npm run build OR yarn run build
        npm start OR yarn start
        
       # generate static project
        npm install OR yarn run generate
```   
 For in-depth deploymnet please go to 'How to run Nuxt.js 2 Forum' page below.

Go to [Vu2.js/Nuxt2.js Forum Video](https://youtu.be/33WeNhsAcBk) page

Go to [How to run Nuxt.js 2 Forum](https://ashot72.github.io/Nuxt2Forum/index.html) page 

Go to [Nuxt.js 2 Forum description](https://ashot72.github.io/Nuxt2Forum/description/index.html) page

