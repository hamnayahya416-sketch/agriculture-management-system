import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconShield, IconUser } from "../common/icons";
import { authenticate, login } from "../store/actions/authActions";
import { showToast } from "../store/actions/uiActions";
import { validateLogin, hasErrors } from "../utils/validators";

const DEMO_ACCOUNTS = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "manager", password: "manager123", role: "Manager" },
];

export default function LoginForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateLogin(form.username, form.password);
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    const account = authenticate(form.username, form.password);
    if (!account) {
      setErrors({ password: "Invalid username or password." });
      dispatch(showToast({ message: "Invalid username or password.", tone: "error" }));
      return;
    }

    dispatch(login({ user: account.username, role: account.role }));
    dispatch(
      showToast({
        message: `Welcome back, ${account.displayName}!`,
        tone: "success",
      })
    );
  }

  function fillDemo(username, password) {
    setForm({ username, password });
    setErrors({});
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__icon">
        <IconShield size={26} />
      </div>

      <label className="field">
        <span>Username</span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="admin"
          value={form.username}
          onChange={handleChange}
          aria-invalid={Boolean(errors.username)}
        />
        {errors.username && <em>{errors.username}</em>}
      </label>

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && <em>{errors.password}</em>}
      </label>

      <button type="submit" className="btn login-form__submit">
        <IconUser size={16} />
        Sign in
      </button>

      <div className="login-form__demo">
        <span className="login-form__demo-title">Demo credentials</span>
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.username}
            type="button"
            className="login-form__demo-chip"
            onClick={() => fillDemo(account.username, account.password)}
          >
            <b>{account.role}</b>
            {account.username} / {account.password}
          </button>
        ))}
      </div>
    </form>
  );
}
