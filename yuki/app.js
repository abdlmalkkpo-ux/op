const express = require('express');
const fs = require("fs-extra");
const app = express();
const PORT = 1752; 

app.use(express.json());

module.exports = async ({ usersData, threadsData }) => {

  app.get("/", async (req, res) => {
    try {
      const allUsers = await usersData.getAll();
      const usersCount = allUsers.length;
      const allThreads = await threadsData.getAll();
      const groupsCount = allThreads.length;
      
      const response = {
        BOT_USERS: usersCount,
        BOT_GROUPS: groupsCount,
        AUTHOR: 'ALLOU MOHAMED',
        CONTACT: 'facebook.com/proarcoder'
      };
      
      res.status(200).json(response);
    } catch (error) {
      log.error("Error fetching data", error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

  app.listen(PORT, () => {
    log.info("Listen", `Server is running on port ${PORT}`);
  });

};
