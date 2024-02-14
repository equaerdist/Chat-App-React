import { Transition } from "react-transition-group";
import { createPortal } from "react-dom";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
} from "@mui/material";
import { Fragment } from "react";
const Modal = (props) => {
  const duration = 300;
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  };

  const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };
  const body = document.querySelector("body");
  const color = props.condition ? "green" : "red";
  console.log(props.message);
  return (
    <>
      <Dialog
        onClose={props.close}
        open={props.in}
        TransitionComponent={Fade}
        transitionDuration={{ enter: 300, exit: 300 }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {"Информация"}
          <IconButton onClick={props.close}>
            <CloseIcon></CloseIcon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.message.split("\n").map((item, i) => {
              return (
                <Fragment key={i}>
                  {item}
                  <br />
                </Fragment>
              );
            })}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Modal;
