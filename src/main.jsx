import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { AuthProvider } from './provider/AuthProvider.jsx';
import Login from './components/Login';
// import App from './App';
import Signup from './components/Signup.jsx';
import Home from './pages/Home.jsx';
import Private from './private/Private.jsx';
import AddTask from './components/AddTask.jsx';
import Update from './components/Update.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Set Login page as the default */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Private><Home></Home></Private>} />
          <Route path= "/signup" element={<Signup/>}/>
          <Route path="/addTask" element={<Private><AddTask></AddTask></Private>}/>
          <Route path="/update/:id" element={<Private><Update></Update></Private>}/>
        </Routes>
        </QueryClientProvider>
        
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
