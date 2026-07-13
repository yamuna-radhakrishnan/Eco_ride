import RagPaper from "./RideCard";
import "./CreateRide.css";
import "./CardAlignment.css";
import { useRef } from "react";
import { Button } from "@mui/material";
import image from "../../assets/images/scamDetective.png";
import { motion } from "framer-motion";
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
      <motion.div
        ref={containerRef}
        data-id="container"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isVisible.container ? 1 : 0,
          y: isVisible.container ? 0 : 50,
        }}
        transition={{ duration: 0.5 }}
        className="container"
      >
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
      </motion.div>
      <motion.div
        ref={aboutRef}
        data-id="about"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isVisible.about ? 1 : 0,
          y: isVisible.about ? 0 : 50,
        }}
        transition={{ duration: 0.5 }}
        className="about"
      >
        <div className="why-rag">
          <h2>Why use Car-pooling ?</h2>
          <div
            className="service"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <motion.div
              ref={service1Ref}
              data-id="service1"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: isVisible.service1 ? 1 : 0,
                y: isVisible.service1 ? 0 : 50,
              }}
              transition={{ duration: 0.5 }}
              className="use"
            >
              <i className="icon">🚗</i>
              <h3 className="title">Book a Ride</h3>
              <p className="content">
                Choose from our fleet of comfortable and reliable vehicles.
                Whether you need a quick ride to the airport or a day-long trip,
                we&apos;ve got you covered!
              </p>
            </motion.div>

            <motion.div
              ref={service2Ref}
              data-id="service2"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: isVisible.service2 ? 1 : 0,
                y: isVisible.service2 ? 0 : 50,
              }}
              transition={{ duration: 0.5 }}
              className="use"
            >
              <i className="icon">🌟</i>
              <h3 className="title">Premium Service</h3>
              <p className="content">
                Experience top-notch service with our professional drivers.
                Enjoy a smooth and safe ride to your destination.
              </p>
            </motion.div>

            <motion.div
              ref={service3Ref}
              data-id="service3"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: isVisible.service3 ? 1 : 0,
                y: isVisible.service3 ? 0 : 50,
              }}
              transition={{ duration: 0.5 }}
              className="use"
            >
              <i className="icon">📅</i>
              <h3 className="title">Flexible Scheduling</h3>
              <p className="content">
                Book in advance or request a ride on the spot. Our flexible
                scheduling ensures you get where you need to go, when you need
                to be there.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <motion.div
        ref={learnMoreRef}
        data-id="learnMore"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isVisible.learnMore ? 1 : 0,
          y: isVisible.learnMore ? 0 : 50,
        }}
        transition={{ duration: 0.5 }}
        className="learnMore"
      >
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
      </motion.div>
      {/* footer should be placed here */}
    </div>
  );
};

export default CreateRide;
