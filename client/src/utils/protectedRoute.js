// import { Navigate } from "react-router-dom";
const ProtectedRoute = async ({ children }) => {
  console.log(document.cookie); //  connect.sid=s%3A2Mg9qmHiYSkPCCooTy4dpRo9wFdBmv31.GN6txKI6%2BM1Um8povJN%2FZfqEM35Mh2JEUqCROrKwpMI

  // Make request to check if cookie has correct auth.
  try {
    const response = await fetch(`http://localhost:3000/`);

    const userInfo = await response.json();
    console.log(userInfo)

  } catch(error) {
    // toast.error(`Error fetching user info: ${error}`);
  } 
  return children;
}

module.exports = ProtectedRoute;