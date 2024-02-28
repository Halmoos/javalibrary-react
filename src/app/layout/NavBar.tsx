import React from "react";
import { toast } from "react-toastify";
import { Button, Container, Menu } from "semantic-ui-react";

export default function NavBar() {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header>JavaLibrary</Menu.Item>
                <Menu.Item name="Books List" />
                <Menu.Item>
                    <Button positive content="Add book" onClick={() => toast.success("hello")} />
                </Menu.Item>
            </Container>
        </Menu>
    )
}