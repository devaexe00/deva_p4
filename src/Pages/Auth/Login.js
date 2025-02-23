// LoginPage.js
import { useReducer, useCallback, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

// Reducer function for form state management
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUES':
      return { ...state, [action.name]: action.value };
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.message };
    default:
      return state;
  }
};

const Login = () => {
  const navigate = useNavigate();
  
  // Use useReducer to manage form state
  const [state, dispatch] = useReducer(formReducer, {
    email: "",
    password: "",
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const { email, password, loading, error } = state;

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    dispatch({ type: 'SET_VALUES', name: e.target.name, value: e.target.value });
  };

  

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      dispatch({ type: 'SET_ERROR', message: "Please fill in all fields." });
      return;
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch({ type: 'SET_ERROR', message: "Please enter a valid email address." });
      return;
    }

    dispatch({ type: 'SET_LOADING', value: true });

    try {
      const { data } = await axios.post(loginAPI, { email, password });
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        toast.success(data.message, toastOptions);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Something went wrong!", toastOptions);
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "#000000" } }, 
          fpsLimit: 240,
          particles: {
            number: { value: 250, density: { enable: true, value_area: 1000 } },
            color: {
              value: ["#a1a1a1", "#4a90e2", "#e2e8f0", "#0066cc", "#00b0a0"], 
              animation: {
                enable: true,
                speed: 8, 
                sync: false, 
              },
            },
            shape: {
              type: ["circle", "star"],
              star: {
                nb_sides: 5,
              },
            },
            opacity: { value: 0.6, random: true },
            size: { value: 4, random: true },
            move: { enable: true, speed: 3 },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        
        
      
      />
      <Container className=" mt-5" style={{ position: "relative", zIndex: "2", backgroundColor:"" }} >
        <Row>
        <h1 className="text-center mt-5">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#ffd700" }} />
            </h1>
            <h1 className="text-center" style={{ color: "#ffd700", fontFamily: "'Montserrat', sans-serif", fontSize: "36px", fontWeight: "600" }}>
            Welcome to Finance Management System</h1> 
                     <Col md={{ span: 6, offset: 3 }}>
                <hr></hr>
            <h1 className=" text-center text-white"  ><b>Login</b></h1>
            <Form>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label style={{ color: "#00FFFF" }}> <b>Email address</b></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  value={email}
                  isInvalid={error}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label style={{ color: "#00FFFF" }}><b>Password</b></Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={password}
                  isInvalid={error}
                />
              </Form.Group>

              {error && (
                <div className="mt-3" style={{ color: "red", animation: "shake 0.5s" }}>
                  {error}
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                className="mt-4"
              >
                <Link to="/forgotPassword" className="text-white lnk">
                  Forgot Password?
                </Link>

                <Button
                  type="submit"
                  className="text-center mt-3 btnStyle"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                  style={{
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#ff8c00"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "blue"}
                >
                  {loading ? "Signing In…" : "Login"}
                </Button>

                <p className="mt-3" style={{ color: "#9d9494" }}>
                  Don't Have an Account?{" "}
                  <Link to="/register" className="text-white lnk">
                    Register
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
