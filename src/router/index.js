import Vue from 'vue';
import Router from 'vue-router'

import ChatHome from '@/components/ChatHome'
import Login from '../components/login'
import SignUp from '../components/SignUp'

Vue.use(Router)

export default [
    {
        path: '*',
        redirect: '/login',
    },
    {
        path: '/',
        redirect: '/login',
    },    
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/sign-up',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/ChatHome',
        name: 'ChatHome',
        component: ChatHome,
        meta: {
            requiresAuth: true
        }
    }
]

