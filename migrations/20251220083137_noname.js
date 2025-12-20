const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(title) => "Reviews"
 * removeColumn(rating) => "Reviews"
 * createTable() => "Comments", deps: [Users, Reviews]
 * createTable() => "MovieLists", deps: [Users]
 * createTable() => "MovieListMovies", deps: [MovieLists, Movies]
 * addColumn(score) => "Reviews"
 * changeColumn(movieId) => "Ratings"
 * addIndex(comments_user_id_review_id) => "Comments"
 *
 */

const info = {
  revision: 2,
  name: "noname",
  created: "2025-12-20T08:31:37.686Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Reviews", "title", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Reviews", "rating", { transaction }],
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
      "MovieLists",
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
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
        isPublic: {
          type: Sequelize.BOOLEAN,
          field: "isPublic",
          defaultValue: false,
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
      "MovieListMovies",
      {
        movieListId: {
          type: Sequelize.INTEGER,
          unique: "MovieListMovies_movieListId_movieId_unique",
          field: "movieListId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "MovieLists", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
        movieId: {
          type: Sequelize.INTEGER,
          unique: "MovieListMovies_movieListId_movieId_unique",
          field: "movieId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Movies", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
        addedAt: {
          type: Sequelize.DATE,
          field: "addedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        note: { type: Sequelize.TEXT, field: "note", allowNull: true },
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
      "Ratings",
      "movieId",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Movies", key: "id" },
        allowNull: true,
        field: "movieId",
      },
      { transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "Comments",
      ["userId", "reviewId"],
      {
        indexName: "comments_user_id_review_id",
        name: "comments_user_id_review_id",
        indicesType: "UNIQUE",
        type: "UNIQUE",
        transaction,
      },
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
    params: ["MovieLists", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["MovieListMovies", { transaction }],
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
    fn: "addColumn",
    params: [
      "Reviews",
      "title",
      { type: Sequelize.STRING, field: "title", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Ratings",
      "movieId",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Movies", key: "id" },
        allowNull: true,
        field: "movieId",
      },
      { transaction },
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
