import React, { useState } from "react";
import styles from "./Auth.module.css";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = ({ setAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    college: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // Test backend connection
  const testBackend = async () => {
    try {
      const res = await axios.get('https://resumind-recovery-3.onrender.com/test');
      console.log("Backend test successful:", res.data);
      return true;
    } catch (err) {
      console.error("Backend test failed:", err);
      return false;
    }
  };

  // Test auth endpoint directly
  const testAuthEndpoint = async () => {
    try {
      console.log("Testing auth endpoint directly...");
      const testPayload = {
        name: "test",
        college: "test",
        email: "test@test.com",
        password: "test123"
      };
      
      // Try with axios first
      try {
        const res = await axios.post('https://resumind-recovery-3.onrender.com/api/auth/signup', testPayload, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("Direct auth test successful (axios):", res.data);
        return true;
      } catch (axiosErr) {
        console.error("Axios test failed:", axiosErr);
        
        // Try with fetch as alternative
        console.log("Trying with fetch...");
        const fetchRes = await fetch('https://resumind-recovery-3.onrender.com/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testPayload)
        });
        
        const fetchData = await fetchRes.json();
        console.log("Fetch response:", fetchData);
        console.log("Fetch status:", fetchRes.status);
        
        return fetchRes.ok;
      }
    } catch (err) {
      console.error("Direct auth test failed:", err);
      console.error("Error details:", err.response?.data);
      return false;
    }
  };

  // Simple test function to bypass form
  const testDirectCall = async () => {
    console.log("=== DIRECT API TEST ===");
    try {
      const response = await axios.post('https://resumind-recovery-3.onrender.com/api/auth/signup', {
        name: "Test User",
        college: "Test College", 
        email: "test@example.com",
        password: "testpassword123"
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Direct call successful:", response.data);
      alert("Direct API call successful!");
    } catch (error) {
      console.error("Direct call failed:", error);
      console.error("Error response:", error.response?.data);
      alert("Direct API call failed: " + (error.response?.data?.error || error.message));
    }
  };

  // Completely isolated test - no form involvement
  const isolatedTest = async () => {
    console.log("=== ISOLATED TEST - NO FORM INVOLVEMENT ===");
    
    // Test 1: Simple axios POST
    try {
      console.log("Making direct axios POST request...");
      const response = await axios({
        method: 'POST',
        url: 'https://resumind-recovery-3.onrender.com/api/auth/signup',
        data: {
          name: "Test User",
          college: "Test College",
          email: "test@example.com", 
          password: "testpassword123"
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Isolated test successful:", response.data);
      alert("✅ Isolated test successful!");
      return true;
    } catch (error) {
      console.error("❌ Isolated test failed:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert("❌ Isolated test failed: " + (error.response?.data?.error || error.message));
      return false;
    }
  };

  // Test if the issue is with the URL or request method
  const testUrlAndMethod = async () => {
    console.log("=== TESTING URL AND METHOD ===");
    
    // Test 1: Check if backend is reachable
    try {
      console.log("Testing backend connectivity...");
      const testResponse = await axios.get('https://resumind-recovery-3.onrender.com/test');
      console.log("✅ Backend is reachable:", testResponse.data);
    } catch (error) {
      console.error("❌ Backend not reachable:", error);
      alert("Backend not reachable!");
      return;
    }
    
    // Test 2: Check if auth endpoint exists
    try {
      console.log("Testing auth endpoint existence...");
      const authResponse = await axios.get('https://resumind-recovery-3.onrender.com/api/auth/signup');
      console.log("❌ Auth endpoint accepts GET (should not):", authResponse.data);
    } catch (error) {
      console.log("✅ Auth endpoint correctly rejects GET:", error.response?.data);
    }
    
    // Test 3: Make actual POST request
    try {
      console.log("Making actual POST request...");
      const postResponse = await axios.post('https://resumind-recovery-3.onrender.com/api/auth/signup', {
        name: "Test User",
        college: "Test College",
        email: "test@example.com",
        password: "testpassword123"
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ POST request successful:", postResponse.data);
      alert("✅ POST request successful!");
    } catch (error) {
      console.error("❌ POST request failed:", error.response?.data);
      alert("❌ POST request failed: " + (error.response?.data?.error || error.message));
    }
  };

  // Test temporary endpoint that doesn't require MongoDB
  const testTempEndpoint = async () => {
    console.log("=== TESTING TEMPORARY ENDPOINT ===");
    try {
      const response = await axios.post('https://resumind-recovery-3.onrender.com/api/auth/test-signup', {
        name: "Test User",
        college: "Test College",
        email: "test@example.com",
        password: "testpassword123"
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Temporary endpoint successful:", response.data);
      alert("✅ Temporary endpoint successful!");
      return true;
    } catch (error) {
      console.error("❌ Temporary endpoint failed:", error);
      console.error("Error response:", error.response?.data);
      alert("❌ Temporary endpoint failed: " + (error.response?.data?.error || error.message));
      return false;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, preventing default");
    setLoading(true);
  
    // Test backend connection first
    const backendWorking = await testBackend();
    if (!backendWorking) {
      alert("Cannot connect to server. Please try again later.");
      setLoading(false);
      return;
    }
  
    const endpoint = isSignUp ? "signup" : "signin";
    const payload = isSignUp
      ? form
      : { email: form.email, password: form.password };
  
    try {
      console.log("=== AUTH REQUEST DEBUG ===");
      console.log("Sending POST request to:", `https://resumind-recovery-3.onrender.com/api/auth/${endpoint}`);
      console.log("Payload:", payload);
      console.log("Request method: POST");
      console.log("Is signup:", isSignUp);
      
      const res = await axios.post(`https://resumind-recovery-3.onrender.com/api/auth/${endpoint}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log("Response status:", res.status);
      console.log("Response data:", res.data);
      
      if (res.status === 200 || res.status === 201) {
        const { user, token } = res.data;
  
        // 🔐 Store in localStorage
        localStorage.setItem("resumindUser", JSON.stringify(user));
        localStorage.setItem("resumindToken", token);
  
        setAuthenticated(true);
        alert(isSignUp ? "Signed up successfully!" : "Logged in successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("=== AUTH ERROR DEBUG ===");
      console.error("Axios error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Request URL:", err.config?.url);
      console.error("Request method:", err.config?.method);
      console.error("Full error object:", err);
      alert(err.response?.data?.error || `${isSignUp ? "Signup" : "Signin"} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className={styles.container}
    >
      <div className={styles.authBox}>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form 
          className={styles.form} 
          onSubmit={handleSubmit} 
          method="POST"
          noValidate
        >
          {isSignUp && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="text"
                name="college"
                placeholder="College"
                value={form.college}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button 
            type="submit" 
            className={styles.button} 
            disabled={loading}
            onClick={(e) => {
              console.log("Button clicked directly");
              handleSubmit(e);
            }}
          >
            {loading ? "Loading..." : (isSignUp ? "Create Account" : "Log In")}
          </button>
        </form>
        <p className={styles.toggleMsg}>
          {isSignUp ? "Already registered? " : "Don't have an account? "}
          <span
            className={styles.toggleLink}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
        
        {/* Debug button - remove this after testing */}
        <button 
          onClick={testAuthEndpoint}
          style={{ 
            marginTop: '10px', 
            padding: '5px 10px', 
            fontSize: '12px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test API (Debug)
        </button>
        
        {/* Simple test button */}
        <button 
          onClick={testDirectCall}
          style={{ 
            marginTop: '10px', 
            marginLeft: '10px',
            padding: '5px 10px', 
            fontSize: '12px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Direct Test
        </button>
        
        {/* Isolated test button */}
        <button 
          onClick={isolatedTest}
          style={{ 
            marginTop: '10px', 
            marginLeft: '10px',
            padding: '5px 10px', 
            fontSize: '12px',
            backgroundColor: '#ff9ff3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Isolated Test
        </button>
        
        {/* URL and method test button */}
        <button 
          onClick={testUrlAndMethod}
          style={{ 
            marginTop: '10px', 
            marginLeft: '10px',
            padding: '5px 10px', 
            fontSize: '12px',
            backgroundColor: '#feca57',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          URL Test
        </button>
        
        {/* Temporary endpoint test button */}
        <button 
          onClick={testTempEndpoint}
          style={{ 
            marginTop: '10px', 
            marginLeft: '10px',
            padding: '5px 10px', 
            fontSize: '12px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Temp Endpoint Test
        </button>
      </div>
    </motion.div>
  );
};

export default Auth;
