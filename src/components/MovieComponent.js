import React, { useState, useEffect } from 'react'
import { authFetch } from "./Auth"
import { Movies } from "./Movies";
import { MovieForm } from "./MovieForm";
export const MovieComponent = () => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        authFetch("http://localhost:5000/movies").then(response => {

            response.json().then(data => {
                setMovies(data.movies);
            })
        });
    }, []);

    const onDelete = (id) => {
        setMovies(movies.filter((movie) => movie.id !== id))
        setalert({ show: true, value: 'Data Deleted!', color: "ui red message" })
    }

    const [alert, setalert] = useState({
        show: false,
        value: "",
        color: ""
    });


    const showalert = () => {
        setalert({ show: true, value: 'Data Added!', color: "ui green message" })
    }

    return (
        <div> {alert.show ? (
            <div className={alert.color}> { alert.value}</div>
        ) : null
        }
            <MovieForm
                onNewMovie={movie =>
                    setMovies(currentMovies => [movie, ...currentMovies])
                }
                Alert={showalert}
            />
            <Movies setalert={setalert} movies={movies} setMovies={setMovies} onDeleteMovie={onDelete} />
        </div>
    )
}
