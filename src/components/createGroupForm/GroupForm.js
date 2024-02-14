import { Box, Modal } from "@mui/material";
import { Formik } from "formik";
import Api from "../../services/Api";
import { useMemo } from "react";
import { Button } from "@mui/material";
import { ErrorMessage, Field, Form } from "formik";
import * as yup from "yup";
import { useField } from "formik";
import Alert from "@mui/material/Alert";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};
const MuiErrorMessage = (props) => {
  const [field, meta] = useField({ ...props });
  return meta.error && meta.touched ? (
    <Alert severity="error" sx={{ mt: "5px" }}>
      {meta.error}
    </Alert>
  ) : null;
};
const GroupForm = (props) => {
  const api = useMemo(() => new Api(), []);
  return (
    <>
      <Modal
        open={props.open}
        closeAfterTransition
        onClose={props.onClose}
        disableAutoFocus
      >
        <Box sx={style}>
          <Formik
            initialValues={{ name: "", description: "" }}
            validationSchema={yup.object({
              name: yup
                .string()
                .required("Это поле является обязательным")
                .min(3, "Название группы не короче 3 символов")
                .max(100, "Название группы не больше 100 символов"),
              description: yup.string(),
            })}
            onSubmit={(values) => {
              api
                .addGroup({
                  name: values.name,
                  description: values.description,
                })
                .then((g) => props.setGroups((old) => [...old, g]))
                .catch((e) => {
                  props.setError(true);
                  props.setMessage(e.message);
                  setTimeout(() => props.setError(false), 2000);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginTop: "25px",
                    fontWeight: 700,
                  }}
                >
                  Название
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Введите название..."
                  style={{ display: "block", marginTop: "5px", width: "100%" }}
                />
                <MuiErrorMessage name="name" component="div" />
                <label
                  htmlFor="description"
                  style={{
                    display: "block",
                    marginTop: "25px",
                    fontWeight: 700,
                  }}
                >
                  Описание
                </label>
                <Field
                  type="text"
                  name="description"
                  as="textarea"
                  placeholder="Введите описание..."
                  style={{
                    display: "block",
                    marginTop: "5px",
                    height: "200px",
                    width: "100%",
                    resize: "none",
                    overflowY: "auto",
                  }}
                />
                <MuiErrorMessage name="description" component="div" />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ display: "block", mt: "25px" }}
                >
                  Создать
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
export default GroupForm;
