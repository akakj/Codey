import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

const About = () => {
  return (
    <article>
      <h1 className="text-2xl left-2 font-semibold">About this Website</h1>
      <p className="pt-2 font-sans font-normal">
        This website was created by a computer-science student preparing for
        technical interviews for job and internship applications. After solving
        a few LeetCode problems and discovering NeetCode, I decided to create my
        own version of LeetCode, which is heavily inspired by NeetCode. NeetCode
        is a great way to prepare for interviews due to its structured layout of
        questions by topic, which makes it easy to navigate and maintain a
        systematic approach to interview preparation. However, once I started
        using NeetCode, I kept thinking, “I wish this could be done
        differently,” and I wondered why not build my own version of NeetCode?
        And this is where we are right now. I hope you enjoy this website!
      </p>
    </article>
  );
};

export default About;
