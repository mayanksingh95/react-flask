import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "semantic-ui-react";


export const EditForm = ({ movie, OnUpdateMovie, setAllValues }) => {
    const [title, setTitle] = useState("");
    const [id, setID] = useState("");
    useEffect(() => {
        setTitle(movie.title)
        setID(movie.id)
    }, [movie])


    return (
        <Form style={{ marginTop: 20, width: 300 }}>
            <Form.Field>
                <Input
                    placeholder="movie title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </Form.Field>
            <Form.Field>
                <Button color='yellow' basic
                    onClick={async () => {
                        const moviedata = { title, id }
                        const response = await fetch(`http://localhost:5000/update_movie/${movie.id}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(moviedata)
                        });

                        if (response.ok) {
                            console.log("response worked!");
                            OnUpdateMovie(moviedata);
                            setTitle("");
                            setAllValues({ isEdit: false })
                        }
                    }}
                >
                    save
          </Button>
            </Form.Field>
        </Form>
    );
};
