import React, { useState } from 'react'
import { Button, Form, Container } from 'semantic-ui-react'
import {
    Route,
    NavLink, Link
} from "react-router-dom";
import { Login } from "./Login";
export const Register = () => {
    //rafc

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const onSubmitClick = (e) => {
        e.preventDefault()
        console.log("You pressed register")
        const newuser = { username, password, confirmpassword };
        if (isNaN(username) && isNaN(password)) {
            const response = fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newuser)
            });

            if (response) {
                setUsername("");
                setPassword("");
                setConfirmPassword("")
                setMessage('registered')
                //return <Redirect to='/login' />
            }

        } else {
            setMessage('validation')
        }
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }

    return (
        <Container style={{ marginTop: 40 }}>
            <div>
                <Route exact path="/login">
                    <Login />
                </Route>
                {message === 'validation' ? (<div className='ui black message'>Please type in username and password</div>) : null}
                <h2>Register</h2>
                {message === 'registered' ? (<div className='ui brown message'>You're registed!
                    <Link
                        name='login'
                        as={NavLink}
                        to='/login' > Click Here </Link>
                 to login</div>) :
                    <Form>
                        <Form.Field>
                            <label>Username</label>
                            <input required type="text"
                                placeholder="Username"
                                onChange={handleUsernameChange}
                                value={username}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input required
                                type="password"
                                placeholder="Password"
                                onChange={handlePasswordChange}
                                value={password}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Confirm Password</label>
                            <input required
                                type="password"
                                placeholder="Password"
                                onChange={handleConfirmPasswordChange}
                                value={confirmpassword}
                            />
                        </Form.Field>
                        <Button onClick={onSubmitClick} type="submit">
                            Register
                        </Button>
                    </Form>}
            </div>
        </Container>
    )
}
