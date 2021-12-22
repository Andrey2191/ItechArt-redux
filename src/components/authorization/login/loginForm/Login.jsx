import { FormAuth } from "../../authorizationForm/Form";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../redux/slices/userSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();

  const handleLogin = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          })
        );
        push("/");
      })
      .catch(() => alert("Пользователь не найден!"));
  };

  return (
    <div>
      <FormAuth title="Войти" handleClick={handleLogin} />
    </div>
  );
};

export default LoginForm;
