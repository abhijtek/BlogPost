import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./components/Login.jsx"));
const AuthLayout = lazy(() => import("./components/AuthLayout.jsx"));
const AddPost = lazy(() => import("./pages/AddPost"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.jsx"));
const EditPost = lazy(() => import("./pages/EditPost"));
const Post = lazy(() => import("./pages/Post"));
const AllPosts = lazy(() => import("./pages/AllPosts"));
const UserPanel = lazy(() => import("./pages/UserPanel"));
const SignUp = lazy(() => import("./components/SignUp.jsx"));
//import SignUp from './pages/SignUp.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: (
                <Suspense fallback={null}>
                    <Home />
                </Suspense>
            ),
        },
        {
            path: "/login",
            element: (
                <Suspense fallback={null}>
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                </Suspense>
            ),
        },
        {
            path: "/signup",
            element: (
                <Suspense fallback={null}>
                    <AuthLayout authentication={false}>
                        <SignUp />
                    </AuthLayout>
                </Suspense>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <Suspense fallback={null}>
                    <AuthLayout authentication>
                        {" "}
                        <AllPosts />
                    </AuthLayout>
                </Suspense>
            ),
        },
        {
            path: "/panel",
            element: (
                <Suspense fallback={null}>
                    <AuthLayout authentication>
                        {" "}
                        <UserPanel />
                    </AuthLayout>
                </Suspense>
            ),
        },
        {
            path: "/add-post",
            element: (
                <Suspense fallback={null}>
                    <AuthLayout authentication>
                        {" "}
                        <AddPost />
                    </AuthLayout>
                </Suspense>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <Suspense fallback={null}>
                    <AuthLayout authentication>
                        {" "}
                        <EditPost />
                    </AuthLayout>
                </Suspense>
            ),
        },
        {
            path: "/post/:slug",
            element: (
                <Suspense fallback={null}>
                    <Post />
                </Suspense>
            ),
        },
    ],
},
])

const hideBootLoader = () => {
  const loader = document.getElementById('boot-loader')
  if (!loader) return
  loader.style.opacity = '0'
  loader.style.transition = 'opacity 220ms ease'
  setTimeout(() => loader.remove(), 240)
}

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>

)

requestAnimationFrame(hideBootLoader)
setTimeout(hideBootLoader, 1200)
