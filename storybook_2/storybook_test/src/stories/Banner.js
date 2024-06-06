/** @jsxImportSource @emotion/react */
​
import React from "react";
export default function Banner({ variant = "info", children }) {
  const beforeStyles = {
    width: 35,
    height: 35,
    display: "inline-flex",
    justifyContent: "center",
    position: "absolute",
    left: "-1.2rem",
    borderRadius: "50%",
    alignItems: "center",
    top: "-0.8rem",
  };
  const variantStyles = {
    info: { 
            borderLeft: "4px solid #44a9ba",     
            backgroundColor: "rgb(234, 248, 253);",     
            "&:before": {       
                content: '"📚"',       
                backgroundColor: "#44a9ba",     
        },   
    },
    danger: {
      borderLeft: "4px solid #ff7828",
      backgroundColor: "rgb(253, 236, 234)",
      "&:before": {
        content: '"⚠️"',
        backgroundColor: "#ff7828",
        ...beforeStyles,
      },
    },
    congrats: {
      borderLeft: "4px solid #72bc23",
      backgroundColor: "rgb(249, 253, 234)",
      "&:before": {
        content: '"🎉"',
        backgroundColor: "#72bc23",
        ...beforeStyles,
      },
    },
    documentation: {
      borderLeft: "4px solid #44a9ba",
      backgroundColor: "rgb(234, 248, 253);",
      "&:before": {
        content: '"📚"',
        backgroundColor: "#44a9ba",
        ...beforeStyles,
      },
    },
  };
  return (
    <aside
      style={{
        margin: "1.5rem auto",
        borderRadius: "0 10px 10px 0",
        padding: "0.8em 1em",
        lineHeight: "1.2",
        textAlign: "center",
        position: "relative",
        clear: "both",
        maxWidth: "500px",
        ...variantStyles[variant],
      }}>
            {children}   {" "}
    </aside>
  );
}
Banner.propTypes = {
  variant: "info" | "congrats" | "documentation" | "danger",
};
