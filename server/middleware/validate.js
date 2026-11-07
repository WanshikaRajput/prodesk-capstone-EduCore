module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues;
    return res.status(400).json({
      success: false,
      message: issues[0].message,
      errors: issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }

  req.body = result.data; // sirf allowed fields aage jaate hain
  next();
};