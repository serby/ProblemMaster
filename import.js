const level = require("level");
const db = level("problems");

const problems = require("./serby-problems.json");

const main = async () => {
  for (let problem of problems) {
    await db.put("problem:" + problem.id, JSON.stringify(problem));
  }

  db.close();
};

main();
