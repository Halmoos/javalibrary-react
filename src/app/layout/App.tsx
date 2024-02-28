import React, { useEffect } from 'react';
import './App.css';
import NavBar from './NavBar';
import BooksTable from '../components/BooksTable';
import { ToastContainer } from 'react-toastify';

function App() {

  useEffect(() => {
    document.title = 'JavaLibrary';
  }, []);

  return (
    <>
      <NavBar />
      <ToastContainer position='top-right' hideProgressBar theme='colored' />
      <BooksTable />
    </>
  );
}

export default App;
