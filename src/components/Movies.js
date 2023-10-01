import React, { useState, useEffect } from "react";
import { List, Header, Rating, Button, Label } from "semantic-ui-react";
import "../App.css";
import { EditForm } from "../components/EditForm";
import { authFetch } from "../components/Auth"

export const Movies = ({ movies, onDeleteMovie, setMovies, setalert }) => {
  //console.log(movies)

  const [user, setUser] = useState("");

  const [allValues, setAllValues] = useState({
    isEdit: false,
    newtitle: "",
    oldtitle: "",
    id: ""
  });

  const OnUpdateMovie = (e) => {
    let newArr = [...movies];
    console.log(newArr);
    let index = newArr.findIndex(x => x.id === e.id);
    console.log(index);
    let item = { ...newArr[index] };
    item.title = e.title;
    newArr[index] = item;
    console.log(item);
    setMovies(newArr);
    setalert({ show: true, value: 'Data Updated!', color: "ui violet message" })

  };

  const updateMovie = (movie) => {
    setAllValues({ ...allValues, isEdit: true, id: movie.id, oldtitle: movie.title })
    console.log('hi')
  };

  useEffect(() => {
    authFetch("http://localhost:5000/api/username").then(response => response.json().then(data => {
      setUser(data.user)
    }))
  }, []);


  return (
    <> {movies ? (
      <List>
        {movies.map(movie => {
          return (
            <List.Item key={movie.id} className="listitem">
              <Header>{movie.title}</Header>
              <Rating rating={movie.rating} maxRating={5} disabled />
              {user === movie.addedby ? <Button
                style={{ marginLeft: 5 }}
                size='mini'
                basic color='red'
                onClick={async () => {
                  const movie_id = movie.id;
                  console.log(movie_id)
                  const response = await fetch(`http://localhost:5000/delete_movie/${movie_id}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    }
                  });

                  if (response.ok) {
                    console.log("response worked!", movie_id);
                    onDeleteMovie(movie_id)
                  }
                }}
              >Delete</Button> : null}

              {user === movie.addedby ? <Button
                style={{ marginLeft: 5 }}
                size='mini'
                basic color='green'
                onClick={async () => {

                  updateMovie(movie)
                }}
              >Update</Button> : null}
              <p></p>
              <Label color='teal' image>
                <img alt="user" src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                {movie.addedby}
              </Label>
              {allValues.isEdit && allValues.id === movie.id ? (
                <EditForm setAllValues={setAllValues} OnUpdateMovie={OnUpdateMovie} movie={movie}
                />

              ) : null}
            </List.Item>

          );
        })}
      </List>) : 'Loading...'}
      <p>&nbsp;</p>
    </>
  );
};
