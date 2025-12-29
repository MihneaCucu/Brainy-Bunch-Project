const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(rating) => "Reviews"
 * removeColumn(title) => "Reviews"
 * dropTable() => "Ratings", deps: []
 * createTable() => "Comments", deps: [Users, Reviews]
 * createTable() => "Diaries", deps: [Users]
 * createTable() => "MovieDiaries", deps: [Movies, Diaries]
 * addColumn(score) => "Reviews"
 * changeColumn(name) => "Directors"
 * changeColumn(title) => "Movies"
 *
 */

const info = {
  revision: 2,
  name: "noname",
  created: "2025-12-27T16:40:11.101Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Reviews", "rating", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Reviews", "title", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Ratings", { transaction }],
  },
  {
    fn: "createTable",
    params: [
      "Comments",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "Users", key: "id" },
          field: "userId",
          allowNull: false,
        },
        reviewId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "Reviews", key: "id" },
          field: "reviewId",
          allowNull: false,
        },
        content: { type: Sequelize.TEXT, field: "content", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Diaries",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          unique: true,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "MovieDiaries",
      {
        movieId: {
          type: Sequelize.INTEGER,
          unique: "MovieDiaries_movieId_diaryId_unique",
          field: "movieId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Movies", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
        diaryId: {
          type: Sequelize.INTEGER,
          unique: "MovieDiaries_movieId_diaryId_unique",
          field: "diaryId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Diaries", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
        watchedAt: {
          type: Sequelize.DATE,
          field: "watchedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Reviews",
      "score",
      { type: Sequelize.INTEGER, field: "score", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Directors",
      "name",
      { type: Sequelize.STRING, field: "name", unique: true, allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Movies",
      "title",
      {
        type: Sequelize.STRING,
        field: "title",
        unique: true,
        allowNull: false,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Reviews", "score", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Comments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Diaries", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["MovieDiaries", { transaction }],
  },
  {
    fn: "createTable",
    params: [
      "Ratings",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        score: { type: Sequelize.INTEGER, field: "score", allowNull: false },
        userId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "userId",
        },
        movieId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Movies", key: "id" },
          allowNull: true,
          field: "movieId",
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Reviews",
      "title",
      { type: Sequelize.STRING, field: "title", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Reviews",
      "rating",
      { type: Sequelize.DECIMAL(3, 1), field: "rating", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Directors",
      "name",
      { type: Sequelize.STRING, field: "name", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Movies",
      "title",
      { type: Sequelize.STRING, field: "title", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "Ratings",
      ["userId", "movieId"],
      {
        indexName: "ratings_user_id_movie_id",
        name: "ratings_user_id_movie_id",
        indicesType: "UNIQUE",
        type: "UNIQUE",
        transaction,
      },
    ],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
