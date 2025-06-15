import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthProvider, { AuthContext } from './components/AuthContext';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Home from './components/Home/Home.jsx';
import ScheduleTable from './components/Schedule/ScheduleTable.jsx';
import ManageClassesPage from './components/admin/ManageClassesPage/ManageClassesPage.jsx';
import SubscriptionList from './components/Subscription/SubscriptionList.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';
import Posts from './components/Posts/Posts.jsx';
import Nav from './components/Nav/Nav.jsx';
import Footer from './components/Footer/Footer.jsx';
import ViewComments from './components/Posts/ViewComments';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useContext(AuthContext);

  const WithLayout = ({ children }) => (
    <>
      <Nav />
      {children}
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
        path="/profile"
        element={
          <PrivateRoute>
            <WithLayout>
              <UserProfile />
            </WithLayout>
          </PrivateRoute>
        }
      />
      {/* <Route path="*" element={<PageNotFound />} /> */}
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
