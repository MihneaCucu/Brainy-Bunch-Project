const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Actors", deps: []
 * createTable() => "Genres", deps: []
 * createTable() => "Movies", deps: []
 * createTable() => "Roles", deps: []
 * createTable() => "MovieActors", deps: [Movies, Actors]
 * createTable() => "MovieGenres", deps: [Movies, Genres]
 * createTable() => "Users", deps: [Roles]
 * createTable() => "Ratings", deps: [Users, Movies]
 * createTable() => "Reviews", deps: [Users, Movies]
 * createTable() => "Watchlists", deps: [Users]
 * createTable() => "WatchlistMovies", deps: [Watchlists, Movies]
 * addIndex(ratings_user_id_movie_id) => "Ratings"
 *
 */

const info = {
  revision: 1,
  name: "init",
  created: "2025-12-13T08:28:54.550Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Actors",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        birthDate: {
          type: Sequelize.DATEONLY,
          field: "birthDate",
          allowNull: true,
        },
        nationality: {
          type: Sequelize.STRING,
          field: "nationality",
          allowNull: true,
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
      "Genres",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          field: "name",
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
      "Movies",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
        releaseYear: {
          type: Sequelize.INTEGER,
          field: "releaseYear",
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
      "Roles",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          field: "name",
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
      "MovieActors",
      {
        movieId: {
          type: Sequelize.INTEGER,
          unique: "MovieActors_movieId_actorId_unique",
          field: "movieId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Movies", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
        actorId: {
          type: Sequelize.INTEGER,
          unique: "MovieActors_movieId_actorId_unique",
          field: "actorId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Actors", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "MovieGenres",
      {
        movieId: {
          type: Sequelize.INTEGER,
          unique: "MovieGenres_movieId_genreId_unique",
          field: "movieId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Movies", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
        genreId: {
          type: Sequelize.INTEGER,
          unique: "MovieGenres_movieId_genreId_unique",
          field: "genreId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Genres", key: "id" },
          allowNull: false,
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING,
          field: "username",
          unique: true,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          field: "email",
          unique: true,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        roleId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Roles", key: "id" },
          field: "roleId",
          defaultValue: 1,
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
    fn: "createTable",
    params: [
      "Reviews",
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
        movieId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Movies", key: "id" },
          field: "movieId",
          allowNull: false,
        },
        rating: {
          type: Sequelize.DECIMAL(3, 1),
          field: "rating",
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: true },
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
      "Watchlists",
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
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          field: "userId",
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
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
      "WatchlistMovies",
      {
        watchlistId: {
          type: Sequelize.INTEGER,
          unique: "WatchlistMovies_watchlistId_movieId_unique",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Watchlists", key: "id" },
          primaryKey: true,
          field: "watchlistId",
          allowNull: false,
        },
        movieId: {
          type: Sequelize.INTEGER,
          unique: "WatchlistMovies_watchlistId_movieId_unique",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Movies", key: "id" },
          primaryKey: true,
          field: "movieId",
          allowNull: false,
        },
        addedAt: { type: Sequelize.DATE, field: "addedAt", allowNull: true },
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

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Actors", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Genres", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Movies", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["MovieActors", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["MovieGenres", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Ratings", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Reviews", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Roles", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Watchlists", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["WatchlistMovies", { transaction }],
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
