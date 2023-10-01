import React, { useEffect, useState } from 'react'
import { Button, Form, Container } from 'semantic-ui-react'
import { login, authFetch, useAuth, logout } from "./Auth"
export const Login = () => {
    //rafc

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const [logged] = useAuth();

    const onSubmitClick = (e) => {
        e.preventDefault()
        console.log("You pressed login")
        let opts = {
            'username': username,
            'password': password
        }
        fetch('http://localhost:5000/api/login', {
            method: 'post',
            body: JSON.stringify(opts)
        }).then(r => r.json())
            .then(token => {
                if (token.access_token) {
                    login(token)
                    console.log(token)
                    setUsername("")
                    setPassword("")

                } else {
                    setMessage("validation")
                    console.log("Please type in correct username/password")
                }
            })
    }

    if (logged) {

        authFetch("http://localhost:5000/api/protected").then(response => {
            if (response.status === 401) {
                setMessage("Sorry you aren't authorized!")
                return null
            }
            return response.json()
        }).then(response => {
            if (response && response.message) {
                setMessage(response.message)
            }
        })
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    useEffect(() => {
        console.log('First one time only - Dom load')
    }, []);

    return (
        <Container style={{ marginTop: 40 }}>
            <div>
                {message === 'validation' ? (<div className='ui black message'>Please type in correct username/password</div>) : null}

                {!logged ? <><h2>Login</h2>
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
                        <Button onClick={onSubmitClick} type="submit">
                            Login Now
                        </Button>
                    </Form></>
                    : <><p>{message}</p>
                        <Button onClick={() => logout()}>Logout</Button></>}
            </div>
        </Container>
    )
}
