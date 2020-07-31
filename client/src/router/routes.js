import Home from '../components/HomePage'
import SignIn from '../components/Auth/SignIn'
import UserList from '../components/Users/UserList'
import UserProfile from '../components/Profile/UserProfile'
import EditProfile from '../components/Profile/EditProfile'
import NewsFeed from '../components/NewsFeed/NewsFeed'
import FindPeopleList from '@/components/Users/FindPeopleList'
import Register from '../components/Register'
import EditProfileInComplete from '../components/Profile/EditProfileInComplete'
import PasswordReset from '../components/Auth/PasswordReset'
import UpdatePassword from '@/components/Auth/UpdatePassword'

//import store from '../store/store'

const routes = [
    
    {
        path: '/', 
        name:'home',
        component: Home, 
        
    },
    {
        path: '/signup', 
        name: 'signup',
        component: Register, 
        
    },
    {
        path: '/signin', 
        name: 'signin',
        component: SignIn, 
        
    },
    {
        path: '/updatepassworduser/user/:userId/token/:token', 
        name: 'update-password',
        component: UpdatePassword, 
        
    },
    {
        path: '/forgot-password', 
        name: 'forgotpassword',
        component: PasswordReset, 
        
    },
    {
        path: '/people', 
        name:'find-people',
        component: FindPeopleList,   
    },
    {
        path: '/users-list',
        name: 'user-list', 
        component: UserList, 
        
    },
    {
        path: '/edit-profile',
        name:'edit-profile', 
        component: EditProfile, 
        
    },
    {
        path: '/edit-profile-incomplete',
        name:'edit-profile-incomplete', 
        component: EditProfileInComplete, 
        
    },
    {
        path: '/profile',
        name:'profile', 
        component: UserProfile, 
        
    },
    {
        path: '/news-feed', 
        name:'newsfeed',
        component:  NewsFeed, 
        // beforeEnter: (to, from, next) => {
        //     if(!store.getters.isLoggedIn && to.name !== 'signin') next({name: 'newsfeed'}) 
        //     else next();
        // }
    }
]


export default routes;