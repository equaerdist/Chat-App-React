import { useFormik } from "formik";
import { useCallback, useMemo, useState, useTransition } from "react";
import "./userForm.scss";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Modal from "../portal/modal";
import Api from "../../services/Api";
import { LinearProgress } from "@mui/material";
import Fade from "@mui/material";
const UserForm = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(false);
  const [isPending, setTransition] = useTransition();
  const [modal, showModal] = useState(false);
  const [message, setMessage] = useState("");
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      if (!page) {
        console.log("first");
        await onEnter(values);
      } else {
        await onRegister(values);
      }
    } catch (e) {
      setMessage(e.message);
      showModal(true);
      setError(true);
      setTimeout(() => showModal(false), 10000);
    } finally {
      setLoading(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      repassword: "",
      nickname: "",
    },
    onSubmit: onSubmit,
  });
  const onEnter = async (values) => {
    await api.getAuth({ nickname: values.nickname, password: values.password });
    return navigate(`/chat/${values.nickname}`);
  };
  const onRegister = async (values) => {
    let e = await api.registerUser({
      nickname: values.nickname,
      fullName: values.name,
      password: values.password,
    });
    setMessage(e.result);
    showModal(true);
    setTimeout(() => showModal(false), 5000);
  };

  const onClick = useCallback((destination) => {
    let value = "";
    if (destination.indexOf("reg") !== -1) value = true;
    else value = false;
    setTransition(() => setPage(value));
  }, []);
  let classes = `user-form__button`;
  let activeClass = classes + " user-form__button_active";
  let api = useMemo(() => new Api(), []);
  return (
    <div className="user-form">
      <Modal
        in={modal}
        message={message}
        close={() => showModal(false)}
      ></Modal>
      <div className="user-form__buttons">
        <button
          className={!page ? activeClass : classes}
          dest="enter"
          onClick={(e) => onClick(e.target.getAttribute("dest"))}
        >
          Войти
        </button>
        <button
          className={page ? activeClass : classes}
          dest="reg"
          onClick={(e) => onClick(e.target.getAttribute("dest"))}
        >
          Регистрация
        </button>
      </div>

      <form className="user-form__main" onSubmit={formik.handleSubmit}>
        <CSSTransition in={page} timeout={300} classNames="fade" unmountOnExit>
          <div>
            <label htmlFor="name">Полное имя пользователя</label>
            <input type="text" name="name" onChange={formik.handleChange} />
          </div>
        </CSSTransition>
        <label htmlFor="nickname">Уникальное имя</label>
        <input type="text" name="nickname" onChange={formik.handleChange} />
        <label htmlFor="password">Пароль</label>
        <input type="password" name="password" onChange={formik.handleChange} />
        <CSSTransition in={page} timeout={300} classNames="fade" unmountOnExit>
          <div>
            <label htmlFor="repassword">Пароль еще раз</label>
            <input
              type="password"
              name="repassword"
              onChange={formik.handleChange}
            />
          </div>
        </CSSTransition>

        {loading ? <LinearProgress></LinearProgress> : null}

        <button className="button">{page ? "Создать аккаунт" : "Войти"}</button>
      </form>
    </div>
  );
};
export default UserForm;
