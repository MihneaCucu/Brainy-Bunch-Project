'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Create Roles
    await queryInterface.bulkInsert('Roles', [
      { id: 1, name: 'user' },
      { id: 2, name: 'moderator' },
      { id: 3, name: 'admin' }
    ], {});

    // One hashed password to use for all test users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('UserPa55!', salt);

    // Create Users
    await queryInterface.bulkInsert('Users', [
      {
        username: 'RegularUser',
        email: 'user@example.com',
        password: hashedPassword,
        roleId: 1, // 'user' role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'ModeratorUser',
        email: 'mod@example.com',
        password: hashedPassword,
        roleId: 2, // 'moderator' role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'AdminUser',
        email: 'admin@example.com',
        password: hashedPassword,
        roleId: 3, // 'admin' role
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    const directors= [
      {
        id: 1,
        name: 'Christopher Noland',
        birthDate: '1970-07-30',
        nationality: 'British'
      },
      {
        id: 2,
        name: 'Quentin Tarantino',
        birthDate: '1963-03-27',
        nationality: 'Americain'
      },
      {
        id: 3,
        name: 'Martin Sorsese',
        birthDate: '1942-11-17',
        nationality: 'Americain'
      },
      {
        id: 4,
        name: 'Steven Spielberg',
        birthDate: '1946-12-18',
        nationality: 'Americain'
      },
      {
        id: 5,
        name: 'Denis Villeneuve',
        birthDate: '1967-10-03',
        nationality: 'Canadian'
      },
    ];

    const addDatesDirectors = directors.map(d=> ({
      ...d,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Directors',addDatesDirectors, {});

    const actors = [
      { 
        id: 1, 
        name: 'Leonardo DiCaprio', 
        birthDate: '1974-11-11', 
        nationality: 'American' 
      },
      { 
        id: 2, 
        name: 'Brad Pitt', 
        birthDate: '1963-12-18', 
        nationality: 'American' 
      },
      { 
        id: 3, 
        name: 'Robert De Niro', 
        birthDate: '1943-08-17', 
        nationality: 'American' 
      },
      { 
        id: 4, 
        name: 'Margot Robbie', 
        birthDate: '1990-07-02', 
        nationality: 'Australian' 
      },
      { 
        id: 5, 
        name: 'Cillian Murphy', 
        birthDate: '1976-05-25', 
        nationality: 'Irish' 
      },
      { 
        id: 6, 
        name: 'Tom Hanks', 
        birthDate: '1956-07-09', 
        nationality: 'American' 
      },
      { 
        id: 7, 
        name: 'Scarlett Johansson', 
        birthDate: '1984-11-22', 
        nationality: 'American' 
      },
      { 
        id: 8, 
        name: 'Denzel Washington', 
        birthDate: '1954-12-28', 
        nationality: 'American' 
      },
      { 
        id: 9, 
        name: 'Timothée Chalamet', 
        birthDate: '1995-12-27', 
        nationality: 'American' 
      },
      { 
        id: 10, 
        name: 'Zendaya', 
        birthDate: '1996-09-01', 
        nationality: 'American'
      }
    ];

    const addDatesActors = actors.map( d => ({
      ...d,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Actors', addDatesActors, {});

    const genres = [
      { 
        id: 1, 
        name: 'Action' 
      },
      { 
        id: 2, 
        name: 'Sci-Fi' 
      },
      { 
        id: 3, 
        name: 'Drama' 
      },
      { 
        id: 4, 
        name: 'Crime' 
      },
      { 
        id: 5, 
        name: 'Adventure' 
      },
      { 
        id: 6, 
        name: 'Biography' 
      },
      { 
        id: 7, 
        name: 'History' 
      },
      { 
        id: 8, 
        name: 'Comedy' 
      },
      { 
        id: 9,
        name: 'Western' 
      },
      { 
        id: 10, 
        name: 'War' 
      }
    ];

    const addDatesGenres = genres.map(d=> ({
      ...d,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Genres', addDatesGenres, {});

    const movies = [
      { id: 1, title: 'Inception', description: 'Dream within a dream.', releaseYear: 2010, directorId: 1 },
      { id: 2, title: 'Interstellar', description: 'Space travel and love.', releaseYear: 2014, directorId: 1 },
      { id: 3, title: 'The Dark Knight', description: 'Batman vs Joker.', releaseYear: 2008, directorId: 1 },
      { id: 4, title: 'Tenet', description: 'Time inversion.', releaseYear: 2020, directorId: 1 },
      { id: 5, title: 'Oppenheimer', description: 'The atomic bomb.', releaseYear: 2023, directorId: 1 },

      { id: 6, title: 'Pulp Fiction', description: 'Crime stories intertwined.', releaseYear: 1994, directorId: 2 },
      { id: 7, title: 'Django Unchained', description: 'Bounty hunter drama.', releaseYear: 2012, directorId: 2 },
      { id: 8, title: 'Kill Bill: Vol 1', description: 'Revenge story.', releaseYear: 2003, directorId: 2 },
      { id: 9, title: 'Once Upon a Time in Hollywood', description: 'Golden age of LA.', releaseYear: 2019, directorId: 2 },

      { id: 10, title: 'The Wolf of Wall Street', description: 'Stock market excess.', releaseYear: 2013, directorId: 3 },
      { id: 11, title: 'Taxi Driver', description: 'A mentally unstable veteran.', releaseYear: 1976, directorId: 3 },
      { id: 12, title: 'Goodfellas', description: 'Mob life.', releaseYear: 1990, directorId: 3 },
      { id: 13, title: 'The Irishman', description: 'Hitman looks back.', releaseYear: 2019, directorId: 3 },

      { id: 14, title: 'Jurassic Park', description: 'Dinosaurs running wild.', releaseYear: 1993, directorId: 4 },
      { id: 15, title: 'Schindler\'s List', description: 'WWII drama.', releaseYear: 1993, directorId: 4 },
      { id: 16, title: 'Saving Private Ryan', description: 'D-Day mission.', releaseYear: 1998, directorId: 4 },
      { id: 17, title: 'Catch Me If You Can', description: 'Con artist story.', releaseYear: 2002, directorId: 4 },

      { id: 18, title: 'Dune: Part One', description: 'Desert planet politics.', releaseYear: 2021, directorId: 5 },
      { id: 19, title: 'Dune: Part Two', description: 'War for Arrakis.', releaseYear: 2024, directorId: 5 },
      { id: 20, title: 'Blade Runner 2049', description: 'Replicant mystery.', releaseYear: 2017, directorId: 5 },
    ];

    const addDatesMovies = movies.map(d=> ({
      ...d,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Movies', addDatesMovies, {});

    const movieGenres = [
      { 
        movieId: 1, 
        genreId: 1 
      }, 
      { 
        movieId: 1, 
        genreId: 2 
      },
      { 
        movieId: 2, 
        genreId: 2 
      }, 
      { 
        movieId: 2, 
        genreId: 3 
      },
      { 
        movieId: 3, 
        genreId: 1 
      }, 
      { 
        movieId: 3, 
        genreId: 4 
      },
      { 
        movieId: 4, 
        genreId: 1 
      }, 
      { 
        movieId: 4, 
        genreId: 2 
      },
      { 
        movieId: 5, 
        genreId: 6 
      }, 
      { 
        movieId: 5,
        genreId: 7 
      },
      { 
        movieId: 6, 
        genreId: 4 
      }, 
      { 
        movieId: 6, 
        genreId: 3 
      },
      { 
        movieId: 7, 
        genreId: 9
      }, 
      { 
        movieId: 7, 
        genreId: 3 
      },
      { 
        movieId: 8, 
        genreId: 1 
      },
      { 
        movieId: 8, 
        genreId: 4 
      },
      { 
        movieId: 9, 
        genreId: 8 
      }, 
      { 
        movieId: 9, 
        genreId: 3 
      },
      { 
        movieId: 10, 
        genreId: 6 
      }, 
      { 
        movieId: 10, 
        genreId: 8 
      },
      { 
        movieId: 11,
        genreId: 4 
      }, 
      { 
        movieId: 11, 
        genreId: 3 
      },
      { 
        movieId: 12, 
        genreId: 6 
      }, 
      { 
        movieId: 12, 
        genreId: 4 
      },
      {
        movieId: 13, 
        genreId: 6 
      }, 
      { 
        movieId: 13, 
        genreId: 4 
      },
      { 
        movieId: 14, 
        genreId: 5 
      }, 
      { 
        movieId: 14, 
        genreId: 2 
      },
      { 
        movieId: 15, 
        genreId: 6 
      }, 
      { 
        movieId: 15, 
        genreId: 7 
      },
      { 
        movieId: 16, 
        genreId: 10 
      }, 
      { 
        movieId: 16, 
        genreId: 3 
      },
      { 
        movieId: 17, 
        genreId: 6 
      }, 
      { 
        movieId: 17, 
        genreId: 4 
      },
      { 
        movieId: 18, 
        genreId: 2 
      }, 
      { 
        movieId: 18, 
        genreId: 5 
      },
      { 
        movieId: 19, 
        genreId: 2 
      }, 
      { 
        movieId: 19, 
        genreId: 5
      },
      { 
        movieId: 20, 
        genreId: 2 
      }, 
      { 
        movieId: 20, 
        genreId: 3 
      },
    ];


    await queryInterface.bulkInsert('MovieGenres', movieGenres, {});

    const movieActors= [
      { 
        movieId: 1, 
        actorId: 1 
      },
      { 
        movieId: 9, 
        actorId: 1 
      },
      { 
        movieId: 10, 
        actorId: 1 
      },
      { 
        movieId: 17, 
        actorId: 1 
      },
      {
        movieId: 9, 
        actorId: 2 
      },
      {
        movieId: 6,
        actorId: 2 
      }, 
      { 
        movieId: 11,
        actorId: 3 
      },
      { 
        movieId: 12, 
        actorId: 3 
      },
      {
        movieId: 13, 
        actorId: 3 
      },
      { 
        movieId: 10, 
        actorId: 4 
      },
      {
        movieId: 9, 
        actorId: 4 
      },
      { 
        movieId: 1, 
        actorId: 5 
      },
      { 
        movieId: 3, 
        actorId: 5 
      },
      {
        movieId: 5, 
        actorId: 5 
      },
      { 
        movieId: 4, 
        actorId: 5 
      },
      { 
        movieId: 16, 
        actorId: 6 
      },
      { 
        movieId: 17, 
        actorId: 6 
      },
      { 
        movieId: 14, 
        actorId: 7
      },
      { 
        movieId: 2, 
        actorId: 7 
      },
      { 
        movieId: 8, 
        actorId: 8 
      },
      { 
        movieId: 4, 
        actorId: 8 
      },
      { 
        movieId: 2, 
        actorId: 9 
      },
      { 
        movieId: 18, 
        actorId: 9 
      },
      { 
        movieId: 19, 
        actorId: 9 
      },
      { 
        movieId: 18, 
        actorId: 10 
      },
      { 
        movieId: 19, 
        actorId: 10 
      },
    ];

    await queryInterface.bulkInsert('MovieActors', movieActors, {});
  },

  async down (queryInterface, Sequelize) {
    // delete data in reverse order (Users first, then Roles) 
    // to avoid foreign key constraint errors
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('MoviesGenres', null, {});
    await queryInterface.bulkDelete('MovieActors', null, {});
    await queryInterface.bulkDelete('Movies', null, {});
    await queryInterface.bulkDelete('Directors', null, {});
    await queryInterface.bulkDelete('Actors', null, {});
    await queryInterface.bulkDelete('Genres', null, {});
  }
};