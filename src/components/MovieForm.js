import React, { useState } from "react";
import { Form, Input, Rating, Button } from "semantic-ui-react";
import { authFetch } from "../components/Auth"

export const MovieForm = ({ onNewMovie, Alert }) => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(1);

  return (
    <Form>
      <Form.Field>
        <Input
          placeholder="movie title"
          value={title}
          required={true}
          onChange={e => setTitle(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <Rating
          icon="star"
          rating={rating}
          maxRating={5}
          onRate={(_, data) => {
            setRating(data.rating);
          }}
        />
      </Form.Field>
      <Form.Field>
        <Button
          onClick={async () => {
            //console.log(title)
            if (isNaN(title)) {
              const movie = { title, rating };
              const response = await authFetch("http://localhost:5000/add_movie", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(movie)
              });

              if (response.ok) {
                console.log("response worked!");
                fetch("http://localhost:5000/get_max_id").then(response =>
                  response.json().then(data1 => {

                    authFetch("http://localhost:5000/api/username").then(response => response.json().then(data => {
                      let id = data1.id
                      let addedby = data.user
                      //console.log(addedby)
                      const movie = { id, title, rating, addedby };
                      onNewMovie(movie);
                      Alert()
                    }));
                  })
                );
                setTitle("");
                setRating(1);
              }
            }
          }}
        >
          submit
        </Button>
      </Form.Field>
    </Form>
  );
};
