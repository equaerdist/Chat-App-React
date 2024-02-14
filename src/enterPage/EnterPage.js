import UserForm from "../components/userForm/userForm";
import { useNavigate } from "react-router-dom";
import Api from "../services/Api";
import "./enterPage.scss";
import { useEffect, useMemo } from "react";
const EnterPage = (props) => {
  const navigate = useNavigate();
  const api = useMemo(() => new Api(), []);
  useEffect(() => {
    api
      .checkAuth()
      .then((r) => navigate(`/chat/${r.nickname}`))
      .catch(console.log);
  }, []);
  return (
    <div className="enter-page">
      <UserForm></UserForm>
    </div>
  );
};
export default EnterPage;
