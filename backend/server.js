const express = require("express");
const app = express();
const PORT = 8383;

let data = [{ name: "chinmay" }];
app.use(express.json());

// get methood

//CRUD -> create-post-update-delete

app.get("/", (req, res) => {
  // -> / default GET
  console.log(req.method);
  res.send(`
        
         <body>
         <p>${JSON.stringify(data)}</p>
         </body>
        
        `);
});

app.get("/dashboard", (req, res) => {
  console.log(`i have hit the  dashboard}`);
  res.send("hi from dashboard");
});

app.get("/api/data", (req, res) => {
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`server has started on ${PORT}`);
});

//ADD DATA

app.post("/api/data", (req, res) => {
  console.log(req.body);
  const newData = req.body;

  if (Array.isArray(newData)) {
    newData.forEach((item) => {
      if (item && item.name) {
        data.push(item);
      }
    });
  } else {
    if (newData) {
      data.push(newData);
      console.log(data);
      res.sendStatus(201);
    } else {
      res.status(400).send({ error: "Invalid type" });
    }
  }
});

app.delete("/api/data", (req, res) => {
  if (data.length > 0) {
    data.pop();
    res.status(200).json({ message: "deleted last item" });
  } else {
    res.status(404).json({ error: "did not delete " });
  }
});
