package dbrepo

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) AllMovies() ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		select 
			id,title,release_date,runtime,mpaa_rating,description,coalesce(image,''),created_at,updated_at
		from
			movies
		order by
			title
	`

	rows, err := m.DB.QueryContext(ctx, query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.Id,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) Connection() *sql.DB {
	return m.DB
}

func (m *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id,email,first_name,last_name,password,created_at,updated_at from users where email = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, email)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &user, nil

}

func (m *PostgresDBRepo) GetUserById(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id,email,first_name,last_name,password,created_at,updated_at from users where id = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &user, nil

}

func (m *PostgresDBRepo) OneMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		select 
			id,title,release_date,runtime,mpaa_rating,description,coalesce(image,''),created_at,updated_at
		from
			movies
		where
			id = $1
	`
	row := m.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie
	err := row.Scan(
		&movie.Id,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Get the genres for the movie
	query = `
		select 
			g.id, g.genre
		from 
			movies_genres mg
		left join 
			genres g on (g.id = mg.genre_id)
		where 
			mg.movie_id = $1
			order by g.genre
	`
	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []models.Genre
	for rows.Next() {
		var genre models.Genre
		err := rows.Scan(
			&genre.ID,
			&genre.Genre,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, genre)
	}

	movie.Generes = genres

	return &movie, nil

}

func (m *PostgresDBRepo) OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		select 
			id,title,release_date,runtime,mpaa_rating,description,coalesce(image,''),created_at,updated_at
		from
			movies
		where
			id = $1
	`
	row := m.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie
	err := row.Scan(
		&movie.Id,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, nil, err
	}

	// Get the genres for the movie
	query = `
		select 
			g.id, g.genre
		from 
			movies_genres mg
		left join 
			genres g on (g.id = mg.genre_id)
		where 
			mg.movie_id = $1
			order by g.genre
	`
	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	var genres []models.Genre
	var genesArray []int

	for rows.Next() {
		var genre models.Genre
		err := rows.Scan(
			&genre.ID,
			&genre.Genre,
		)
		if err != nil {
			return nil, nil, err
		}
		genres = append(genres, genre)
		genesArray = append(genesArray, genre.ID)
	}

	movie.Generes = genres
	movie.GenresArray = genesArray

	var allGenres []*models.Genre

	query = `
		select 
			id, genre
		from
			genres
		order by
			genre
	`
	rows, err = m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var genre models.Genre
		err := rows.Scan(
			&genre.ID,
			&genre.Genre,
		)
		if err != nil {
			return nil, nil, err
		}
		allGenres = append(allGenres, &genre)
	}

	return &movie, allGenres, nil

}

func (m *PostgresDBRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		select 
			id, genre,created_at,updated_at
		from
			genres
		order by
			genre
	`
	rows, err := m.DB.QueryContext(ctx, query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre

	for rows.Next() {
		var genre models.Genre
		err := rows.Scan(
			&genre.ID,
			&genre.Genre,
			&genre.CreatedAt,
			&genre.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, &genre)
	}
	return genres, nil
}
