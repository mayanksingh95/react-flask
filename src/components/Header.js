import React from 'react'
import {
    NavLink
} from "react-router-dom";
import { Menu } from 'semantic-ui-react'
export const Header = ({ islogin }) => {
    return (
        <Menu className="ui menu">
            <Menu.Item
                name='home'
                as={NavLink}
                to='/'
            >
                Home
        </Menu.Item>

            <Menu.Item
                name='about'
                as={NavLink}
                to='/about'
            >
                About
        </Menu.Item>
            <Menu.Item
                name='login'
                as={NavLink}
                to='/login'
            >
                Login
        </Menu.Item>
            {!islogin ? <Menu.Item
                name='register'
                as={NavLink}
                to='/register'
            >
                Register
        </Menu.Item> : null}
            {islogin ? (<Menu.Item
                name='secret'
                as={NavLink}
                to='/secret'
            >
                Users
            </Menu.Item>) : null}
        </Menu>
    )
}