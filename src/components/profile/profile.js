import cat from "../../img/cat.jpg";
import EditIcon from "@mui/icons-material/Edit";
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";
const useInput = (defaultValue) => {
  const [input, setInput] = useState(defaultValue);
  const onInput = (e) => {
    setInput(e.target.value);
  };
  return { input, onInput };
};
const Profile = (props) => {
  const onClick = (e) => {
    props.setUser((oldUser) => ({
      ...oldUser,
      nickname: nickname.input,
      fullName: fullName.input,
    }));
  };
  let date = new Date(props.user.registrationDate);
  const fullName = useInput(props.user.fullName);
  const nickname = useInput(props.user.nickname);
  const canIEdit = () =>
    fullName.input === props.user.fullName &&
    nickname.input === props.user.nickname
      ? visuallyHidden
      : null;
  return (
    <div className="main__profile">
      <img
        src={"http://localhost:5090/user.png"}
        className="main__profile-img"
        alt=""
      />
      <input
        onInput={fullName.onInput}
        className="main__profile-name"
        style={{ backgroundColor: "transparent", border: "none" }}
        value={fullName.input}
      />
      <div className="main__profile-dscr">User</div>

      <div className="main__profile-data">
        <label htmlFor="nickname" style={{ marginRight: "5px" }}>
          Ваш никнейм
        </label>
        <input
          onInput={nickname.onInput}
          value={nickname.input}
          name="nickname"
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontWeight: 700,
            fontSize: "17px",
          }}
        />
      </div>
      <div className="main__profile-data">
        Дата регистрации
        <span>{`${date.getDate()}:${
          date.getMonth() + 1
        }:${date.getFullYear()}`}</span>
      </div>
      <EditIcon
        sx={{ m: "20px", cursor: "pointer", ...canIEdit() }}
        onClick={onClick}
        titleAccess="Нажмите на имя, чтобы отредактировать"
      ></EditIcon>
      {props.error}
    </div>
  );
};
export default Profile;
