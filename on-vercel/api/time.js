export default (req, res) => {
  res.json({
    'hello': 'world',
    time: new Date()
  });
}
