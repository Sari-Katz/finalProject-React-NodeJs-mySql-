import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthProvider, { AuthContext } from './components/AuthContext';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Home from './components/Home/Home.jsx';
import ScheduleTable from './components/Schedule/ScheduleTable.jsx';
import ManageClassesPage from './components/admin/ManageClassesPage/ManageClassesPage.jsx';
import ManageChallangesPage from './components/admin/ManageChallengePage/ManageChallangesPage.jsx';
import SubscriptionList from './components/Subscription/SubscriptionList.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';
import Posts from './components/Posts/Posts.jsx';
import Info from './components/UserProfile/Info.jsx';
import Nav from './components/Nav/Nav.jsx';
import Footer from './components/Footer/Footer.jsx';
import ViewComments from './components/Posts/ViewComments';

// ייבוא הCSS הגלובלי
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useContext(AuthContext);

  // קומפוננט שעוטף כל דף עם Nav, Footer ומיקום מרכזי
  const WithLayout = ({ children }) => (
    <>
      <Nav />
      <main className="main-content">
        <div className="page-wrapper">
          <div className="content-container">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  const PrivateRoute = ({ children, requiredRole }) => {
    if (!user) return <Navigate to="/login" />;
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to={`/user/home`} /> : <Login />
        }
      />
      
      <Route
        path="/Info"
        element={
          <PrivateRoute>
            <WithLayout>
              <Info />
            </WithLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/login"
        element={
          user ? <Navigate to={`/user/home`} /> : <Login />
        }
      />
      
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/user/home"
        element={
          <PrivateRoute>
            <WithLayout>
              <Home />
            </WithLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/schedule"
        element={
          <PrivateRoute>
            <WithLayout>
              <ScheduleTable />
            </WithLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/Subscription"
        element={
          <PrivateRoute>
            <WithLayout>
              <SubscriptionList />
            </WithLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/ManageClasses"
        element={
          <PrivateRoute requiredRole="admin">
            <WithLayout>
              <ManageClassesPage />
            </WithLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/ManageChallanges"
        element={
          <PrivateRoute requiredRole="admin">
            <WithLayout>
              <ManageChallangesPage />
            </WithLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <WithLayout>
              <UserProfile />
            </WithLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/posts"
        element={
          <PrivateRoute>
            <WithLayout>
              <Posts />
            </WithLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/post/:postId/comments"
        element={
          <PrivateRoute>
            <WithLayout>
              <ViewComments />
            </WithLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;