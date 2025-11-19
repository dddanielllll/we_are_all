module.exports = (req, res) => {
  const summary = `We Are All One is an educational computer game that works offline. It teaches players to understand and address discrimination through interactive activities and teamwork. It can be played solo or in groups starting at age 8, and it contains no violence.`;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
  res.statusCode = 200;
  res.end(JSON.stringify({ summary }));
};
