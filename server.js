import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// ✅ 確保 `_page` 參數正確生效
server.use((req, res, next) => {
  if (req.method === "GET" && req.query._page) {
    const totalCount = router.db.get("tasks").size().value();
    res.setHeader("X-Total-Count", totalCount);
  }
  next();
});

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log("✅ JSON Server is running on http://localhost:3001");
});
