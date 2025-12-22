const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Actors", deps: []
 * createTable() => "Directors", deps: []
 * createTable() => "Genres", deps: []
 * createTable() => "Roles", deps: []
 * createTable() => "Users", deps: [Roles]
 * createTable() => "Movies", deps: [Directors]
 * createTable() => "Reviews", deps: [Users, Movies]
 * createTable() => "MovieActors", deps: [Movies, Actors]
 * createTable() => "Diaries", deps: [Users]
 * createTable() => "MovieGenres", deps: [Movies, Genres]
 * createTable() => "MovieDiaries", deps: [Movies, Diaries]
 * createTable() => "MovieLists", deps: [Users]
 * createTable() => "MovieListMovies", deps: [MovieLists, Movies]
 * createTable() => "Comments", deps: [Users, Reviews]
 * createTable() => "Watchlists", deps: [Users]
 * createTable() => "WatchlistMovies", deps: [Watchlists, Movies]
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2025-12-21T16:29:00.672Z",
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
      "Directors",
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
      "Movies",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          field: "title",
          unique: true,
          allowNull: false,
        },
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
        directorId: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          field: "directorId",
          references: { model: "Directors", key: "id" },
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
        score: { type: Sequelize.INTEGER, field: "score", allowNull: false },
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
        note: { type: Sequelize.TEXT, field: "note", allowNull: true },
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
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Actors", { transaction }],
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
    params: ["Directors", { transaction }],
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
    params: ["MovieDiaries", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["MovieGenres", { transaction }],
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
