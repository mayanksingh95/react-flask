import React, { useEffect, useState } from "react";
import { Container, Table, Label } from "semantic-ui-react";
import { authFetch } from "./Auth"

export const Secret = () => {
    const [message, setMessage] = useState([])
    //const [logged] = useAuth();

    useEffect(() => {
        authFetch("http://localhost:5000/users").then(response =>
            response.json().then(data => {
                //console.log(data.users)
                setMessage(data.users);
            })
        );
    }, [])


    return (
        <Container style={{ marginTop: 40 }}>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        {/*<Table.HeaderCell>Password</Table.HeaderCell>*/}
                        <Table.HeaderCell>Role</Table.HeaderCell>
                        <Table.HeaderCell>Active</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {message.map((user) => {
                        return (
                            <Table.Row key={user.id}>
                                <Table.Cell><Label ribbon>{user.id}</Label></Table.Cell>
                                <Table.Cell>{user.username}</Table.Cell>
                                {/*<Table.Cell>{user.password}</Table.Cell>*/}
                                <Table.Cell>{user.role}</Table.Cell>
                                <Table.Cell>
                                    {user.is_active ? ('Yes') : 'No'}
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        </Container >
    )
}
