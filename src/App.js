import { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './FirebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


function App() {

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isNumberValid, setIsNumberValid] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchedPassword, setMatchedPassword] = useState(true);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    success: false,
    phoneNumber: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault();


    if (isNewUser && user.email && user.password && user.phoneNumber) {

      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(() => {


          const UpdateUserInfo = { ...user };
          UpdateUserInfo.error = "";
          UpdateUserInfo.success = true;
          setUser(UpdateUserInfo);

        })
        .catch((error) => {

          const errorMessage = error.message;


          const UpdateUserInfo = { ...user };
          UpdateUserInfo.error = errorMessage;
          UpdateUserInfo.success = false;
          setUser(UpdateUserInfo);
        });

    }

    if (!isNewUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(() => {

          const UpdateUserInfo = { ...user };
          UpdateUserInfo.error = "";
          UpdateUserInfo.success = true;
          setUser(UpdateUserInfo);

        })
        .catch((error) => {
          const errorMessage = error.message;
          const UpdateUserInfo = { ...user };
          UpdateUserInfo.error = errorMessage;
          UpdateUserInfo.success = false;
          setUser(UpdateUserInfo);
          console.log(errorMessage);
        });

    }


  }

  const handleBlur = (e) => {

    let isFormValid;
    let passwordValidation;


    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      setIsEmailValid(isFormValid);

    }
    if (e.target.name === 'password') {
      isFormValid = e.target.value.length > 6 && /\d{1}/.test(e.target.value);
      isFormValid ? setConfirmPassword(e.target.value) : setConfirmPassword('');
      setIsPasswordValid(isFormValid);
    }

    if (e.target.name === 'phoneNumber') {
      isFormValid = e.target.value.length > 10;
      setIsNumberValid(isFormValid);
    }

    if (e.target.name === 'confirm-password') {

      passwordValidation = e.target.value === confirmPassword;

      setMatchedPassword(passwordValidation);

    }

    if (isFormValid && matchedPassword) {

      const UpdateUserInfo = { ...user };

      UpdateUserInfo[e.target.name] = e.target.value;

      setUser(UpdateUserInfo);

    }

  }

  const toggleSignIn = () => {
    setIsClicked(!isClicked);
    setIsNewUser(!isNewUser);
    setUser({});

  }


  return (
    <div className="App">
      <h1 className="mt-0">Our Own Authentication</h1>
      <form onSubmit={handleSubmit}>

        <label htmlFor="username">Email</label>
        <input type="email" name="email" className="form-control mb-3" placeholder="email" required onBlur={handleBlur} />
        {isEmailValid ? null : <p className="text-danger">invalid email</p>}

        <label htmlFor="password">Password</label>
        <input type="password" name="password" className="form-control mb-3" placeholder="password" required onBlur={handleBlur} />
        {isPasswordValid ? null : <p className="text-danger">invalid password</p>}

        <label htmlFor="password">Confirm Password</label>
        <input type="password" name="confirm-password" className="form-control mb-3" placeholder="Confirm Password" required onBlur={handleBlur} />
        {matchedPassword ? null : <p className="text-danger">password didn't match</p>}

        {
          isClicked ? null : (
            <>
              <label htmlFor="mobile">Mobile No</label>
              <input type="text" name="phoneNumber" className="form-control" placeholder="mobile" required onBlur={handleBlur} />
              {isNumberValid ? null : <p className="text-danger">invalid number</p>}

            </>
          )
        }

        <br />
        <br />

        {
          isClicked ? <button type="submit" className="btn btn-primary">Sign In</button> : (
            <>
              <p>First time? Please Sign Up</p>
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </>
          )
        }
      </form>

      <div>

        <span className="signin" onClick={toggleSignIn}>{isClicked ? 'Go back' : 'Sign In'}</span>
      </div>

      <h2>{user.success ? <p className="text-success">User {isNewUser ? 'created' : 'logged-in'} successfully</p> : <p className="text-warning">{user.error}</p>}</h2>



    </div>
  );
}

export default App;
