import RagPaper from "./RideCard";
import "../CreateRide/CreateRide.css";
import "../CreateRide/RideCard.css";
import { useRef } from "react";
import { Button } from "@mui/material";
import image from "../../assets/images/scamDetective.png";

import { useState, useEffect } from "react";

const CreateRide = () => {
  const [isVisible, setIsVisible] = useState({
    container: false,
    about: false,
    learnMore: false,
    service1: false,
    service2: false,
    service3: false,
  });

  const containerRef = useRef(null);
  const aboutRef = useRef(null);
  const learnMoreRef = useRef(null);
  const service1Ref = useRef(null);
  const service2Ref = useRef(null);
  const service3Ref = useRef(null);

  useEffect(() => {
    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prevState) => ({
            ...prevState,
            [entry.target.dataset.id]: true,
          }));
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    const sections = [
      containerRef.current,
      aboutRef.current,
      learnMoreRef.current,
      service1Ref.current,
      service2Ref.current,
      service3Ref.current,
    ];

    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className="outer-container" id="top">
      <div className="container">
        <div className="text-container">
          <div className="line1">
            <h1>The Hassle Free Services in India</h1>
          </div>
          <div className="line2">
            <h1>
              for efficient services in India. Our reliable ragger connect based
              service ensures safe and timely collection of your recyclable
              waste
            </h1>
          </div>
        </div>
        <RagPaper />
      </div>
      <div className="about">
        <div className="why-rag">
          <h2>Why use Car-pooling ?</h2>
          <div
            className="service"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <div className="use">
              <i className="icon">🚗</i>
              <h3 className="title">Book a Ride</h3>
              <p className="content">
                Choose from our fleet of comfortable and reliable vehicles.
                Whether you need a quick ride to the airport or a day-long trip,
                we&apos;ve got you covered!
              </p>
            </div>

            <div className="use">
              <i className="icon">🌟</i>
              <h3 className="title">Premium Service</h3>
              <p className="content">
                Experience top-notch service with our professional drivers.
                Enjoy a smooth and safe ride to your destination.
              </p>
            </div>

            <div className="use">
              <i className="icon">📅</i>
              <h3 className="title">Flexible Scheduling</h3>
              <p className="content">
                Book in advance or request a ride on the spot. Our flexible
                scheduling ensures you get where you need to go, when you need
                to be there.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="learnMore">
        <div>
          <img src={image} alt="" />
        </div>
        <div className="learnMore-content">
          <h2>Help us keep you safe from scams</h2>
          <div className="learnMore-text">
            At College_Rapido, we&apos;re working hard to make our platform as
            secure as it can be. But when scams do happen, we want you to know
            exactly how to avoid and report them. Follow our tips to help us
            keep you safe.
          </div>
          <Button
            variant="contained"
            style={{
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
              borderRadius: "10px",
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
      {/* footer should be placed here */}.
    </div>
  );
};

export default CreateRide;
