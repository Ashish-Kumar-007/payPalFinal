import React from "react";
import { Card, Row, Col, Avatar, Layout } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";

const { Meta } = Card;

const data = {
  id: 1,
  name: "John Doe",
  designation: "Software Engineer",
  email: "john.doe@example.com",
  image: "https://randomuser.me/api/portraits/men/1.jpg",
  details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

const students = [
  {
    name: "Deepali",
    usn: "4SU20CS026",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    address: "Poornima Nilaya Vakwady Post, Kundapura Taluk, Udupi - 576257",
    email: "deepali042002@gmail.com",
    phoneNumber: "8970193233",
  },
  {
    name: "Samarth Jain",
    usn: "4SU20CS081",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    address:
      "#1-104/6, 505:5TH Main road, 4:Halekote Road, Belthangady - 574214, Dakshina Kannada",
    email: "jsamarth84@gmail.com",
    phoneNumber: "8050279170",
  },
  {
    name: "Samyakth Kumar",
    usn: "4SU20CS085",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    address: "Padma Nilaya Jainpete, Belthangady",
    email: "samyakthkumar19@gmail.com",
    phoneNumber: "7795167462",
  },
  {
    name: "Sudeep D Gowda",
    usn: "4SU20CS109",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    address: "Ujwal Compound, Shivajinagar Ujire - 574240",
    email: "sudeepgowd423@gmail.com",
    phoneNumber: "9535046423",
  },
];

const CardComponent = ({ item }) => (
  <Card>
    <Row gutter={16}>
      <Col span={8}>
        <Avatar src={item.image} icon={<UserOutlined />} size={64} />{" "}
      </Col>
      <Col span={16}>
        <p>Name: {item.name} </p>
        <p>USN: {item.usn}</p>
        <p>Address: {item.address}</p>
        <p>E-mail ID: {item.email}</p>
        <p>Contact Phone No: {item.phoneNumber}</p>
      </Col>
    </Row>
  </Card>
);

const AboutUs = () => {
  return (
    <Layout>
      <Content style={{ minHeight: "100vh", paddingTop:"20px",  width: "600px", alignItems: "center", justifyContent: "center" }}>
        <Row gutter={[16, 16]}>
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Avatar src={data.image} icon={<UserOutlined />} size={64} />{" "}
                <p>{data.name} </p>
                <p>{data.designation}</p>
              </Col>
              <Col span={16}>
                <p>{data.details}</p>
                <p>E-mail ID: {data.email}</p>
              </Col>
            </Row>
          </Card>
        </Row>
        <Row gutter={[16, 16]}>
          {students.map((item) => (
            <Col span={24} key={item.id}>
              <CardComponent item={item} />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default AboutUs;