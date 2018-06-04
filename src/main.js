// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import firebase from 'firebase'
import nativeToast from 'native-toast'
import VueRouter from 'vue-router'
import Routes from './router/index'
import '../node_modules/native-toast/dist/native-toast.css'

Vue.use(VueRouter)

Vue.config.productionTip = false

let app;
let config = {
  apiKey: "AIzaSyCmDyeWN3XYfuqJ-nJEsgSXSGQGaIXQMH8",
  authDomain: "vuefirebase-84e8c.firebaseapp.com",
  databaseURL: "https://vuefirebase-84e8c.firebaseio.com",
  projectId: "vuefirebase-84e8c",
  storageBucket: "vuefirebase-84e8c.appspot.com",
  messagingSenderId: "34821206390"
};
firebase.initializeApp(config);

const router = new VueRouter({
  mode: 'history',
  routes: Routes
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  // check if the route we want to navigate to need authentication by checking if the route object has the requiresAuth meta.
  // So, in our navigation guard global function, inside the to route object, we search if the matched Array has some records (in our case a single one) with requiresAuth meta.
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // If the route we navigate to requires authentication and there is no current user logged in, we redirect to the Login view.
  if (requiresAuth  && !currentUser) next ('login')
  // If the route we navigate to does not require authentication and there is a user logged in, we redirect to the ChatHome view.
  else if (!requiresAuth && currentUser) next ('ChatHome')
  // Else, we proceed navigation.
  else next()
})

// We need to initialize the app only when we are sure Firebase Auth object is ready to use. This makes sure that the redirection 
// takes place directly on the first load of the APP. For that, we make use of an observer Firebase ships with. This observer is called onAuthStateChanged.
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    });
  }
});