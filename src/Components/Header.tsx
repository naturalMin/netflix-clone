import styled from "styled-components";
import { Link } from "react-router-dom";

const Nav = styled.div``;
const Col = styled.div``;
const Logo = styled.div``;
const Menu = styled.ul``;
const Item = styled.li``;
const Search = styled.form``;
const Input = styled.input``;


function Header() {
  return (
    <Nav>
      <Col>
        <Logo></Logo>
      </Col>
      <Col>
        <Menu>
          <Item>
            <Link to = "/">Movie</Link>
          </Item>
          <Item>
            <Link to = "/tv">TV Show</Link>
          </Item>
        </Menu>
      </Col>
      <Col>
        <Search>
          <Input />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;