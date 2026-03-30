function getCredentials() {
  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("Faltan ADMIN_USER y/o ADMIN_PASSWORD en variables de entorno.");
  }

  return { username, password };
}

function login(req, res) {
  const { username, password } = req.body || {};
  const creds = getCredentials();

  if (username !== creds.username || password !== creds.password) {
    return res.status(401).json({ error: "Credenciales invalidas" });
  }

  req.session.user = {
    username: creds.username
  };

  return res.json({
    authenticated: true,
    username: creds.username
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.json({ authenticated: false });
  });
}

function me(req, res) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    username: req.session.user.username
  });
}

module.exports = {
  login,
  logout,
  me,
  getCredentials
};
