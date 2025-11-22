export const dashboard = (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
};
