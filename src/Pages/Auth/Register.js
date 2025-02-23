// SignupPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./auth.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('user')){
      navigate('/');
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password } = values;
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { name, email, password } = values;
    setLoading(true);

    try {
      const { data } = await axios.post(registerAPI, { name, email, password });

      if (data.success) {
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Something went wrong!", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

        <Container className="mt-5" style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <h1 className="text-center">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#ffd700" }} />
            </h1>
            <h1 className="text-center" style={{ color: "#ffd700", fontFamily: "'Montserrat', sans-serif", fontSize: "36px", fontWeight: "600" }}>
              Welcome to Finance Management System</h1>
            <Col md={{ span: 6, offset: 3 }}>
              <h1 className="text-white text-center mt-5" ><b>Registration</b></h1>
              <Form>
                <Form.Group controlId="formBasicName" className="mt-3">
                  <Form.Label style={{ color: "#00FFFF" }}><b>Name</b></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!error}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label style={{ color: "#00FFFF" }}><b>Email address</b></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!error}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label style={{ color: "#00FFFF" }}><b>Password</b></Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!error}
                  />
                </Form.Group>

                {error && (
                  <div
                    style={{
                      color: "red",
                      marginTop: "10px",
                      animation: "shake 0.5s",
                    }}
                  >
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
                    {loading ? "Registering..." : "Signup"}
                  </Button>

                  <p className="mt-3" style={{ color: "#9d9494" }}>
                    Already have an account?{" "}
                    <Link to="/login" className="text-white lnk">
                      Login
                    </Link>
                  </p>
                </div>
              </Form>
            </Col>
          </Row>
          <ToastContainer />
        </Container>
      </div>
    </>
  );
};

export default Register;
