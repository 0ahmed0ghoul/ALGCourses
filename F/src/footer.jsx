import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/footer.css';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              ALGCourses is a leading platform offering a wide range of online courses and quizzes.
              Our mission is to make learning accessible to everyone.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="/about" className="text-white">About</Nav.Link>
              <Nav.Link href="/courses" className="text-white">Courses</Nav.Link>
              <Nav.Link href="/quizzes" className="text-white">Quizzes</Nav.Link>
              <Nav.Link href="/contact" className="text-white">Contact Us</Nav.Link>
            </Nav>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              Email: support@algcourses.com <br />
              Phone: +1 123-456-7890 <br />
              Address: 123 Learning St, Knowledge City, 45678
            </p>
            <div>
              <a href="#" className="text-white me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p className="mb-0">© 2025 ALGCourses. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
